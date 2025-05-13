// Helper function to generate order ID
function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
}

// Helper function to update inventory based on recipe
async function updateInventoryForOrder(connection, itemId, orderQuantity) {
  console.log(`Attempting to update inventory for item ${itemId} with quantity ${orderQuantity}`);

  // Get the item's SKU (recipe_id) and category
  const [itemRows] = await connection.query(`
    SELECT sku, item_name, item_cat 
    FROM item 
    WHERE item_id = ?
  `, [itemId]);

  if (itemRows.length === 0) {
    throw new Error(`Item not found with ID: ${itemId}`);
  }

  const recipeId = itemRows[0].sku;
  const itemCategory = itemRows[0].item_cat;
  console.log(`Found SKU ${recipeId} for item ${itemRows[0].item_name} (Category: ${itemCategory})`);

  // For beverages and desserts, check direct inventory
  if (itemCategory === 'Beverage' || itemCategory === 'Dessert') {
    console.log(`Checking direct inventory for ${itemCategory} item: ${itemRows[0].item_name}`);
    
    const [inventoryRows] = await connection.query(`
      SELECT i.ing_id, i.quantity, ing.ing_name
      FROM inventory i
      JOIN ingredient ing ON i.ing_id = ing.ing_id
      WHERE i.ing_id = ?
    `, [recipeId]);  // Using SKU as ing_id for direct items

    if (inventoryRows.length === 0) {
      throw new Error(`No inventory found for ${itemCategory} item: ${itemRows[0].item_name}`);
    }

    const currentStock = inventoryRows[0].quantity;
    const newStock = currentStock - orderQuantity;

    if (newStock < 0) {
      throw new Error(`Insufficient stock for ${itemRows[0].item_name}. Required: ${orderQuantity}, Available: ${currentStock}`);
    }

    await connection.query(`
      UPDATE inventory 
      SET quantity = ? 
      WHERE ing_id = ?
    `, [newStock, recipeId]);

    console.log(`Updated direct inventory for ${itemRows[0].item_name}: ${currentStock} -> ${newStock}`);
    return;
  }

  // For pizzas and sides, check recipe ingredients
  console.log(`Checking recipe ingredients for ${itemCategory} item: ${itemRows[0].item_name}`);
  
  const [recipeRows] = await connection.query(`
    SELECT r.ing_id, r.quantity, i.ing_name
    FROM recipe r
    JOIN ingredient i ON r.ing_id = i.ing_id
    WHERE r.recipe_id = ?
  `, [recipeId]);

  if (recipeRows.length === 0) {
    throw new Error(`No recipe found for ${itemRows[0].item_name} (${itemCategory})`);
  }

  console.log(`Found ${recipeRows.length} ingredients in recipe for ${itemRows[0].item_name}`);

  // Update inventory for each ingredient
  for (const ingredient of recipeRows) {
    // Calculate total quantity needed
    const totalQuantityNeeded = ingredient.quantity * orderQuantity;

    // Check current inventory level
    const [inventoryRows] = await connection.query(`
      SELECT quantity 
      FROM inventory 
      WHERE ing_id = ?
    `, [ingredient.ing_id]);

    if (inventoryRows.length === 0) {
      throw new Error(`Ingredient ${ingredient.ing_name} not found in inventory`);
    }

    const currentStock = inventoryRows[0].quantity;
    const newStock = currentStock - totalQuantityNeeded;

    if (newStock < 0) {
      throw new Error(`Insufficient stock for ingredient ${ingredient.ing_name}. Required: ${totalQuantityNeeded}, Available: ${currentStock}`);
    }

    // Update inventory
    await connection.query(`
      UPDATE inventory 
      SET quantity = ? 
      WHERE ing_id = ?
    `, [newStock, ingredient.ing_id]);

    console.log(`Updated inventory for ${ingredient.ing_name}: ${currentStock} -> ${newStock}`);
  }
}

module.exports = {
  generateOrderId,
  updateInventoryForOrder
}; 
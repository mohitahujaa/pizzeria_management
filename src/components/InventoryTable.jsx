import React, { useState, useEffect } from 'react';

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated thresholds
  const CRITICAL_THRESHOLD = 100;  // Red warning
  const WARNING_THRESHOLD = 1000;  // Yellow warning

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        console.log('Fetching inventory data from backend...');
        const response = await fetch('http://localhost:5000/api/admin/inventory');
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Received data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch inventory');
        }

        setInventory(data);
        setLoading(false);
      } catch (err) {
        console.error('Error in InventoryTable:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!inventory || inventory.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        No inventory data available
      </div>
    );
  }

  const getRowStyle = (quantity) => {
    if (quantity < CRITICAL_THRESHOLD) {
      return 'bg-red-100 text-red-900';
    }
    if (quantity < WARNING_THRESHOLD) {
      return 'bg-yellow-100 text-yellow-900';
    }
    return '';
  };

  const getQuantityStyle = (quantity) => {
    if (quantity < CRITICAL_THRESHOLD) {
      return 'bg-red-200 text-red-900 font-bold';
    }
    if (quantity < WARNING_THRESHOLD) {
      return 'bg-yellow-200 text-yellow-900 font-bold';
    }
    return 'bg-green-100 text-green-900';
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Inventory Status Legend:</h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 mr-2"></div>
            <span>Critical (Below {CRITICAL_THRESHOLD})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 mr-2"></div>
            <span>Warning (Below {WARNING_THRESHOLD})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border mr-2"></div>
            <span>Normal</span>
          </div>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ingredient ID
            </th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Quantity in Stock
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {inventory.map((item) => (
            <tr 
              key={item.ing_id}
              className={`hover:bg-opacity-80 transition-colors duration-150 ${getRowStyle(item.quantity)}`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {item.ing_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-3 py-1 rounded-full ${getQuantityStyle(item.quantity)}`}>
                  {item.quantity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable; 
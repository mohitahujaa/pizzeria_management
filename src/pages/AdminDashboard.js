import React, { useState } from 'react';

function AdminDashboard() {
  const [staffForm, setStaffForm] = useState({ staff_id: '', first_name: '', last_name: '', position: '', hourly_rate: '' });
  const [itemForm, setItemForm] = useState({ item_id: '', sku: '', item_name: '', item_cat: '', item_size: '', item_price: '' });
  const [shiftForm, setShiftForm] = useState({ shift_id: '', day_of_week: '', start_time: '', end_time: '' });

  const handleStaffChange = e => setStaffForm({ ...staffForm, [e.target.name]: e.target.value });
  const handleItemChange = e => setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  const handleShiftChange = e => setShiftForm({ ...shiftForm, [e.target.name]: e.target.value });

  const submitForm = (url, data) => {
    fetch(`http://localhost:5000/api/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer YOUR_TOKEN' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => alert(`${url} added successfully`))
      .catch(error => alert(`Error adding ${url}: ${error.message}`));
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Staff Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Add Staff</h2>
        <form className="space-y-2" onSubmit={e => { e.preventDefault(); submitForm('staff', staffForm); }}>
          {['staff_id','first_name','last_name','position','hourly_rate'].map(field => (
            <input 
              key={field} 
              className="border w-full p-2 rounded" 
              name={field} 
              placeholder={field.split('_').join(' ').toUpperCase()} 
              onChange={handleStaffChange}
              value={staffForm[field]}
            />
          ))}
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
            Add Staff
          </button>
        </form>
      </div>

      {/* Menu Item Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Add Menu Item</h2>
        <form className="space-y-2" onSubmit={e => { e.preventDefault(); submitForm('items', itemForm); }}>
          {['item_id','sku','item_name','item_cat','item_size','item_price'].map(field => (
            <input 
              key={field} 
              className="border w-full p-2 rounded" 
              name={field} 
              placeholder={field.split('_').join(' ').toUpperCase()} 
              onChange={handleItemChange}
              value={itemForm[field]}
            />
          ))}
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Add Item
          </button>
        </form>
      </div>

      {/* Shift Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Add Shift</h2>
        <form className="space-y-2" onSubmit={e => { e.preventDefault(); submitForm('shift', shiftForm); }}>
          {['shift_id','day_of_week','start_time','end_time'].map(field => (
            <input 
              key={field} 
              className="border w-full p-2 rounded" 
              name={field} 
              placeholder={field.split('_').join(' ').toUpperCase()} 
              onChange={handleShiftChange}
              value={shiftForm[field]}
            />
          ))}
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
            Add Shift
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard; 
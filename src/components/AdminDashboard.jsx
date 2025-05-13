import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import InventoryTable from './InventoryTable';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'inventory'

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleViewInventoryImpact = (orderId) => {
    // TODO: Implement inventory impact view
    console.log('View inventory impact for order:', orderId);
  };

  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`
            py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'orders'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`
            py-4 px-1 border-b-2 font-medium text-sm
            ${activeTab === 'inventory'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          Inventory
        </button>
      </nav>
    </div>
  );

  const renderContent = () => {
    if (isLoading && activeTab === 'orders') {
      return (
        <div className="text-center text-gray-600">Loading orders...</div>
      );
    }

    if (error && activeTab === 'orders') {
      return (
        <div className="text-center text-red-600">{error}</div>
      );
    }

    if (activeTab === 'inventory') {
      return <InventoryTable />;
    }

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.order_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.created_at), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.name}
                    <br />
                    <span className="text-xs text-gray-400">ID: {order.customer.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={`${order.order_id}-${item.item_id}-${index}`}>
                          {item.quantity}x {item.name} ({item.size})
                          <br />
                          <span className="text-xs text-gray-400">Item ID: {item.item_id}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewInventoryImpact(order.order_id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm"
                    >
                      View Inventory Impact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        {renderTabs()}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { useEffect, useState } from 'react';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = JSON.parse(localStorage.getItem('user'));
  console.log(userId)

  useEffect(() => {
    if (userId) {
      console.log(`userrr`)
      fetch(`http://localhost:3002/order/${userId}`) // Make sure this is the correct URL for your order service
        .then(res => res.json())
        .then(data => {
          setOrders(data || 0); 
          setLoading(false); 
        })
        .catch(err => {
          console.error('Error fetching orders:', err);
          setLoading(false); 
        });
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Orders</h2>
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl">
        <h3 className="text-xl font-semibold mb-4">Your Recent Orders</h3>
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="border-b pb-4">
                <p className="text-gray-600">Order #{order._id}: {order.products.map(product => product.name).join(', ')}</p>
                <p className="text-gray-500">Status: {order.status || 'Pending'}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;

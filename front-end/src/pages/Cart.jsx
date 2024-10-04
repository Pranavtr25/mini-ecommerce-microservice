import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();


  const { userId } = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/cart/${userId}`)
        .then(res => {
          console.log(res); 
          return res.json();
        })
        .then(data => {
          setCartItems(data.products); 
          const total = data.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
          setTotalPrice(total);
        })
        .catch(err => console.error('Error fetching cart items:', err));
    }
  }, [userId]);

  const handleOrderNow = () => {
    fetch('http://localhost:3002/order', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, products: cartItems }), 
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Order created and cart emptied') {
          setCartItems([]);  
          setTotalPrice(0);  
          alert('Order placed successfully!');
        }
        navigate('/orders')
      })
      .catch(err => console.error('Error placing order:', err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h2>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        {cartItems.length > 0 ? (
          cartItems.map((product, index) => (
            <div key={index} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price.toFixed(2)}</p>
                <p className="text-gray-600">Quantity: {product.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
          <button 
            className="bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-300"
            onClick={handleOrderNow}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

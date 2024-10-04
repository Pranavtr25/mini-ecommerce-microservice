import React, { useState, useEffect } from 'react';

const Product = () => {
  const [products, setProducts] = useState([]);
  const userId = "some_user_id"; 

  useEffect(() => {
    fetch('https://fakestoreapi.com/products?limit=5')
      .then(res => res.json())
      .then(json => setProducts(json)) 
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const addToCart = (product) => {
    const {userId} = JSON.parse(localStorage.getItem('user'))

    fetch('http://localhost:3001/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        product: {
          name: product.title,
          price: product.price,
        },
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Product added to cart:', data);
    })
    .catch(err => console.error("Error adding product to cart:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-6">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-xl font-semibold mb-4">{product.title}</h3>
              <p className="text-gray-800 font-bold mb-4">${product.price}</p>
              <button 
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Product;

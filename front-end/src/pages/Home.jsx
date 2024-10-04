import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to Our Website</h1>
      <nav className="bg-white shadow-md rounded-lg p-8">
        <ul className="space-y-4">
          <li>
            <Link
              to="/login"
              className="block text-lg font-semibold text-blue-500 hover:text-blue-700 transition duration-300"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="block text-lg font-semibold text-blue-500 hover:text-blue-700 transition duration-300"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="block text-lg font-semibold text-blue-500 hover:text-blue-700 transition duration-300"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="block text-lg font-semibold text-blue-500 hover:text-blue-700 transition duration-300"
            >
              Orders
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;

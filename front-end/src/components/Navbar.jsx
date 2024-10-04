import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);  
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setIsLoggedIn(false); 
    navigate('/login'); 
  };

  // useEffect to ensure component is updated after navigating
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);  
  }, [navigate]);

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">My E-Commerce Website</Link>
        </div>
        <ul className="flex space-x-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          {isLoggedIn ? (
              <>
              <li><Link to="/cart">Cart</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

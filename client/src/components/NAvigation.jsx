import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useUser } from '../API/UserContext'; 
import { useCart } from '../API/cartContext'; // Ensure this import path is correct
import { FaShoppingCart } from 'react-icons/fa'; // Importing a cart icon

const Navigation = () => {
  const { user, logoutUser } = useUser();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Food Rescue</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {/* Additional navigation items here */}
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <Link to="/cart" className="nav-item nav-link">
                  <FaShoppingCart />
                  {cartItems && cartItems.length > 0 && (
                    <span className="badge bg-secondary ms-1">{cartItems.length}</span>
                  )}
                </Link>
                <span className="navbar-text me-3">
                  Welcome, {user.username}!
                </span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn btn-outline-success" to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

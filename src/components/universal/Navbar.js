import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [collapsedState, setCollapsedState] = useState(false);
  const navClass = collapsedState
    ? 'collapse navbar-collapse show'
    : 'collapse navbar-collapse';
  const togglerClass = collapsedState
    ? 'navbar-toggler collapsed'
    : 'navbar-toggler';
  const toggleNav = () => {
    setCollapsedState(!collapsedState);
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        My App
      </Link>
      <button
        className={togglerClass}
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={toggleNav}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={navClass} id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link to="/" className="nav-link">
              Home <span className="sr-only">(current)</span>
            </Link>
          </li>
        </ul>
        <div>
          <Link to="/login">
            <button className="btn btn-secondary mr-3">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn btn-primary">Register</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

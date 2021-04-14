import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container-fluid h-100 d-flex flex-column justify-content-center align-items-center">
      <h1>Oops! We couldn't find what you were looking for</h1>
      <p>It's possible the resource has moved.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}

export default NotFound;

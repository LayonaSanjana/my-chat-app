// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Import global styles
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* Wrap App with Router here */}
      <App />
    </Router>
  </React.StrictMode>
);

// src/components/layouts/LayoutWrapper.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  
  // Log for debugging
  console.log('LayoutWrapper rendering for path:', location.pathname);
  console.log('LayoutWrapper rendering with children:', children);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* This is a simple wrapper that just adds some padding and container */}
      {children}
    </div>
  );
};

export default LayoutWrapper;
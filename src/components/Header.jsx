// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-6 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Geometric Logo Creator</h1>
            <p className="text-gray-600 mt-1">Professional engineering & sustainability icons</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm font-medium">
              Phase 2: Geometric Icon Portfolio
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-gray-600 text-sm">
              Geometric Logo Platform for Engineering & Sustainability Sectors
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-gray-500 text-sm">
              Geometric icons based on industry research
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
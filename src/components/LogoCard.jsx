// src/components/LogoCard.jsx
import React from 'react';
import GeometricIcon from './GeometricIcon';
import ColorPalette from './ColorPalette';

const LogoCard = ({ logo, onSelect }) => {
  const { name, description, geometricLogic, symbolism, colors } = logo;
  const mainColor = colors[0].hex;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg border border-gray-100 flex flex-col"
    >
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-lg bg-gray-50">
          <GeometricIcon svgPath={logo.svgPath} size={150} color={mainColor} />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
      
      <p className="text-gray-600 mb-3 text-sm flex-grow">{description}</p>
      
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Geometric Logic:</h4>
        <p className="text-xs text-gray-600 mb-2">{geometricLogic}</p>
        
        <h4 className="text-sm font-medium text-gray-700 mb-1">Symbolism:</h4>
        <p className="text-xs text-gray-600 mb-3">{symbolism}</p>
      </div>
      
      <div className="mt-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Color Palette:</h4>
        <ColorPalette colors={colors} />
        
        <button 
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => onSelect(logo)}
        >
          Select & Customize
        </button>
      </div>
    </div>
  );
};

export default LogoCard;
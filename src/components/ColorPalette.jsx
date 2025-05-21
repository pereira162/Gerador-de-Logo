// src/components/ColorPalette.jsx
import React from 'react';

const ColorPalette = ({ colors }) => {
  return (
    <div className="flex mt-2 space-x-2">
      {colors.map((color, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-8 h-8 rounded-full border border-gray-300"
            style={{ backgroundColor: color.hex }}
            title={`${color.name}: ${color.hex}`}
          ></div>
          <span className="text-xs mt-1 text-gray-500">{color.hex}</span>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;
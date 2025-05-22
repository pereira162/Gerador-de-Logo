// components/common/ColorPicker.jsx
import React, { useState, useEffect, useRef } from 'react';

/**
 * ColorPicker component that provides a color selection interface
 * @param {Object} props - Component props
 * @param {string} props.color - Current color value (hex, rgb, etc.)
 * @param {function} props.onChange - Function to call when color changes
 * @param {string} props.label - Label text for the color picker
 * @param {boolean} props.allowNone - Whether to allow "none" as a color option
 */
const ColorPicker = ({ color = '#000000', onChange, label = 'Color', allowNone = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const pickerRef = useRef(null);
  
  // Update the input value when the color prop changes
  useEffect(() => {
    setInputValue(color === 'none' ? 'none' : color);
  }, [color]);
  
  // Close the color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle color selection from the color input
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };
  
  // Handle text input for the color
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };
  
  // Validate and apply input when focus is lost
  const handleBlur = () => {
    // Basic validation for hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    
    // If "none" is allowed and input is "none", update color
    if (allowNone && inputValue.toLowerCase() === 'none') {
      onChange('none');
      return;
    }
    
    // If it's a valid hex color, update the color
    if (hexRegex.test(inputValue)) {
      onChange(inputValue);
    } else {
      // If invalid, revert to the previous valid color
      setInputValue(color === 'none' ? 'none' : color);
    }
  };
  
  // Set transparent color
  const handleSetTransparent = () => {
    onChange('none');
    setIsExpanded(false);
  };
  
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative" ref={pickerRef}>
        <div className="flex items-center">
          <div 
            className="w-10 h-10 border rounded mr-2 cursor-pointer"
            style={{ 
              backgroundColor: color === 'none' ? 'transparent' : color,
              backgroundImage: color === 'none' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none',
              backgroundSize: '10px 10px',
              backgroundPosition: '0 0, 5px 5px'
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="flex-1 border rounded p-2 text-sm"
            placeholder="#RRGGBB"
          />
        </div>
        
        {isExpanded && (
          <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg p-3 w-full">
            <div className="mb-2">
              <input
                type="color"
                value={color === 'none' ? '#000000' : color}
                onChange={handleColorChange}
                className="w-full h-10"
              />
            </div>
            
            {allowNone && (
              <button
                onClick={handleSetTransparent}
                className="w-full py-1 px-2 text-sm border rounded hover:bg-gray-100"
              >
                Set Transparent
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
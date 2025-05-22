// components/EditorScreen/ShapeProperties.jsx
import React from 'react';
import ColorPicker from '../common/ColorPicker';
import TransformControls from '../common/TransformControls';

/**
 * ShapeProperties component for editing SVG shape properties
 * @param {Object} props - Component props
 * @param {Object} props.element - The selected SVG element data
 * @param {Object} props.transform - The element's transform data
 * @param {function} props.onStyleChange - Function to call when style changes
 * @param {function} props.onTransformChange - Function to call when transforms change
 * @param {function} props.onReset - Function to call when reset button is clicked
 */
const ShapeProperties = ({ 
  element, 
  transform,
  onStyleChange, 
  onTransformChange,
  onReset 
}) => {
  if (!element) return null;

  // Handle opacity change
  const handleOpacityChange = (value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      onStyleChange('opacity', numValue);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Shape Properties</h3>
        <div className="text-sm text-gray-500 mb-4">
          Type: <span className="font-medium">{element.type}</span>
        </div>

        {/* Fill Color */}
        {element.fill !== undefined && (
          <ColorPicker
            color={element.fill}
            onChange={(color) => onStyleChange('fill', color)}
            label="Fill Color"
            allowNone={true}
          />
        )}

        {/* Stroke Color */}
        {element.stroke !== undefined && (
          <ColorPicker
            color={element.stroke}
            onChange={(color) => onStyleChange('stroke', color)}
            label="Stroke Color"
            allowNone={true}
          />
        )}

        {/* Stroke Width */}
        {element.stroke !== 'none' && element.stroke !== undefined && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stroke Width
            </label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.5"
                value={element.strokeWidth || 0} 
                onChange={(e) => onStyleChange('strokeWidth', Number(e.target.value))}
                className="w-full"
              />
              <span className="ml-2 text-xs w-10">{element.strokeWidth || 0}px</span>
            </div>
          </div>
        )}

        {/* Opacity */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opacity
          </label>
          <div className="flex items-center">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={element.opacity || 1} 
              onChange={(e) => handleOpacityChange(e.target.value)}
              className="w-full"
            />
            <span className="ml-2 text-xs w-10">{Math.round((element.opacity || 1) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Transformation Controls */}
      <div className="border-t pt-4">
        <TransformControls 
          transform={transform}
          onChange={onTransformChange}
        />
      </div>

      {/* Reset Button */}
      <div className="border-t pt-4">
        <button 
          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded w-full"
          onClick={onReset}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default ShapeProperties;
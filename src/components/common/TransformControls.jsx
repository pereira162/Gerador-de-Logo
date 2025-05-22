// components/common/TransformControls.jsx
import React from 'react';

/**
 * TransformControls component for handling element transformations
 * @param {Object} props - Component props
 * @param {Object} props.transform - Current transformation values
 * @param {function} props.onChange - Function to call when transformation changes
 * @param {boolean} props.showRotation - Whether to show rotation controls
 * @param {boolean} props.showScale - Whether to show scale controls
 */
const TransformControls = ({
  transform = {
    translateX: 0,
    translateY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1
  },
  onChange,
  showRotation = true,
  showScale = true
}) => {
  // Handle position change (X and Y coordinates)
  const handlePositionChange = (axis, value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      onChange(axis, numValue);
    }
  };

  // Handle rotation change
  const handleRotationChange = (value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      onChange('rotation', numValue);
    }
  };

  // Handle scale change
  const handleScaleChange = (axis, value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      onChange(axis, numValue);
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-3">Transformation</h4>
      
      {/* Position Controls */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">X Position</label>
          <input 
            type="number"
            value={transform.translateX || 0} 
            onChange={(e) => handlePositionChange('translateX', e.target.value)}
            className="w-full border rounded p-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Y Position</label>
          <input 
            type="number"
            value={transform.translateY || 0} 
            onChange={(e) => handlePositionChange('translateY', e.target.value)}
            className="w-full border rounded p-1 text-sm"
          />
        </div>
      </div>
      
      {/* Rotation Controls */}
      {showRotation && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rotation (degrees)
          </label>
          <div className="flex items-center">
            <input 
              type="range" 
              min="0" 
              max="360" 
              step="1"
              value={transform.rotation || 0} 
              onChange={(e) => handleRotationChange(e.target.value)}
              className="w-full"
            />
            <input
              type="number"
              min="0"
              max="360"
              step="1"
              value={transform.rotation || 0}
              onChange={(e) => handleRotationChange(e.target.value)}
              className="ml-2 w-16 border rounded p-1 text-sm"
            />
          </div>
        </div>
      )}
      
      {/* Scale Controls */}
      {showScale && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Scale X</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.05"
                value={transform.scaleX || 1} 
                onChange={(e) => handleScaleChange('scaleX', e.target.value)}
                className="w-full"
              />
              <span className="ml-2 text-xs w-10">{(transform.scaleX || 1).toFixed(2)}x</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Scale Y</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.05"
                value={transform.scaleY || 1} 
                onChange={(e) => handleScaleChange('scaleY', e.target.value)}
                className="w-full"
              />
              <span className="ml-2 text-xs w-10">{(transform.scaleY || 1).toFixed(2)}x</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransformControls;
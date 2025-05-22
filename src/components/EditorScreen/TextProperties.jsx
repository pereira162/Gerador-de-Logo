// components/EditorScreen/TextProperties.jsx
import React from 'react';
import ColorPicker from '../common/ColorPicker';
import TransformControls from '../common/TransformControls';
import fontManager from '../../services/FontManager';

/**
 * TextProperties component for editing SVG text properties
 * @param {Object} props - Component props
 * @param {Object} props.element - The selected text element data
 * @param {Object} props.transform - The element's transform data
 * @param {function} props.onStyleChange - Function to call when style changes
 * @param {function} props.onTransformChange - Function to call when transforms change
 * @param {function} props.onContentChange - Function to call when text content changes
 * @param {function} props.onReset - Function to call when reset button is clicked
 */
const TextProperties = ({
  element,
  transform,
  onStyleChange,
  onTransformChange,
  onContentChange,
  onReset
}) => {
  if (!element) return null;

  // Get available fonts from FontManager
  const availableFonts = fontManager.getAvailableFonts() || [];

  // Handle text content change
  const handleContentChange = (e) => {
    onContentChange(e.target.value);
  };

  // Handle font family change
  const handleFontFamilyChange = (e) => {
    onStyleChange('fontFamily', e.target.value);
  };

  // Handle font size change
  const handleFontSizeChange = (value) => {
    const size = Number(value);
    if (!isNaN(size) && size > 0) {
      onStyleChange('fontSize', size);
    }
  };

  // Handle font weight change
  const handleFontWeightChange = (e) => {
    onStyleChange('fontWeight', e.target.value);
  };

  // Handle text alignment change
  const handleAlignmentChange = (alignment) => {
    onStyleChange('alignment', alignment);
  };

  // Handle opacity change
  const handleOpacityChange = (value) => {
    const opacity = Number(value);
    if (!isNaN(opacity)) {
      onStyleChange('opacity', opacity);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Text Properties</h3>

        {/* Text Content */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            value={element.content || ''}
            onChange={handleContentChange}
            className="w-full border rounded p-2 text-sm"
            rows="2"
          />
        </div>

        {/* Font Family */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={element.fontFamily || 'Arial'}
            onChange={handleFontFamilyChange}
            className="w-full border rounded p-2 text-sm"
          >
            {availableFonts.map((font) => (
              <option key={font.family} value={font.family}>
                {font.family}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <div className="flex items-center">
            <input 
              type="range" 
              min="8" 
              max="72" 
              step="1"
              value={element.fontSize || 24} 
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="w-full"
            />
            <input
              type="number"
              min="1"
              value={element.fontSize || 24}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="ml-2 w-16 border rounded p-1 text-sm"
            />
          </div>
        </div>

        {/* Font Weight */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Weight
          </label>
          <select
            value={element.fontWeight || '400'}
            onChange={handleFontWeightChange}
            className="w-full border rounded p-2 text-sm"
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="700">Bold (700)</option>
          </select>
        </div>

        {/* Text Alignment */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Alignment
          </label>
          <div className="flex space-x-1">
            <button
              className={`flex-1 py-1 px-2 border rounded text-sm ${
                element.alignment === 'start' ? 'bg-blue-100 border-blue-300' : 'bg-white'
              }`}
              onClick={() => handleAlignmentChange('start')}
            >
              Left
            </button>
            <button
              className={`flex-1 py-1 px-2 border rounded text-sm ${
                (element.alignment === 'middle' || element.alignment === 'center') 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'bg-white'
              }`}
              onClick={() => handleAlignmentChange('middle')}
            >
              Center
            </button>
            <button
              className={`flex-1 py-1 px-2 border rounded text-sm ${
                element.alignment === 'end' ? 'bg-blue-100 border-blue-300' : 'bg-white'
              }`}
              onClick={() => handleAlignmentChange('end')}
            >
              Right
            </button>
          </div>
        </div>

        {/* Text Color */}
        <ColorPicker
          color={element.fill || '#000000'}
          onChange={(color) => onStyleChange('fill', color)}
          label="Text Color"
        />

        {/* Opacity */}
        <div className="mb-3">
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

export default TextProperties;
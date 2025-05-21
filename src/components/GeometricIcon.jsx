// src/components/GeometricIcon.jsx
import React from 'react';

const GeometricIcon = ({ svgPath, size = 100, color = "currentColor" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`geometric-icon`}
      style={{ color }}
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
        </filter>
      </defs>
      
      <g filter="url(#shadow)">
        {svgPath && <g dangerouslySetInnerHTML={{ __html: svgPath }} />}
      </g>
    </svg>
  );
};

export default GeometricIcon;
// src/components/IconGrid.jsx
import React from 'react';
import LogoCard from './LogoCard';

const IconGrid = ({ logos, onSelectLogo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {logos.map((logo) => (
        <LogoCard 
          key={logo.id} 
          logo={logo} 
          onSelect={onSelectLogo}
        />
      ))}
    </div>
  );
};

export default IconGrid;
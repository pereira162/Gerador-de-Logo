// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import IconGrid from './components/IconGrid';
import GeometricIcon from './components/GeometricIcon';
import LogoData from './data/LogoData';

function App() {
  const [selectedLogo, setSelectedLogo] = useState(null);
  
  const handleSelectLogo = (logo) => {
    setSelectedLogo(logo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setSelectedLogo(null);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 flex-grow">
        {selectedLogo ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Selected Logo: {selectedLogo.name}</h2>
              <button 
                onClick={handleBack}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to All Icons
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="p-8 bg-gray-50 rounded-lg inline-block">
                  <GeometricIcon svgPath={selectedLogo.svgPath} size={250} color={selectedLogo.colors[0].hex} />
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">About this Design</h3>
                  <p className="text-gray-600">{selectedLogo.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Geometric Logic</h3>
                  <p className="text-gray-600">{selectedLogo.geometricLogic}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Symbolism</h3>
                  <p className="text-gray-600">{selectedLogo.symbolism}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Suggested Color Palette</h3>
                  <div className="flex flex-wrap gap-4">
                    {selectedLogo.colors.map((color, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-16 h-16 rounded-lg shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 mt-1">{color.name}</span>
                        <span className="text-xs text-gray-500">{color.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-blue-800 text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-blue-600 text-sm">
                    In the next phase, you'll be able to customize this icon by adjusting components, 
                    changing colors, and adding typography to create your complete logo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-6 mb-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Geometric Logo Portfolio</h2>
              <p className="text-gray-600 max-w-3xl">
                Explore our collection of 10 distinctive geometric logo icons designed specifically for 
                engineering and sustainability businesses. Each icon uses pure geometry to convey 
                precision, innovation, and environmental consciousness. Select any logo to view details 
                and use it as a starting point for your brand identity.
              </p>
            </div>
            
            <IconGrid logos={LogoData} onSelectLogo={handleSelectLogo} />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
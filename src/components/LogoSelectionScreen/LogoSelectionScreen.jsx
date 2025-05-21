import React, { useEffect } from 'react';
import { availableSVGTemplates } from '../../utils/SVGTemplates';
import useLogoStore from '../../store/LogoStore';

const LogoSelectionScreen = () => {
  const selectLogo = useLogoStore(state => state.selectLogo);
  
  useEffect(() => {
    // If this component is shown, make sure we're in selection mode
    useLogoStore.setState({ currentScreen: 'selection' });
  }, []);
  
  const handleLogoSelect = async (logoId) => {
    await selectLogo(logoId);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select a Geometric Logo Template</h1>
        
        <p className="text-center mb-8 text-gray-600">
          Choose from our collection of geometric logo templates to start creating your professional logo.
          Each design symbolizes different concepts suitable for engineering and sustainability sectors.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {availableSVGTemplates.map((template) => (
            <div 
              key={template.id}
              className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 p-4 border rounded-lg hover:shadow-lg"
              onClick={() => handleLogoSelect(template.id)}
            >
              <div 
                className="w-full aspect-square mb-2 flex items-center justify-center"
                dangerouslySetInnerHTML={{ 
                  __html: `<div style="width: 80px; height: 80px;">
                            ${template.id === "circle" ? 
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><circle cx="200" cy="200" r="180" fill="#0B3C5D"/></svg>' :
                            template.id === "square" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><rect x="40" y="40" width="320" height="320" fill="#0B3C5D"/></svg>' :
                            template.id === "triangle" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><polygon points="200,40 40,340 360,340" fill="#0B3C5D"/></svg>' :
                            template.id === "hexagon" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><polygon points="200,40 340,120 340,280 200,360 60,280 60,120" fill="#0B3C5D"/></svg>' :
                            template.id === "spiral" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><path d="M200,200 C200,180 220,160 240,160 C270,160 290,190 290,220 C290,260 250,290 210,290 C160,290 120,250 120,200 C120,140 170,100 230,100" fill="none" stroke="#0B3C5D" stroke-width="8"/></svg>' :
                            template.id === "grid" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><rect x="50" y="50" width="300" height="300" fill="#fff"/><line x1="50" y1="100" x2="350" y2="100" stroke="#0B3C5D" stroke-width="3"/><line x1="50" y1="200" x2="350" y2="200" stroke="#0B3C5D" stroke-width="3"/><line x1="50" y1="300" x2="350" y2="300" stroke="#0B3C5D" stroke-width="3"/><line x1="100" y1="50" x2="100" y2="350" stroke="#328CC1" stroke-width="3"/><line x1="200" y1="50" x2="200" y2="350" stroke="#328CC1" stroke-width="3"/><line x1="300" y1="50" x2="300" y2="350" stroke="#328CC1" stroke-width="3"/></svg>' :
                            template.id === "lines" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><line x1="40" y1="200" x2="360" y2="200" stroke="#0B3C5D" stroke-width="15"/><line x1="200" y1="40" x2="200" y2="360" stroke="#328CC1" stroke-width="15"/><circle cx="200" cy="200" r="25" fill="#D9B310"/></svg>' :
                            template.id === "curve" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><path d="M40,200 C80,140 120,260 160,140 C200,20 240,120 280,240 C320,360 360,200 360,200" fill="none" stroke="#0B3C5D" stroke-width="12"/></svg>' :
                            template.id === "fractal" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><polygon points="200,40 40,320 360,320" fill="#0B3C5D"/><polygon points="200,40 120,180 280,180" fill="#328CC1"/></svg>' :
                            template.id === "biomorf" ?
                              '<svg viewBox="0 0 400 400" width="100%" height="100%"><path d="M200,50 C260,50 320,90 350,150 C380,210 380,280 340,330 C300,380 240,380 200,370 C160,380 100,380 60,330 C20,280 20,210 50,150 C80,90 140,50 200,50 Z" fill="#0B3C5D"/></svg>' :
                            '<svg viewBox="0 0 400 400" width="100%" height="100%"><circle cx="200" cy="200" r="180" fill="#0B3C5D"/></svg>'
                            }
                          </div>`
                }}
              />
              <span className="text-sm text-center font-medium">
                {template.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSelectionScreen;
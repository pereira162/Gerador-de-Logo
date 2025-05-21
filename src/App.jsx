import React, { useEffect } from 'react';
import './index.css';
import useLogoStore from './store/LogoStore';
import LogoSelectionScreen from './components/LogoSelectionScreen/LogoSelectionScreen';
import EditorScreen from './components/EditorScreen/EditorScreen';
import TypographyScreen from './components/TypographyScreen/TypographyScreen';
import ExportScreen from './components/ExportScreen/ExportScreen';
import fontManager from './services/FontManager';

function App() {
  const currentScreen = useLogoStore(state => state.currentScreen);
  
  // Load fonts when app starts
  useEffect(() => {
    fontManager.loadFonts().catch(err => {
      console.error('Error loading fonts:', err);
    });
  }, []);

  // Render appropriate screen based on state
  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'selection':
        return <LogoSelectionScreen />;
      case 'editor':
        return <EditorScreen />;
      case 'typography':
        return <TypographyScreen />;
      case 'export':
        return <ExportScreen />;
      default:
        return <LogoSelectionScreen />;
    }
  };
  
  return (
    <div className="app-container min-h-screen bg-gray-50">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
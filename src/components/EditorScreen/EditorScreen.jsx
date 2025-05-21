import React, { useState, useEffect } from 'react';
import useLogoStore from '../../store/LogoStore';
import EditingCanvas from './EditingCanvas';
import PropertiesPanel from './PropertiesPanel';
import ColorEditorPanel from './ColorEditorPanel';

const EditorScreen = () => {
  const [activeTab, setActiveTab] = useState('properties'); // 'properties', 'colors'
  const { currentProject, setScreen } = useLogoStore(state => ({
    currentProject: state.currentProject,
    setScreen: state.setScreen
  }));
  
  const { selectedLogoId, selectedElementId } = currentProject;
  
  useEffect(() => {
    // If no logo is selected, go back to selection screen
    if (!selectedLogoId) {
      setScreen('selection');
    }
  }, [selectedLogoId, setScreen]);
  
  const handleSwitchToTypography = () => {
    setScreen('typography');
  };
  
  const handleSwitchToExport = () => {
    setScreen('export');
  };
  
  const handleBackToSelection = () => {
    if (confirm('Going back to logo selection will discard your current design. Continue?')) {
      setScreen('selection');
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Geometric Logo Editor</h1>
          <div className="space-x-2">
            <button 
              onClick={handleBackToSelection}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Back to Selection
            </button>
            <button 
              onClick={handleSwitchToTypography}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Add Typography
            </button>
            <button 
              onClick={handleSwitchToExport}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
            >
              Export
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Canvas) */}
        <div className="w-2/3 p-4 bg-gray-100">
          <EditingCanvas />
        </div>
        
        {/* Right Panel (Properties) */}
        <div className="w-1/3 border-l border-gray-300 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-300">
            <button 
              className={`px-4 py-2 flex-1 ${activeTab === 'properties' ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('properties')}
            >
              Properties
            </button>
            <button 
              className={`px-4 py-2 flex-1 ${activeTab === 'colors' ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('colors')}
            >
              Colors
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'properties' ? (
              <PropertiesPanel />
            ) : (
              <ColorEditorPanel />
            )}
          </div>
          
          {/* Status Bar */}
          <div className="p-2 bg-gray-100 border-t border-gray-300 text-sm text-gray-600">
            {selectedElementId ? (
              <span>Editing element: {selectedElementId}</span>
            ) : (
              <span>No element selected. Click on a shape to edit it.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorScreen;
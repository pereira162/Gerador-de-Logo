import React, { useState } from 'react';
import useLogoStore from '../../store/LogoStore';
import exportManager from '../../services/ExportManager';

const ExportScreen = () => {
  const [exportFormat, setExportFormat] = useState('svg');
  const [resolution, setResolution] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [exportVariant, setExportVariant] = useState('main');
  
  const { currentProject, setScreen, exportLogo } = useLogoStore(state => ({
    currentProject: state.currentProject,
    setScreen: state.setScreen,
    exportLogo: state.exportLogo
  }));
  
  // Handle export action
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportLogo(exportFormat, resolution);
    } catch (error) {
      console.error('Error exporting logo:', error);
      alert('Failed to export logo. Please try again.');
    }
    setIsExporting(false);
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Export Logo</h1>
          <div className="space-x-2">
            <button 
              onClick={() => setScreen('editor')}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Back to Editor
            </button>
            <button 
              onClick={() => setScreen('typography')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Edit Typography
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Preview) */}
        <div className="w-2/3 p-8 bg-gray-100 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Logo Preview</h2>
          <div className="flex-1 bg-white rounded-lg shadow-inner border border-gray-200 flex items-center justify-center">
            <div 
              id="editing-canvas" 
              className="w-full max-w-md mx-auto aspect-square"
            >
              {/* SVG is rendered here by SVGManager */}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Final preview of your logo with all customizations applied.
          </div>
        </div>
        
        {/* Right Panel (Export Controls) */}
        <div className="w-1/3 p-6 border-l border-gray-300 overflow-y-auto">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            
            {/* Format selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="svg"
                    checked={exportFormat === 'svg'}
                    onChange={() => setExportFormat('svg')}
                    className="mr-2"
                  />
                  <span>SVG</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="png"
                    checked={exportFormat === 'png'}
                    onChange={() => setExportFormat('png')}
                    className="mr-2"
                  />
                  <span>PNG</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {exportFormat === 'svg' ? 
                  'SVG is scalable and ideal for most professional uses.' : 
                  'PNG is suitable for digital platforms and presentations.'}
              </p>
            </div>
            
            {/* Resolution for PNG */}
            {exportFormat === 'png' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  className="w-full border rounded p-2"
                >
                  <option value={1}>Standard (400x400px)</option>
                  <option value={2}>High (800x800px)</option>
                  <option value={4}>Ultra (1600x1600px)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Higher resolution results in larger file size.
                </p>
              </div>
            )}
            
            {/* Variant selection - disabled for MVP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variant</label>
              <select
                value={exportVariant}
                onChange={(e) => setExportVariant(e.target.value)}
                className="w-full border rounded p-2"
                disabled={true}
              >
                <option value="main">Main Logo</option>
                <option value="horizontal" disabled>Horizontal Layout (coming soon)</option>
                <option value="vertical" disabled>Vertical Layout (coming soon)</option>
                <option value="icon-only" disabled>Icon Only (coming soon)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                In the MVP, only the main logo variant is available.
              </p>
            </div>
            
            {/* Export Button */}
            <div className="pt-4">
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full py-3 ${isExporting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded font-medium`}
              >
                {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
              </button>
            </div>
            
            {/* Information */}
            <div className="bg-blue-50 p-4 rounded mt-6 text-sm">
              <h4 className="font-medium text-blue-700 mb-2">What happens next?</h4>
              <ul className="list-disc pl-4 text-blue-800 space-y-1">
                <li>Your logo will be downloaded in the selected format</li>
                <li>SVG files maintain full editability in vector software</li>
                <li>PNG files are ready for web and print use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportScreen;
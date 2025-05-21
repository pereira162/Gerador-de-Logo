import React, { useState, useEffect } from 'react';
import useLogoStore from '../../store/LogoStore';
import exportManager from '../../services/ExportManager';
import svgManager from '../../services/SVGManager';
import '../../index.css';

const ExportScreen = () => {
  const { currentProject, setScreen } = useLogoStore();
  const [exportFormat, setExportFormat] = useState('svg');
  const [resolution, setResolution] = useState(1);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName] = useState('meu-logo');

  // Get the current SVG content from the store
  const svgContent = useLogoStore(state => state.currentProject.svgContent);
  const selectedLogoId = useLogoStore(state => state.currentProject.selectedLogoId);

  // Initialize the SVG content in the editing canvas
  useEffect(() => {
    if (!svgContent || !selectedLogoId) return;
    
    // Initialize the SVG Manager with the current SVG content
    svgManager.initialize(svgContent, "editing-canvas");
    
    // Set the SVG content in the export manager for export functionality
    exportManager.setSVGContent(svgContent);
  }, [svgContent, selectedLogoId]);

  // Função para exportar o logo
  const handleExport = async () => {
    setIsExporting(true);
    try {
      let result;
      
      if (exportFormat === 'svg') {
        result = exportManager.exportSVG();
      } else if (exportFormat === 'png') {
        result = await exportManager.exportPNG([], resolution);
      }
      
      if (result) {
        // Para SVG, criar um blob a partir da string SVG
        if (exportFormat === 'svg') {
          const blob = new Blob([result], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          triggerDownload(url, `${fileName}.svg`);
        } 
        // Para PNG, o resultado já é um dataURL
        else if (exportFormat === 'png') {
          setDownloadUrl(result);
          triggerDownload(result, `${fileName}.png`);
        }
      }
    } catch (error) {
      console.error('Erro ao exportar logo:', error);
      alert('Erro ao exportar. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Função auxiliar para disparar o download
  const triggerDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviousClick = () => {
    setScreen('typography');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Exportar Logo</h1>
        <button
          onClick={handlePreviousClick}
          className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de previsualização */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Prévia Final</h2>
          <div 
            className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center"
            style={{ 
              height: '400px',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            <div 
              id="editing-canvas" 
              className="w-full h-full flex items-center justify-center"
            />
          </div>
        </div>

        {/* Painel de exportação */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Opções de Exportação</h2>
            
            <div className="space-y-6">
              {/* Nome do arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Arquivo
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="meu-logo"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Formato de exportação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="svg"
                      checked={exportFormat === 'svg'}
                      onChange={() => setExportFormat('svg')}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">SVG (vetorial)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="png"
                      checked={exportFormat === 'png'}
                      onChange={() => setExportFormat('png')}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">PNG (imagem)</span>
                  </label>
                </div>
              </div>
              
              {/* Resolução (apenas para PNG) */}
              {exportFormat === 'png' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolução
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="1">Normal (400×400px)</option>
                    <option value="2">Média (800×800px)</option>
                    <option value="4">Alta (1600×1600px)</option>
                  </select>
                </div>
              )}
              
              {/* Botão de exportação */}
              <div>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isExporting ? 'Exportando...' : `Exportar como ${exportFormat.toUpperCase()}`}
                </button>
              </div>
              
              {/* Botão para baixar novamente */}
              {downloadUrl && (
                <div>
                  <a
                    href={downloadUrl}
                    download={`${fileName}.${exportFormat}`}
                    className="block w-full py-3 text-center bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Baixar Novamente
                  </a>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Começar um Novo Logo</h3>
                <button
                  onClick={() => setScreen('selection')}
                  className="w-full py-2 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Voltar à Seleção de Modelos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportScreen;
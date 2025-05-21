import React, { useState, useEffect } from 'react';
import useLogoStore from '../store/LogoStore';
import exportManager from '../services/ExportManager';
import fontManager from '../services/FontManager';

const SVGExporter = () => {
  const [format, setFormat] = useState('svg');
  const [resolution, setResolution] = useState(1);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const { exportLogo } = useLogoStore();
  
  // Pré-carregar fontes ao montar o componente
  useEffect(() => {
    const preloadFonts = async () => {
      await fontManager.initialize();
    };
    preloadFonts();
  }, []);
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Garantir que as fontes estejam carregadas antes da exportação
      await fontManager.initialize();
      
      // Usar o exportLogo do LogoStore que já integra com o ExportManager
      const result = await exportLogo(format, resolution);
      
      if (result) {
        // Criar URL para download
        const blob = new Blob([result], { 
          type: format === 'svg' ? 'image/svg+xml' : 'image/png' 
        });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        
        // Disparar o download automaticamente
        const link = document.createElement('a');
        link.href = url;
        link.download = `logo.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro ao exportar logo:', error);
      alert('Não foi possível exportar o logo. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Exportar Logo</h2>
      <p className="text-gray-600 mb-6">
        Escolha o formato e a resolução desejada para exportar seu logo finalizado.
      </p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Formato
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="format"
                value="svg"
                checked={format === 'svg'}
                onChange={() => setFormat('svg')}
              />
              <span className="ml-2">SVG (vetorial)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="format"
                value="png"
                checked={format === 'png'}
                onChange={() => setFormat('png')}
              />
              <span className="ml-2">PNG (imagem)</span>
            </label>
          </div>
        </div>
        
        {format === 'png' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resolução
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
            >
              <option value="1">Normal (1x)</option>
              <option value="2">Média (2x)</option>
              <option value="4">Alta (4x)</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exportando...' : 'Exportar'}
        </button>
        
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={`logo.${format}`}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Baixar Novamente
          </a>
        )}
      </div>
    </div>
  );
};

export default SVGExporter;
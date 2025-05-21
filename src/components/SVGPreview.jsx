import React, { useEffect, useRef } from 'react';
import useLogoStore from '../store/LogoStore';
import svgManager from '../services/SVGManager';

const SVGPreview = ({ width = 400, height = 400 }) => {
  const canvasRef = useRef(null);
  const { currentProject, selectElement } = useLogoStore();
  
  // Configurar o handler de seleção
  useEffect(() => {
    if (canvasRef.current) {
      // Definir callback para quando um elemento for selecionado no SVG
      svgManager.setElementSelectCallback((elementId) => {
        selectElement(elementId);
      });
    }
  }, [selectElement]);
  
  // Carregar SVG no canvas quando o conteúdo mudar
  useEffect(() => {
    if (canvasRef.current && currentProject.svgContent) {
      // Limpar qualquer conteúdo existente
      while (canvasRef.current.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
      
      // Inicializar o SVG Manager com o novo conteúdo
      svgManager.initialize(currentProject.svgContent, 'editing-canvas');
    }
  }, [currentProject.svgContent]);
  
  // Destacar o elemento selecionado
  useEffect(() => {
    if (currentProject.selectedElementId) {
      // Encontrar todos os elementos com classe de seleção e remover
      const selectedElements = document.querySelectorAll('.selected-element');
      selectedElements.forEach(el => {
        el.classList.remove('selected-element');
        // Restaurar o stroke original se necessário
        const originalStroke = el.getAttribute('data-original-stroke');
        if (originalStroke) {
          el.setAttribute('stroke', originalStroke);
          el.removeAttribute('data-original-stroke');
        }
      });
      
      // Encontrar o elemento selecionado e adicionar destaque
      const selectedElement = document.getElementById(currentProject.selectedElementId);
      if (selectedElement) {
        selectedElement.classList.add('selected-element');
        
        // Armazenar o stroke original e aplicar um novo para indicar seleção
        const currentStroke = selectedElement.getAttribute('stroke');
        if (currentStroke) {
          selectedElement.setAttribute('data-original-stroke', currentStroke);
        }
        selectedElement.setAttribute('stroke', '#2563eb');
        selectedElement.setAttribute('stroke-width', '2');
      }
    }
  }, [currentProject.selectedElementId]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Prévia do Logo</h2>
        <p className="text-gray-500 text-sm">Clique em um elemento para editá-lo</p>
      </div>
      
      <div 
        className="border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center"
        style={{ 
          width: width, 
          height: height, 
          maxWidth: '100%',
          margin: '0 auto'
        }}
      >
        <div 
          id="editing-canvas" 
          ref={canvasRef}
          className="w-full h-full flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default SVGPreview;
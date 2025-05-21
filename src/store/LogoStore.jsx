import { create } from 'zustand';
import colorManager from '../services/ColorManager';
import svgManager from '../services/SVGManager';
import { availableSVGTemplates } from '../utils/SVGTemplates';

/**
 * LogoStore - Gerencia o estado global da aplicação de logos
 * Controla o fluxo de telas, os elementos do logo, e as cores
 */
const useLogoStore = create((set, get) => ({
  // Estado atual da navegação
  currentScreen: 'selection', // selection, editor, typography, export
  
  // Projeto de logo atual
  currentProject: {
    selectedLogoId: null,
    selectedElementId: null,
    svgContent: null,
    elements: new Map(), // Mapa de elementos SVG com suas propriedades
    textElements: [], // Array para elementos de texto
    colorPalette: colorManager.getCurrentPalette(),
  },
  
  // Histórico para desfazer/refazer (P1)
  history: {
    past: [],
    future: [],
  },
  
  // Métodos para navegação
  setScreen: (screen) => {
    set({ currentScreen: screen });
  },
  
  // Métodos para projeto/logo
  selectLogo: async (logoId) => {
    const template = availableSVGTemplates.find(t => t.id === logoId);
    if (!template) return false;
    
    try {
      // Carregar o SVG do template
      const response = await fetch(template.path);
      if (!response.ok) throw new Error('Falha ao carregar SVG');
      
      const svgContent = await response.text();
      
      // Analisar o SVG para extrair elementos identificáveis
      const elementMap = await svgManager.parseSVGElements(svgContent);
      
      set(state => ({
        currentProject: {
          ...state.currentProject,
          selectedLogoId: logoId,
          svgContent,
          elements: elementMap,
          selectedElementId: null, // Resetar qualquer seleção anterior
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Erro ao carregar SVG do template:', error);
      return false;
    }
  },
  
  // Métodos para manipulação de elementos
  selectElement: (elementId) => {
    set(state => ({
      currentProject: {
        ...state.currentProject,
        selectedElementId: elementId
      }
    }));
  },
  
  updateElement: (elementId, properties) => {
    const { currentProject } = get();
    const element = currentProject.elements.get(elementId);
    
    if (!element) return false;
    
    // Atualizar as propriedades no elemento
    const updatedElement = { ...element, ...properties };
    const updatedElements = new Map(currentProject.elements);
    updatedElements.set(elementId, updatedElement);
    
    // Atualizar o elemento no DOM via SVGManager
    Object.keys(properties).forEach(prop => {
      svgManager.updateElementProperty(elementId, prop, properties[prop]);
    });
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        elements: updatedElements
      }
    }));
    
    return true;
  },
  
  // Métodos para gerenciamento de paletas de cores
  applyColorPalette: (paletteId) => {
    const palette = colorManager.getPalette(paletteId);
    if (!palette) return false;
    
    const { currentProject } = get();
    
    // Aplicar cores da paleta aos elementos
    // 1. Elementos primários recebem a cor primária
    // 2. Elementos secundários recebem a cor secundária
    // 3. Elementos de destaque recebem a cor de destaque

    // Atualizar todos os elementos com as novas cores
    const updatedElements = new Map();
    currentProject.elements.forEach((element, id) => {
      let updatedElement = { ...element };

      // Aplicar cores baseado na "role" do elemento (se existir)
      if (element.role === 'primary') {
        updatedElement.fill = palette.primary;
      } else if (element.role === 'secondary') {
        updatedElement.fill = palette.secondary;
      } else if (element.role === 'accent') {
        updatedElement.fill = palette.accent;
      } else {
        // Para elementos sem role específica, alternar entre primária e secundária
        const index = parseInt(id.replace(/\D/g, '')) || 0;
        updatedElement.fill = index % 2 === 0 ? palette.primary : palette.secondary;
      }

      updatedElements.set(id, updatedElement);
      
      // Atualizar no DOM via SVGManager
      svgManager.updateElementProperty(id, 'fill', updatedElement.fill);
    });
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        elements: updatedElements,
        colorPalette: palette
      }
    }));
    
    return true;
  },
  
  // Métodos para manipulação de texto
  addTextElement: (textProps) => {
    const id = `text-${Date.now()}`;
    const textElement = {
      id,
      ...textProps
    };
    
    // Adicionar o elemento de texto no DOM via SVGManager
    svgManager.addTextElement(textElement);
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        textElements: [...state.currentProject.textElements, textElement]
      }
    }));
    
    return id;
  },
  
  updateTextElement: (textId, properties) => {
    const { currentProject } = get();
    const textElement = currentProject.textElements.find(el => el.id === textId);
    
    if (!textElement) return false;
    
    // Atualizar as propriedades no elemento
    const updatedTextElement = { ...textElement, ...properties };
    const updatedTextElements = currentProject.textElements.map(el => 
      el.id === textId ? updatedTextElement : el
    );
    
    // Atualizar o elemento no DOM via SVGManager
    svgManager.updateTextElement(textId, properties);
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        textElements: updatedTextElements
      }
    }));
    
    return true;
  },
  
  // Métodos para exportação (integração com ExportManager)
  exportLogo: async (format, resolution = 1) => {
    // A implementação aqui depende do ExportManager
    // Retornar o resultado da exportação
    // Implementado no ExportManager.jsx
    return true;
  }
}));

export default useLogoStore;
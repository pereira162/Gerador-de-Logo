import { create } from 'zustand';
import colorManager from '../services/ColorManager';
import fontManager from '../services/FontManager';
import exportManager from '../services/ExportManager';
import svgManager from '../services/SVGManager';
import { getAllTemplates, loadTemplateContent } from '../utils/SVGTemplates';

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
    // Adicionar transformações por elemento
    transformations: new Map(), // Mapa de transformações por elemento ID
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
    const template = getAllTemplates().find(t => t.id === logoId);
    if (!template) return false;
    
    try {
      // Carregar o SVG do template usando o método de utils/SVGTemplates
      const svgContent = await loadTemplateContent(logoId);
      if (!svgContent) throw new Error('Falha ao carregar SVG');
      
      // Analisar o SVG para extrair elementos identificáveis
      const elementMap = await svgManager.parseSVGElements(svgContent);
      
      // Iniciar carregamento das fontes necessárias
      await fontManager.initialize();
      
      // Aplicar paleta de cores padrão
      const defaultPalette = {
        primary: '#0B3C5D', 
        secondary: '#328CC1', 
        accent: '#D9B310'
      };
      
      set(state => ({
        currentProject: {
          ...state.currentProject,
          selectedLogoId: logoId,
          svgContent,
          elements: elementMap,
          selectedElementId: null, // Resetar qualquer seleção anterior
          colorPalette: defaultPalette,
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
    // Highlight the selected element in the SVG
    svgManager.highlightSelectedElement(elementId);
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        selectedElementId: elementId
      }
    }));
  },
  
  // Initialize transformations for an element
  initElementTransform: (elementId) => {
    const { currentProject } = get();
    
    // If transformation already exists, don't create a new one
    if (currentProject.transformations.has(elementId)) return;
    
    // Default transformation values
    const defaultTransform = {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    
    // Update the transformations map
    const updatedTransformations = new Map(currentProject.transformations);
    updatedTransformations.set(elementId, defaultTransform);
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        transformations: updatedTransformations
      }
    }));
  },
  
  // Update transformation for an element
  updateElementTransform: (elementId, transformProps) => {
    const { currentProject } = get();
    let elementTransform = currentProject.transformations.get(elementId) || {
      translateX: 0, 
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    };
    
    // Update with new transformation values
    elementTransform = { ...elementTransform, ...transformProps };
    
    // Create updated transformations map
    const updatedTransformations = new Map(currentProject.transformations);
    updatedTransformations.set(elementId, elementTransform);
    
    // Apply transformation to the SVG element
    svgManager.applyTransformation(elementId, {
      x: elementTransform.translateX,
      y: elementTransform.translateY,
      scaleX: elementTransform.scaleX,
      scaleY: elementTransform.scaleY,
      rotation: elementTransform.rotation
    });
    
    // Update state
    set(state => ({
      currentProject: {
        ...state.currentProject,
        transformations: updatedTransformations
      }
    }));
    
    return true;
  },
  
  updateElement: (elementId, properties) => {
    const { currentProject } = get();
    const element = currentProject.elements.get(elementId);
    
    if (!element) return false;
    
    // Atualizar as propriedades no elemento
    const updatedElement = { ...element, ...properties };
    const updatedElements = new Map(currentProject.elements);
    updatedElements.set(elementId, updatedElement);
    
    // Filter style properties vs. other properties
    const styleProps = {};
    if (properties.fill !== undefined) styleProps.fill = properties.fill;
    if (properties.stroke !== undefined) styleProps.stroke = properties.stroke;
    if (properties.strokeWidth !== undefined) styleProps.strokeWidth = properties.strokeWidth;
    if (properties.opacity !== undefined) styleProps.opacity = properties.opacity;
    
    // Apply style changes via SVGManager if there are style props
    if (Object.keys(styleProps).length > 0) {
      svgManager.applyStyle(elementId, styleProps);
    }
    
    // Update other properties using the old method
    const otherProps = { ...properties };
    ["fill", "stroke", "strokeWidth", "opacity"].forEach(prop => delete otherProps[prop]);
    
    Object.keys(otherProps).forEach(prop => {
      svgManager.updateElementProperty(elementId, prop, otherProps[prop]);
    });
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        elements: updatedElements
      }
    }));
    
    return true;
  }
  
  // Métodos para gerenciamento de paletas de cores
  applyColorPalette: (paletteId) => {
    let palette;
    
    // Verificar se o paletteId é uma string (nome da paleta) ou um objeto (paleta personalizada)
    if (typeof paletteId === 'string') {
      // Pegar uma paleta predefinida do color manager
      const colorScheme = colorManager.getActiveColorScheme().find(scheme => scheme === paletteId);
      if (!colorScheme) {
        // Se não encontrou, tentar usar o esquema 'modern' como fallback
        colorManager.setActiveColorScheme('modern');
        const colors = colorManager.getActiveColorScheme();
        palette = {
          primary: colors.find(c => c.name === 'Primary').hex,
          secondary: colors.find(c => c.name === 'Secondary').hex,
          accent: colors.find(c => c.name === 'Accent').hex,
          dark: colors.find(c => c.name === 'Dark').hex,
          light: colors.find(c => c.name === 'Light').hex
        };
      } else {
        // Usar a paleta encontrada
        const colors = colorManager.getActiveColorScheme();
        palette = {
          primary: colors.find(c => c.name === 'Primary').hex,
          secondary: colors.find(c => c.name === 'Secondary').hex,
          accent: colors.find(c => c.name === 'Accent').hex,
          dark: colors.find(c => c.name === 'Dark').hex,
          light: colors.find(c => c.name === 'Light').hex
        };
      }
    } else if (typeof paletteId === 'object') {
      // Usar uma paleta personalizada passada diretamente
      palette = paletteId;
    } else {
      // Usar paleta técnica padrão
      palette = {
        primary: '#0B3C5D',
        secondary: '#328CC1',
        accent: '#D9B310',
        dark: '#1D2731',
        light: '#F5F5F5'
      };
    }
    
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
    
    // Usar ColorManager para aplicar cores também nos textos
    currentProject.textElements.forEach(text => {
      const textColor = colorManager.getTextColorForBackground(palette.primary);
      svgManager.updateTextElement(text.id, { fill: textColor });
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
  addTextElement: async (textProps) => {
    // Carregar as fontes disponíveis se ainda não estiverem carregadas
    await fontManager.initialize();
    
    // Obter a primeira fonte disponível como padrão se o fontFamily não for especificado
    const availableFonts = fontManager.getAvailableFonts();
    const defaultFont = availableFonts.length > 0 ? availableFonts[0].family : 'Arial';
    
    // Se a fonte não for especificada, usar a padrão
    if (!textProps.fontFamily) {
      textProps.fontFamily = defaultFont;
    }
    
    // Definir cor de texto com contraste adequado em relação ao fundo se não foi especificada
    if (!textProps.fill) {
      const { currentProject } = get();
      if (currentProject.colorPalette) {
        // Usar ColorManager para definir uma cor de texto com bom contraste
        textProps.fill = colorManager.getTextColorForBackground(currentProject.colorPalette.primary);
      } else {
        textProps.fill = '#000000'; // Cor padrão
      }
    }
    
    const id = `text-${Date.now()}`;
    const textElement = {
      id,
      ...textProps
    };
    
    // Carregar a fonte especificada antes de adicionar o texto
    await fontManager.loadFont(textProps.fontFamily);
    
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
  
  updateTextElement: async (textId, properties) => {
    const { currentProject } = get();
    const textElement = currentProject.textElements.find(el => el.id === textId);
    
    if (!textElement) return false;
    
    // Se a fonte está sendo alterada, garantir que seja carregada
    if (properties.fontFamily) {
      await fontManager.loadFont(properties.fontFamily);
    }
    
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
    try {
      // Garantir que as fontes estão carregadas para a exportação
      await fontManager.initialize();
      
      if (format === 'svg') {
        // Exportar como SVG usando o exportManager
        return exportManager.exportSVG();
      } else if (format === 'png') {
        // Exportar como PNG usando o exportManager com a resolução especificada
        return await exportManager.exportPNG([], resolution);
      } else {
        throw new Error(`Formato não suportado: ${format}`);
      }
    } catch (error) {
      console.error('Erro na exportação:', error);
      return null;
    }
  }
}));

export default useLogoStore;
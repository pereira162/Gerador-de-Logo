// src/store/LogoStore.jsx
import { create } from 'zustand';
import colorManager from '../services/ColorManager';
import fontManager from '../services/FontManager';
import exportManager from '../services/ExportManager';
import svgManager from '../services/SVGManager';
import { getAllTemplates, loadTemplateContent } from '../utils/SVGTemplates';

const initialProjectState = {
  selectedLogoId: null,
  selectedElementId: null,
  svgContent: null, // Esta será a fonte da verdade para o SVG visual
  elements: new Map(), 
  textElements: [], 
  colorPalette: colorManager.colorSchemes['modern'] || Object.values(colorManager.getAllColorSchemes())[0], // Pega a primeira se 'modern' não existir
  transformations: new Map(),
  currentElementStyles: {}, // Para guardar estilos lidos do elemento selecionado
  // currentElementTransform já estava no Software_Architecture_Document.md, vamos usar 'transformations' Map
};

const useLogoStore = create((set, get) => ({
  currentScreen: 'selection',
  currentProject: { ...initialProjectState },
  history: { past: [], future: [] }, // P1

  setScreen: (screen) => set({ currentScreen: screen }),

  selectLogo: async (logoId) => {
    const template = getAllTemplates().find(t => t.id === logoId);
    if (!template) {
      console.error(`Template com id "${logoId}" não encontrado.`);
      return false;
    }
    try {
      const svgContent = await loadTemplateContent(logoId);
      if (!svgContent) throw new Error('Falha ao carregar SVG');
      
      const elementMap = await svgManager.parseSVGElements(svgContent);
      await fontManager.initialize(); // Garante que fontes P0 estejam prontas
      
      // Define uma paleta padrão se nenhuma estiver ativa (usando a nova estrutura do ColorManager)
      let activePalette = get().currentProject.colorPalette;
      if (!activePalette || Object.keys(activePalette).length === 0) {
        const schemes = colorManager.getAllColorSchemes(); // Objeto de esquemas
        const firstSchemeName = Object.keys(schemes)[0] || 'modern';
        colorManager.setActiveColorScheme(firstSchemeName);
        activePalette = colorManager.getActiveColorScheme().reduce((acc, color) => {
            acc[color.name.toLowerCase()] = color.hex; // primary, secondary, accent
            return acc;
        }, {});
      }

      set(state => ({
        currentScreen: 'editor',
        currentProject: {
          ...initialProjectState, // Reseta para o estado inicial do projeto
          selectedLogoId: logoId,
          svgContent, // Conteúdo SVG inicial do template
          elements: elementMap,
          colorPalette: activePalette, // Define a paleta
          transformations: new Map(), // Reseta transformações
          textElements: [], // Reseta textos
        }
      }));
      return true;
    } catch (error) {
      console.error('Erro ao carregar SVG do template:', error);
      return false;
    }
  },

  selectElement: (elementId) => {
    console.log('LogoStore: Selecting element', elementId);
    
    // First, let's ensure the element is highlighted in the SVG
    svgManager.highlightSelectedElement(elementId);
    
    if (elementId) {
      // Read the current styles and transformations from the SVG element
      const styles = svgManager.getElementStyle(elementId);
      const transforms = svgManager.getElementTransform(elementId);
      
      console.log('Element styles:', styles);
      console.log('Element transforms:', transforms);
      
      const { currentProject } = get();
      const updatedTransformations = new Map(currentProject.transformations);
      
      // Ensure we have valid transformation object
      const validTransforms = transforms || { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 };
      updatedTransformations.set(elementId, validTransforms);
      
      // Check if it's a text element
      const isTextElement = currentProject.textElements.some(el => el.id === elementId);
      
      set(state => ({
        currentProject: {
          ...state.currentProject,
          selectedElementId: elementId,
          currentElementStyles: styles || {},
          transformations: updatedTransformations,
        }
      }));
      
      // Force re-read of the element's visual state to ensure UI is up to date
      setTimeout(() => {
        const freshStyles = svgManager.getElementStyle(elementId);
        const freshTransforms = svgManager.getElementTransform(elementId);
        
        if (freshStyles || freshTransforms) {
          set(state => ({
            currentProject: {
              ...state.currentProject,
              currentElementStyles: freshStyles || state.currentProject.currentElementStyles,
              transformations: state.currentProject.transformations.set(
                elementId, 
                freshTransforms || state.currentProject.transformations.get(elementId)
              ),
            }
          }));
        }
      }, 10);
    } else {
      // When no element is selected
      set(state => ({
        currentProject: {
          ...state.currentProject,
          selectedElementId: null,
          currentElementStyles: {},
          // We keep transformations in the Map for future use
        }
      }));
    }
  },

  initElementTransform: (elementId) => {
    const { currentProject } = get();
    if (currentProject.transformations.has(elementId)) return;
    
    const existingTransform = svgManager.getElementTransform(elementId); // Tenta ler do SVG
    const defaultTransform = existingTransform || {
      translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0,
    };
    
    const updatedTransformations = new Map(currentProject.transformations);
    updatedTransformations.set(elementId, defaultTransform);
    set(state => ({
      currentProject: { ...state.currentProject, transformations: updatedTransformations }
    }));
  },

  updateElementTransform: (elementId, transformProps) => {
    const { currentProject } = get();
    let currentTransform = currentProject.transformations.get(elementId) || 
                           { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 };
    
    const newTransform = { ...currentTransform, ...transformProps };
    
    // Passa os valores absolutos para o SVGManager
    svgManager.applyTransformation(elementId, {
      x: newTransform.translateX,
      y: newTransform.translateY,
      scaleX: newTransform.scaleX,
      scaleY: newTransform.scaleY,
      rotation: newTransform.rotation,
    });
    
    const newSvgString = svgManager.getSVGContent();
    const updatedTransformations = new Map(currentProject.transformations);
    updatedTransformations.set(elementId, newTransform);
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        transformations: updatedTransformations,
        svgContent: newSvgString, // ATUALIZA O SVG CONTENT
      }
    }));
  },

  updateElement: (elementId, properties) => { // Usado para estilos como fill, stroke, etc.
    const { currentProject } = get();
    // const element = currentProject.elements.get(elementId); // 'elements' Map é mais para dados iniciais/metadata
    // if (!element) return false;

    // Aplica diretamente via SVGManager
    svgManager.applyStyle(elementId, properties); 
    
    const newSvgString = svgManager.getSVGContent();
    const newCurrentStyles = { ...(currentProject.currentElementStyles || {}), ...properties };

    set(state => ({
      currentProject: {
        ...state.currentProject,
        svgContent: newSvgString, // ATUALIZA O SVG CONTENT
        currentElementStyles: state.currentProject.selectedElementId === elementId 
                              ? newCurrentStyles 
                              : state.currentProject.currentElementStyles,
        // Atualiza o 'elements' Map também se ele for usado para renderizar a UI
        // elements: new Map(currentProject.elements).set(elementId, { ...element, ...properties }) 
      }
    }));
  },
  
  applyColorPalette: (paletteIdOrObject) => {
    let paletteColors;
    let paletteToStore = {};

    if (typeof paletteIdOrObject === 'string') {
        const schemeName = paletteIdOrObject;
        colorManager.setActiveColorScheme(schemeName); // Define o esquema ativo no ColorManager
        const activeSchemeArray = colorManager.getActiveColorScheme(); // Retorna array de {name, hex, rgb}
        
        paletteColors = activeSchemeArray.reduce((acc, color) => {
            acc[color.name.toLowerCase()] = color.hex;
            return acc;
        }, {});
        paletteToStore = { id: schemeName, name: schemeName, ...paletteColors };

    } else if (typeof paletteIdOrObject === 'object') {
        paletteColors = { // Assume que o objeto tem primary, secondary, accent
            primary: paletteIdOrObject.primary,
            secondary: paletteIdOrObject.secondary,
            accent: paletteIdOrObject.accent,
        };
        paletteToStore = paletteIdOrObject;
    } else {
        console.error("Invalid palette data provided to applyColorPalette");
        return false;
    }
    
    const { currentProject } = get();
    // O método applyColorsToSVG do ColorManager espera o svgManager e o mapeamento de cores
    // Para P0, vamos simplificar. Assumimos que os SVGs têm classes:
    // .primary-color-element, .secondary-color-element, .accent-color-element
    // E que svgManager pode aplicar estilos a elementos por classe
    
    // Esta é uma implementação simplificada. Uma melhor abordagem seria o ColorManager
    // não manipular o DOM diretamente, mas retornar os seletores e cores, e o SVGManager aplicar.
    // Ou o SVGManager ter um método applyPalette(paletteConfig).
    if (svgManager.svgElement) { // Verifica se o SVG está inicializado
        const primaryElements = svgManager.svgElement.querySelectorAll('.primary-color-element');
        const secondaryElements = svgManager.svgElement.querySelectorAll('.secondary-color-element');
        const accentElements = svgManager.svgElement.querySelectorAll('.accent-color-element');

        primaryElements.forEach(el => svgManager.applyStyle(el.id, { fill: paletteColors.primary }));
        secondaryElements.forEach(el => svgManager.applyStyle(el.id, { fill: paletteColors.secondary }));
        accentElements.forEach(el => svgManager.applyStyle(el.id, { fill: paletteColors.accent }));
    }
    
    // Atualizar cor dos textos existentes
    const updatedTextElements = currentProject.textElements.map(textEl => {
      const newTextColor = colorManager.getTextColorForBackground(paletteColors.primary || '#FFFFFF');
      svgManager.updateTextElement(textEl.id, { fill: newTextColor });
      return { ...textEl, fill: newTextColor };
    });

    const newSvgString = svgManager.getSVGContent();
    set(state => ({
      currentProject: {
        ...state.currentProject,
        colorPalette: paletteToStore,
        svgContent: newSvgString, // ATUALIZA O SVG CONTENT
        textElements: updatedTextElements,
        // elements: new Map(currentProject.elements) // Precisa atualizar o 'elements' Map também
      }
    }));
  },
  
  addTextElement: async (textProps) => {
    await fontManager.initialize(); // Garante que as fontes P0 estejam carregadas
    const defaultFont = fontManager.getAvailableFonts().length > 0 ? fontManager.getAvailableFonts()[0].family : 'Arial';
    
    const finalFontFamily = textProps.fontFamily || defaultFont;
    await fontManager.loadFont(finalFontFamily); // Carrega a fonte específica
    
    const { currentProject } = get();
    const finalFillColor = textProps.fill || colorManager.getTextColorForBackground(currentProject.colorPalette.primary || '#FFFFFF');
    
    const id = `text-${Date.now()}`;
    const textElementData = {
      id,
      type: textProps.type || 'companyName',
      content: textProps.content,
      fontFamily: finalFontFamily,
      fontSize: textProps.fontSize || 24,
      fontWeight: textProps.fontWeight || '400',
      fill: finalFillColor,
      position: textProps.position || { x: 200, y: 350 }, // P0 default
      alignment: textProps.alignment || 'middle', // P0 default
    };
    
    svgManager.addTextElement(textElementData);
    const newSvgString = svgManager.getSVGContent();
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        textElements: [...state.currentProject.textElements, textElementData],
        svgContent: newSvgString, // ATUALIZA O SVG CONTENT
      }
    }));
    return id;
  },
  
  updateTextElement: async (textId, properties) => {
    const { currentProject } = get();
    const textElement = currentProject.textElements.find(el => el.id === textId);
    if (!textElement) return false;

    if (properties.fontFamily) {
      await fontManager.loadFont(properties.fontFamily);
    }
    
    svgManager.updateTextElement(textId, properties);
    const newSvgString = svgManager.getSVGContent();
    
    set(state => ({
      currentProject: {
        ...state.currentProject,
        textElements: state.currentProject.textElements.map(el => 
          el.id === textId ? { ...el, ...properties } : el
        ),
        svgContent: newSvgString, // ATUALIZA O SVG CONTENT
      }
    }));
    return true;
  },

  deleteTextElement: (textId) => {
    svgManager.removeTextElement(textId);
    const newSvgString = svgManager.getSVGContent();
    set(state => ({
      currentProject: {
        ...state.currentProject,
        textElements: state.currentProject.textElements.filter(el => el.id !== textId),
        selectedElementId: state.currentProject.selectedElementId === textId ? null : state.currentProject.selectedElementId,
        svgContent: newSvgString, // ATUALIZA O SVG CONTENT
      }
    }));
  },

  exportLogo: async (format, resolution = 1, filename = 'logo') => { // Adicionado filename
    const { svgContent } = get().currentProject;
    if (!svgContent) {
      alert("Nenhum logo para exportar.");
      console.error("LogoStore: Nenhum svgContent para exportar.");
      return null;
    }
    
    try {
      if (format === 'svg') {
        return exportManager.exportSVG(svgContent, `${filename}.svg`);
      } else if (format === 'png') {
        return await exportManager.exportPNG(svgContent, `${filename}.png`, resolution);
      } else {
        throw new Error(`Formato de exportação não suportado: ${format}`);
      }
    } catch (error) {
      console.error('LogoStore: Erro na exportação:', error);
      alert(`Erro ao exportar como ${format.toUpperCase()}. Verifique o console.`);
      return null;
    }
  }
}));

export default useLogoStore;
# Platform Technical Architecture and Implementation Specifications

## Geometric Logo Creation Platform for Engineering and Sustainability Sectors

*Data da Criação: 20 de Maio de 2025*
*Versão: 1.0 (Anteriormente "Platform_Functional_Technical_Specifications.md", revisado para foco técnico e arquitetural)*

---

## Índice

1.  [Introdução](#1-introdução)
    1.1. [Propósito e Escopo deste Documento](#11-propósito-e-escopo-deste-documento)
    1.2. [Referências a Documentos Complementares](#12-referências-a-documentos-complementares)
2.  [Visão Geral da Arquitetura da Aplicação](#2-visão-geral-da-arquitetura-da-aplicação)
    2.1. [Princípio Fundamental: Arquitetura "Self-Contained" no Cliente](#21-princípio-fundamental-arquitetura-self-contained-no-cliente)
    2.2. [Componentes Lógicos Principais (Alto Nível)](#22-componentes-lógicos-principais-alto-nível)
3.  [Especificações Técnicas Detalhadas dos Ícones Geométricos Base](#3-especificações-técnicas-detalhadas-dos-ícones-geométricos-base)
    *(Conceitos de design e simbolismo no `Consolidated_Geometric_Logo_Design_Guide.md`)*
    3.1. [Formato e Estrutura SVG Padrão](#31-formato-e-estrutura-svg-padrão)
    3.2. [Identificação e Agrupamento de Elementos SVG para Edição](#32-identificação-e-agrupamento-de-elementos-svg-para-edição)
    3.3. [Lista de Parâmetros SVG Editáveis por Ícone (a ser detalhada pela equipe de desenvolvimento)](#33-lista-de-parâmetros-svg-editáveis-por-ícone-a-ser-detalhada-pela-equipe-de-desenvolvimento)
4.  [Detalhamento Técnico das Funcionalidades da Plataforma](#4-detalhamento-técnico-das-funcionalidades-da-plataforma)
    *(Requisitos funcionais do usuário e UI/UX no `geometric_logo_platform_PRD.md`)*
    4.1. [Módulo de Seleção de Ícones: Carregamento e Instanciação de SVG](#41-módulo-de-seleção-de-ícones-carregamento-e-instanciação-de-svg)
    4.2. [Motor de Edição Geométrica (Client-Side)](#42-motor-de-edição-geométrica-client-side)
        4.2.1. [Seleção e Manipulação de Elementos SVG via JavaScript](#421-seleção-e-manipulação-de-elementos-svg-via-javascript)
        4.2.2. [Aplicação de Transformações (Translate, Scale, Rotate)](#422-aplicação-de-transformações-translate-scale-rotate)
        4.2.3. [Modificação de Atributos de Estilo (Fill, Stroke, Opacity)](#423-modificação-de-atributos-de-estilo-fill-stroke-opacity)
    4.3. [Sistema de Cores (Implementação Técnica)](#43-sistema-de-cores-implementação-técnica)
    4.4. [Motor de Tipografia (Client-Side)](#44-motor-de-tipografia-client-side)
        4.4.1. [Gerenciamento e Renderização de Fontes Bundled/Web](#441-gerenciamento-e-renderização-de-fontes-bundledweb)
        4.4.2. [Criação e Posicionamento de Elementos `<text>` SVG](#442-criação-e-posicionamento-de-elementos-text-svg)
    4.5. [Lógica de Geração de Variantes (Client-Side)](#45-lógica-de-geração-de-variantes-client-side)
    4.6. [Mecanismo de Exportação (SVG e Conversão para PNG no Cliente)](#46-mecanismo-de-exportação-svg-e-conversão-para-png-no-cliente)
5.  [Arquitetura de Frontend (React)](#5-arquitetura-de-frontend-react)
    5.1. [Estrutura de Componentes Proposta](#51-estrutura-de-componentes-proposta)
    5.2. [Gerenciamento de Estado (Client-Side)](#52-gerenciamento-de-estado-client-side)
    5.3. [Fluxo de Dados entre Componentes](#53-fluxo-de-dados-entre-componentes)
6.  [Stack Tecnológico e Bibliotecas](#6-stack-tecnológico-e-bibliotecas)
    6.1. [Linguagens e Frameworks Base](#61-linguagens-e-frameworks-base)
    6.2. [Bibliotecas JavaScript para Manipulação de SVG e Outras Tarefas (Sugestões)](#62-bibliotecas-javascript-para-manipulação-de-svg-e-outras-tarefas-sugestões)
7.  [Requisitos Não Funcionais Técnicos](#7-requisitos-não-funcionais-técnicos)
    7.1. [Performance e Otimização no Cliente](#71-performance-e-otimização-no-cliente)
    7.2. [Segurança (Considerações para Aplicação Client-Side)](#72-segurança-considerações-para-aplicação-client-side)
    7.3. [Manutenibilidade e Escalabilidade do Código Frontend](#73-manutenibilidade-e-escalabilidade-do-código-frontend)
8.  [Questões Técnicas Abertas e Desafios de Implementação](#8-questões-técnicas-abertas-e-desafios-de-implementação)

---

## 1. Introdução

### 1.1. Propósito e Escopo deste Documento
Este documento foca na **arquitetura técnica e nas especificações de implementação** da Plataforma de Criação de Logos Geométricos. Ele se baseia nos requisitos de produto e especificações de UI/UX definidos no `geometric_logo_platform_PRD.md` e nas diretrizes de design do `Consolidated_Geometric_Logo_Design_Guide.md`.

O objetivo principal é detalhar *como* a plataforma será construída tecnicamente, com ênfase na arquitetura "self-contained" no lado do cliente, nas tecnologias a serem utilizadas e na lógica de implementação das funcionalidades core.

### 1.2. Referências a Documentos Complementares
*   **`geometric_logo_platform_PRD.md`**: Contém a visão do produto, metas, user stories, análise de mercado, requisitos funcionais detalhados (P0/P1/P2) e as especificações de UI/UX com wireframes.
*   **`Consolidated_Geometric_Logo_Design_Guide.md`**: Contém os princípios de design, estilos, simbolismo, cores e a descrição conceitual dos 10 ícones geométricos base.

---

## 2. Visão Geral da Arquitetura da Aplicação

### 2.1. Princípio Fundamental: Arquitetura "Self-Contained" no Cliente
Conforme definido no `geometric_logo_platform_PRD.md` (Seção "Technical Specifications > Core Implementation Requirements"), a plataforma deve operar inteiramente no navegador do usuário, sem dependência de serviços de backend para suas funcionalidades principais de criação, edição e exportação de logos. Todas as operações devem ser realizadas no lado do cliente.

### 2.2. Componentes Lógicos Principais (Alto Nível)
A aplicação pode ser dividida logicamente nos seguintes componentes principais (a serem detalhados na arquitetura React):
1.  **Módulo de Interface do Usuário (UI Layer):** Responsável pela apresentação e interação com o usuário (baseado nos wireframes do PRD).
2.  **Motor de Edição SVG (Core Logic Layer):** Lógica para carregar, manipular, estilizar e transformar os SVGs dos logos.
3.  **Motor de Tipografia (Core Logic Layer):** Lógica para adicionar, posicionar e estilizar texto SVG.
4.  **Motor de Geração de Variantes (Core Logic Layer):** Lógica para criar as diferentes versões do logo.
5.  **Módulo de Exportação (Utility Layer):** Lógica para gerar arquivos SVG e converter para PNG no cliente.
6.  **Gerenciador de Estado (State Management Layer):** Mantém o estado atual do logo em edição, histórico de ações, etc.

---

## 3. Especificações Técnicas Detalhadas dos Ícones Geométricos Base
*(Os conceitos de design, simbolismo e relevância setorial de cada ícone estão detalhados no `Consolidated_Geometric_Logo_Design_Guide.md`, Seção 6)*

### 3.1. Formato e Estrutura SVG Padrão
*   Cada um dos 10 ícones base será fornecido como um arquivo SVG individual.
*   **Estrutura:** Código SVG limpo, bem formado, usando elementos vetoriais padrão (`<path>`, `<circle>`, `<rect>`, `<line>`, `<polygon>`, `<polyline>`). Evitar `<image>`, `<foreignObject>`, scripts ou filtros SVG complexos.
*   **ViewBox e Proporções:** `viewBox` definido para garantir escalabilidade. `preserveAspectRatio="xMidYMid meet"` será usado como padrão.
*   **Estilos Iniciais:** Cores de preenchimento e contorno base podem ser definidas, mas devem ser facilmente sobrescritas pela plataforma via atributos SVG ou CSS.
*   **Otimização:** Os SVGs devem ser otimizados (ex: usando SVGO) para reduzir o tamanho do arquivo sem perder a editabilidade ou precisão.

### 3.2. Identificação e Agrupamento de Elementos SVG para Edição
*   **IDs e Classes:** Elementos SVG que são passíveis de customização individual (cor, transformação) ou que fazem parte de um grupo lógico devem ter `id`s únicos ou `class`es descritivas.
    *   Exemplo de IDs: `icon-circle-main`, `icon-rect-corner-element`.
    *   Exemplo de Classes: `editable-fill`, `editable-stroke`, `transform-group`.
*   **Grupos (`<g>`):** Elementos que devem ser transformados ou estilizados em conjunto devem ser agrupados. Grupos também podem ter IDs/classes para seleção.
*   **Ordem de Camadas (Z-index):** A ordem dos elementos no SVG definirá a sua sobreposição visual. O módulo de edição poderá oferecer funcionalidades básicas de reordenamento (P1).

### 3.3. Lista de Parâmetros SVG Editáveis por Ícone (a ser detalhada pela equipe de desenvolvimento)
Para cada um dos 10 ícones, a equipe de desenvolvimento, em conjunto com o designer (se houver), deverá mapear os "Parâmetros de Customização Sugeridos" do `Consolidated_Geometric_Logo_Design_Guide.md` para atributos SVG específicos e identificadores (IDs/classes) que a plataforma manipulará.

**Exemplo para o "Círculo Perfeito":**
*   **Elemento SVG:** `<circle id="main-circle" class="editable-fill editable-stroke" ... />`
*   **Parâmetros Manipuláveis pela Plataforma:**
    *   `fill` (do `#main-circle`)
    *   `stroke` (do `#main-circle`)
    *   `stroke-width` (do `#main-circle`)
    *   (Se houver elementos internos, como um ponto central `<circle id="center-dot">`, seus atributos `cx`, `cy`, `r`, `fill` também.)
    *   Para "grau de completude", a plataforma pode precisar converter o `<circle>` para um `<path>` com comandos de arco, ou usar `stroke-dasharray`.

*Esta análise e mapeamento detalhado para todos os 10 ícones são cruciais para o Motor de Edição SVG.*

---

## 4. Detalhamento Técnico das Funcionalidades da Plataforma
*(Os requisitos funcionais do usuário (P0/P1/P2) e o design da UI/UX estão definidos no `geometric_logo_platform_PRD.md`. Esta seção foca nos aspectos técnicos de implementação dessas funcionalidades.)*

### 4.1. Módulo de Seleção de Ícones: Carregamento e Instanciação de SVG
*   Os 10 SVGs base serão armazenados como arquivos estáticos na aplicação.
*   Ao selecionar um ícone, seu conteúdo SVG será carregado (ex: via `fetch` para um arquivo local ou importado diretamente como componente React se for simples) e injetado/renderizado no Canvas de Edição SVG.
*   Uma cópia do SVG original (ou sua representação em estado) será mantida para permitir resets ou iniciar novas customizações.

### 4.2. Motor de Edição Geométrica (Client-Side)

#### 4.2.1. Seleção e Manipulação de Elementos SVG via JavaScript
*   Lógica para identificar cliques do mouse/toques no Canvas e mapeá-los para elementos SVG específicos (usando IDs/classes).
*   Ao selecionar um elemento, exibir alças de transformação (geradas dinamicamente ou parte de um overlay SVG).
*   Manipular o DOM SVG diretamente ou através de uma biblioteca de abstração para aplicar transformações e mudanças de estilo.

#### 4.2.2. Aplicação de Transformações (Translate, Scale, Rotate)
*   Modificar o atributo `transform` dos elementos SVG selecionados ou de seus grupos.
*   Implementar lógica para redimensionamento proporcional e não proporcional.
*   Cálculo de centro de rotação.

#### 4.2.3. Modificação de Atributos de Estilo (Fill, Stroke, Opacity)
*   Alterar diretamente os atributos SVG `fill`, `stroke`, `stroke-width`, `stroke-opacity`, `fill-opacity`.
*   Implementar seletores de cor (componente React) que retornem valores HEX/RGB.
*   Para paletas globais, a lógica iterará sobre elementos com classes específicas (ex: `primary-color-element`) e aplicará as cores da paleta.

### 4.3. Sistema de Cores (Implementação Técnica)
*   As paletas sugeridas (do Guia de Design) serão armazenadas como arrays de strings de cores (HEX).
*   O seletor de cor customizado permitirá entrada de HEX, RGB e (P1) HSL, com conversão interna para o formato necessário pelo SVG.
*   (P2) Cores recentes/salvas podem usar `localStorage`.

### 4.4. Motor de Tipografia (Client-Side)

#### 4.4.1. Gerenciamento e Renderização de Fontes Bundled/Web
*   As fontes selecionadas (Open Source/licenciadas) serão incluídas nos ativos da aplicação e carregadas via CSS (`@font-face`).
*   Garantir que as fontes estejam carregadas antes de calcular o tamanho do texto ou renderizar para exportação.

#### 4.4.2. Criação e Posicionamento de Elementos `<text>` SVG
*   Adicionar dinamicamente elementos `<text>` (ou `<tspan>` para múltiplas linhas/estilos - P2) ao SVG principal.
*   Manipular atributos SVG como `x`, `y`, `font-family`, `font-size`, `font-weight`, `fill`, `text-anchor`, `letter-spacing`, `word-spacing`.
*   Lógica para posicionamento relativo ao ícone (cálculo de bounding boxes do ícone e do texto).

### 4.5. Lógica de Geração de Variantes (Client-Side)
*   Para cada variante (P1):
    *   Duplicar o SVG do logo principal editado.
    *   **Símbolo:** Remover elementos de texto.
    *   **Wordmark:** Remover elementos do ícone.
    *   **Layout Horizontal/Vertical:** Reposicionar programaticamente o grupo do ícone e o(s) grupo(s) de texto. Ajustar `text-anchor` e coordenadas `x, y`.
    *   **Monocromático:** Iterar sobre todos os elementos com `fill` e `stroke` e aplicar uma única cor (preto ou branco), ajustando opacidades se necessário para manter a forma.

### 4.6. Mecanismo de Exportação (SVG e Conversão para PNG no Cliente)
*   **Exportação SVG:**
    *   Serializar o estado atual do DOM SVG do logo (ou da variante selecionada) para uma string.
    *   Remover quaisquer elementos/atributos específicos da interface de edição (ex: alças de seleção).
    *   Criar um `Blob` com `type="image/svg+xml"` e usar um link `<a>` com atributo `download` para iniciar o download.
*   **Conversão SVG para PNG (Client-Side):**
    1.  Criar um elemento `<canvas>` fora da tela.
    2.  Desenhar o SVG no `<canvas>`. Isso pode ser feito:
        *   Convertendo o SVG para um Data URL e usando-o como `src` de um `Image` object, que é então desenhado no canvas.
        *   Usando uma biblioteca JS que renderiza SVG em canvas (ex: `canvg` ou funcionalidades de bibliotecas como `Fabric.js` se esta for usada para manipulação geral de SVG).
    3.  Obter o conteúdo do canvas como um Data URL PNG usando `canvas.toDataURL('image/png')`.
    4.  Criar um `Blob` a partir do Data URL e iniciar o download via link `<a>`.
    5.  (P1) Para opções de resolução, o canvas pode ser dimensionado antes de desenhar o SVG (ex: para 2x DPI, dobrar as dimensões do canvas e do SVG desenhado nele).

---

## 5. Arquitetura de Frontend (React)
*(Esta é uma proposta inicial de arquitetura de componentes, a ser detalhada no Documento de Arquitetura de Software.)*

### 5.1. Estrutura de Componentes Proposta (Alto Nível)
```
App
├── Header
├── LogoSelectionScreen
│   ├── IconFilterControls (P1)
│   └── IconGrid
│       └── IconDisplayCard (x10)
├── MainEditorScreen
│   ├── ToolbarPanel
│   │   └── ToolButton (Select, Move, Color, Text, etc.)
│   ├── EditingCanvas
│   │   └── SVGWorkspace (renderiza e manipula o SVG interativo)
│   ├── PropertiesPanel (contextual)
│   │   ├── ColorEditorPanel (pode ser modal/sub-componente)
│   │   │   ├── ColorPickerComponent
│   │   │   └── PaletteSelectorComponent
│   │   ├── TransformControls
│   │   └── StrokeFillControls
│   ├── PreviewPanel
│   │   ├── LivePreviewDisplay
│   │   └── MockupPreview (P1)
│   └── EditorNavigationControls (Back, Next)
├── TypographyScreen (ou integrado ao MainEditorScreen)
│   ├── FontSelectionPanel
│   ├── TextPropertiesPanel
│   └── TypographyLayoutControls
├── VariantsAndExportScreen
│   ├── VariantPreviewGrid
│   │   └── VariantDisplayCard (xN)
│   └── ExportOptionsPanel
└── FooterActions
```

### 5.2. Gerenciamento de Estado (Client-Side)
*   **Estado Principal da Aplicação:**
    *   Ícone base selecionado.
    *   Estrutura de dados representando o logo em edição (lista de elementos SVG, suas propriedades, transformações). Isso pode ser uma representação JS do DOM SVG ou o próprio DOM SVG se a manipulação for direta.
    *   Conteúdo e propriedades do texto (nome da empresa, tagline).
    *   Histórico de ações para Undo/Redo (P1) – uma pilha de estados anteriores do logo.
    *   Configurações da interface (ex: ferramenta ativa, zoom).
*   **Opções de Gerenciamento de Estado:**
    *   **React Context API + `useReducer`:** Para estados mais complexos e compartilhados.
    *   **Zustand/Jotai/Valtio:** Bibliotecas leves para gerenciamento de estado global ou atômico.
    *   **Redux (Toolkit):** Para aplicações maiores, mas pode ser excessivo para um MVP "self-contained" se a complexidade do estado não justificar.
    *   A escolha dependerá da complexidade final percebida.

### 5.3. Fluxo de Dados entre Componentes
*   Interações do usuário nos painéis de ferramentas/propriedades disparam atualizações no estado central do logo.
*   O componente `SVGWorkspace` (ou similar) lê o estado do logo e renderiza/atualiza o SVG.
*   O `PreviewPanel` também lê o estado do logo para renderizar o preview.
*   O estado é passado via props ou consumido de um contexto/store global.

---

## 6. Stack Tecnológico e Bibliotecas

### 6.1. Linguagens e Frameworks Base
*   **JavaScript (ES6+):** Linguagem principal.
*   **React:** Framework para construção da UI.
*   **HTML5, CSS3.**
*   **Tailwind CSS:** Para estilização utilitária.

### 6.2. Bibliotecas JavaScript para Manipulação de SVG e Outras Tarefas (Sugestões)
*   **Manipulação de SVG:**
    *   **Opção 1 (Mais Controle/Leve):** Manipulação direta do DOM SVG com helpers JS customizados.
    *   **Opção 2 (Abstração):**
        *   `SVG.js`: Biblioteca leve e fluente para manipulação de SVG.
        *   `Snap.svg`: Outra biblioteca popular para SVG, da Adobe.
        *   *Nota:* A escolha deve priorizar bibliotecas "self-contained", com licenças permissivas e bom suporte da comunidade. Evitar bibliotecas que exijam APIs externas pagas.
*   **Conversão SVG para PNG:**
    *   `saveSvgAsPng` (ou sua lógica adaptada): Biblioteca focada nesta tarefa.
    *   Manipulação direta com `<canvas>` e `toDataURL()`.
*   **Empacotamento .zip (P1):**
    *   `JSZip`: Para criar arquivos .zip no cliente.
*   **Testes:**
    *   Jest, React Testing Library.
*   **Build:**
    *   Vite (rápido e moderno) ou Create React App (se Webpack for preferido).

---

## 7. Requisitos Não Funcionais Técnicos

### 7.1. Performance e Otimização no Cliente
*   SVG DOM deve ser atualizado eficientemente. Evitar repinturas/reflows desnecessários.
*   Debounce/throttle para inputs que disparam muitas atualizações (ex: sliders).
*   Otimizar SVGs base para complexidade mínima necessária.
*   Testar performance com o ícone mais complexo e múltiplas edições.

### 7.2. Segurança (Considerações para Aplicação Client-Side)
*   **Sanitização de Inputs (se houver):** Embora não haja backend, se o SVG for construído dinamicamente com inputs do usuário (ex: texto), garantir que não haja injeção de scripts maliciosos no SVG.
*   **Exportação Segura:** Gerar arquivos para download de forma segura.
*   **Licenças de Ativos:** Garantir que todas as fontes e bibliotecas JS tenham licenças compatíveis com o uso gratuito e "self-contained".

### 7.3. Manutenibilidade e Escalabilidade do Código Frontend
*   Componentização clara em React.
*   Estado bem gerenciado.
*   Código modular e comentado.
*   Testes unitários e de integração para lógica core.

---

## 8. Questões Técnicas Abertas e Desafios de Implementação
*(Estas são as "Open Questions" do `geometric_logo_platform_PRD.md` com foco técnico, a serem resolvidas pela equipe de arquitetura)*

1.  **Performance com SVGs Complexos:** Qual é o limite prático de complexidade de SVG (número de nós, grupos) que pode ser manipulado fluidamente no cliente com a abordagem escolhida?
2.  **Fidelidade da Conversão SVG para PNG:** Como garantir a máxima fidelidade na conversão, especialmente com fontes, efeitos SVG (se houver P2) e transparência?
3.  **Gerenciamento de Fontes para Exportação PNG:** Como garantir que as fontes web sejam corretamente renderizadas no `<canvas>` antes da exportação para PNG?
4.  **Undo/Redo Robusto:** Qual a melhor estratégia para implementar um histórico de undo/redo eficiente para manipulações complexas de SVG (ex: diffing de estado, command pattern)?
5.  **Abstração vs. Manipulação Direta de SVG:** Avaliar o trade-off entre usar uma biblioteca de abstração SVG (que pode adicionar overhead) versus a complexidade da manipulação direta do DOM SVG.
6.  **Testes Automatizados para Manipulação Gráfica:** Estratégias para testes automatizados de funcionalidades que envolvem manipulação visual e de vetores.

---

*© 2025 MetaGPTX (MGX). Todos os direitos reservados.*
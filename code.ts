// This shows the HTML page in "ui.html".
figma.showUI(
  __html__,
  { width: 280, height: 360, title: "Corner rounder" }
)

let radiusVariables = [];

initialize();

async function initialize() {
// Query all published collections from libraries enabled for this file
//const libraryCollections =
//    await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
// Select a library variable collection to import into this file
const variablesInLibrary =
    await figma.teamLibrary.getVariablesInLibraryCollectionAsync("8aece5ab1df9f5cd89bc7b2857548bacee5a5826");
// Import the variables
const variablesToImport = [
  variablesInLibrary.find((libVar) => libVar.name === 'radius/4xs'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/3xs'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/2xs'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/xs'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/sm'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/md'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/lg'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/xl'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/2xl'),
  variablesInLibrary.find((libVar) => libVar.name === 'radius/3xl')
];

radiusVariables['2'] = await figma.variables.importVariableByKeyAsync(variablesToImport[0].key);
radiusVariables['4'] = await figma.variables.importVariableByKeyAsync(variablesToImport[1].key);
radiusVariables['6'] = await figma.variables.importVariableByKeyAsync(variablesToImport[2].key);
radiusVariables['8'] = await figma.variables.importVariableByKeyAsync(variablesToImport[3].key);
radiusVariables['12'] = await figma.variables.importVariableByKeyAsync(variablesToImport[4].key);
radiusVariables['16'] = await figma.variables.importVariableByKeyAsync(variablesToImport[5].key);
radiusVariables['20'] = await figma.variables.importVariableByKeyAsync(variablesToImport[6].key);
radiusVariables['24'] = await figma.variables.importVariableByKeyAsync(variablesToImport[7].key);
radiusVariables['32'] = await figma.variables.importVariableByKeyAsync(variablesToImport[8].key);
radiusVariables['40'] = await figma.variables.importVariableByKeyAsync(variablesToImport[9].key);

}

figma.ui.onmessage =  (msg: {type: string, style: string, corners: boolean[], variable: boolean, nested: boolean, children: boolean, override: boolean}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'round-border') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0)
      figma.notify("Please select some objects");
    for (const node of selection) {
      setRadius(node, msg, false);
    }
  }
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// Function to set corner radius
function setRadius(node: BaseNode, msg: {type: string, style: string, corners: boolean[], variable: boolean, nested: boolean, children: boolean, override: boolean}, isChild: boolean): void {
  if (isCornerType(node)) {
    const overrideCondition = msg.override || (msg.override === isPartOfInstance(node));
    const childCondition = !isChild || (isChild && (("fills" in node && Array.isArray(node.fills) && node.fills.length > 0) || ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length > 0)));
    if (overrideCondition && childCondition) {
      const width = node.width;
      const height = node.height;
      let newRadius = 0;
      if (msg.style === 'user') {
          switch (true) {
            case (Math.min(width, height) <= 6) :
              newRadius = 0;
              break;
            case (Math.min(width, height) <= 8) :
              newRadius = 2;
              break;
            case (Math.min(width, height) <= 16) :
              newRadius = 4;
              break;
            case (Math.min(width, height) <= 24) :
              newRadius = 6;
              break;
            case (Math.min(width, height) <= 40) :
              newRadius = 8;
              break;
            case (Math.min(width, height) <= 64) :
              newRadius = 12;
              break;
            case (Math.min(width, height) <= 96) :
              newRadius = 16;
              break;
            case (Math.min(width, height) <= 192) :
              newRadius = 20;
              break;
            case (Math.min(width, height) <= 320) :
              newRadius = 24;
              break;
            default:
                newRadius = 32;
                break;
            }
      }
      else if (msg.style === 'admin') {
        switch (true) {
          case (Math.min(width, height) <= 6) :
            newRadius = 0;
            break;
          case (Math.min(width, height) <= 8) :
            newRadius = 2;
            break;
          case (Math.min(width, height) <= 16) :
            newRadius = 4;
            break;
          case (Math.min(width, height) <= 24) :
            newRadius = 6;
            break;
          case (Math.min(width, height) <= 40) :
            newRadius = 8;
            break;
          case (Math.min(width, height) <= 128) :
            newRadius = 12;
            break;
          case (Math.min(width, height) <= 320) :
            newRadius = 16;
            break;
          default:
              newRadius = 20;
              break;
        }
      }
      if (msg.style === 'user' && msg.nested && node.parent) {
        let parentNode = node.parent;
        while (parentNode.parent && isLayerType(parentNode)){
          parentNode = parentNode.parent;
        }
        if (isOutterType(parentNode)) {
          let padding = parentNode.paddingTop;
          newRadius = 0;
          switch (true) {
            case (Math.min(width, height) <= 6) :
              newRadius = 0;
              break;
            case (Math.min(width, height) <= 8) :
              newRadius = 0;
              break;
            case (Math.min(width, height) <= 16) :
              if (padding >= 2) newRadius = 2; 
              break;
            case (Math.min(width, height) <= 24) :
              if (padding >= 4) newRadius = 2; else if (padding === 2) newRadius = 4;
              break;
            case (Math.min(width, height) <= 40) :
              if (padding >= 6) newRadius = 4; else if (padding === 4) newRadius = 6; else if (padding === 2) newRadius = 6;
              break;
            case (Math.min(width, height) <= 64) :
              if (padding >= 8) newRadius = 8; else if (padding === 6) newRadius = 8; else if (padding === 4) newRadius = 12; else if (padding === 2) newRadius = 12;
              break;
            case (Math.min(width, height) <= 96) :
              if (padding >= 12) newRadius = 12; else if (padding === 8) newRadius = 12; else if (padding === 6) newRadius = 12; else if (padding === 4) newRadius = 16; else if (padding === 2) newRadius = 16;
              break;
            case (Math.min(width, height) <= 192) :
              if (padding >= 16) newRadius = 12; else if (padding >= 12) newRadius = 12; else if (padding === 8) newRadius = 16; else if (padding === 6) newRadius = 16; else if (padding === 4) newRadius = 20; else if (padding === 2) newRadius = 20;
              break;
            case (Math.min(width, height) <= 320) :
              if (padding >= 20) newRadius = 12; else if (padding >= 16) newRadius = 16; else if (padding >= 12) newRadius = 16; else if (padding === 8) newRadius = 20; else if (padding === 6) newRadius = 20; else if (padding === 4) newRadius = 24; else if (padding === 2) newRadius = 24;
              break;
            default:
              if (padding >= 24) newRadius = 16; else if (padding >= 20) newRadius = 16; else if (padding >= 16) newRadius = 20; else if (padding === 16) newRadius = 20; else if (padding === 12) newRadius = 24; else if (padding === 8) newRadius = 24; else if (padding === 6) newRadius = 32; else if (padding === 4) newRadius = 32; else if (padding === 2) newRadius = 32;
                break;
          }
        }
      }
      else if (msg.style === 'admin' && msg.nested && node.parent) {
        let parentNode = node.parent;
        while (parentNode.parent && isLayerType(parentNode)){
          parentNode = parentNode.parent;
        }
        if (isOutterType(parentNode)) {
          let padding = parentNode.paddingTop;
          newRadius = 0;
          switch (true) {
            case (Math.min(width, height) <= 6) :
              newRadius = 0;
              break;
            case (Math.min(width, height) <= 8) :
              newRadius = 0;
              break;
            case (Math.min(width, height) <= 16) :
              if (padding >= 2) newRadius = 2; 
              break;
            case (Math.min(width, height) <= 24) :
              if (padding >= 4) newRadius = 2; else if (padding === 2) newRadius = 4;
              break;
            case (Math.min(width, height) <= 40) :
              if (padding >= 6) newRadius = 4; else if (padding === 4) newRadius = 6; else if (padding === 2) newRadius = 6;
              break;
            case (Math.min(width, height) <= 128) :
              if (padding >= 8) newRadius = 8; else if (padding === 6) newRadius = 8; else if (padding === 4) newRadius = 12; else if (padding === 2) newRadius = 12;
              break;
            case (Math.min(width, height) <= 320) :
              if (padding >= 12) newRadius = 12; else if (padding === 8) newRadius = 12; else if (padding === 6) newRadius = 12; else if (padding === 4) newRadius = 16; else if (padding === 2) newRadius = 16;
              break;
            default:
                if (padding >= 16) newRadius = 12; else if (padding === 16) newRadius = 12; else if (padding === 12) newRadius = 12; else if (padding === 8) newRadius = 16; else if (padding === 6) newRadius = 16; else if (padding === 4) newRadius = 20; else if (padding === 2) newRadius = 20;
                break;
          }
        }
      }

      if(msg.corners[0]) applyRadius(node, 0, newRadius, msg.variable);
      if(msg.corners[1]) applyRadius(node, 1, newRadius, msg.variable);
      if(msg.corners[2]) applyRadius(node, 2, newRadius, msg.variable);
      if(msg.corners[3]) applyRadius(node, 3, newRadius, msg.variable);
      //figma.viewport.scrollAndZoomIntoView(selection);
    }
  }

// Check if the node has children and recursively apply corner radius
  if (msg.children && isContainerType(node) && "children" in node) {
    for (const child of node.children) {
      setRadius(child, msg, true);
    }
  }
  return;
}

function applyRadius(node: BaseNode, corner: number, radius: number, asVar: boolean): void {
  if ( asVar ) {
    switch (corner) {
      case 0 :
        node.setBoundVariable("topLeftRadius", radiusVariables[radius.toString()]);
        break;
      case 1 :
        node.setBoundVariable("topRightRadius", radiusVariables[radius.toString()]);
        break;
      case 2 :
        node.setBoundVariable("bottomLeftRadius", radiusVariables[radius.toString()]);
        break;
      case 3 :
        node.setBoundVariable("bottomRightRadius", radiusVariables[radius.toString()]);
        break;
    }
  } else {
    switch (corner) {
      case 0 :
        node.topLeftRadius = radius;
        break;
      case 1 :
        node.topRightRadius = radius;
        break;
      case 2 :
        node.bottomLeftRadius = radius;
        break;
      case 3 :
        node.bottomRightRadius = radius;
        break;
    }
  }
  return;
}

function isContainerType(node: BaseNode): boolean {
  if (node.type === 'GROUP' || node.type === 'SECTION' || node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE')
    return true;
  else
    return false;
}
function isCornerType(node: BaseNode): boolean {
  if ('cornerRadius' in node && 'width' in node && 'height' in node && (node.type === 'RECTANGLE' || node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE'))
    return true;
  else
    return false;
}
function isLayerType(node: BaseNode): boolean {
  if (node.type === 'GROUP' || ((node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') && node.layoutMode !== 'NONE' && (node.paddingTop === 0 && node.paddingBottom === 0 && node.paddingLeft === 0 && node.paddingRight === 0)) )
    return true;
  else
    return false;
}
function isOutterType(node: BaseNode): boolean {
  if ((node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') && node.layoutMode !== 'NONE' && node.paddingTop > 0 && node.paddingTop <= 64 && node.paddingTop === node.paddingBottom && node.paddingTop === node.paddingLeft && node.paddingTop === node.paddingRight)
    return true;
  else
    return false;
}

// Function to check if a node is part of an instance
function isPartOfInstance(node: BaseNode): boolean {
  let currentNode: BaseNode | null = node;

  // Traverse up the node tree
  while (currentNode) {
    if (currentNode.type === 'INSTANCE') {
      return true; // The node is part of an instance
    }
    currentNode = currentNode.parent;
  }

  return false; // The node is not part of an instance
}
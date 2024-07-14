// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(
  __html__,
  { width: 300, height: 320, title: "Corner rounder" }
)

figma.ui.onmessage =  (msg: {type: string, style: string}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'round-border') {
    const selection = figma.currentPage.selection;
    for (const node of selection) {
      if ('cornerRadius' in node) {
        const width = node.width;
        const height = node.height;
    if (msg.style === 'user') {
        switch (true) {
          case (Math.min(width, height) <= 6) :
            node.cornerRadius = 0;
            break;
          case (Math.min(width, height) <= 8) :
            node.cornerRadius = 2;
            break;
          case (Math.min(width, height) <= 16) :
            node.cornerRadius = 4;
            break;
          case (Math.min(width, height) <= 24) :
            node.cornerRadius = 6;
            break;
          case (Math.min(width, height) <= 40) :
            node.cornerRadius = 8;
            break;
          case (Math.min(width, height) <= 64) :
            node.cornerRadius = 12;
            break;
          case (Math.min(width, height) <= 96) :
            node.cornerRadius = 16;
            break;
          case (Math.min(width, height) <= 192) :
            node.cornerRadius = 20;
            break;
          case (Math.min(width, height) <= 320) :
            node.cornerRadius = 24;
            break;
          default:
              node.cornerRadius = 32;
              break;
          }
        } else if (msg.style === 'admin')
          {
            switch (true) {
              case (Math.min(width, height) <= 6) :
                node.cornerRadius = 0;
                break;
              case (Math.min(width, height) <= 8) :
                node.cornerRadius = 2;
                break;
              case (Math.min(width, height) <= 16) :
                node.cornerRadius = 4;
                break;
              case (Math.min(width, height) <= 24) :
                node.cornerRadius = 6;
                break;
              case (Math.min(width, height) <= 40) :
                node.cornerRadius = 8;
                break;
              case (Math.min(width, height) <= 128) :
                node.cornerRadius = 12;
                break;
              case (Math.min(width, height) <= 320) :
                node.cornerRadius = 16;
                break;
              default:
                  node.cornerRadius = 20;
                  break;
              }
          }
      }
    }
  
    figma.viewport.scrollAndZoomIntoView(selection);
  }
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

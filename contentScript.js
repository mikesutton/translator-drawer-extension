// ...existing code...

function createOrToggleDrawer() {
  let drawer = document.getElementById('translationDrawer');
  
  if (drawer) {
    // Toggle visibility if drawer already exists
    drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
    return;
  }

  // Create drawer if it doesn't exist
  drawer = document.createElement('div');
  drawer.id = 'translationDrawer';
  
  // Create a style element for isolated drawer styles
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #translationDrawer {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      position: fixed !important;
      top: 0 !important;
      right: 0 !important;
      width: 300px !important;
      height: 100% !important;
      background-color: white !important;
      color: #333 !important;
      box-shadow: -2px 0 5px rgba(0,0,0,0.2) !important;
      z-index: 2147483647 !important;
      padding: 20px !important;
      overflow-y: auto !important;
      transition: transform 0.3s ease !important;
      box-sizing: border-box !important;
      display: block !important;
    }
    
    #translationDrawer * {
      all: revert;
      font-family: inherit !important;
      color: inherit !important;
      box-sizing: border-box !important;
    }
    
    #translationDrawer h2 {
      font-size: 18px !important;
      font-weight: bold !important;
      margin: 0 0 16px 0 !important;
      padding: 0 !important;
      color: #333 !important;
    }
    
    #translationDrawer p {
      font-size: 14px !important;
      line-height: 1.4 !important;
      margin: 0 0 16px 0 !important;
      padding: 0 !important;
      color: #333 !important;
    }
  `;
  
  document.head.appendChild(styleElement);
  
  // Apply minimal inline styles as a fallback
  drawer.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    width: 300px !important;
    height: 100% !important;
    z-index: 2147483647 !important;
  `;

  const content = document.createElement('div');
  content.innerHTML = '<h2>Translation Drawer</h2><p>This is a sidebar for translations and notes. Use the toolbar button to toggle visibility.</p>';
  drawer.appendChild(content);

  document.body.appendChild(drawer);
}

// ...existing code...

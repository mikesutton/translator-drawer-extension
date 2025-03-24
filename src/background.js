// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Send a message to the content script
  chrome.tabs.sendMessage(tab.id, {message: "clicked_browser_action"}, function(response) {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
    }
  });
});
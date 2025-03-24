document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.getElementById('close-button');
    const content = document.getElementById('content');
    
    // Add styling for select boxes
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        select {
            color: white;
        }
    `;
    document.head.appendChild(styleElement);

    // Function to close the side drawer
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            content.style.display = 'none';
        });
    }

    // Function to open the side drawer
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'openDrawer') {
            content.style.display = 'block';
        }
    });

    // Send message to content script as soon as popup opens
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs && tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "clicked_browser_action"}, function(response) {
                // Handle any potential errors, like if content script isn't loaded yet
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError);
                }
                
                // Close the popup immediately after sending the message
                window.close();
            });
        } else {
            // Close popup even if no tab found
            window.close();
        }
    });
});
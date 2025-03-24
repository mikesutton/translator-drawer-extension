document.addEventListener('DOMContentLoaded', function() {
  // Load saved API key
  chrome.storage.sync.get(['translationApiKey'], function(result) {
    const apiKeyInput = document.getElementById('api-key');
    if (result.translationApiKey) {
      apiKeyInput.value = result.translationApiKey;
    }
  });
  
  // Save API key
  document.getElementById('save-button').addEventListener('click', function() {
    const apiKey = document.getElementById('api-key').value.trim();
    
    chrome.storage.sync.set({ translationApiKey: apiKey }, function() {
      const successMessage = document.getElementById('success-message');
      successMessage.style.display = 'block';
      
      // Hide success message after 3 seconds
      setTimeout(function() {
        successMessage.style.display = 'none';
      }, 3000);
    });
  });
});

function addCopyButton() {
  // Create copy button element
  const copyButton = document.createElement('button');
  copyButton.id = 'translationCopyButton';
  copyButton.textContent = 'Copy';
  
  // Create success message element
  const successMessage = document.createElement('div');
  successMessage.className = 'copy-success-message';
  successMessage.textContent = 'Copied!';
  
  // Get translation output element
  const translationOutput = document.getElementById('translationOutput');
  
  // Add button and message to DOM
  if (translationOutput) {
    // Check if button already exists to prevent duplicates
    if (!document.getElementById('translationCopyButton')) {
      translationOutput.appendChild(copyButton);
      translationOutput.appendChild(successMessage);
      
      // Add click event listener to copy button
      copyButton.addEventListener('click', function() {
        // Get the translated text from the textarea instead of the parent div
        const translatedTextArea = document.getElementById('translated-text');
        const textToCopy = translatedTextArea ? translatedTextArea.value : '';
        
        // Use Clipboard API to copy text
        navigator.clipboard.writeText(textToCopy).then(function() {
          // Show success message
          successMessage.classList.add('show');
          
          // Hide success message after 2 seconds
          setTimeout(function() {
            successMessage.classList.remove('show');
          }, 2000);
        }).catch(function(err) {
          console.error('Could not copy text: ', err);
        });
      });
    }
  } else {
    console.warn('Translation output element not found');
  }
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
  // If the drawer is already in the DOM
  if (document.getElementById('translationOutput')) {
    addCopyButton();
  }
});

// Add observer to detect when translation output is added dynamically
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        if (node.id === 'translationOutput' || 
            (node.nodeType === 1 && node.querySelector && node.querySelector('#translationOutput'))) {
          setTimeout(addCopyButton, 100); // Small delay to ensure DOM is ready
          break;
        }
      }
    }
  });
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

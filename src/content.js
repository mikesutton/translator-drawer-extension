(function() {
    let drawer = null; // Keep track of the drawer

    function toggleDrawer() {
        if (drawer) {
            // If the drawer exists, add closing class and wait for animation to complete
            drawer.classList.add('closing');
            setTimeout(() => {
                drawer.remove();
                drawer = null;
            }, 300); // Match this with the CSS transition duration
        } else {
            // If the drawer doesn't exist, create it
            drawer = document.createElement('div');
            drawer.id = 'translation-drawer';
            drawer.className = 'opening';
            drawer.innerHTML = `
               <h2 style="margin-bottom: 20px;">Translation Tool</h2>
                <label for="from-language" style="margin-bottom: 5px;">From:</label>
                <select id="from-language" style="margin-bottom: 15px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                    <option value="en" selected>English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                </select>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <label for="to-language" style="margin-bottom: 5px;">To:</label>
                    <button id="reverse-button" style="padding: 5px 10px; border: none; border-radius: 5px; background-color: #00a36c; color: #ffffff; cursor: pointer;">Reverse</button>
                </div>
                <select id="to-language" style="margin-bottom: 15px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
                    <option value="es" selected>Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="en">English</option>
                </select>

                <label for="source-text" style="margin-bottom: 5px;">Source Text:</label>
                <textarea id="source-text" rows="5" cols="30" style="width:95%; margin-bottom: 15px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;"></textarea>

                <label for="translated-text" style="margin-bottom: 5px;">Translated Text:</label>
                <div id="translationOutput" style="width:95%; margin-bottom: 15px; padding: 10px; border-radius: 5px; border: 1px solid #ccc; background-color: white; min-height: 100px; color: black; position: relative;">
                    <textarea id="translated-text" rows="5" cols="30" readonly style="width:100%; padding: 0; border: none; background-color: transparent; color: black; resize: none;"></textarea>
                </div>

                <div style="display: flex; justify-content: space-between;">
                    <button id="translate-button" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #007acc; color: #ffffff; cursor: pointer;">Translate</button>
                    <button id="clear-button" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #6c757d; color: #ffffff; cursor: pointer;">Clear</button>
                </div>
                <div id="api-error" style="color: #ff6b6b; margin-top: 10px; display: none;">
                    API key not set. Please set your API key in the extension options.
                </div>
        `;
            document.body.appendChild(drawer);

            // Inject CSS
            injectCSS();

            const sourceText = document.getElementById('source-text');
            const translatedText = document.getElementById('translated-text');
            const translateButton = document.getElementById('translate-button');
            const clearButton = document.getElementById('clear-button'); // Get the clear button
            const reverseButton = document.getElementById('reverse-button');
            const apiError = document.getElementById('api-error');
          
            // Translate on button click
            translateButton.addEventListener('click', translateText);

            // Clear button click
            clearButton.addEventListener('click', clearText);

            // Reverse button click
            reverseButton.addEventListener('click', reverseTranslation);

            // Translate on Shift+Enter
            sourceText.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && event.shiftKey) {
                    event.preventDefault(); // Prevent newline in textarea
                    translateText();
                }
            });

            // Manually trigger copy button addition now that the drawer and translationOutput element exist
            if (typeof addCopyButton === 'function') {
                addCopyButton();
            }

            async function translateText() {
                const text = sourceText.value;
                if (!text.trim()) {
                    return;
                }
                
                const fromLanguage = document.getElementById('from-language').value;
                const toLanguage = document.getElementById('to-language').value;
                if (fromLanguage === toLanguage) {
                    translatedText.value = 'Source and target languages are the same.';
                    return;
                }

                try {
                    const translation = await getTranslation(text, fromLanguage, toLanguage);
                    if (translation) {
                        translatedText.value = translation;
                        apiError.style.display = 'none';
                    }
                } catch (error) {
                    translatedText.value = 'Translation failed. Check console for errors.';
                    console.error('Translation error:', error);
                }
            }

            async function getTranslation(text, fromLanguage, toLanguage) {
                // Get the API key from Chrome storage
                return new Promise((resolve, reject) => {
                    chrome.storage.sync.get(['translationApiKey'], function(result) {
                        const apiKey = result.translationApiKey;
                        
                        if (!apiKey) {
                            apiError.style.display = 'block';
                            reject(new Error('API key not set'));
                            return;
                        }
                        
                        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(text)}&source=${fromLanguage}&target=${toLanguage}`;

                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.data && data.data.translations && data.data.translations.length > 0) {
                                resolve(data.data.translations[0].translatedText);
                            } else {
                                reject(new Error('Invalid response format'));
                            }
                        })
                        .catch(error => {
                            reject(error);
                        });
                    });
                });
            }

            function clearText() {
                sourceText.value = '';
                translatedText.value = '';
                apiError.style.display = 'none';
            }

            function reverseTranslation() {
                const fromLanguageSelect = document.getElementById('from-language');
                const toLanguageSelect = document.getElementById('to-language');

                // Swap language selections
                const fromLanguage = fromLanguageSelect.value;
                const toLanguage = toLanguageSelect.value;

                fromLanguageSelect.value = toLanguage;
                toLanguageSelect.value = fromLanguage;

                // Swap text content
                const sourceTextContent = sourceText.value;
                const translatedTextContent = translatedText.value;

                sourceText.value = translatedTextContent;
                translatedText.value = sourceTextContent;
            }

            function injectCSS() {
                const css = `
                    select {
                        color: black !important;
                    }
                    #translation-icon {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 50px;
                        cursor: pointer;
                        z-index: 1000;
                    }

                    #translation-drawer {
                        position: fixed;
                        top: 0;
                        right: 0;
                        width: 400px;
                        height: 100%;
                        background-color: rgba(0, 68, 102, 0.7);
                        box-shadow: -2px 0 5px rgba(0,0,0,0.5);
                        backdrop-filter: blur(10px);
                        z-index: 9999;
                        overflow-y: auto;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        font-family: Arial, sans-serif;
                        color: rgb(255, 255, 255);
                        border-radius: 0 0 10px;
                        transition: transform 300ms ease-in-out;
                    }
                    
                    #translationOutput {
                        position: relative;
                        padding-right: 70px !important;
                    }
                    
                    #translation-drawer.opening {
                        animation: slideIn 300ms forwards;
                    }
                    
                    #translation-drawer.closing {
                        animation: slideOut 300ms forwards;
                    }
                    
                    @keyframes slideIn {
                        from { transform: translateX(100%); }
                        to { transform: translateX(0); }
                    }
                    
                    @keyframes slideOut {
                        from { transform: translateX(0); }
                        to { transform: translateX(100%); }
                    }

                    #translation-drawer h2, #translation-drawer label{
                        color: rgb(255, 255, 255);
                    }

                    #translation-drawer h2{
                        font-size: 24px;
                        font-weight: 700;
                    }

                    #source-text, #translated-text {
                        width: 95%;
                        background-color: white;
                        color: black;
                    }
                    
                    /* Ensure translated text doesn't have gray background */
                    #translated-text {
                        background-color: white !important;
                    }
                    
                    /* Copy button styles */
                    #translationCopyButton {
                        position: absolute !important;
                        top: 10px !important;
                        right: 10px !important;
                        padding: 5px 10px !important;
                        background-color: #007acc !important;
                        color: white !important;
                        border: none !important;
                        border-radius: 4px !important;
                        cursor: pointer !important;
                        font-size: 12px !important;
                        z-index: 10 !important;
                    }
                    
                    .copy-success-message {
                        position: absolute !important;
                        top: 10px !important;
                        right: 70px !important;
                        color: #00a36c !important;
                        font-size: 12px !important;
                    }
                `;

                const style = document.createElement('style');
                style.textContent = css;
                document.head.appendChild(style);
            }
        }
    }

    // Listen for messages from the popup - FIXED: Moved outside of toggleDrawer function
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "clicked_browser_action") {
                toggleDrawer();
                // Send an acknowledgment back
                if (sendResponse) {
                    sendResponse({status: "Drawer toggled"});
                }
                return true; // Keep the message channel open for async response
            }
        }
    );
})();
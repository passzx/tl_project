// size check
function isMobileView() {
    return window.innerWidth <= 768;
}

function processTextForDisplay(text, playerName) {
    let processedText = text;

// personalization
    if (processedText && typeof processedText === 'string') {
        processedText = processedText.replace(/\[Player\]/g, playerName);
    }

// goodbye line breaks
    if (isMobileView()) {
        if (processedText && typeof processedText === 'string') {
            processedText = processedText.replace(/<br>/g, ' ');
        }
    }
    return processedText;
}

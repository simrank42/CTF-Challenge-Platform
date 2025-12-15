// Steganography Challenge - Hidden data in zero-width characters
(function() {
    const flag = 'CTF{H1dd3n_1n_Pl41n_S1ght}';
    
    // Encode flag using zero-width characters
    // U+200B = zero-width space (0)
    // U+200C = zero-width non-joiner (1)
    // U+200D = zero-width joiner (separator)
    function encodeToZeroWidth(text) {
        const binary = text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join('');
        
        let encoded = '';
        for (let i = 0; i < binary.length; i++) {
            if (binary[i] === '0') {
                encoded += '\u200B'; // zero-width space
            } else {
                encoded += '\u200C'; // zero-width non-joiner
            }
            // Add separator every 8 bits
            if ((i + 1) % 8 === 0 && i < binary.length - 1) {
                encoded += '\u200D'; // zero-width joiner
            }
        }
        
        return encoded;
    }
    
    // Hide flag in CSS content
    function hideInCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hidden flag in CSS comment: ${flag} */
            .hidden-flag::before {
                content: "${encodeToZeroWidth(flag)}";
            }
        `;
        document.head.appendChild(style);
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        const hiddenTextDiv = document.getElementById('hidden-text');
        if (hiddenTextDiv) {
            // Hide flag using zero-width characters
            const encodedFlag = encodeToZeroWidth(flag);
            hiddenTextDiv.textContent = 'Look carefully... ' + encodedFlag + ' ...there might be something hidden here.';
            
            // Also add a hidden div with the flag
            const secretDiv = document.createElement('div');
            secretDiv.className = 'hidden-flag';
            secretDiv.style.display = 'none';
            secretDiv.setAttribute('data-flag', flag);
            document.body.appendChild(secretDiv);
            
            // Hide in CSS
            hideInCSS();
        }
        
        // Also hide in HTML comments
        const comment = document.createComment(` STEGANOGRAPHY FLAG: ${flag} `);
        document.body.appendChild(comment);
    });
})();


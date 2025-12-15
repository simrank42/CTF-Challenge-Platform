// Steganography Challenge - Expert level with multiple techniques
(function() {
    const flag = 'CTF{H1dd3n_1n_Pl41n_S1ght}';
    
    // Split flag into 3 parts
    const flagPart1 = flag.substring(0, 11);  // CTF{H1dd3n_
    const flagPart2 = flag.substring(11, 20); // 1n_Pl41n_
    const flagPart3 = flag.substring(20);     // S1ght}
    
    // Encode using zero-width characters (U+200B = 0, U+200C = 1, U+200D = separator)
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
    
    // Encode each part
    const encodedPart1 = encodeToZeroWidth(flagPart1);
    const encodedPart2 = encodeToZeroWidth(flagPart2);
    const encodedPart3 = encodeToZeroWidth(flagPart3);
    
    // Hide flag using CSS content
    function hideInCSS() {
        const style = document.createElement('style');
        style.setAttribute('data-stego-style', 'true');
        style.textContent = `
            /* Part 1 hidden in CSS comment: ${flagPart1} */
            .hidden-flag-part1::before {
                content: "${encodedPart1}";
            }
            /* Part 2 in CSS */
            .hidden-flag-part2::after {
                content: "${encodedPart2}";
            }
            /* Part 3 */
            .hidden-flag-part3::before {
                content: "${encodedPart3}";
            }
        `;
        document.head.appendChild(style);
    }
    
    // Hide using whitespace in text
    function hideInWhitespace() {
        // Part 1: Use different Unicode whitespace characters
        const wsChars = ['\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005'];
        let wsEncoded = '';
        for (let i = 0; i < flagPart2.length; i++) {
            const charCode = flagPart2.charCodeAt(i);
            // Encode using combination of whitespace chars
            const idx1 = charCode % wsChars.length;
            const idx2 = Math.floor(charCode / wsChars.length) % wsChars.length;
            wsEncoded += wsChars[idx1] + wsChars[idx2];
        }
        return wsEncoded;
    }
    
    const whitespaceEncoded = hideInWhitespace();
    
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
        
        const hiddenTextDiv = document.getElementById('hidden-text');
        if (hiddenTextDiv) {
            // Hide all three parts using zero-width characters
            hiddenTextDiv.textContent = 'Look carefully... ' + encodedPart1 + ' ' + encodedPart2 + ' ' + encodedPart3 + ' ...there might be something hidden here.';
            
            // Remove old hidden divs if they exist
            const oldDivs = document.querySelectorAll('.hidden-flag-part1, .hidden-flag-part2, .hidden-flag-part3, [data-stego-hidden]');
            oldDivs.forEach(div => div.remove());
            
            // Also add hidden divs with different techniques
            const secretDiv1 = document.createElement('div');
            secretDiv1.className = 'hidden-flag-part1';
            secretDiv1.style.display = 'none';
            secretDiv1.setAttribute('data-part', '1');
            document.body.appendChild(secretDiv1);
            
            const secretDiv2 = document.createElement('div');
            secretDiv2.className = 'hidden-flag-part2';
            secretDiv2.style.display = 'none';
            secretDiv2.setAttribute('data-part', '2');
            document.body.appendChild(secretDiv2);
            
            const secretDiv3 = document.createElement('div');
            secretDiv3.className = 'hidden-flag-part3';
            secretDiv3.style.display = 'none';
            secretDiv3.setAttribute('data-part', '3');
            document.body.appendChild(secretDiv3);
            
            // Hide part 2 using whitespace steganography in a visible element
            const wsDiv = document.createElement('div');
            wsDiv.style.visibility = 'hidden';
            wsDiv.style.position = 'absolute';
            wsDiv.setAttribute('data-stego-hidden', 'true');
            wsDiv.textContent = 'Normal text' + whitespaceEncoded + 'more text';
            document.body.appendChild(wsDiv);
            
            // Hide in CSS (only add once)
            if (!document.querySelector('style[data-stego-style]')) {
                hideInCSS();
            }
        }
        
        // Remove old comments if they exist
        const allComments = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue && node.nodeValue.includes('Part 1 base64:') || 
                node.nodeValue.includes('Part 2 hex:') || 
                node.nodeValue.includes('Part 3: Check CSS')) {
                allComments.push(node);
            }
        }
        allComments.forEach(comment => comment.remove());
        
        // Hide parts in HTML comments (encoded differently) - only add once
        const comment1 = document.createComment(` Part 1 base64: ${btoa(flagPart1)} `);
        document.body.appendChild(comment1);
        
        const comment2 = document.createComment(` Part 2 hex: ${Array.from(flagPart2).map(c => c.charCodeAt(0).toString(16)).join('')} `);
        document.body.appendChild(comment2);
        
        const comment3 = document.createComment(` Part 3: Check CSS and zero-width chars `);
        document.body.appendChild(comment3);
    }
    
    // Single initialization path
    function attemptInit() {
        const hiddenTextDiv = document.getElementById('hidden-text');
        if (hiddenTextDiv || document.readyState === 'complete') {
            setTimeout(initChallenge, 50);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChallenge, { once: true });
        } else {
            setTimeout(initChallenge, 100);
        }
    }
    
    window.initSteganography = initChallenge;
    attemptInit();
})();

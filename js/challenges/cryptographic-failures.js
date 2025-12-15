// Cryptographic Failures Challenge - Expert level with custom algorithm
(function() {
    const flag = 'CTF{Mul7i_L4y3r_3ncryp710n_F41l}';
    
    // Custom encryption algorithm with key derivation
    function customEncrypt(text, key) {
        // Step 1: XOR with key (cyclic)
        let step1 = text.split('').map((char, idx) => {
            const keyChar = key.charCodeAt(idx % key.length);
            return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
        }).join('');
        
        // Step 2: Custom substitution cipher (Caesar + ROT13 hybrid)
        let step2 = step1.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(((char.charCodeAt(0) - 65 + 17) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                return String.fromCharCode(((char.charCodeAt(0) - 97 + 17) % 26) + 97);
            } else if (char >= '0' && char <= '9') {
                return String.fromCharCode(((char.charCodeAt(0) - 48 + 5) % 10) + 48);
            }
            return char;
        }).join('');
        
        // Step 3: Reverse and add noise
        step2 = step2.split('').reverse().join('');
        
        // Step 4: Hex encode
        let step3 = step2.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        
        // Step 5: Base64 encode
        let step4 = btoa(step3);
        
        // Step 6: Add padding noise (red herring)
        const noise = 'a'.repeat(16);
        step4 = noise.substring(0, 8) + step4 + noise.substring(8);
        
        // Step 7: Final Base64 (double encoding)
        return btoa(step4);
    }
    
    // Key derivation function - key is encoded in comments, not directly visible
    // The actual key is derived from: "weak_secret_2024" but encoded
    const keySource = btoa('weak_secret_2024').substring(0, 16); // Base64 encoded key source
    const encryptionKey = atob(keySource.replace(/[^A-Za-z0-9]/g, '') + '==').substring(0, 16); // Decode to get key
    
    // Display encrypted message when page loads
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
        
        const encryptedText = document.getElementById('encrypted-text');
        const encrypted = customEncrypt(flag, encryptionKey);
        
        if (encryptedText) {
            encryptedText.textContent = encrypted;
        }
        
        // Display obfuscated key derivation function (doesn't show actual key)
        const keyDerivationCode = document.getElementById('key-derivation-code');
        if (keyDerivationCode) {
            keyDerivationCode.textContent = `// Key Derivation Function
function deriveKey(secret) {
    // Key source is base64 encoded
    const encoded = btoa(secret);
    return encoded.substring(0, 16);
}

// Usage example (key source hidden):
// const key = deriveKey("***hidden***");
// The actual key source is encoded in this file's comments`;
        }
        
        // Remove old comments if they exist (check by content)
        const walker = document.createTreeWalker(document.head, NodeFilter.SHOW_COMMENT, null, false);
        const commentsToRemove = [];
        let node;
        while (node = walker.nextNode()) {
            const content = node.nodeValue || '';
            if (content.includes('Key source base64:') || 
                content.includes('Encryption key hint:') || 
                content.includes('Key derivation:')) {
                commentsToRemove.push(node);
            }
        }
        commentsToRemove.forEach(comment => comment.remove());
        
        // Hide key in HTML comments (encoded, not plain)
        const comment1 = document.createComment(` Key source base64: ${btoa('weak_secret_2024')} `);
        document.head.appendChild(comment1);
        
        // Also add noise comments (red herrings)
        const comment2 = document.createComment(` Encryption key hint: Look for base64 encoded strings `);
        document.head.appendChild(comment2);
        
        const comment3 = document.createComment(` Key derivation: btoa(source).substring(0,16) `);
        document.head.appendChild(comment3);
    }
    
    // Single initialization path - check if DOM is ready
    function attemptInit() {
        const encryptedText = document.getElementById('encrypted-text');
        if (encryptedText || document.readyState === 'complete') {
            // DOM ready or element exists
            setTimeout(initChallenge, 50);
        } else if (document.readyState === 'loading') {
            // Wait for DOM
            document.addEventListener('DOMContentLoaded', initChallenge, { once: true });
        } else {
            // Fallback
            setTimeout(initChallenge, 100);
        }
    }
    
    // Make available globally and attempt initialization
    window.initCryptographicFailures = initChallenge;
    
    // Attempt initialization
    attemptInit();
})();

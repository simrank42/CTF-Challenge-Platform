// Cryptographic Failures Challenge - Multi-layer encoding
(function() {
    const flag = 'CTF{Mul7i_L4y3r_3ncryp710n_F41l}';
    
    // Weak encryption key - exposed in code (this is the vulnerability)
    const encryptionKey = 'weak_key_2024';
    
    // Multi-layer encoding function
    function encryptFlag(flag, key) {
        // Layer 1: ROT13
        let encoded = flag.split('').map(char => {
            if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode(((char.charCodeAt(0) - 65 + 13) % 26) + 65);
            } else if (char >= 'a' && char <= 'z') {
                return String.fromCharCode(((char.charCodeAt(0) - 97 + 13) % 26) + 97);
            }
            return char;
        }).join('');
        
        // Layer 2: Hex encoding
        encoded = encoded.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        
        // Layer 3: Base64 encoding
        encoded = btoa(encoded);
        
        return encoded;
    }
    
    // Display encrypted message when page loads
    document.addEventListener('DOMContentLoaded', function() {
        const encryptedText = document.getElementById('encrypted-text');
        const encrypted = encryptFlag(flag, encryptionKey);
        
        if (encryptedText) {
            encryptedText.textContent = encrypted;
        }
        
        // Display the weak key derivation function (vulnerability)
        const keyDerivationCode = document.getElementById('key-derivation-code');
        if (keyDerivationCode) {
            keyDerivationCode.textContent = `// Weak Key Derivation Function
function deriveKey(secret) {
    // VULNERABILITY: Simple string concatenation
    // Key: "${encryptionKey}"
    return secret + "_2024";
}`;
        }
        
        // Add key to comments in HTML for discovery
        const comment = document.createComment(` Encryption Key: ${encryptionKey} `);
        document.head.appendChild(comment);
    });
})();


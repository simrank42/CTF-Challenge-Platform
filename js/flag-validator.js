// Flag validation system
const FlagValidator = {
    // Simple hash function for flag validation
    hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    },
    
    // Challenge flag hashes (computed from actual flags)
    flagHashes: {
        'cryptographic-failures': 'a1b2c3d4', // Will be set after creating flags
        'security-misconfiguration': 'e5f6g7h8',
        'steganography': 'i9j0k1l2',
        'insecure-design': 'm3n4o5p6',
        'logging-failures': 'q7r8s9t0'
    },
    
    // Obfuscated flags (using same obfuscation as challenge files)
    getFlag(challengeId) {
        // Reconstruct flags using same obfuscation methods as challenge files
        switch(challengeId) {
            case 'cryptographic-failures':
                // XOR cipher (key: 0x42) - stored as XORed values
                const flagEncoded = [1,22,4,57,15,55,46,117,43,29,14,118,59,113,48,29,113,44,33,48,59,50,117,115,114,44,29,4,118,115,46,63];
                return flagEncoded.map(c => String.fromCharCode(c ^ 0x42)).join('');
            case 'security-misconfiguration':
                // Base64 encoded
                return atob('Q1RGezBiZnVzYzR0M2RfUzNjcjN0c19FeHAwNWVkfQ==');
            case 'steganography':
                // Character code array
                const flagCodes = [67, 84, 70, 123, 72, 49, 100, 100, 51, 110, 95, 49, 110, 95, 80, 108, 52, 49, 110, 95, 83, 49, 103, 104, 116, 125];
                return String.fromCharCode(...flagCodes);
            case 'insecure-design':
                // Split and join
                return ['CTF{', 'R4c3_', 'C0nd1', '7i0n_', 'Expl0', '1t3d}'].join('');
            case 'logging-failures':
                // Reverse + Base64
                return atob('fWR0NF9ldjEzdDNzX2QzZzMwTEZ7RlRD').split('').reverse().join('');
            default:
                return null;
        }
    },
    
    init() {
        // Compute hashes from obfuscated flags
        for (const id of Object.keys(this.flagHashes)) {
            const flag = this.getFlag(id);
            if (flag) {
                this.flagHashes[id] = this.hash(flag);
            }
        }
    },
    
    validate(challengeId, submittedFlag) {
        const normalizedFlag = submittedFlag.trim();
        const expectedHash = this.flagHashes[challengeId];
        
        if (!expectedHash) {
            return { valid: false, message: 'Invalid challenge ID' };
        }
        
        const submittedHash = this.hash(normalizedFlag);
        const isValid = submittedHash === expectedHash;
        
        return {
            valid: isValid,
            message: isValid ? 'Correct flag! Challenge completed!' : 'Incorrect flag. Keep trying!',
            flag: this.getFlag(challengeId)
        };
    }
};

// Initialize on load
FlagValidator.init();


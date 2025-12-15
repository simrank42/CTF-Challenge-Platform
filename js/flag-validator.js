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
    
    // Actual flags (for hash computation)
    flags: {
        'cryptographic-failures': 'CTF{Mul7i_L4y3r_3ncryp710n_F41l}',
        'security-misconfiguration': 'CTF{0bfusc4t3d_S3cr3ts_Exp05ed}',
        'steganography': 'CTF{H1dd3n_1n_Pl41n_S1ght}',
        'insecure-design': 'CTF{R4c3_C0nd17i0n_Expl01t3d}',
        'logging-failures': 'CTF{L0gg3d_S3ns1t1v3_D4t4}'
    },
    
    init() {
        // Compute hashes from actual flags
        for (const [id, flag] of Object.entries(this.flags)) {
            this.flagHashes[id] = this.hash(flag);
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
            flag: this.flags[challengeId]
        };
    }
};

// Initialize on load
FlagValidator.init();


// Logging and Alerting Failures Challenge - Expert level
// Flag is NOT directly logged - requires piecing together encoded data
(function() {
    // Flag obfuscated: Reverse + Base64
    const flagRevB64 = 'fWR0NF9ldjEzdDNzX2QzZzMwTEZ7RlRD';
    const flag = atob(flagRevB64).split('').reverse().join('');
    
    // Split flag into parts and encode them
    function encodeFlagPart(part, index) {
        // Each part is encoded differently
        switch(index % 4) {
            case 0: return btoa(part).replace(/=/g, ''); // Base64 without padding
            case 1: return Array.from(part).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); // Hex
            case 2: return part.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x42)).join('').split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); // XOR then hex
            case 3: return Array.from(part).map(c => (c.charCodeAt(0) + 13).toString(36)).join(''); // Custom encoding
            default: return part;
        }
    }
    
    // Split flag into parts
    const flagParts = [
        flag.substring(0, 8),   // CTF{FL03
        flag.substring(8, 16),   // g3d_s3t3
        flag.substring(16, 24),  // 1ve_4td}
        flag.substring(24, 32)   // (empty - flag is 24 chars)
    ];
    
    // Encode each part
    const encodedParts = flagParts.map((part, idx) => encodeFlagPart(part, idx));
    
    // Sensitive data that IS logged (distraction)
    const apiKey = 'SECRET_API_KEY_12345';
    const userToken = 'user_token_abc123';
    const dbConnection = 'postgresql://admin:password123@localhost:5432/db';
    
    // Vulnerable logging - but flag is NOT directly logged
    window.triggerError = function() {
        try {
            const error = new Error('Authentication failed');
            
            const errorContext = {
                requestId: 'req_' + Date.now(),
                sessionData: { token: userToken },
                timestamp: new Date().toISOString(),
                correlationId: 'corr_' + encodedParts[0],
                stackSig: 'sig_' + encodedParts[0].slice(0, 6)
            };
            
            console.error('Error occurred:', error);
            console.error('Error context:', errorContext);
            console.error('Stack analysis:', {
                depth: 3,
                hash: encodedParts[0], // encoded part hidden as hash
                location: 'auth.js:42',
                note: 'trace correlation only'
            });
            
            throw error;
        } catch (e) {
            const errorMeta = {
                code: 'AUTH_ERR',
                severity: 'high'
            };
            console.log('Error metadata:', errorMeta);
        }
    };
    
    window.makeRequest = function() {
        const requestId = 'req_' + Date.now();
        
        const requestData = {
            endpoint: '/api/data',
            headers: {
                'Authorization': 'Bearer ' + userToken,
                'API-Key': apiKey,
                'X-Request-Id': requestId,
                // encodedParts[1] placed in correlation id, presented as a checksum
                'X-Correlation-Id': encodedParts[1]
            },
            body: {
                action: 'fetch',
                timestamp: Date.now(),
                checksum: encodedParts[1].slice(0, 6) + '-chk'
            }
        };
        
        console.log('Making API request:', requestData);
        console.log('Request headers:', JSON.stringify(requestData.headers, null, 2));
        console.log('Request fingerprint:', requestData.body.checksum);
        
        const outputDiv = document.getElementById('app-output');
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="flag-message success">Request sent! Analyze all logged data carefully.</div>';
        }
        
        setTimeout(function() {
            const response = {
                status: 200,
                headers: {
                    'X-Correlation-Id': requestId,
                    'X-Request-Id': requestId
                },
                data: {
                    message: 'Success',
                    userData: {
                        token: userToken,
                        signature: 'sig-' + encodedParts[1].slice(-6)
                    }
                }
            };
            console.log('Response received:', response);
        }, 500);
    };
    
    window.debugMode = function() {
        const debugInfo = {
            environment: 'production',
            debug: true,
            version: '1.0.0',
            config: {
                apiKey: apiKey,
                dbConnection: dbConnection
            },
            metrics: {
                latencyMs: Math.floor(Math.random() * 40) + 80,
                featureToggle: encodedParts[2], // encoded part disguised as feature toggle key
                checksum: 'chk-' + encodedParts[2].slice(0, 5)
            }
        };
        
        console.log('=== DEBUG MODE ENABLED ===');
        console.log('Debug information:', debugInfo);
        console.log('Feature flags:', debugInfo.metrics.featureToggle);
        console.log('========================');
        
        const outputDiv = document.getElementById('app-output');
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="flag-message warning">Debug mode enabled! All encoded data logged. Analyze carefully.</div>';
        }
    };
    
    // Initialize challenge - no logging on page load
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
    }
    
    // Single initialization path
    function attemptInit() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(initChallenge, 50);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChallenge, { once: true });
        } else {
            setTimeout(initChallenge, 100);
        }
    }
    
    window.initLoggingFailures = initChallenge;
    attemptInit();
})();

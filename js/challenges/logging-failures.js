// Logging and Alerting Failures Challenge - Expert level
// Flag is NOT directly logged - requires piecing together encoded data
(function() {
    const flag = 'CTF{L0gg3d_S3ns1t1v3_D4t4}';
    
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
    
    // Split flag into 5 parts
    const flagParts = [
        flag.substring(0, 8),   // CTF{L0g
        flag.substring(8, 16),  // g3d_S3n
        flag.substring(16, 24), // s1t1v3_
        flag.substring(24, 32), // D4t4}
        flag.substring(4, 7)    // Red herring: L0g
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
            
            // Log encoded flag part 1 in error context (but disguised)
            const errorContext = {
                requestId: 'req_' + encodedParts[0],
                sessionData: { token: userToken },
                timestamp: new Date().toISOString()
            };
            
            console.error('Error occurred:', error);
            console.error('Error context:', errorContext);
            console.error('Request ID:', errorContext.requestId);
            
            // Log encoded flag part 2 in stack trace analysis
            console.error('Stack analysis:', {
                depth: 3,
                hash: encodedParts[1],
                location: 'auth.js:42'
            });
            
            throw error;
        } catch (e) {
            // Log encoded flag part 3 in error handler metadata
            const errorMeta = {
                code: 'AUTH_ERR',
                ref: encodedParts[2],
                severity: 'high'
            };
            console.log('Error metadata:', errorMeta);
            console.log('Error reference:', errorMeta.ref);
        }
    };
    
    window.makeRequest = function() {
        const requestId = 'req_' + Date.now();
        
        // Log encoded flag part 4 in request headers (disguised)
        const requestData = {
            endpoint: '/api/data',
            headers: {
                'Authorization': 'Bearer ' + userToken,
                'API-Key': apiKey,
                'X-Request-Id': requestId,
                'X-Correlation-Id': encodedParts[3] // Flag part hidden here
            },
            body: {
                action: 'fetch',
                timestamp: Date.now()
            }
        };
        
        console.log('Making API request:', requestData);
        console.log('Request headers:', JSON.stringify(requestData.headers, null, 2));
        
        const outputDiv = document.getElementById('app-output');
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="flag-message success">Request sent! Analyze all logged data carefully.</div>';
        }
        
        // Response contains encoded flag part 0 (first part) in correlation header
        setTimeout(function() {
            const response = {
                status: 200,
                headers: {
                    'X-Correlation-Id': encodedParts[0], // First flag part
                    'X-Request-Id': requestId
                },
                data: {
                    message: 'Success',
                    userData: {
                        token: userToken,
                        hash: encodedParts[1] // Second flag part
                    }
                }
            };
            console.log('Response received:', response);
            console.log('Response headers:', JSON.stringify(response.headers, null, 2));
        }, 500);
    };
    
    window.debugMode = function() {
        // Debug mode logs encoded data but not the flag directly
        const debugInfo = {
            environment: 'production',
            debug: true,
            version: '1.0.0',
            config: {
                apiKey: apiKey,
                dbConnection: dbConnection,
                // Flag parts encoded and scattered
                checksum: encodedParts[0] + encodedParts[1],
                signature: encodedParts[2] + encodedParts[3]
            },
            metrics: {
                requestHash: encodedParts[1],
                sessionHash: encodedParts[0],
                errorRef: encodedParts[2]
            }
        };
        
        console.log('=== DEBUG MODE ENABLED ===');
        console.log('Debug information:', debugInfo);
        console.log('Configuration checksum:', debugInfo.config.checksum);
        console.log('Configuration signature:', debugInfo.config.signature);
        console.log('Metrics:', JSON.stringify(debugInfo.metrics, null, 2));
        console.log('========================');
        
        const outputDiv = document.getElementById('app-output');
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="flag-message warning">Debug mode enabled! All encoded data logged. Analyze carefully.</div>';
        }
    };
    
    // Log on page load - contains encoded flag parts disguised as normal data
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
        
        console.log('Application initialized');
        console.log('Loading user session...');
        
        // Encoded flag parts logged as various identifiers
        const sessionData = {
            token: userToken,
            apiKey: apiKey,
            sessionId: 'sess_' + encodedParts[0], // First part
            userId: 'user_' + encodedParts[1],     // Second part
            requestHash: encodedParts[2],          // Third part
            correlationId: encodedParts[3]         // Fourth part
        };
        
        console.log('Session data:', sessionData);
        console.log('Session ID:', sessionData.sessionId);
        console.log('User ID:', sessionData.userId);
        console.log('Request hash:', sessionData.requestHash);
        console.log('Correlation ID:', sessionData.correlationId);
        
        // Also log in error handlers during initialization
        try {
            const initData = { 
                status: 'ready',
                version: '1.0.0',
                buildId: encodedParts[0] + '_' + encodedParts[1]
            };
            console.log('Init complete:', initData);
        } catch (e) {
            console.error('Init error:', e);
            console.error('Error context:', { 
                ref: encodedParts[2],
                hash: encodedParts[3]
            });
        }
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

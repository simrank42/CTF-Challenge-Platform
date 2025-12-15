// Logging and Alerting Failures Challenge - Exposed sensitive data
(function() {
    const flag = 'CTF{L0gg3d_S3ns1t1v3_D4t4}';
    
    // Sensitive data that should not be logged
    const apiKey = 'SECRET_API_KEY_12345';
    const userToken = 'user_token_abc123';
    const dbConnection = 'postgresql://admin:password123@localhost:5432/db';
    
    // Vulnerable logging - exposes sensitive data
    window.triggerError = function() {
        try {
            // Simulate an error that exposes sensitive data in stack trace
            const error = new Error('Authentication failed');
            error.details = {
                apiKey: apiKey,
                userToken: userToken,
                flag: flag, // FLAG EXPOSED IN ERROR!
                timestamp: new Date().toISOString()
            };
            
            console.error('Error occurred:', error);
            console.error('Stack trace:', error.stack);
            console.error('Error details:', JSON.stringify(error.details, null, 2));
            
            // Also log to output
            const outputDiv = document.getElementById('app-output');
            if (outputDiv) {
                outputDiv.innerHTML = '<div class="flag-message error">Error triggered! Check console for details.</div>';
            }
            
            throw error;
        } catch (e) {
            // Error handler also logs sensitive data
            console.log('Caught error:', e.message);
            console.log('Full error object:', e);
        }
    };
    
    window.makeRequest = function() {
        // Logged request with sensitive data
        const requestData = {
            endpoint: '/api/data',
            headers: {
                'Authorization': 'Bearer ' + userToken,
                'API-Key': apiKey
            },
            body: {
                flag: flag, // FLAG IN REQUEST LOG!
                action: 'fetch'
            }
        };
        
        console.log('Making API request:', requestData);
        console.log('Request headers:', JSON.stringify(requestData.headers, null, 2));
        console.log('Request body:', JSON.stringify(requestData.body, null, 2));
        
        // Simulate network request (would show in Network tab in real app)
        const outputDiv = document.getElementById('app-output');
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="flag-message success">Request sent! Check console and Network tab.</div>';
        }
        
        // Also log response (which might contain sensitive data)
        setTimeout(function() {
            const response = {
                status: 200,
                data: {
                    message: 'Success',
                    flag: flag, // FLAG IN RESPONSE LOG!
                    userData: {
                        token: userToken
                    }
                }
            };
            console.log('Response received:', response);
        }, 500);
    };
    
    window.debugMode = function() {
        // Debug mode exposes even more information
        const debugInfo = {
            environment: 'production',
            debug: true,
            version: '1.0.0',
            config: {
                apiKey: apiKey,
                dbConnection: dbConnection,
                secretFlag: flag // FLAG IN DEBUG LOG!
            },
            flags: {
                featureX: true,
                featureY: false,
                ctfFlag: flag // FLAG EXPOSED!
            }
        };
        
        console.log('=== DEBUG MODE ENABLED ===');
        console.log('Debug information:', debugInfo);
        console.log('Configuration:', JSON.stringify(debugInfo.config, null, 2));
        console.log('Feature flags:', JSON.stringify(debugInfo.flags, null, 2));
        console.log('Sensitive data exposed:', {
            apiKey: apiKey,
            dbConnection: dbConnection,
            flag: flag
        });
        console.log('========================');
        
        const outputDiv = document.getElementById('app-output');
        if (outputDiv) {
            outputDiv.innerHTML = '<div class="flag-message warning">Debug mode enabled! Check console for extensive logging.</div>';
        }
    };
    
    // Log on page load (common mistake)
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Application initialized');
        console.log('Loading user session...');
        console.log('Session data:', {
            token: userToken,
            apiKey: apiKey,
            // Flag accidentally logged
            initializationFlag: flag
        });
        
        // Also log in case of errors during initialization
        try {
            // Simulate initialization
            const initData = { flag: flag, status: 'ready' };
            console.log('Init complete:', initData);
        } catch (e) {
            console.error('Init error:', e);
            console.error('Error context:', { flag: flag });
        }
    });
})();


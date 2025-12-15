// Security Misconfiguration Challenge - Expert level with advanced obfuscation
(function() {
    // Flag obfuscated with Base64 encoding
    const flagB64 = 'Q1RGezBiZnVzYzR0M2RfUzNjcjN0c19FeHAwNWVkfQ==';
    const flag = atob(flagB64);
    
    // Split flag into parts
    const flagPart1 = flag.substring(0, 12);  // CTF{0bfusc4
    const flagPart2 = flag.substring(12, 23); // t3d_S3cr3
    const flagPart3 = flag.substring(23);     // ts_Exp05ed}
    
    // Encode each part differently
    const encodedPart1 = btoa(flagPart1).split('').reverse().join('');
    const encodedPart2 = Array.from(flagPart2).map(c => c.charCodeAt(0).toString(16)).join('');
    const encodedPart3 = flagPart3.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x55)).map(c => btoa(c)).join('|');
    
    // Advanced obfuscation with string arrays
    const _0x1a2b = ['flag', 'secret', 'exposed', 'config', 'api', 'key', 'password'];
    const _0x3c4d = ['part1', 'part2', 'part3', 'encoded', 'decoded'];
    const _0x5e6f = ['base64', 'hex', 'xor', 'rot', 'substitute'];
    
    const _0x8g9h = function(_0xa0b1, _0xc2d3) {
        _0xa0b1 = _0xa0b1 - 0x0;
        let _0xe4f5 = _0x1a2b[_0xa0b1 % _0x1a2b.length];
        return _0xe4f5;
    };
    
    const _0x6g7h = function(_0xa0b1) {
        let _0xc2d3 = _0x3c4d[_0xa0b1 % _0x3c4d.length];
        return _0xc2d3;
    };
    
    // Exposed configuration with encoded flag parts
    const exposedSecret = 'API_KEY_EXPOSED_12345';
    const dbPassword = 'admin_password_weak';
    
    // Heavily obfuscated function
    window.obfuscatedFunction = function() {
        const _0xa = _0x8g9h('0x0'); // 'flag'
        const _0xb = _0x8g9h('0x1'); // 'secret'
        const _0xc = _0x8g9h('0x2'); // 'exposed'
        
        // Config with encoded flag parts hidden in different properties
        const config = {
            apiKey: exposedSecret,
            dbPassword: dbPassword,
            debug: true,
            [_0xa + _0x6g7h(0)]: encodedPart1,  // flagpart1
            [_0xb + _0x6g7h(1)]: encodedPart2,  // secretpart2
            [_0xc + _0x6g7h(2)]: encodedPart3,  // exposedpart3
            checksum: encodedPart1 + encodedPart2,
            signature: encodedPart2 + encodedPart3,
            // Additional config data (flag parts not in obvious metadata)
            sessionId: encodedPart1.substring(0, 8),
            requestId: encodedPart2.substring(0, 8),
            traceId: encodedPart3.substring(0, 8)
        };
        
        console.log('Config loaded:', config);
        console.error('Security Misconfiguration detected:', _0xb);
        
        return 'Configuration loaded. Analyze all properties carefully.';
    };
    
    // Make executeObfuscatedCode available globally (before HTML tries to use it)
    window.executeObfuscatedCode = function() {
        const resultDiv = document.getElementById('execution-result');
        if (!window.obfuscatedFunction) {
            if (resultDiv) {
                resultDiv.innerHTML = '<div class="flag-message error">Obfuscated function not loaded. Check the page source.</div>';
            }
            return;
        }
        
        try {
            const result = window.obfuscatedFunction();
            if (resultDiv) {
                resultDiv.innerHTML = `<div class="flag-message success">Execution result: ${result}</div>`;
            }
        } catch (e) {
            if (resultDiv) {
                resultDiv.innerHTML = `<div class="flag-message error">Error: ${e.message}</div>`;
            }
        }
    };
    
    // Display obfuscated code
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
        
        const obfuscatedCode = document.getElementById('obfuscated-code');
        if (obfuscatedCode) {
            obfuscatedCode.textContent = `const _0x1a2b=['flag','secret','exposed','config','api','key','password'];
const _0x3c4d=['part1','part2','part3','encoded','decoded'];
const _0x8g9h=function(_0xa0b1,_0xc2d3){
    _0xa0b1=_0xa0b1-0x0;
    let _0xe4f5=_0x1a2b[_0xa0b1%_0x1a2b.length];
    return _0xe4f5;
};
const _0x6g7h=function(_0xa0b1){
    let _0xc2d3=_0x3c4d[_0xa0b1%_0x3c4d.length];
    return _0xc2d3;
};
function obfuscatedFunction(){
    const _0xa=_0x8g9h('0x0');
    const _0xb=_0x8g9h('0x1');
    const _0xc=_0x8g9h('0x2');
    const config={
        apiKey:'${exposedSecret}',
        dbPassword:'${dbPassword}',
        debug:true,
        [_0xa+_0x6g7h(0)]:'${encodedPart1}',
        [_0xb+_0x6g7h(1)]:'${encodedPart2}',
        [_0xc+_0x6g7h(2)]:'${encodedPart3}',
        checksum:'${encodedPart1+encodedPart2}',
        signature:'${encodedPart2+encodedPart3}',
        sessionId:'${encodedPart1.substring(0,8)}',
        requestId:'${encodedPart2.substring(0,8)}',
        traceId:'${encodedPart3.substring(0,8)}'
    };
    console.log('Config loaded:',config);
    return 'Configuration loaded.';
}`;
        }
        
        // Expose config globally for analysis (but don't make it too obvious)
        window.configMisconfiguration = {
            secret: exposedSecret,
            password: dbPassword,
            // Flag parts are in the config object properties, not here
            sessionData: {
                id: encodedPart1.substring(0, 8),
                token: encodedPart2.substring(0, 8),
                ref: encodedPart3.substring(0, 8)
            }
        };
    }
    
    // Single initialization path
    function attemptInit() {
        const obfuscatedCode = document.getElementById('obfuscated-code');
        if (obfuscatedCode || document.readyState === 'complete') {
            setTimeout(initChallenge, 50);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initChallenge, { once: true });
        } else {
            setTimeout(initChallenge, 100);
        }
    }
    
    window.initSecurityMisconfiguration = initChallenge;
    attemptInit();
})();

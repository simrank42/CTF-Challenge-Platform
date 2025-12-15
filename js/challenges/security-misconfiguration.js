// Security Misconfiguration Challenge - Obfuscated JavaScript
(function() {
    const flag = 'CTF{0bfusc4t3d_S3cr3ts_Exp05ed}';
    
    // Exposed secret (this is the misconfiguration)
    const exposedSecret = 'API_KEY_EXPOSED_12345';
    const dbPassword = 'admin_password_weak';
    
    // Obfuscated function using string arrays and transformations
    const _0x1a2b = ['flag', 'secret', 'exposed', 'config', 'api'];
    const _0x3c4d = function(_0x5e6f, _0x7g8h) {
        _0x5e6f = _0x5e6f - 0x0;
        let _0x9i0j = _0x1a2b[_0x5e6f];
        return _0x9i0j;
    };
    
    // Heavily obfuscated function
    window.obfuscatedFunction = function() {
        const _0xa = _0x3c4d('0x0');
        const _0xb = _0x3c4d('0x1');
        const _0xc = _0x3c4d('0x2');
        
        // Exposed configuration
        const config = {
            apiKey: exposedSecret,
            dbPassword: dbPassword,
            debug: true,
            flag: flag
        };
        
        // Logging misconfiguration - should not expose secrets
        console.log('Config loaded:', config);
        console.error('Security Misconfiguration: API key exposed in client code!', exposedSecret);
        console.warn('Database password in frontend:', dbPassword);
        
        return 'Configuration loaded. Check console for details.';
    };
    
    // Display obfuscated code
    document.addEventListener('DOMContentLoaded', function() {
        const obfuscatedCode = document.getElementById('obfuscated-code');
        if (obfuscatedCode) {
            obfuscatedCode.textContent = `const _0x1a2b=['flag','secret','exposed','config','api'];
const _0x3c4d=function(_0x5e6f,_0x7g8h){
    _0x5e6f=_0x5e6f-0x0;
    let _0x9i0j=_0x1a2b[_0x5e6f];
    return _0x9i0j;
};
function obfuscatedFunction(){
    const _0xa=_0x3c4d('0x0');
    const _0xb=_0x3c4d('0x1');
    const _0xc=_0x3c4d('0x2');
    const config={
        apiKey:'${exposedSecret}',
        dbPassword:'${dbPassword}',
        debug:true,
        flag:'${flag}'
    };
    console.log('Config loaded:',config);
    console.error('Security Misconfiguration:',exposedSecret);
    return 'Configuration loaded.';
}`;
        }
        
        // Also expose it in a way that can be discovered
        window.configMisconfiguration = {
            secret: exposedSecret,
            password: dbPassword,
            flag: flag
        };
    });
})();


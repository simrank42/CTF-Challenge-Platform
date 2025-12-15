// Steganography Challenge - Expert level with image LSB steganography
(function() {
    // Flag obfuscated as character code array
    const flagCodes = [67, 84, 70, 123, 72, 49, 100, 100, 51, 110, 95, 49, 110, 95, 80, 108, 52, 49, 110, 95, 83, 49, 103, 104, 116, 125];
    const flag = String.fromCharCode(...flagCodes);
    
    // LSB Steganography: Hide flag in image using least significant bits
    function createImageWithSteganography(text, width = 200, height = 200) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Convert text to binary
        const binaryText = text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join('');
        
        // Add end marker (8 zeros)
        const dataBits = binaryText + '00000000';
        let bitIndex = 0;
        
        // Generate image with hidden data
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // RGB values - create subtle pattern
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            const noise = (x + y) % 256;
            
            // Set RGB with LSB steganography
            if (bitIndex < dataBits.length) {
                const bit = parseInt(dataBits[bitIndex]);
                data[i] = (noise & 0xFE) | bit; // Red channel LSB
                bitIndex++;
            } else {
                data[i] = noise;
            }
            
            if (bitIndex < dataBits.length) {
                const bit = parseInt(dataBits[bitIndex]);
                data[i + 1] = (noise & 0xFE) | bit; // Green channel LSB
                bitIndex++;
            } else {
                data[i + 1] = noise;
            }
            
            if (bitIndex < dataBits.length) {
                const bit = parseInt(dataBits[bitIndex]);
                data[i + 2] = (noise & 0xFE) | bit; // Blue channel LSB
                bitIndex++;
            } else {
                data[i + 2] = noise;
            }
            
            data[i + 3] = 255; // Alpha
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }
    
    // Extract flag from image using LSB
    function extractFromImage(imageData) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        return new Promise((resolve) => {
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                let binaryString = '';
                
                // Extract LSBs from RGB channels
                for (let i = 0; i < data.length; i += 4) {
                    // Extract from Red, Green, Blue channels
                    binaryString += (data[i] & 1).toString();
                    binaryString += (data[i + 1] & 1).toString();
                    binaryString += (data[i + 2] & 1).toString();
                    
                    // Check for end marker (8 consecutive zeros)
                    if (binaryString.length >= 8) {
                        const last8 = binaryString.substring(binaryString.length - 8);
                        if (last8 === '00000000') {
                            break;
                        }
                    }
                }
                
                // Convert binary to text
                let text = '';
                for (let i = 0; i < binaryString.length - 8; i += 8) {
                    const byte = binaryString.substring(i, i + 8);
                    const charCode = parseInt(byte, 2);
                    if (charCode === 0) break;
                    text += String.fromCharCode(charCode);
                }
                
                resolve(text);
            };
            img.src = imageData;
        });
    }
    
    let initialized = false;
    function initChallenge() {
        // Prevent double initialization
        if (initialized) return;
        initialized = true;
        
        const imageContainer = document.getElementById('stego-image-container');
        if (imageContainer) {
            // Generate image with hidden flag
            const imageDataUrl = createImageWithSteganography(flag);
            const img = document.createElement('img');
            img.src = imageDataUrl;
            img.alt = 'Steganography challenge image';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.style.border = '2px solid var(--color-bg-secondary)';
            img.setAttribute('id', 'stego-image');
            imageContainer.appendChild(img);
            
            // Make extraction function available for hints
            window.extractStegoFlag = function() {
                extractFromImage(imageDataUrl).then(extracted => {
                    console.log('Extracted:', extracted);
                    return extracted;
                });
            };
        }
    }
    
    // Single initialization path
    function attemptInit() {
        const imageContainer = document.getElementById('stego-image-container');
        if (imageContainer || document.readyState === 'complete') {
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

# CTF Challenge Solution Guide

This document provides step-by-step solutions for all challenges in the CTF platform.

## Flag Format
All flags follow the format: `CTF{...}`

---

## Challenge 1: Cryptographic Failures

### Flag
```
CTF{Mul7i_L4y3r_3ncryp710n_F41l}
```

### Solution Steps

1. **Examine the Encrypted Message**
   - The encrypted text is displayed in the challenge page
   - Note that it appears to be base64 encoded (typical base64 characters)

2. **Find the Key**
   - Open browser DevTools (F12)
   - Go to the Elements/Inspector tab
   - Look for HTML comments in the `<head>` section
   - Find the comment containing: `Key source base64: d2Vha19zZWNyZXRfMjAyNA==`
   - Decode this base64: `atob('d2Vha19zZWNyZXRfMjAyNA==')` = `weak_secret_2024`
   - The encryption key is the first 16 characters: `weak_secret_2024`

3. **Understand the Encryption Algorithm**
   - The code shows a custom encryption with multiple layers:
     - Layer 1: XOR with key (cyclic)
     - Layer 2: Custom substitution cipher (Caesar +17 for letters, +5 for numbers)
     - Layer 3: String reversal
     - Layer 4: Hex encoding
     - Layer 5: Base64 encoding
     - Layer 6: Add noise padding
     - Layer 7: Final Base64 encoding (double encoding)

4. **Decryption Process** (Reverse the encryption steps)
   ```javascript
   // Step 1: Base64 decode twice
   let decoded = atob(atob(encryptedString).substring(8, encryptedString.length - 8));
   
   // Step 2: Hex decode
   decoded = decoded.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('');
   
   // Step 3: Reverse the string
   decoded = decoded.split('').reverse().join('');
   
   // Step 4: Reverse substitution (Caesar -17 for letters, -5 for numbers)
   decoded = decoded.split('').map(char => {
       if (char >= 'A' && char <= 'Z') {
           return String.fromCharCode(((char.charCodeAt(0) - 65 - 17 + 26) % 26) + 65);
       } else if (char >= 'a' && char <= 'z') {
           return String.fromCharCode(((char.charCodeAt(0) - 97 - 17 + 26) % 26) + 97);
       } else if (char >= '0' && char <= '9') {
           return String.fromCharCode(((char.charCodeAt(0) - 48 - 5 + 10) % 10) + 48);
       }
       return char;
   }).join('');
   
   // Step 5: Reverse XOR with key
   const key = 'weak_secret_2024';
   const flag = decoded.split('').map((char, idx) => {
       const keyChar = key.charCodeAt(idx % key.length);
       return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
   }).join('');
   ```

5. **Submit the Flag**
   - Use the decrypted flag: `CTF{Mul7i_L4y3r_3ncryp710n_F41l}`

---

## Challenge 2: Security Misconfiguration

### Flag
```
CTF{0bfusc4t3d_S3cr3ts_Exp05ed}
```

### Solution Steps

1. **Examine the Obfuscated Code**
   - The challenge displays obfuscated JavaScript code
   - It uses string arrays (`_0x1a2b`, `_0x3c4d`) and computed property names

2. **Execute the Obfuscated Code**
   - Click the "Execute Code" button
   - Or open browser console and run: `obfuscatedFunction()`
   - The function will log a config object

3. **Analyze the Config Object**
   - Open browser DevTools Console
   - Look for the logged config object
   - The config contains properties with computed names:
     - `flagpart1`: First encoded part of the flag
     - `secretpart2`: Second encoded part
     - `exposedpart3`: Third encoded part
   - Also check `checksum` and `signature` which contain combinations

4. **Decode Each Part**
   
   **Part 1 (flagpart1):**
   - It's base64 encoded, then reversed
   - Reverse the string first, then base64 decode
   ```javascript
   const part1 = atob(encodedPart1.split('').reverse().join(''));
   ```

   **Part 2 (secretpart2):**
   - It's hex encoded
   ```javascript
   const part2 = encodedPart2.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('');
   ```

   **Part 3 (exposedpart3):**
   - It's XORed with 0x55, then base64 encoded with '|' separators
   ```javascript
   const part3Base64 = encodedPart3.split('|').map(s => String.fromCharCode(atob(s).charCodeAt(0) ^ 0x55)).join('');
   ```

5. **Reconstruct the Flag**
   - Combine all three parts: `part1 + part2 + part3`
   - Result: `CTF{0bfusc4t3d_S3cr3ts_Exp05ed}`

6. **Alternative: Check HTML Comments**
   - Inspect page source or use DevTools
   - Look for HTML comments containing flag parts
   - Format: `Flag parts: [part1]|[part2]|[part3]`

---

## Challenge 3: Steganography

### Flag
```
CTF{H1dd3n_1n_Pl41n_S1ght}
```

### Solution Steps

1. **Examine the Image**
   - The challenge displays an image generated dynamically
   - The flag is hidden using LSB (Least Significant Bit) steganography

2. **Understand LSB Steganography**
   - Each pixel has RGB values (Red, Green, Blue)
   - Each color channel is 8 bits (0-255)
   - The least significant bit (LSB) of each channel can store data
   - The flag is encoded in binary and stored in LSBs sequentially

3. **Extract the Flag from Image**
   
   **Method 1: Using Browser Console**
   ```javascript
   // The image is in the DOM
   const img = document.getElementById('stego-image');
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   canvas.width = img.width;
   canvas.height = img.height;
   ctx.drawImage(img, 0, 0);
   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
   const data = imageData.data;
   
   let binaryString = '';
   // Extract LSBs from RGB channels sequentially
   for (let i = 0; i < data.length; i += 4) {
       binaryString += (data[i] & 1).toString();     // Red channel LSB
       binaryString += (data[i + 1] & 1).toString(); // Green channel LSB
       binaryString += (data[i + 2] & 1).toString(); // Blue channel LSB
       
       // Check for end marker (8 consecutive zeros)
       if (binaryString.length >= 8) {
           const last8 = binaryString.substring(binaryString.length - 8);
           if (last8 === '00000000') {
               break;
           }
       }
   }
   
   // Convert binary to text
   let flag = '';
   for (let i = 0; i < binaryString.length - 8; i += 8) {
       const byte = binaryString.substring(i, i + 8);
       const charCode = parseInt(byte, 2);
       if (charCode === 0) break;
       flag += String.fromCharCode(charCode);
   }
   console.log(flag);
   ```

   **Method 2: Use Provided Function**
   - Check if `extractStegoFlag()` is available in console
   - Run: `extractStegoFlag()`

4. **Submit the Flag**
   - Use the extracted flag: `CTF{H1dd3n_1n_Pl41n_S1ght}`

---

## Challenge 4: Insecure Design

### Flag
```
CTF{R4c3_C0nd17i0n_Expl01t3d}
```

### Solution Steps

1. **Understand the Vulnerability**
   - The payment system has a race condition
   - Balance check and deduction are separate asynchronous operations
   - Multiple checks can pass before any deduction occurs

2. **Analyze the Code Flow**
   - `makePurchase()` checks balance asynchronously (50-100ms delay)
   - Balance deduction happens after check (100-200ms delay)
   - This creates a vulnerability window

3. **Exploit the Race Condition**
   
   **Method 1: Rapid Button Clicks**
   - Rapidly click the "Purchase Item" button multiple times (10-15 clicks)
   - Multiple checks will pass before any deduction
   - Balance will go negative, triggering flag reveal

   **Method 2: Console Exploit Function**
   ```javascript
   // Use the provided helper function
   exploitRaceCondition();
   
   // Or manually trigger multiple purchases
   for (let i = 0; i < 15; i++) {
       makePurchase();
   }
   ```

   **Method 3: Advanced Exploit**
   ```javascript
   advancedExploit(); // Triggers 15 purchases
   ```

4. **Check for Flag**
   - After exploitation, click "Check Status" button
   - Or wait for automatic flag reveal
   - The flag appears when:
     - Balance goes negative (`balance < 0`), OR
     - Multiple transactions are pending (`pendingTransactions.length > 1`)

5. **Submit the Flag**
   - Use the revealed flag: `CTF{R4c3_C0nd17i0n_Expl01t3d}`

---

## Challenge 5: Logging and Alerting Failures

### Flag
```
CTF{FL03g3d_s3t31ve_4td}
```

### Solution Steps

1. **Open Browser DevTools**
   - Press F12 to open Developer Tools
   - Go to the Console tab
   - Keep Network tab open as well (optional)

2. **Trigger All Actions**
   - Click "Trigger Error" button
   - Click "Make Request" button
   - Click "Debug Mode" button
   - Also check initial page load logs

3. **Collect Encoded Flag Parts**
   
   The flag `CTF{FL03g3d_s3t31ve_4td}` is split into 3 parts (actually 4 array elements but part 3 is empty):
   - Part 0: `CTF{FL03` (first 8 characters)
   - Part 1: `g3d_s3t3` (characters 8-16)
   - Part 2: `1ve_4td}` (characters 16-24)
   - Part 3: Empty string (but still encoded and logged)

   Each part is encoded differently and scattered across logs:

   **Part 0: Base64 Encoded (no padding)**
   - Found in: 
     - Session ID: `sessionData.sessionId` (remove 'sess_' prefix)
     - Response headers `X-Correlation-Id`
     - Build ID: `initData.buildId` (first part before '_')
   - Decode: `atob(encodedString)`
   - Example: Base64 of "CTF{FL03" = "Q1RGe0ZMMDM=" (without padding: "Q1RGe0ZMMDM")

   **Part 1: Hex Encoded**
   - Found in:
     - User ID: `sessionData.userId` (remove 'user_' prefix)
     - Response data hash: `response.data.userData.hash`
     - Error stack analysis hash
   - Decode: 
   ```javascript
   const part1 = hexString.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('');
   ```
   - Example: Hex of "g3d_s3t3" = "6733645f73337433"

   **Part 2: XOR + Hex Encoded**
   - XOR key: 0x42
   - Found in:
     - Request hash: `sessionData.requestHash`
     - Error metadata ref: `errorMeta.ref`
   - Decode:
   ```javascript
   const part2 = hexString.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16) ^ 0x42)).join('');
   ```
   - Example: "1ve_4td}" XOR 0x42 then hex encoded

   **Part 3: Custom Encoding (base36)**
   - Found in:
     - Correlation ID: `sessionData.correlationId`
     - Request headers `X-Correlation-Id`
   - This uses custom encoding: (charCode + 13).toString(36)
   - Since part 3 is empty string, this will be empty too

4. **Locate Specific Log Entries**
   
   After triggering all actions, search console logs for:
   - Session initialization logs (page load)
   - Error logs (from Trigger Error)
   - Request/Response logs (from Make Request)
   - Debug mode logs (from Debug Mode)

   Key locations (from code analysis):
   - `Session ID: sess_[encoded]` → Part 0 (Base64, remove 'sess_' prefix)
   - `User ID: user_[encoded]` → Part 1 (Hex, remove 'user_' prefix)
   - `Request hash: [encoded]` → Part 2 (XOR+Hex)
   - `Error context requestId: req_[encoded]` → Part 0 (Base64, remove 'req_' prefix)
   - `Stack analysis hash: [encoded]` → Part 1 (Hex)
   - `Error metadata ref: [encoded]` → Part 2 (XOR+Hex)
   - Request headers `X-Correlation-Id` → Part 3 (base36, empty string)
   - Response headers `X-Correlation-Id` → Part 0 (Base64)
   - Response data hash: `response.data.userData.hash` → Part 1 (Hex)
   - Build ID: `initData.buildId` → Part 0 + '_' + Part 1 (split on '_')

5. **Decode and Combine**
   
   Once you have all 3 encoded parts (from session initialization or triggered actions):
   ```javascript
   // Part 0: Base64 decode
   const part0 = atob(encodedPart0); // "CTF{FL03"
   
   // Part 1: Hex decode
   const part1 = encodedPart1.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join(''); // "g3d_s3t3"
   
   // Part 2: Hex decode then XOR (key 0x42)
   const part2 = encodedPart2.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16) ^ 0x42)).join(''); // "1ve_4td}"
   
   // Combine all parts
   const flag = part0 + part1 + part2; // "CTF{FL03g3d_s3t31ve_4td}"
   ```
   
   **Note:** Part 3 is empty in the actual flag, so you only need parts 0, 1, and 2.

6. **Alternative: Analyze Encoded Strings Directly**
   - Look for patterns in logs
   - The flag parts appear as:
     - Session identifiers
     - Request/Correlation IDs
     - Error references
     - Hash values

7. **Submit the Flag**
   - Use the reconstructed flag: `CTF{FL03g3d_s3t31ve_4td}`

---

## Quick Reference: All Flags

```
Challenge 1 (Cryptographic Failures):    CTF{Mul7i_L4y3r_3ncryp710n_F41l}
Challenge 2 (Security Misconfiguration): CTF{0bfusc4t3d_S3cr3ts_Exp05ed}
Challenge 3 (Steganography):             CTF{H1dd3n_1n_Pl41n_S1ght}
Challenge 4 (Insecure Design):           CTF{R4c3_C0nd17i0n_Expl01t3d}
Challenge 5 (Logging Failures):          CTF{FL03g3d_s3t31ve_4td}
```

---

## Tools and Techniques Used

### Browser DevTools
- **Elements/Inspector**: View HTML source, comments, attributes
- **Console**: Execute JavaScript, view logs, debug code
- **Network**: Monitor requests/responses (less critical for these challenges)
- **Sources**: View JavaScript source code

### Common Encoding/Decoding
- **Base64**: `btoa()` encode, `atob()` decode
- **Hex**: `parseInt(hex, 16)` to number, `number.toString(16)` to hex
- **XOR**: `charCode ^ key`
- **Binary**: `parseInt(binary, 2)` to number, `number.toString(2)` to binary

### Useful JavaScript Snippets
```javascript
// Base64 decode
atob('encoded_string')

// Hex to ASCII
hexString.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('')

// ASCII to Hex
text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')

// Binary to ASCII
binaryString.match(/.{8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('')

// XOR cipher
text.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('')
```

---

## Notes for CTF Organizers

- This solution guide should be kept separate from the main repository
- Consider password-protecting this file or storing it in a private location
- Flags are obfuscated in the codebase but can be reconstructed using these methods
- All challenges are designed to be solvable using only browser DevTools
- No external tools are required, though they can make some steps easier


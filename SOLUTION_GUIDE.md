# CTF Challenge Solution Guide

This document provides simple, tool-based solutions for all challenges.

## Flag Format
All flags follow the format: `CTF{...}`

---

## Challenge 1: Cryptographic Failures

### Flag
```
CTF{Mul7i_L4y3r_3ncryp710n_F41l}
```

### Simple Solution

1. **Find the Key**
   - Open DevTools (F12) → Elements tab
   - View page source or inspect `<head>` section
   - Find HTML comment: `Key source base64: d2Vha19zZWNyZXRfMjAyNA==`
   - **Tool**: Use [base64decode.org](https://www.base64decode.org/) or browser console: `atob('d2Vha19zZWNyZXRfMjAyNA==')`
   - Result: `weak_secret_2024` (use first 16 chars as key)

2. **Decrypt the Message**
   - Copy the encrypted text from the page
   - **Tool**: Use [CyberChef](https://gchq.github.io/CyberChef/) with this recipe:
     - From Base64 (twice)
     - Remove padding (first 8 and last 8 chars)
     - From Hex
     - Reverse string
     - ROT13 (or Caesar -17 for letters, -5 for numbers)
     - XOR with key `weak_secret_2024`

3. **Quick Browser Method**
   ```javascript
   // In console, after finding key:
   const key = 'weak_secret_2024';
   const encrypted = 'PASTE_ENCRYPTED_TEXT_HERE';
   // Then reverse all encryption steps (see code for exact algorithm)
   ```

---

## Challenge 2: Security Misconfiguration

### Flag
```
CTF{0bfusc4t3d_S3cr3ts_Exp05ed}
```

### Simple Solution

1. **Execute the Obfuscated Code**
   - Click "Execute Code" button OR
   - Open console and run: `obfuscatedFunction()`

2. **Find Flag Parts in Console**
   - Look for the logged `config` object
   - Find properties: `flagpart1`, `secretpart2`, `exposedpart3`

3. **Decode Each Part**
   - **Part 1**: Reverse string, then Base64 decode
     - **Tool**: [CyberChef](https://gchq.github.io/CyberChef/) → Reverse → From Base64
   - **Part 2**: Hex to ASCII
     - **Tool**: [rapidtables.com/convert/number/hex-to-ascii.html](https://www.rapidtables.com/convert/number/hex-to-ascii.html)
   - **Part 3**: Split by `|`, Base64 decode each, XOR with 0x55
     - **Tool**: CyberChef → Split by `|` → From Base64 → XOR (key: 0x55)

4. **Alternative: Check HTML Comments**
   - View page source
   - Search for comment: `Flag parts: [part1]|[part2]|[part3]`

---

## Challenge 3: Steganography

### Flag
```
CTF{H1dd3n_1n_Pl41n_S1ght}
```

### Simple Solution

1. **Use Browser Console**
   - Open DevTools Console (F12)
   - Run: `extractStegoFlag()`
   - Flag will be logged to console

2. **Manual Extraction (if function not available)**
   ```javascript
   const img = document.getElementById('stego-image');
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   canvas.width = img.width;
   canvas.height = img.height;
   ctx.drawImage(img, 0, 0);
   const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
   
   let binary = '';
   for (let i = 0; i < data.length; i += 4) {
       binary += (data[i] & 1) + (data[i+1] & 1) + (data[i+2] & 1);
   }
   // Convert binary to text (8 bits per char, stop at 00000000)
   ```

3. **Tool Alternative**
   - Download the image
   - Use [StegOnline](https://stegonline.georgeom.net/) or similar LSB steganography tool
   - Extract LSB from RGB channels

---

## Challenge 4: Insecure Design

### Flag
```
CTF{R4c3_C0nd17i0n_Expl01t3d}
```

### Simple Solution

1. **Exploit the Race Condition**
   - **Method 1**: Rapidly click "Purchase Item" button 10-15 times quickly
   - **Method 2**: Open console and run:
     ```javascript
     exploitRaceCondition();
     ```
   - **Method 3**: Run:
     ```javascript
     for(let i=0; i<20; i++) makePurchase();
     ```

2. **Check for Flag**
   - Click "Check Status" button
   - Flag appears when balance goes negative or multiple transactions process

3. **Why It Works**
   - Balance check (30-70ms delay) and deduction (80-160ms delay) are separate
   - Multiple checks can pass before any deduction occurs
   - This creates a race condition window

---

## Challenge 5: Logging and Alerting Failures

### Flag
```
CTF{FL03g3d_s3t31ve_4td}
```

### Simple Solution

1. **Open Console and Trigger Actions**
   - Press F12 → Console tab
   - Click all buttons: "Trigger Error", "Make Request", "Debug Mode"
   - Check initial page load logs

2. **Find Encoded Flag Parts**
   Look for these in console logs:
   - **Part 0** (Base64): `Session ID: sess_[encoded]` or `X-Correlation-Id` in response headers
   - **Part 1** (Hex): `User ID: user_[encoded]` or `response.data.userData.hash`
   - **Part 2** (XOR+Hex): `Request hash: [encoded]` or `Error metadata ref: [encoded]`

3. **Decode Using Tools**
   - **Part 0**: [base64decode.org](https://www.base64decode.org/)
   - **Part 1**: [rapidtables.com/convert/number/hex-to-ascii.html](https://www.rapidtables.com/convert/number/hex-to-ascii.html)
   - **Part 2**: Hex decode first, then XOR with 0x42
     - **Tool**: CyberChef → From Hex → XOR (key: 0x42)

4. **Combine Parts**
   - Simply concatenate: `part0 + part1 + part2`
   - Result: `CTF{FL03g3d_s3t31ve_4td}`

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

## Recommended Tools

### Online Tools (No Installation Required)
- **[CyberChef](https://gchq.github.io/CyberChef/)** - Swiss Army knife for encoding/decoding
- **[base64decode.org](https://www.base64decode.org/)** - Quick Base64 decode
- **[rapidtables.com](https://www.rapidtables.com/convert/number/hex-to-ascii.html)** - Hex to ASCII converter
- **[StegOnline](https://stegonline.georgeom.net/)** - LSB steganography extractor

### Browser Built-in Tools
- **DevTools Console** - Run JavaScript, view logs
- **Elements/Inspector** - View HTML source, comments
- **Network Tab** - Monitor requests (optional)

### Quick JavaScript Snippets
```javascript
// Base64 decode
atob('encoded_string')

// Hex to text
hexString.match(/.{2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('')

// XOR cipher
text.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('')
```

---

## Presentation Tips

1. **For Live Demos**: Use CyberChef for visual encoding/decoding steps
2. **For Workshops**: Show browser DevTools as the primary tool
3. **For Documentation**: Link to online tools rather than showing code
4. **Quick Solutions**: Most challenges can be solved with 2-3 tool operations

---

## Notes for CTF Organizers

- All challenges solvable with browser DevTools + online tools
- No external software installation required
- Solutions are designed to be teachable in 5-10 minutes each
- Flags are intentionally obfuscated but recoverable with proper tools

# Frontend CTF Challenge Platform

A frontend-only Capture The Flag (CTF) platform with 5 medium-to-high difficulty challenges based on OWASP vulnerability categories. Built with vanilla HTML, CSS, and JavaScript - perfect for GitHub Pages hosting.

## Features

- **5 OWASP-Based Challenges**: Each challenge focuses on a specific security vulnerability category
- **Modern Security Dashboard Theme**: Dark blue theme with professional styling
- **Progress Tracking**: LocalStorage-based progress tracking with score system
- **Hint System**: Limited hints (1-2 per challenge) for medium-high difficulty
- **No Backend Required**: Fully frontend-only, works entirely in the browser
- **GitHub Pages Ready**: Static file structure for easy deployment

## Challenges

1. **Cryptographic Failures** - Multi-layer encoding challenge with weak key derivation
2. **Security Misconfiguration** - JavaScript obfuscation revealing exposed secrets
3. **Steganography** - Hidden data using zero-width characters and CSS
4. **Insecure Design** - Race condition and business logic vulnerabilities
5. **Logging and Alerting Failures** - Sensitive data exposed through console logs

## File Structure

```
/
├── index.html              # Main landing page with challenge gallery
├── challenges/
│   ├── cryptographic-failures.html
│   ├── security-misconfiguration.html
│   ├── steganography.html
│   ├── insecure-design.html
│   └── logging-failures.html
├── css/
│   └── styles.css          # Modern Security Dashboard theme
├── js/
│   ├── app.js              # Main application logic and routing
│   ├── flag-validator.js   # Flag validation system
│   ├── progress.js         # Progress tracking with localStorage
│   └── challenges/
│       ├── cryptographic-failures.js
│       ├── security-misconfiguration.js
│       ├── steganography.js
│       ├── insecure-design.js
│       └── logging-failures.js
└── README.md
```

## Deployment to GitHub Pages

### Method 1: Using GitHub Web Interface

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to **Settings** → **Pages**
4. Under **Source**, select the branch containing your files (usually `main` or `master`)
5. Select `/ (root)` as the folder
6. Click **Save**
7. Your site will be available at `https://[username].github.io/[repository-name]`

### Method 2: Using Git Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: CTF Challenge Platform"

# Add remote repository (replace with your repository URL)
git remote add origin https://github.com/[username]/[repository-name].git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then follow steps 3-7 from Method 1.

### Method 3: Using GitHub CLI

```bash
gh repo create [repository-name] --public
git init
git add .
git commit -m "Initial commit: CTF Challenge Platform"
git branch -M main
git remote add origin https://github.com/[username]/[repository-name].git
git push -u origin main
```

## Local Development

Simply open `index.html` in a web browser or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## How to Solve Challenges

Each challenge is designed with medium-to-high difficulty:

1. **Read the challenge description carefully**
2. **Use browser DevTools** (F12) - Console, Network, Sources tabs are essential
3. **Inspect page source** - Look for comments, hidden data, or exposed secrets
4. **Try the hints** - Each challenge has 1-2 hints if you get stuck
5. **Think about the OWASP category** - Understanding the vulnerability type helps

### Challenge-Specific Tips

- **Cryptographic Failures**: Look for exposed keys in source code. Decode layers in reverse order.
- **Security Misconfiguration**: Execute obfuscated code in console. Check what it logs.
- **Steganography**: Inspect HTML source and CSS. Look for zero-width characters.
- **Insecure Design**: Exploit race conditions by making rapid requests.
- **Logging Failures**: Check console logs, error messages, and debug output.

## Flag Format

All flags follow the format: `CTF{...}`

## Progress System

- Progress is stored in browser's localStorage
- You can reset progress using the "Reset Progress" button
- Each completed challenge awards points
- Progress persists across browser sessions

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with JavaScript enabled

## Customization

To modify flags, edit the `flags` object in `js/flag-validator.js`. The system uses hash-based validation, so hashes will be automatically computed.

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to fork this project and create your own challenges or improve the existing ones!


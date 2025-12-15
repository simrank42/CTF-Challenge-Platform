// Main application logic and routing
const App = {
    challenges: [
        {
            id: 'cryptographic-failures',
            title: 'Cryptographic Failures',
            category: 'CRYPTOGRAPHIC FAILURES',
            description: 'Decrypt the multi-layered encoding to find the flag.',
            points: 100,
            icon: '🔐'
        },
        {
            id: 'security-misconfiguration',
            title: 'Security Misconfiguration',
            category: 'SECURITY MISCONFIGURATION',
            description: 'Deobfuscate the JavaScript code to reveal hidden secrets.',
            points: 100,
            icon: '⚙️'
        },
        {
            id: 'steganography',
            title: 'Steganography',
            category: 'STEGANOGRAPHY',
            description: 'Find the hidden flag using steganography techniques.',
            points: 100,
            icon: '🖼️'
        },
        {
            id: 'insecure-design',
            title: 'Insecure Design',
            category: 'INSECURE DESIGN',
            description: 'Exploit the flawed business logic to reveal the flag.',
            points: 100,
            icon: '⚠️'
        },
        {
            id: 'logging-failures',
            title: 'Logging and Alerting Failures',
            category: 'LOGGING AND ALERTING FAILURES',
            description: 'Extract sensitive information from logs and error messages.',
            points: 100,
            icon: '📋'
        }
    ],
    
    init() {
        this.renderChallengeGallery();
        this.setupEventListeners();
        this.updateProgress();
        this.handleRouting();
    },
    
    setupEventListeners() {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all progress?')) {
                    ProgressManager.reset();
                    this.updateProgress();
                    this.renderChallengeGallery();
                }
            });
        }
        
        // Handle back navigation
        window.addEventListener('hashchange', () => {
            this.handleRouting();
        });
    },
    
    handleRouting() {
        const hash = window.location.hash.substring(1);
        if (hash && this.challenges.find(c => c.id === hash)) {
            this.showChallenge(hash);
        } else {
            this.showGallery();
        }
    },
    
    showGallery() {
        const container = document.getElementById('challenges-container');
        const challengeView = document.getElementById('challenge-view');
        if (container && challengeView) {
            container.classList.remove('hidden');
            challengeView.classList.add('hidden');
            window.location.hash = '';
        }
    },
    
    showChallenge(challengeId) {
        const container = document.getElementById('challenges-container');
        const challengeView = document.getElementById('challenge-view');
        if (container && challengeView) {
            container.classList.add('hidden');
            challengeView.classList.remove('hidden');
            this.renderChallenge(challengeId);
        }
    },
    
    renderChallengeGallery() {
        const container = document.getElementById('challenges-container');
        if (!container) return;
        
        container.innerHTML = this.challenges.map(challenge => {
            const isCompleted = ProgressManager.isCompleted(challenge.id);
            const attempts = ProgressManager.getAttempts(challenge.id);
            
            return `
                <div class="challenge-card ${isCompleted ? 'completed' : ''}" data-challenge-id="${challenge.id}">
                    <div class="challenge-header">
                        <span class="challenge-icon">${challenge.icon}</span>
                        <div class="challenge-title-section">
                            <h2>${challenge.title}</h2>
                            <span class="challenge-category">${challenge.category}</span>
                        </div>
                        ${isCompleted ? '<span class="badge-completed">✓ Completed</span>' : ''}
                    </div>
                    <p class="challenge-description">${challenge.description}</p>
                    <div class="challenge-footer">
                        <span class="points-badge">${challenge.points} pts</span>
                        ${attempts > 0 ? `<span class="attempts-badge">${attempts} attempt${attempts > 1 ? 's' : ''}</span>` : ''}
                    </div>
                    <button class="btn-challenge" onclick="App.showChallenge('${challenge.id}')">
                        ${isCompleted ? 'View Challenge' : 'Start Challenge'}
                    </button>
                </div>
            `;
        }).join('');
    },
    
    renderChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) {
            console.error('Challenge not found:', challengeId);
            return;
        }
        
        const container = document.getElementById('challenge-view');
        if (!container) {
            console.error('Challenge view container not found');
            return;
        }
        
        // Escape HTML to prevent XSS (though challenge data is trusted)
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        container.innerHTML = `
            <div class="challenge-page">
                <button class="btn-back" onclick="App.showGallery()">← Back to Challenges</button>
                <div class="challenge-page-header">
                    <h1>${escapeHtml(challenge.icon)} ${escapeHtml(challenge.title)}</h1>
                    <span class="challenge-category">${escapeHtml(challenge.category)}</span>
                </div>
                <div id="challenge-content">
                    <!-- Challenge content will be loaded by individual challenge files -->
                </div>
            </div>
        `;
        
        // Load challenge-specific content
        this.loadChallengeContent(challengeId);
    },
    
    loadChallengeContent(challengeId) {
        const contentDiv = document.getElementById('challenge-content');
        if (!contentDiv) {
            console.error('Challenge content container not found');
            return;
        }
        
        // Load challenge-specific HTML based on ID
        fetch(`challenges/${challengeId}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                if (contentDiv) {
                    contentDiv.innerHTML = html;
                    this.initializeChallenge(challengeId);
                }
            })
            .catch(err => {
                console.error('Error loading challenge:', err);
                if (contentDiv) {
                    contentDiv.innerHTML = '<div class="flag-message error">Error loading challenge content. Please try again or refresh the page.</div>';
                }
            });
    },
    
    initializeChallenge(challengeId) {
        // Initialize challenge-specific JavaScript
        const submitBtn = document.getElementById('submit-flag-btn');
        const flagInput = document.getElementById('flag-input');
        
        // Reset flag input state (re-enable if disabled)
        if (flagInput) {
            flagInput.disabled = false;
            flagInput.value = '';
        }
        
        if (submitBtn && flagInput) {
            submitBtn.addEventListener('click', () => {
                this.submitFlag(challengeId);
            });
            
            flagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitFlag(challengeId);
                }
            });
        }
        
        // Remove old challenge scripts to prevent memory leak
        const existingScripts = document.querySelectorAll('script[data-challenge-script]');
        existingScripts.forEach(script => script.remove());
        
        // Load challenge-specific JS if it exists
        const script = document.createElement('script');
        script.src = `js/challenges/${challengeId}.js`;
        script.setAttribute('data-challenge-script', challengeId);
        script.onerror = () => {
            console.error(`Failed to load challenge script: ${challengeId}.js`);
            const contentDiv = document.getElementById('challenge-content');
            if (contentDiv) {
                const errorMsg = contentDiv.querySelector('.error-message');
                if (!errorMsg) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'flag-message error error-message';
                    errorDiv.textContent = 'Error loading challenge script. Please refresh the page.';
                    contentDiv.insertBefore(errorDiv, contentDiv.firstChild);
                }
            }
        };
        script.onload = () => {
            // After script loads, trigger initialization
            // Each challenge JS defines an init function: init + PascalCase of challenge ID
            const initFuncName = 'init' + challengeId.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join('');
            
            // Give it a moment for the script to fully execute
            setTimeout(() => {
                if (window[initFuncName] && typeof window[initFuncName] === 'function') {
                    window[initFuncName]();
                }
            }, 100);
        };
        document.body.appendChild(script);
    },
    
    submitFlag(challengeId) {
        const flagInput = document.getElementById('flag-input');
        const resultDiv = document.getElementById('flag-result');
        
        if (!flagInput || !resultDiv) return;
        
        const submittedFlag = flagInput.value.trim();
        if (!submittedFlag) {
            resultDiv.innerHTML = '<div class="flag-message error">Please enter a flag.</div>';
            resultDiv.classList.remove('hidden');
            return;
        }
        
        ProgressManager.incrementAttempts(challengeId);
        const validation = FlagValidator.validate(challengeId, submittedFlag);
        
        if (validation.valid) {
            resultDiv.innerHTML = `<div class="flag-message success">${validation.message}</div>`;
            ProgressManager.completeChallenge(challengeId, this.challenges.find(c => c.id === challengeId).points);
            this.updateProgress();
            flagInput.disabled = true;
            
            // Update UI after a delay
            setTimeout(() => {
                this.renderChallengeGallery();
            }, 1000);
        } else {
            resultDiv.innerHTML = `<div class="flag-message error">${validation.message}</div>`;
        }
        
        resultDiv.classList.remove('hidden');
    },
    
    updateProgress() {
        const stats = ProgressManager.getStats();
        const completedEl = document.getElementById('completed-count');
        const scoreEl = document.getElementById('total-score');
        
        if (completedEl) completedEl.textContent = stats.completed;
        if (scoreEl) scoreEl.textContent = stats.score;
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Make App available globally for onclick handlers
window.App = App;

// Global hint toggle function (works after HTML injection)
window.toggleHint = function(hintId) {
    const hint = document.getElementById(hintId);
    const arrow = document.getElementById(hintId + '-arrow');
    if (hint && arrow) {
        hint.classList.toggle('hidden');
        arrow.textContent = hint.classList.contains('hidden') ? '▼' : '▲';
    }
};


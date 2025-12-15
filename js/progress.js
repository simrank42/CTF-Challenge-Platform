// Progress tracking using localStorage
const ProgressManager = {
    STORAGE_KEY: 'ctf_progress',
    
    init() {
        try {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.reset();
            }
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    },
    
    getProgress() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                return this.getDefaultProgress();
            }
            
            const parsed = JSON.parse(data);
            
            // Validate structure
            if (typeof parsed !== 'object' || parsed === null) {
                console.warn('Invalid progress data structure, resetting');
                this.reset();
                return this.getDefaultProgress();
            }
            
            // Ensure required fields exist with correct types
            const progress = {
                completed: Array.isArray(parsed.completed) ? parsed.completed : [],
                score: typeof parsed.score === 'number' ? parsed.score : 0,
                attempts: typeof parsed.attempts === 'object' && parsed.attempts !== null ? parsed.attempts : {},
                timestamps: typeof parsed.timestamps === 'object' && parsed.timestamps !== null ? parsed.timestamps : {}
            };
            
            // Ensure completed is array of strings
            progress.completed = progress.completed.filter(id => typeof id === 'string');
            
            // Ensure score is non-negative
            progress.score = Math.max(0, progress.score);
            
            return progress;
        } catch (e) {
            console.error('Error reading progress:', e);
            this.reset();
            return this.getDefaultProgress();
        }
    },
    
    getDefaultProgress() {
        return {
            completed: [],
            score: 0,
            attempts: {},
            timestamps: {}
        };
    },
    
    saveProgress(progress) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded. Progress not saved.');
                alert('Storage quota exceeded. Progress may not be saved. Please free up space.');
            } else {
                console.error('Error saving progress:', e);
            }
        }
    },
    
    isCompleted(challengeId) {
        const progress = this.getProgress();
        return progress.completed.includes(challengeId);
    },
    
    completeChallenge(challengeId, points) {
        const progress = this.getProgress();
        if (!progress.completed.includes(challengeId)) {
            progress.completed.push(challengeId);
            progress.score += points;
            progress.timestamps[challengeId] = new Date().toISOString();
        }
        this.saveProgress(progress);
    },
    
    incrementAttempts(challengeId) {
        const progress = this.getProgress();
        if (!progress.attempts[challengeId]) {
            progress.attempts[challengeId] = 0;
        }
        progress.attempts[challengeId]++;
        this.saveProgress(progress);
        return progress.attempts[challengeId];
    },
    
    getAttempts(challengeId) {
        const progress = this.getProgress();
        return progress.attempts[challengeId] || 0;
    },
    
    reset() {
        const defaultProgress = this.getDefaultProgress();
        this.saveProgress(defaultProgress);
    },
    
    getStats() {
        const progress = this.getProgress();
        return {
            completed: progress.completed.length,
            score: progress.score,
            total: 5
        };
    }
};

// Initialize on load
ProgressManager.init();


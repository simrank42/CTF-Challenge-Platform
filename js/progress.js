// Progress tracking using localStorage
const ProgressManager = {
    STORAGE_KEY: 'ctf_progress',
    
    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.reset();
        }
    },
    
    getProgress() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : {
            completed: [],
            score: 0,
            attempts: {},
            timestamps: {}
        };
    },
    
    saveProgress(progress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
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
        const defaultProgress = {
            completed: [],
            score: 0,
            attempts: {},
            timestamps: {}
        };
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


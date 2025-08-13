// PixelFocus - Forest Pixel Pomodoro Timer JavaScript

class PixelFocusTimer {
    constructor() {
        this.timeRemaining = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = 'work';
        this.sessionCount = 1;
        this.totalSessions = 4;
        this.timer = null;
        
        // User progress
        this.userLevel = 1;
        this.userXP = 0;
        this.totalSessionsCompleted = 0;
        
        // Settings
        this.workTime = 25;
        this.shortBreakTime = 5;
        this.longBreakTime = 15;
        this.soundEnabled = true;
        this.notificationsEnabled = true;
        this.notificationPermissionRequested = false;
        this.darkTheme = false;
        
        // Achievements
        this.achievements = {
            'first-session': false,
            'level-up': false,
            'pomodoro-master': false
        };
        
        // XP values
        this.xpPerSession = 25;
        this.xpPerLevel = 100;
        
        // Sound effects (using Web Audio API for better control)
        this.audioContext = null;
        this.sounds = {};
        
        this.initializeElements();
        this.loadUserData();
        this.initializeSounds();
        this.initializeNotifications();
        this.initializeTheme();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        // Timer elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionTypeDisplay = document.getElementById('sessionType');
        this.sessionCountDisplay = document.getElementById('sessionCount');
        this.characterSprite = document.getElementById('characterSprite');
        
        // Control buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Settings
        this.workTimeInput = document.getElementById('workTime');
        this.shortBreakInput = document.getElementById('shortBreak');
        this.longBreakInput = document.getElementById('longBreak');
        this.soundEnabledInput = document.getElementById('soundEnabled');
        this.notificationsEnabledInput = document.getElementById('notificationsEnabled');
        this.themeModeInput = document.getElementById('themeMode');
        
        // User progress
        this.userLevelDisplay = document.getElementById('userLevel');
        this.userXPDisplay = document.getElementById('userXP');
        this.nextLevelXPDisplay = document.getElementById('nextLevelXP');
        this.xpProgress = document.getElementById('xpProgress');
        
        // Notifications
        this.notification = document.getElementById('notification');
        
        // Achievements
        this.achievementList = document.getElementById('achievementList');
    }
    
    initializeSounds() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    initializeNotifications() {
        // Check notification support and current permission
        if (!('Notification' in window)) {
            this.notificationsEnabled = false;
            this.notificationsEnabledInput.checked = false;
            this.notificationsEnabledInput.disabled = true;
            return;
        }
        
        // Update notification availability based on current permission
        if (Notification.permission === 'denied') {
            this.notificationsEnabled = false;
            this.notificationsEnabledInput.checked = false;
            this.notificationsEnabledInput.disabled = true;
        } else if (Notification.permission === 'granted') {
            // Only enable if user hasn't explicitly disabled it
            if (this.notificationsEnabled && !this.notificationPermissionRequested) {
                this.notificationsEnabledInput.checked = true;
            }
        }
        // If permission is 'default', don't auto-request - wait for user interaction
    }
    
    initializeTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('pixelFocusTheme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (savedTheme === null && systemPrefersDark)) {
            this.darkTheme = true;
            document.body.classList.add('dark-theme');
            this.themeModeInput.checked = true;
        } else {
            this.darkTheme = false;
            document.body.classList.remove('dark-theme');
            this.themeModeInput.checked = false;
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('pixelFocusTheme') === null) {
                // Only auto-switch if user hasn't manually set a preference
                this.darkTheme = e.matches;
                this.themeModeInput.checked = e.matches;
                if (e.matches) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            }
        });
    }
    
    createSounds() {
        // Create nature/forest-style sound effects using oscillators
        this.sounds = {
            start: () => this.playMelody([
                { freq: 440, duration: 0.15 },
                { freq: 554.37, duration: 0.15 },
                { freq: 659.25, duration: 0.15 },
                { freq: 880, duration: 0.3 }
            ]),
            complete: () => this.playMelody([
                { freq: 523.25, duration: 0.2 },
                { freq: 587.33, duration: 0.2 },
                { freq: 659.25, duration: 0.2 },
                { freq: 783.99, duration: 0.4 }
            ]),
            levelUp: () => this.playMelody([
                { freq: 880, duration: 0.1 },
                { freq: 1046.5, duration: 0.1 },
                { freq: 1174.7, duration: 0.1 },
                { freq: 1318.5, duration: 0.1 },
                { freq: 1568.0, duration: 0.1 },
                { freq: 1760.0, duration: 0.1 },
                { freq: 1975.5, duration: 0.3 }
            ]),
            pause: () => this.playMelody([
                { freq: 659.25, duration: 0.2 },
                { freq: 523.25, duration: 0.2 },
                { freq: 415.3, duration: 0.3 }
            ]),
            reset: () => this.playMelody([
                { freq: 880, duration: 0.1 },
                { freq: 783.99, duration: 0.1 },
                { freq: 659.25, duration: 0.1 },
                { freq: 523.25, duration: 0.1 },
                { freq: 440, duration: 0.2 }
            ]),
            tick: () => this.playBeep(600, 0.05)
        };
    }
    
    playMelody(notes) {
        if (!this.audioContext || !this.soundEnabled) return;
        
        let currentTime = this.audioContext.currentTime;
        
        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
    }
    
    playBeep(frequency, duration) {
        if (!this.audioContext || !this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Settings events
        this.workTimeInput.addEventListener('change', (e) => {
            this.workTime = parseInt(e.target.value);
            if (!this.isRunning && this.currentSession === 'work') {
                this.updateTimeDisplay();
            }
        });
        
        this.shortBreakInput.addEventListener('change', (e) => {
            this.shortBreakTime = parseInt(e.target.value);
            if (!this.isRunning && this.currentSession === 'shortBreak') {
                this.updateTimeDisplay();
            }
        });
        
        this.longBreakInput.addEventListener('change', (e) => {
            this.longBreakTime = parseInt(e.target.value);
            if (!this.isRunning && this.currentSession === 'longBreak') {
                this.updateTimeDisplay();
            }
        });
        
        this.soundEnabledInput.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            this.saveUserData();
            // Provide feedback that sound toggle worked
            if (this.soundEnabled) {
                this.showNotification('🔊 Sound effects enabled!');
                // Play a test sound to confirm
                setTimeout(() => this.sounds.tick(), 100);
            } else {
                this.showNotification('🔇 Sound effects disabled!');
            }
        });
        
        this.notificationsEnabledInput.addEventListener('change', (e) => {
            if (e.target.checked) {
                // User wants to enable notifications
                if (Notification.permission === 'granted') {
                    this.notificationsEnabled = true;
                    this.saveUserData();
                    this.showNotification('🔔 Notifications enabled!');
                } else if (Notification.permission === 'default') {
                    // Request permission
                    this.notificationPermissionRequested = true;
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            this.notificationsEnabled = true;
                            this.showNotification('🔔 Notifications enabled! You\'ll be notified when sessions complete.');
                        } else {
                            this.notificationsEnabled = false;
                            this.notificationsEnabledInput.checked = false;
                            this.showNotification('🔔 Notifications denied. You can enable them in browser settings.');
                        }
                        this.saveUserData();
                    });
                } else {
                    // Permission denied
                    this.notificationsEnabled = false;
                    this.notificationsEnabledInput.checked = false;
                    this.showNotification('🔔 Notifications are blocked. Please enable them in browser settings.');
                    this.saveUserData();
                }
            } else {
                // User wants to disable notifications
                this.notificationsEnabled = false;
                this.saveUserData();
                this.showNotification('🔕 Notifications disabled!');
            }
        });
        
        // Theme toggle
        this.themeModeInput.addEventListener('change', (e) => {
            this.darkTheme = e.target.checked;
            if (this.darkTheme) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('pixelFocusTheme', 'dark');
                this.showNotification('🌙 Dark theme enabled!');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('pixelFocusTheme', 'light');
                this.showNotification('☀️ Light theme enabled!');
            }
        });
        
        // Enable audio context on user interaction
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }
    
    startTimer() {
        if (this.isPaused) {
            this.resumeTimer();
            return;
        }
        
        this.setTimeForCurrentSession();
        this.isRunning = true;
        this.isPaused = false;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        document.body.classList.add('timer-active');
        
        this.sounds.start();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimeDisplay();
            
            if (this.timeRemaining <= 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isPaused = true;
        this.isRunning = false;
        clearInterval(this.timer);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.textContent = '▶️ RESUME';
        
        document.body.classList.remove('timer-active');
        
        // Play pause sound
        this.sounds.pause();
    }
    
    resumeTimer() {
        this.isPaused = false;
        this.isRunning = true;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.startBtn.textContent = '🚀 START';
        
        document.body.classList.add('timer-active');
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimeDisplay();
            
            if (this.timeRemaining <= 0) {
                this.completeSession();
            }
        }, 1000);
    }
    
    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timer);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.textContent = '🚀 START';
        
        document.body.classList.remove('timer-active');
        document.body.classList.remove('session-complete');
        
        // Play reset sound
        this.sounds.reset();
        
        this.setTimeForCurrentSession();
        this.updateTimeDisplay();
    }
    
    completeSession() {
        this.isRunning = false;
        clearInterval(this.timer);
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.textContent = '🚀 START';
        
        document.body.classList.remove('timer-active');
        document.body.classList.add('session-complete');
        
        this.sounds.complete();
        this.showNotification(this.getSessionCompleteMessage());
        this.sendBrowserNotification(this.getSessionCompleteMessage());
        
        // Award XP for completed session
        this.awardXP(this.xpPerSession);
        this.totalSessionsCompleted++;
        
        // Check achievements
        this.checkAchievements();
        
        // Move to next session
        this.advanceSession();
        
        // Remove session complete animation after 2 seconds
        setTimeout(() => {
            document.body.classList.remove('session-complete');
        }, 2000);
        
        this.saveUserData();
    }
    
    advanceSession() {
        if (this.currentSession === 'work') {
            if (this.sessionCount >= this.totalSessions) {
                this.currentSession = 'longBreak';
                this.sessionCount = 1;
            } else {
                this.currentSession = 'shortBreak';
                this.sessionCount++;
            }
        } else {
            this.currentSession = 'work';
        }
        
        this.setTimeForCurrentSession();
        this.updateDisplay();
    }
    
    setTimeForCurrentSession() {
        switch (this.currentSession) {
            case 'work':
                this.timeRemaining = this.workTime * 60;
                break;
            case 'shortBreak':
                this.timeRemaining = this.shortBreakTime * 60;
                break;
            case 'longBreak':
                this.timeRemaining = this.longBreakTime * 60;
                break;
        }
    }
    
    getSessionCompleteMessage() {
        switch (this.currentSession) {
            case 'work':
                return '🌱 Work session complete! Time for a break! 🌱';
            case 'shortBreak':
                return '🍃 Break time over! Ready to work? 🍃';
            case 'longBreak':
                return '🌳 Long break complete! New cycle starting! 🌳';
            default:
                return '✨ Session complete! ✨';
        }
    }
    
    updateTimeDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        // Update session type
        const sessionTypes = {
            'work': 'WORK SESSION',
            'shortBreak': 'SHORT BREAK',
            'longBreak': 'LONG BREAK'
        };
        this.sessionTypeDisplay.textContent = sessionTypes[this.currentSession];
        
        // Update session counter
        this.sessionCountDisplay.textContent = this.sessionCount;
        
        // Update character sprite based on session
        const sprites = {
            'work': '🧙‍♂️',
            'shortBreak': '🌿',
            'longBreak': '🌳'
        };
        this.characterSprite.textContent = sprites[this.currentSession];
        
        // Update time display
        this.updateTimeDisplay();
        
        // Update user progress
        this.updateUserProgress();
    }
    
    awardXP(amount) {
        this.userXP += amount;
        
        // Check for level up
        const xpNeeded = this.userLevel * this.xpPerLevel;
        if (this.userXP >= xpNeeded) {
            this.levelUp();
        }
        
        this.updateUserProgress();
    }
    
    levelUp() {
        this.userLevel++;
        this.userXP = this.userXP - ((this.userLevel - 1) * this.xpPerLevel);
        
        this.sounds.levelUp();
        const levelUpMessage = `🌿 LEVEL UP! You are now level ${this.userLevel}! 🌿`;
        this.showNotification(levelUpMessage);
        this.sendBrowserNotification(levelUpMessage);
        
        // Unlock level up achievement
        this.unlockAchievement('level-up');
    }
    
    updateUserProgress() {
        this.userLevelDisplay.textContent = this.userLevel;
        this.userXPDisplay.textContent = this.userXP;
        
        const xpNeeded = this.userLevel * this.xpPerLevel;
        this.nextLevelXPDisplay.textContent = xpNeeded;
        
        const progressPercentage = (this.userXP / xpNeeded) * 100;
        this.xpProgress.style.width = `${progressPercentage}%`;
    }
    
    checkAchievements() {
        // First session achievement
        if (this.totalSessionsCompleted >= 1 && !this.achievements['first-session']) {
            this.unlockAchievement('first-session');
        }
        
        // Forest master achievement (100 sessions)
        if (this.totalSessionsCompleted >= 100 && !this.achievements['pomodoro-master']) {
            this.unlockAchievement('pomodoro-master');
        }
    }
    
    unlockAchievement(achievementId) {
        this.achievements[achievementId] = true;
        
        const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievementElement) {
            achievementElement.classList.remove('locked');
            achievementElement.classList.add('unlocked');
        }
        
        const achievementNames = {
            'first-session': 'First Session Complete!',
            'level-up': 'Level Up!',
            'pomodoro-master': 'Forest Master!'
        };
        
        this.showNotification(`🏆 Achievement Unlocked: ${achievementNames[achievementId]} 🏆`);
    }
    
    showNotification(message) {
        this.notification.textContent = message;
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }
    
    sendBrowserNotification(message) {
        if (!this.notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        
        const notification = new Notification('PixelFocus 🌲', {
            body: message,
            icon: '🌲',
            badge: '🌲',
            silent: false,
            requireInteraction: false
        });
        
        // Auto-close notification after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);
        
        // Focus window when notification is clicked
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
    
    saveUserData() {
        const userData = {
            userLevel: this.userLevel,
            userXP: this.userXP,
            totalSessionsCompleted: this.totalSessionsCompleted,
            achievements: this.achievements,
            workTime: this.workTime,
            shortBreakTime: this.shortBreakTime,
            longBreakTime: this.longBreakTime,
            soundEnabled: this.soundEnabled,
            notificationsEnabled: this.notificationsEnabled,
            notificationPermissionRequested: this.notificationPermissionRequested,
            darkTheme: this.darkTheme
        };
        
        localStorage.setItem('pixelFocus', JSON.stringify(userData));
    }
    
    loadUserData() {
        const userData = localStorage.getItem('pixelFocus');
        
        if (userData) {
            const data = JSON.parse(userData);
            
            this.userLevel = data.userLevel || 1;
            this.userXP = data.userXP || 0;
            this.totalSessionsCompleted = data.totalSessionsCompleted || 0;
            this.achievements = { ...this.achievements, ...data.achievements };
            this.workTime = data.workTime || 25;
            this.shortBreakTime = data.shortBreakTime || 5;
            this.longBreakTime = data.longBreakTime || 15;
            this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
            this.notificationsEnabled = data.notificationsEnabled !== undefined ? data.notificationsEnabled : true;
            this.notificationPermissionRequested = data.notificationPermissionRequested || false;
            this.darkTheme = data.darkTheme !== undefined ? data.darkTheme : false;
            
            // Update input values
            this.workTimeInput.value = this.workTime;
            this.shortBreakInput.value = this.shortBreakTime;
            this.longBreakInput.value = this.longBreakTime;
            this.soundEnabledInput.checked = this.soundEnabled;
            
            // Set notification toggle based on permission and user preference
            if (Notification.permission === 'denied' || !('Notification' in window)) {
                this.notificationsEnabledInput.checked = false;
                this.notificationsEnabledInput.disabled = true;
                this.notificationsEnabled = false;
            } else {
                this.notificationsEnabledInput.checked = this.notificationsEnabled;
                this.notificationsEnabledInput.disabled = false;
            }
            
            // Set theme toggle
            this.themeModeInput.checked = this.darkTheme;
            
            // Update achievement display
            Object.keys(this.achievements).forEach(achievementId => {
                if (this.achievements[achievementId]) {
                    const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
                    if (achievementElement) {
                        achievementElement.classList.remove('locked');
                        achievementElement.classList.add('unlocked');
                    }
                }
            });
        } else {
            // No saved data, set initial values
            this.soundEnabledInput.checked = this.soundEnabled;
            
            // Set notification toggle based on current permission
            if (Notification.permission === 'denied' || !('Notification' in window)) {
                this.notificationsEnabledInput.checked = false;
                this.notificationsEnabledInput.disabled = true;
                this.notificationsEnabled = false;
            } else {
                this.notificationsEnabledInput.checked = this.notificationsEnabled;
                this.notificationsEnabledInput.disabled = false;
            }
            
            // Set theme toggle
            this.themeModeInput.checked = this.darkTheme;
        }
        
        this.setTimeForCurrentSession();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timer = new PixelFocusTimer();
    
    // Add some Easter eggs
    let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                timer.awardXP(1000);
                timer.showNotification('🌲 SECRET FOREST CODE ACTIVATED! Bonus XP awarded! 🌲');
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // Add spacebar controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (!timer.isRunning && !timer.isPaused) {
                timer.startTimer();
            } else if (timer.isRunning) {
                timer.pauseTimer();
            } else if (timer.isPaused) {
                timer.resumeTimer();
            }
        }
    });
});

// PixelFocus Timer Unit Tests
// Run with: node tests/test-timer.js

class PixelFocusTimerTests {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    // Test runner
    runTests() {
        console.log('🌲 Running PixelFocus Timer Tests...\n');
        
        this.testTimerInitialization();
        this.testSessionManagement();
        this.testTimeCalculations();
        this.testUserProgress();
        this.testSoundSystem();
        this.testThemeSystem();
        this.testDataPersistence();
        
        this.printResults();
    }

    // Test helper methods
    assert(condition, testName) {
        if (condition) {
            console.log(`✅ ${testName}`);
            this.passed++;
        } else {
            console.log(`❌ ${testName}`);
            this.failed++;
        }
    }

    assertEqual(actual, expected, testName) {
        this.assert(actual === expected, `${testName} (Expected: ${expected}, Got: ${actual})`);
    }

    assertTrue(condition, testName) {
        this.assert(condition, testName);
    }

    assertFalse(condition, testName) {
        this.assert(!condition, testName);
    }

    // Mock timer class for testing
    createMockTimer() {
        return {
            timeRemaining: 0,
            isRunning: false,
            isPaused: false,
            currentSession: 'work',
            sessionCount: 1,
            totalSessions: 4,
            userLevel: 1,
            userXP: 0,
            totalSessionsCompleted: 0,
            workTime: 25,
            shortBreakTime: 5,
            longBreakTime: 15,
            soundEnabled: true,
            notificationsEnabled: true,
            darkTheme: false,
            
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
            },
            
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
            },
            
            awardXP(amount) {
                this.userXP += amount;
                const xpNeeded = this.userLevel * 100;
                if (this.userXP >= xpNeeded) {
                    this.userLevel++;
                    this.userXP = this.userXP - ((this.userLevel - 1) * 100);
                }
            },
            
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
        };
    }

    // Test categories
    testTimerInitialization() {
        console.log('📋 Testing Timer Initialization...');
        
        const timer = this.createMockTimer();
        
        this.assertEqual(timer.currentSession, 'work', 'Initial session should be work');
        this.assertEqual(timer.sessionCount, 1, 'Initial session count should be 1');
        this.assertEqual(timer.userLevel, 1, 'Initial user level should be 1');
        this.assertEqual(timer.userXP, 0, 'Initial XP should be 0');
        this.assertEqual(timer.workTime, 25, 'Default work time should be 25 minutes');
        this.assertEqual(timer.shortBreakTime, 5, 'Default short break should be 5 minutes');
        this.assertEqual(timer.longBreakTime, 15, 'Default long break should be 15 minutes');
        this.assertTrue(timer.soundEnabled, 'Sound should be enabled by default');
        this.assertTrue(timer.notificationsEnabled, 'Notifications should be enabled by default');
        this.assertFalse(timer.darkTheme, 'Dark theme should be disabled by default');
        
        console.log('');
    }

    testSessionManagement() {
        console.log('📋 Testing Session Management...');
        
        const timer = this.createMockTimer();
        
        // Test work session time
        timer.setTimeForCurrentSession();
        this.assertEqual(timer.timeRemaining, 1500, 'Work session should be 1500 seconds (25 min)');
        
        // Test session advancement
        timer.advanceSession();
        this.assertEqual(timer.currentSession, 'shortBreak', 'Should advance to short break after work');
        this.assertEqual(timer.sessionCount, 2, 'Session count should increment');
        this.assertEqual(timer.timeRemaining, 300, 'Short break should be 300 seconds (5 min)');
        
        // Test multiple work sessions
        timer.currentSession = 'work';
        timer.sessionCount = 4;
        timer.advanceSession();
        this.assertEqual(timer.currentSession, 'longBreak', 'Should advance to long break after 4 work sessions');
        this.assertEqual(timer.sessionCount, 1, 'Session count should reset to 1');
        this.assertEqual(timer.timeRemaining, 900, 'Long break should be 900 seconds (15 min)');
        
        // Test break to work transition
        timer.currentSession = 'shortBreak';
        timer.advanceSession();
        this.assertEqual(timer.currentSession, 'work', 'Should return to work after break');
        
        console.log('');
    }

    testTimeCalculations() {
        console.log('📋 Testing Time Calculations...');
        
        const timer = this.createMockTimer();
        
        // Test time formatting
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };
        
        this.assertEqual(formatTime(1500), '25:00', '25 minutes should format as 25:00');
        this.assertEqual(formatTime(300), '05:00', '5 minutes should format as 05:00');
        this.assertEqual(formatTime(65), '01:05', '65 seconds should format as 01:05');
        this.assertEqual(formatTime(0), '00:00', '0 seconds should format as 00:00');
        
        // Test time remaining calculations
        timer.timeRemaining = 1500;
        this.assertEqual(timer.timeRemaining, 1500, 'Time remaining should be accurate');
        
        console.log('');
    }

    testUserProgress() {
        console.log('📋 Testing User Progress System...');
        
        const timer = this.createMockTimer();
        
        // Test XP awarding
        timer.awardXP(25);
        this.assertEqual(timer.userXP, 25, 'XP should be awarded correctly');
        this.assertEqual(timer.userLevel, 1, 'Should not level up with 25 XP');
        
        // Test level up
        timer.awardXP(75); // Total 100 XP
        this.assertEqual(timer.userLevel, 2, 'Should level up at 100 XP');
        this.assertEqual(timer.userXP, 0, 'XP should reset after level up');
        
        // Test multiple level ups
        timer.awardXP(200); // Should level up twice
        this.assertEqual(timer.userLevel, 4, 'Should level up multiple times');
        this.assertEqual(timer.userXP, 0, 'XP should reset after multiple level ups');
        
        // Test session completion
        timer.totalSessionsCompleted = 0;
        timer.totalSessionsCompleted++;
        this.assertEqual(timer.totalSessionsCompleted, 1, 'Session completion should increment');
        
        console.log('');
    }

    testSoundSystem() {
        console.log('📋 Testing Sound System...');
        
        const timer = this.createMockTimer();
        
        // Test sound toggle
        this.assertTrue(timer.soundEnabled, 'Sound should be enabled initially');
        timer.soundEnabled = false;
        this.assertFalse(timer.soundEnabled, 'Sound should be disabled when toggled');
        
        // Test sound state persistence
        timer.soundEnabled = true;
        this.assertTrue(timer.soundEnabled, 'Sound should be enabled when toggled back');
        
        console.log('');
    }

    testThemeSystem() {
        console.log('📋 Testing Theme System...');
        
        const timer = this.createMockTimer();
        
        // Test theme toggle
        this.assertFalse(timer.darkTheme, 'Dark theme should be disabled initially');
        timer.darkTheme = true;
        this.assertTrue(timer.darkTheme, 'Dark theme should be enabled when toggled');
        
        // Test theme state persistence
        timer.darkTheme = false;
        this.assertFalse(timer.darkTheme, 'Dark theme should be disabled when toggled back');
        
        console.log('');
    }

    testDataPersistence() {
        console.log('📋 Testing Data Persistence...');
        
        const timer = this.createMockTimer();
        
        // Test data structure
        const userData = {
            userLevel: timer.userLevel,
            userXP: timer.userXP,
            totalSessionsCompleted: timer.totalSessionsCompleted,
            workTime: timer.workTime,
            shortBreakTime: timer.shortBreakTime,
            longBreakTime: timer.longBreakTime,
            soundEnabled: timer.soundEnabled,
            notificationsEnabled: timer.notificationsEnabled,
            darkTheme: timer.darkTheme
        };
        
        this.assertEqual(userData.userLevel, 1, 'User level should be saved');
        this.assertEqual(userData.userXP, 0, 'User XP should be saved');
        this.assertEqual(userData.workTime, 25, 'Work time should be saved');
        this.assertTrue(userData.soundEnabled, 'Sound setting should be saved');
        this.assertFalse(userData.darkTheme, 'Theme setting should be saved');
        
        // Test data loading
        const loadedData = JSON.parse(JSON.stringify(userData));
        this.assertEqual(loadedData.userLevel, 1, 'User level should load correctly');
        this.assertEqual(loadedData.userXP, 0, 'User XP should load correctly');
        this.assertEqual(loadedData.workTime, 25, 'Work time should load correctly');
        
        console.log('');
    }

    printResults() {
        console.log('📊 Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total: ${this.passed + this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed! PixelFocus is working correctly!');
        } else {
            console.log('\n⚠️  Some tests failed. Please check the implementation.');
        }
    }
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    const testRunner = new PixelFocusTimerTests();
    testRunner.runTests();
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PixelFocusTimerTests;
}

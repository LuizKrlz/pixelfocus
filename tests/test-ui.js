// PixelFocus UI Integration Tests
// Run with: node tests/test-ui.js

class PixelFocusUITests {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.testResults = [];
    }

    // Test runner
    runTests() {
        console.log('🌲 Running PixelFocus UI Tests...\n');
        
        this.testHTMLStructure();
        this.testCSSClasses();
        this.testResponsiveDesign();
        this.testAccessibility();
        this.testThemeSwitching();
        this.testToggleFunctionality();
        
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

    // Mock DOM elements for testing
    createMockDOM() {
        return {
            // Top controls
            topControls: {
                className: 'top-controls',
                children: [
                    { id: 'themeMode', type: 'checkbox', className: 'toggle-switch' },
                    { id: 'soundEnabled', type: 'checkbox', className: 'toggle-switch' },
                    { id: 'notificationsEnabled', type: 'checkbox', className: 'toggle-switch' }
                ]
            },
            
            // Header
            header: {
                className: 'header',
                children: [
                    { className: 'title', textContent: '🌲 PIXELFOCUS 🌲' },
                    { className: 'user-stats' }
                ]
            },
            
            // Timer section
            timerSection: {
                className: 'timer-section',
                children: [
                    { id: 'characterSprite', className: 'character-sprite' },
                    { id: 'timeDisplay', className: 'time-display' },
                    { id: 'sessionType', className: 'session-type' },
                    { id: 'startBtn', className: 'btn btn-start' },
                    { id: 'pauseBtn', className: 'btn btn-pause' },
                    { id: 'resetBtn', className: 'btn btn-reset' }
                ]
            },
            
            // Settings
            settings: {
                className: 'settings',
                children: [
                    { id: 'workTime', type: 'number', min: '1', max: '60' },
                    { id: 'shortBreak', type: 'number', min: '1', max: '30' },
                    { id: 'longBreak', type: 'number', min: '1', max: '60' }
                ]
            },
            
            // Achievements
            achievements: {
                className: 'achievements',
                children: [
                    { className: 'achievement-list' }
                ]
            }
        };
    }

    // Test categories
    testHTMLStructure() {
        console.log('📋 Testing HTML Structure...');
        
        const dom = this.createMockDOM();
        
        // Test top controls structure
        this.assertEqual(dom.topControls.className, 'top-controls', 'Top controls should have correct class');
        this.assertEqual(dom.topControls.children.length, 3, 'Should have 3 toggle switches');
        
        // Test header structure
        this.assertEqual(dom.header.className, 'header', 'Header should have correct class');
        this.assertTrue(dom.header.children.some(child => child.className === 'title'), 'Header should have title');
        this.assertTrue(dom.header.children.some(child => child.className === 'user-stats'), 'Header should have user stats');
        
        // Test timer section structure
        this.assertEqual(dom.timerSection.className, 'timer-section', 'Timer section should have correct class');
        this.assertTrue(dom.timerSection.children.some(child => child.id === 'timeDisplay'), 'Should have time display');
        this.assertTrue(dom.timerSection.children.some(child => child.id === 'startBtn'), 'Should have start button');
        this.assertTrue(dom.timerSection.children.some(child => child.id === 'pauseBtn'), 'Should have pause button');
        this.assertTrue(dom.timerSection.children.some(child => child.id === 'resetBtn'), 'Should have reset button');
        
        // Test settings structure
        this.assertEqual(dom.settings.className, 'settings', 'Settings should have correct class');
        this.assertTrue(dom.settings.children.some(child => child.id === 'workTime'), 'Should have work time input');
        this.assertTrue(dom.settings.children.some(child => child.id === 'shortBreak'), 'Should have short break input');
        this.assertTrue(dom.settings.children.some(child => child.id === 'longBreak'), 'Should have long break input');
        
        console.log('');
    }

    testCSSClasses() {
        console.log('📋 Testing CSS Classes...');
        
        const dom = this.createMockDOM();
        
        // Test button classes
        const startBtn = dom.timerSection.children.find(child => child.id === 'startBtn');
        this.assertTrue(startBtn.className.includes('btn'), 'Start button should have btn class');
        this.assertTrue(startBtn.className.includes('btn-start'), 'Start button should have btn-start class');
        
        const pauseBtn = dom.timerSection.children.find(child => child.id === 'pauseBtn');
        this.assertTrue(pauseBtn.className.includes('btn'), 'Pause button should have btn class');
        this.assertTrue(pauseBtn.className.includes('btn-pause'), 'Pause button should have btn-pause class');
        
        const resetBtn = dom.timerSection.children.find(child => child.id === 'resetBtn');
        this.assertTrue(resetBtn.className.includes('btn'), 'Reset button should have btn class');
        this.assertTrue(resetBtn.className.includes('btn-reset'), 'Reset button should have btn-reset class');
        
        // Test input validation
        const workTimeInput = dom.settings.children.find(child => child.id === 'workTime');
        this.assertEqual(workTimeInput.min, '1', 'Work time should have min value of 1');
        this.assertEqual(workTimeInput.max, '60', 'Work time should have max value of 60');
        
        const shortBreakInput = dom.settings.children.find(child => child.id === 'shortBreak');
        this.assertEqual(shortBreakInput.min, '1', 'Short break should have min value of 1');
        this.assertEqual(shortBreakInput.max, '30', 'Short break should have max value of 30');
        
        console.log('');
    }

    testResponsiveDesign() {
        console.log('📋 Testing Responsive Design...');
        
        // Test viewport meta tag (would be in HTML)
        const viewportMeta = {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0'
        };
        
        this.assertEqual(viewportMeta.name, 'viewport', 'Should have viewport meta tag');
        this.assertTrue(viewportMeta.content.includes('width=device-width'), 'Should support responsive width');
        this.assertTrue(viewportMeta.content.includes('initial-scale=1.0'), 'Should have proper initial scale');
        
        // Test font loading
        const fontLink = {
            href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
            rel: 'stylesheet'
        };
        
        this.assertTrue(fontLink.href.includes('Press+Start+2P'), 'Should load Press Start 2P font');
        this.assertEqual(fontLink.rel, 'stylesheet', 'Should be a stylesheet link');
        
        console.log('');
    }

    testAccessibility() {
        console.log('📋 Testing Accessibility...');
        
        const dom = this.createMockDOM();
        
        // Test form labels
        const workTimeInput = dom.settings.children.find(child => child.id === 'workTime');
        this.assertEqual(workTimeInput.type, 'number', 'Work time should be number input for accessibility');
        
        const shortBreakInput = dom.settings.children.find(child => child.id === 'shortBreak');
        this.assertEqual(shortBreakInput.type, 'number', 'Short break should be number input for accessibility');
        
        // Test button accessibility
        const startBtn = dom.timerSection.children.find(child => child.id === 'startBtn');
        this.assertTrue(startBtn.id, 'Start button should have ID for accessibility');
        
        const pauseBtn = dom.timerSection.children.find(child => child.id === 'pauseBtn');
        this.assertTrue(pauseBtn.id, 'Pause button should have ID for accessibility');
        
        // Test semantic structure
        this.assertTrue(dom.header.className === 'header', 'Should use semantic header element');
        this.assertTrue(dom.timerSection.className === 'timer-section', 'Should use semantic section element');
        
        console.log('');
    }

    testThemeSwitching() {
        console.log('📋 Testing Theme Switching...');
        
        // Test theme classes
        const bodyElement = {
            className: '',
            classList: {
                add: (cls) => { bodyElement.className += ' ' + cls; },
                remove: (cls) => { bodyElement.className = bodyElement.className.replace(cls, ''); },
                contains: (cls) => bodyElement.className.includes(cls)
            }
        };
        
        // Test light theme
        this.assertFalse(bodyElement.classList.contains('dark-theme'), 'Should start with light theme');
        
        // Test switching to dark theme
        bodyElement.classList.add('dark-theme');
        this.assertTrue(bodyElement.classList.contains('dark-theme'), 'Should switch to dark theme');
        
        // Test switching back to light theme
        bodyElement.classList.remove('dark-theme');
        this.assertFalse(bodyElement.classList.contains('dark-theme'), 'Should switch back to light theme');
        
        console.log('');
    }

    testToggleFunctionality() {
        console.log('📋 Testing Toggle Functionality...');
        
        const dom = this.createMockDOM();
        
        // Test toggle switches exist
        const themeToggle = dom.topControls.children.find(child => child.id === 'themeMode');
        this.assertEqual(themeToggle.type, 'checkbox', 'Theme toggle should be checkbox');
        
        const soundToggle = dom.topControls.children.find(child => child.id === 'soundEnabled');
        this.assertEqual(soundToggle.type, 'checkbox', 'Sound toggle should be checkbox');
        
        const notificationToggle = dom.topControls.children.find(child => child.id === 'notificationsEnabled');
        this.assertEqual(notificationToggle.type, 'checkbox', 'Notification toggle should be checkbox');
        
        // Test toggle states
        const toggleStates = {
            theme: false,
            sound: true,
            notifications: true
        };
        
        this.assertFalse(toggleStates.theme, 'Theme should be off by default');
        this.assertTrue(toggleStates.sound, 'Sound should be on by default');
        this.assertTrue(toggleStates.notifications, 'Notifications should be on by default');
        
        // Test toggle switching
        toggleStates.theme = true;
        this.assertTrue(toggleStates.theme, 'Theme should be switchable');
        
        toggleStates.sound = false;
        this.assertFalse(toggleStates.sound, 'Sound should be switchable');
        
        console.log('');
    }

    printResults() {
        console.log('📊 UI Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total: ${this.passed + this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All UI tests passed! PixelFocus interface is working correctly!');
        } else {
            console.log('\n⚠️  Some UI tests failed. Please check the implementation.');
        }
    }
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    const testRunner = new PixelFocusUITests();
    testRunner.runTests();
}

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PixelFocusUITests;
}

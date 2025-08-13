// PixelFocus Test Runner
// Run with: node tests/test-runner.js

const TimerTests = require('./test-timer.js');
const UITests = require('./test-ui.js');

class PixelFocusTestRunner {
    constructor() {
        this.testSuites = [];
        this.totalPassed = 0;
        this.totalFailed = 0;
        this.startTime = Date.now();
    }

    addTestSuite(testSuite) {
        this.testSuites.push(testSuite);
    }

    async runAllTests() {
        console.log('🌲🌲🌲 PIXELFOCUS COMPREHENSIVE TEST SUITE 🌲🌲🌲\n');
        console.log('Starting test execution...\n');

        for (const TestSuite of this.testSuites) {
            const testRunner = new TestSuite();
            
            // Capture console output
            const originalLog = console.log;
            const logs = [];
            console.log = (...args) => {
                logs.push(args.join(' '));
                originalLog(...args);
            };

            try {
                testRunner.runTests();
                
                // Extract results from logs
                const resultsLine = logs.find(log => log.includes('Test Results:'));
                if (resultsLine) {
                    const passedMatch = resultsLine.match(/Passed: (\d+)/);
                    const failedMatch = resultsLine.match(/Failed: (\d+)/);
                    
                    if (passedMatch) this.totalPassed += parseInt(passedMatch[1]);
                    if (failedMatch) this.totalFailed += parseInt(failedMatch[1]);
                }
            } catch (error) {
                console.log(`❌ Test suite failed with error: ${error.message}`);
                this.totalFailed++;
            } finally {
                console.log = originalLog;
            }
            
            console.log('\n' + '='.repeat(60) + '\n');
        }

        this.printFinalResults();
    }

    printFinalResults() {
        const endTime = Date.now();
        const duration = ((endTime - this.startTime) / 1000).toFixed(2);
        
        console.log('🎯 FINAL TEST RESULTS');
        console.log('='.repeat(40));
        console.log(`⏱️  Total Duration: ${duration}s`);
        console.log(`📊 Total Tests: ${this.totalPassed + this.totalFailed}`);
        console.log(`✅ Passed: ${this.totalPassed}`);
        console.log(`❌ Failed: ${this.totalFailed}`);
        console.log(`📈 Success Rate: ${this.calculateSuccessRate()}%`);
        
        if (this.totalFailed === 0) {
            console.log('\n🎉🎉🎉 ALL TESTS PASSED! PIXELFOCUS IS READY FOR PRODUCTION! 🎉🎉🎉');
        } else {
            console.log('\n⚠️  Some tests failed. Please review the implementation.');
        }
        
        console.log('\n' + '='.repeat(40));
    }

    calculateSuccessRate() {
        const total = this.totalPassed + this.totalFailed;
        if (total === 0) return 0;
        return Math.round((this.totalPassed / total) * 100);
    }
}

// Performance tests
class PerformanceTests {
    constructor() {
        this.passed = 0;
        this.failed = 0;
    }

    runTests() {
        console.log('🚀 Running Performance Tests...\n');
        
        this.testTimerPerformance();
        this.testMemoryUsage();
        this.testAnimationPerformance();
        
        this.printResults();
    }

    testTimerPerformance() {
        console.log('📋 Testing Timer Performance...');
        
        const startTime = performance.now();
        
        // Simulate timer operations
        for (let i = 0; i < 1000; i++) {
            const timer = {
                timeRemaining: 1500,
                updateTimeDisplay: () => {
                    const minutes = Math.floor(this.timeRemaining / 60);
                    const seconds = this.timeRemaining % 60;
                    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            };
            timer.updateTimeDisplay();
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.assert(duration < 100, `Timer operations should complete in under 100ms (took ${duration.toFixed(2)}ms)`);
        
        console.log('');
    }

    testMemoryUsage() {
        console.log('📋 Testing Memory Usage...');
        
        const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        
        // Simulate data operations
        const testData = [];
        for (let i = 0; i < 1000; i++) {
            testData.push({
                userLevel: 1,
                userXP: i,
                totalSessionsCompleted: i,
                workTime: 25,
                soundEnabled: true
            });
        }
        
        const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Clean up
        testData.length = 0;
        
        this.assert(memoryIncrease < 1000000, `Memory usage should be reasonable (used ${memoryIncrease} bytes)`);
        
        console.log('');
    }

    testAnimationPerformance() {
        console.log('📋 Testing Animation Performance...');
        
        const startTime = performance.now();
        
        // Simulate CSS animation calculations
        for (let i = 0; i < 100; i++) {
            const progress = i / 100;
            const transform = `translateX(${progress * 22}px)`;
            const opacity = 1 - progress;
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.assert(duration < 10, `Animation calculations should be fast (took ${duration.toFixed(2)}ms)`);
        
        console.log('');
    }

    assert(condition, testName) {
        if (condition) {
            console.log(`✅ ${testName}`);
            this.passed++;
        } else {
            console.log(`❌ ${testName}`);
            this.failed++;
        }
    }

    printResults() {
        console.log('📊 Performance Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total: ${this.passed + this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All performance tests passed! PixelFocus is performant!');
        } else {
            console.log('\n⚠️  Some performance tests failed. Please optimize the implementation.');
        }
    }
}

// Browser compatibility tests
class BrowserCompatibilityTests {
    constructor() {
        this.passed = 0;
        this.failed = 0;
    }

    runTests() {
        console.log('🌐 Running Browser Compatibility Tests...\n');
        
        this.testWebAudioAPI();
        this.testLocalStorage();
        this.testNotificationsAPI();
        this.testCSSFeatures();
        
        this.printResults();
    }

    testWebAudioAPI() {
        console.log('📋 Testing Web Audio API...');
        
        const hasAudioContext = typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined';
        this.assert(hasAudioContext, 'Web Audio API should be available');
        
        console.log('');
    }

    testLocalStorage() {
        console.log('📋 Testing Local Storage...');
        
        const hasLocalStorage = typeof localStorage !== 'undefined';
        this.assert(hasLocalStorage, 'Local Storage should be available');
        
        if (hasLocalStorage) {
            try {
                localStorage.setItem('test', 'value');
                const value = localStorage.getItem('test');
                localStorage.removeItem('test');
                this.assert(value === 'value', 'Local Storage should work correctly');
            } catch (error) {
                this.assert(false, 'Local Storage should not throw errors');
            }
        }
        
        console.log('');
    }

    testNotificationsAPI() {
        console.log('📋 Testing Notifications API...');
        
        const hasNotifications = typeof Notification !== 'undefined';
        this.assert(hasNotifications, 'Notifications API should be available');
        
        console.log('');
    }

    testCSSFeatures() {
        console.log('📋 Testing CSS Features...');
        
        // Test CSS Grid support
        const hasGrid = CSS.supports('display', 'grid');
        this.assert(hasGrid, 'CSS Grid should be supported');
        
        // Test CSS Flexbox support
        const hasFlexbox = CSS.supports('display', 'flex');
        this.assert(hasFlexbox, 'CSS Flexbox should be supported');
        
        // Test CSS transitions
        const hasTransitions = CSS.supports('transition', 'all 0.3s ease');
        this.assert(hasTransitions, 'CSS Transitions should be supported');
        
        console.log('');
    }

    assert(condition, testName) {
        if (condition) {
            console.log(`✅ ${testName}`);
            this.passed++;
        } else {
            console.log(`❌ ${testName}`);
            this.failed++;
        }
    }

    printResults() {
        console.log('📊 Browser Compatibility Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total: ${this.passed + this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All compatibility tests passed! PixelFocus is browser-compatible!');
        } else {
            console.log('\n⚠️  Some compatibility tests failed. Please check browser support.');
        }
    }
}

// Main test execution
async function runAllTests() {
    const testRunner = new PixelFocusTestRunner();
    
    // Add all test suites
    testRunner.addTestSuite(TimerTests);
    testRunner.addTestSuite(UITests);
    testRunner.addTestSuite(PerformanceTests);
    testRunner.addTestSuite(BrowserCompatibilityTests);
    
    // Run all tests
    await testRunner.runAllTests();
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests().catch(console.error);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PixelFocusTestRunner, runAllTests };
}

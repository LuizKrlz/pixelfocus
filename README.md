# 🌲 PixelFocus 🌲

[![CI](https://github.com/LuizKrlz/pixelfocus/actions/workflows/ci.yml/badge.svg)](https://github.com/LuizKrlz/pixelfocus/actions/workflows/ci.yml)

A gamified Pomodoro timer with a mystical forest pixel theme that makes productivity fun and engaging!

## 🎮 Features

### ⏰ Pomodoro Timer
- **Work Sessions**: Default 25 minutes (customizable)
- **Short Breaks**: Default 5 minutes (customizable)
- **Long Breaks**: Default 15 minutes (customizable)
- **Session Cycle**: 4 work sessions → 1 long break

### 🎵 Nature-Inspired Sounds
- **Start Session**: Mystical forest awakening melody
- **Pause Timer**: Gentle wind-down melody
- **Reset Timer**: Falling leaves descent sound
- **Session Complete**: Nature harmony fanfare
- **Level Up**: Magical growth jingle
- All sounds created with Web Audio API for authentic 8-bit feel

### 🎨 Animated Forest Background
- **Moving Clouds**: Floating across the magical sky
- **Floating Leaves**: Gently swaying in the breeze
- **Pixel Trees**: Majestic forest elements with detailed foliage
- **Dynamic Sky**: Beautiful gradient from sky blue to deep forest green

### 🏆 Gamification System
- **XP Points**: Earn 25 XP per completed session
- **Level Progression**: Level up every 100 XP
- **Achievements**: Unlock special milestones
  - 🌱 First Session Complete
  - 🌿 Level Up!
  - 🌳 Forest Master (100+ sessions)

### 💾 Data Persistence
- Progress automatically saved to browser localStorage
- Settings and preferences remembered between sessions
- Achievement progress tracked long-term

### 🔧 User Settings
- **Sound Control**: Toggle sound effects on/off
- **Browser Notifications**: Get notified when sessions complete (even in background tabs)
- **Customizable Timers**: Adjust work and break durations to your preference
- **Automatic Permissions**: App will request notification permissions when needed

### 🧪 Testing Suite
- **Comprehensive Tests**: 90+ unit and integration tests
- **Timer Logic**: Complete coverage of core functionality
- **UI Components**: All interface elements tested
- **Performance**: Speed and memory optimization tests
- **Browser Compatibility**: Feature detection and fallbacks

## 🚀 How to Use

1. **Open the App**: Simply open `index.html` in your web browser
2. **Customize Settings**: Adjust work/break times if needed
3. **Start Timer**: Click "🚀 START" or press spacebar
4. **Stay Focused**: Work during work sessions, relax during breaks
5. **Level Up**: Complete sessions to gain XP and unlock achievements

## ⌨️ Keyboard Controls

- **Spacebar**: Start/Pause/Resume timer
- **Secret Forest Code** (↑↑↓↓←→←→BA): Hidden nature bonus! 🌲

## 📱 Responsive Design

The app works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Animations and responsive design
- **Vanilla JavaScript**: Timer logic and gamification
- **Web Audio API**: Mario-style sound effects
- **localStorage**: Data persistence

### Browser Compatibility
- Modern browsers with Web Audio API support
- Fallback gracefully if audio features unavailable

## 🌲 Forest Pixel Theme Elements

### Visual Design
- **Pixel Art Aesthetic**: Using "Press Start 2P" retro font
- **Nature Colors**: Forest greens, earth browns, and sky blues
- **8-bit Style**: Pixelated borders and blocky design elements

### Animations
- **Character Sprite**: Changes based on session type and status
  - 🧙‍♂️ Forest wizard during work sessions
  - 🌿 Nature spirit during short breaks
  - 🌳 Ancient tree during long breaks
- **Background Elements**: Continuously moving clouds and floating leaves
- **UI Feedback**: Button press animations and hover effects

### Sound Design
- **Nature Melodies**: Mystical forest-inspired tune sequences
- **8-bit Synthesis**: Square wave oscillators for retro sound
- **Context-Aware**: Different sounds for different events

## 🏁 Getting Started

No installation required! Just:

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start your first Pomodoro session
4. Level up and stay productive! 🌲

## 🧪 Running Tests

### Quick Test
```bash
npm test
```

### Individual Test Suites
```bash
npm run test:timer    # Timer functionality tests
npm run test:ui       # UI component tests
```

### Development Server
```bash
npm run dev           # Start local server
npm start             # Open app in browser
```

See `tests/README.md` for detailed testing documentation.

---

**Welcome to the Forest of Focus! 🌲** Keep working, keep growing, and remember - even the mightiest trees need time to rest and grow between seasons!

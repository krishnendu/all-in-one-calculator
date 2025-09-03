# All-in-One Calculator & Investment Tool

A comprehensive, responsive **Progressive Web App (PWA)** that combines a basic calculator with an advanced investment comparison tool. Built with vanilla HTML, CSS, and JavaScript using class-based, modular architecture.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishnendu/all-in-one-calculator.git
   cd all-in-one-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate PWA icons**
   ```bash
   npm run generate-icons
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Install as PWA for the best experience

## 🚀 PWA Features

### Progressive Web App Capabilities
- ✅ **Installable** - Can be installed as a native app on devices
- ✅ **Offline Functionality** - Works without internet connection
- ✅ **Service Worker** - Caches resources for fast loading
- ✅ **Push Notifications** - Support for notifications
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Fast Loading** - Optimized for performance

### Calculator Features
- ✅ **Basic Calculator** - Standard arithmetic operations
- ✅ **Scientific Calculator** - Advanced mathematical functions
- ✅ **Investment Calculator** - Financial planning and comparison
- ✅ **Mobile Optimized** - Touch-friendly interface

## 📊 Investment Features

### Investment Options
1. **Fixed Deposit (FD)**
   - One-time principal investment
   - Compound interest calculations
   - Maturity value projections

2. **Recurring Deposit (RD)**
   - Monthly contribution plans
   - Systematic investment approach
   - Long-term wealth building

3. **Custom Plan**
   - Combination of FD + RD
   - Flexible investment strategy
   - Optimized returns

### Calculation Parameters
- **Principal Amount**: Initial investment
- **Monthly Contributions**: Regular deposits
- **Interest Rate**: Annual percentage rate (0-20%)
- **Compounding Frequency**: Daily, Weekly, Monthly, Quarterly, Half-yearly, Yearly
- **Investment Term**: Years or months

### Results Display
- **Summary Cards**: Total investment, interest earned, maturity value
- **Comparison Table**: Side-by-side analysis of different options
- **Visual Charts**: Bar charts showing investment vs maturity values
- **Effective Rate**: Annualized return calculations

## 🛠️ Technical Architecture

### Class-Based Design
```javascript
// Main Application Class
class CalculatorApp {
    // Orchestrates all components
}

// Calculator Class
class Calculator {
    // Handles basic arithmetic operations
}

// Investment Calculator Class
class InvestmentCalculator {
    // Manages investment calculations and comparisons
}

// Tab Manager Class
class TabManager {
    // Handles tab switching functionality
}
```

### Modular Structure
- **Separation of Concerns**: Each class handles specific functionality
- **Reusable Components**: Easy to extend and maintain
- **Clean Code**: Well-documented with comprehensive comments
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

## 🎨 Design Features

### Modern UI/UX
- **Gradient backgrounds**: Beautiful color schemes
- **Smooth animations**: CSS transitions and keyframes
- **Interactive elements**: Hover effects and feedback
- **Responsive grid**: Adapts to all screen sizes
- **Typography**: Clean, readable Inter font

### Mobile-First Design
- **Touch-friendly**: Large buttons and touch targets
- **Responsive tables**: Horizontal scrolling on mobile
- **Flexible layouts**: CSS Grid and Flexbox
- **Optimized spacing**: Proper padding and margins

## 🚀 Deployment on GitHub Pages

### Option 1: GitHub Actions (Recommended)

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/krishnendu/all-in-one-calculator.git
   cd all-in-one-calculator
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial PWA Calculator commit"
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages (created by GitHub Actions)
   - Click Save

4. **Your PWA is Live!**
   ```
   https://krishnendu.github.io/all-in-one-calculator/
   ```

### Option 2: Manual Deployment

1. **Create GitHub Repository**
   - Name: `all-in-one-calculator`
   - Make it public

2. **Upload Files**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/krishnendu/all-in-one-calculator.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Settings → Pages → Deploy from branch → main

## 📱 Installing as PWA

### Desktop Installation
1. Open the app in Chrome/Edge
2. Look for the install prompt in the address bar
3. Click "Install" to add to your desktop

### Mobile Installation
1. Open the app in Chrome/Safari
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will appear as a native app

### Offline Usage
- Once installed, the app works offline
- All calculator functions are available without internet
- Data is cached for fast loading

## 📁 File Structure
```
all-in-one-calculator/
├── index.html              # Main HTML file with PWA meta tags
├── styles.css              # CSS styles with PWA-specific styles
├── script.js               # JavaScript with PWA functionality
├── manifest.json           # PWA manifest file
├── sw.js                   # Service worker for offline functionality
├── package.json            # Project metadata and scripts
├── README.md               # This documentation
├── DEPLOYMENT.md           # Detailed deployment guide
├── generate-icons.js       # Icon generation script
├── icon-preview.html       # Icon preview page
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions workflow
├── icons/                  # PWA icons (auto-generated)
│   ├── icon-16x16.webp
│   ├── icon-32x32.webp
│   ├── icon-72x72.webp
│   ├── icon-96x96.webp
│   ├── icon-128x128.webp
│   ├── icon-144x144.webp
│   ├── icon-152x152.webp
│   ├── icon-192x192.webp
│   ├── icon-384x384.webp
│   └── icon-512x512.webp
└── screenshots/            # App screenshots (auto-generated)
    ├── desktop.webp
    └── mobile.webp
```

## 🎯 Usage Instructions

### Basic Calculator
1. Click on the **Basic Calculator** tab
2. Use number buttons or keyboard to input values
3. Click operators or use keyboard shortcuts:
   - `+` for addition
   - `-` for subtraction
   - `*` for multiplication
   - `/` for division
   - `Enter` or `=` for equals
   - `Escape` to clear
   - `Backspace` to delete

### Investment Calculator
1. Click on the **Investment Calculator** tab
2. Select investment type (FD, RD, or Custom)
3. Fill in the required parameters:
   - Principal amount
   - Monthly contribution (if applicable)
   - Interest rate
   - Compounding frequency
   - Investment term
4. Click **Calculate Returns**
5. View results in summary cards, comparison table, and charts

## 🔧 Customization

### Adding New Investment Types
```javascript
// In InvestmentCalculator class
calculateNewInvestmentType(principal, rate, term) {
    // Your calculation logic
    return {
        type: 'New Investment Type',
        principal: principal,
        totalContribution: totalContribution,
        interestEarned: interestEarned,
        maturityValue: maturityValue,
        effectiveRate: effectiveRate
    };
}
```

### Modifying Styles
- Edit `styles.css` to change colors, fonts, or layout
- Use CSS custom properties for easy theming
- Responsive breakpoints are clearly marked

### Extending Functionality
- Add new calculator operations in the `Calculator` class
- Create new investment calculations in `InvestmentCalculator` class
- Implement additional UI components as needed

## 🐛 Troubleshooting

### Common Issues
1. **Chart not displaying**: Ensure canvas element exists and has proper dimensions
2. **Calculations not working**: Check browser console for JavaScript errors
3. **Mobile layout issues**: Verify viewport meta tag is present
4. **GitHub Pages not loading**: Check repository settings and branch configuration

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Full responsive support

## 📈 Performance Features

### Optimizations
- **Efficient calculations**: Optimized mathematical formulas
- **Minimal DOM manipulation**: Smart updates and caching
- **Responsive images**: Optimized for all screen sizes
- **Fast loading**: No external dependencies

### Best Practices
- **Semantic HTML**: Proper structure and accessibility
- **CSS organization**: Logical grouping and comments
- **JavaScript modules**: Clean, maintainable code
- **Error handling**: Comprehensive validation and user feedback

## 🤝 Contributing

Feel free to contribute to this project by:
1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Font Awesome**: Icons
- **Google Fonts**: Inter font family
- **Canvas API**: Chart visualization
- **Modern CSS**: Grid, Flexbox, and animations

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

#!/usr/bin/env node

/**
 * PWA Icon Generator - Perfect SVG to WebP Conversion using Puppeteer
 * Uses browser rendering to ensure SVG gradients are converted perfectly to WebP
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Icon sizes needed for PWA
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Generate SVG with proper gradient definition
function generateSVG(size) {
    const uniqueId = `grad-${size}`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#${uniqueId})" rx="${size * 0.1}"/>
  <text x="${size/2}" y="${size * 0.65}" font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" text-anchor="middle" font-weight="bold">🧮</text>
  <text x="${size/2}" y="${size * 0.85}" font-family="Arial, sans-serif" font-size="${size * 0.15}" fill="white" text-anchor="middle">CALC</text>
</svg>`;
}

// Convert SVG to WebP using Puppeteer (browser rendering)
async function convertSVGtoWebP(svgContent, size, outputPath) {
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport to match icon size
        await page.setViewport({ width: size, height: size });
        
        // Create HTML with the SVG
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            background: transparent;
        }
        svg {
            display: block;
            width: ${size}px;
            height: ${size}px;
        }
    </style>
</head>
<body>
    ${svgContent}
</body>
</html>`;
        
        // Set content and wait for rendering
        await page.setContent(html);
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait for rendering
        
        // Take screenshot as WebP
        await page.screenshot({
            path: outputPath,
            type: 'webp',
            quality: 100,
            omitBackground: true,
            clip: {
                x: 0,
                y: 0,
                width: size,
                height: size
            }
        });
        
        return true;
    } catch (error) {
        console.error(`Error converting SVG to WebP: ${error.message}`);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Create a screenshot with proper gradient using Puppeteer (WebP)
async function createScreenshot(width, height, title, outputPath) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width, height });
        
        const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="icon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  
  <!-- App Icon -->
  <g transform="translate(${width/2 - 80}, ${height/2 - 80})">
    <rect width="160" height="160" fill="url(#icon)" rx="16"/>
    <text x="80" y="100" font-family="Arial, sans-serif" font-size="64" fill="white" text-anchor="middle" font-weight="bold">🧮</text>
    <text x="80" y="140" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">CALC</text>
  </g>
  
  <!-- Title -->
  <text x="${width/2}" y="${height/2 + 120}" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${title}</text>
  <text x="${width/2}" y="${height/2 + 160}" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">All-in-One Calculator PWA</text>
</svg>`;
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            background: transparent;
        }
        svg {
            display: block;
            width: ${width}px;
            height: ${height}px;
        }
    </style>
</head>
<body>
    ${svgContent}
</body>
</html>`;
        
        await page.setContent(html);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await page.screenshot({
            path: outputPath,
            type: 'webp',
            quality: 100,
            omitBackground: true,
            clip: {
                x: 0,
                y: 0,
                width,
                height
            }
        });
        
        return true;
    } catch (error) {
        console.error(`Error creating screenshot: ${error.message}`);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Generate icons with Puppeteer (WebP)
async function generateIcons() {
    console.log('🎨 Generating PWA icons with Puppeteer (perfect WebP gradient preservation)...');
    
    for (const size of iconSizes) {
        const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
        const webpPath = path.join(iconsDir, `icon-${size}x${size}.webp`);
        
        // Create SVG file
        const svgContent = generateSVG(size);
        fs.writeFileSync(svgPath, svgContent);
        
        // Convert using Puppeteer to WebP
        const success = await convertSVGtoWebP(svgContent, size, webpPath);
        
        if (success) {
            console.log(`✅ Created icon-${size}x${size}.webp with perfect gradient`);
        } else {
            console.log(`❌ Failed to create icon-${size}x${size}.webp`);
        }
    }
    
    // Generate screenshots
    console.log('📸 Generating screenshots with perfect WebP gradients...');
    
    const desktopSuccess = await createScreenshot(1280, 720, 'Desktop View', path.join(screenshotsDir, 'desktop.webp'));
    if (desktopSuccess) {
        console.log('✅ Created desktop.webp with perfect gradient');
    }
    
    const mobileSuccess = await createScreenshot(375, 667, 'Mobile View', path.join(screenshotsDir, 'mobile.webp'));
    if (mobileSuccess) {
        console.log('✅ Created mobile.webp with perfect gradient');
    }
    
    console.log('\n🎉 Puppeteer-based WebP icon generation complete!');
    console.log('\n📁 Files created:');
    console.log(`   - icons/ directory with ${iconSizes.length} WebP files (perfect gradients)`);
    console.log(`   - icons/ directory with ${iconSizes.length} SVG files`);
    console.log('   - screenshots/ directory with WebP screenshots (perfect gradients)');
    console.log('\n✅ SVG gradients converted perfectly to WebP using browser rendering!');
    console.log('\n📋 Next steps:');
    console.log('   1. Check the WebP files for correct gradient colors');
    console.log('   2. Update manifest.json to use WebP icons');
    console.log('   3. Test PWA installation');
    console.log('   4. Deploy to GitHub Pages');
    console.log('\n🚀 Your PWA is ready for deployment with perfect WebP gradient colors!');
}

// Run the icon generation
generateIcons().catch(error => {
    console.error('Error generating icons:', error);
    process.exit(1);
});

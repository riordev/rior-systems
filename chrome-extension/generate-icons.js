// Simple script to generate PNG icons from SVGs
// Requires: npm install sharp

const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128];

async function generateIcons() {
  try {
    // Try to use sharp if available
    const sharp = require('sharp');
    
    for (const size of sizes) {
      const svgPath = path.join(__dirname, `icons/icon${size}.svg`);
      const pngPath = path.join(__dirname, `icons/icon${size}.png`);
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(size, size)
          .png()
          .toFile(pngPath);
        console.log(`Generated icon${size}.png`);
      }
    }
    console.log('All icons generated successfully!');
  } catch (error) {
    console.log('Note: Install sharp (npm install sharp) to auto-generate PNG icons from SVGs');
    console.log('Or manually convert the SVG files in the icons/ folder to PNG format');
  }
}

generateIcons();
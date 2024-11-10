import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generateIcons() {
  try {
    // Install sharp locally in a temporary directory
    await execAsync('mkdir -p temp && cd temp && npm init -y && npm install sharp');
    
    // Create the conversion script
    const scriptContent = `
    import sharp from 'sharp';
    
    async function convert() {
      const faviconSvg = await fs.readFile('../client/public/assets/favicon-base.svg');
      const maskableSvg = await fs.readFile('../client/public/assets/maskable-base.svg');
      
      // Generate PNG versions first
      await Promise.all([
        sharp(faviconSvg)
          .resize(16, 16)
          .png()
          .toFile('../client/public/assets/favicon-16x16.png'),
          
        sharp(faviconSvg)
          .resize(32, 32)
          .png()
          .toFile('../client/public/assets/favicon-32x32.png'),
          
        sharp(faviconSvg)
          .resize(180, 180)
          .png()
          .toFile('../client/public/assets/apple-touch-icon-180x180.png'),
          
        sharp(maskableSvg)
          .resize(512, 512)
          .png()
          .toFile('../client/public/assets/maskable-icon.png'),

        // Create a 32x32 PNG for favicon.ico
        sharp(faviconSvg)
          .resize(32, 32)
          .png()
          .toFile('../client/public/assets/favicon-temp.png')
      ]);

      // Use ImageMagick to convert PNG to ICO
      await new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec('convert ../client/public/assets/favicon-temp.png ../client/public/favicon.ico', (error) => {
          if (error) {
            reject(error);
            return;
          }
          // Clean up temporary PNG
          fs.unlink('../client/public/assets/favicon-temp.png').then(resolve).catch(reject);
        });
      });
    }
    
    convert().catch(console.error);
    `;
    
    await fs.writeFile('temp/convert.mjs', scriptContent);
    
    // Run the conversion script
    await execAsync('cd temp && node convert.mjs');
    
    // Clean up
    await execAsync('rm -rf temp');
    
    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

generateIcons();

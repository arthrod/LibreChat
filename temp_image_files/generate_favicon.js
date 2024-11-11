import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

async function generateFavicon() {
  try {
    const currentDir = process.cwd();
    console.log('Current directory:', currentDir);

    // Ensure directories exist
    const publicDir = path.join(currentDir, 'client', 'public');
    await fs.mkdir(publicDir, { recursive: true });
    console.log('Public directory created:', publicDir);

    // Create temp directory and install sharp
    const tempDir = path.join(currentDir, 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    await execAsync('cd temp && npm init -y && npm install sharp');
    console.log('Sharp installed in:', tempDir);
    
    // Create the conversion script
    const scriptContent = `
    import sharp from 'sharp';
    import { promises as fs } from 'fs';
    import path from 'path';
    import { exec as execCallback } from 'child_process';
    import { promisify } from 'util';
    
    const exec = promisify(execCallback);
    
    async function convert() {
      const currentDir = process.cwd();
      const publicDir = path.join(currentDir, '..', 'client', 'public');
      const pngPath = path.join(publicDir, 'favicon.png');
      const icoPath = path.join(publicDir, 'favicon.ico');
      
      console.log('Working directory:', currentDir);
      console.log('PNG path:', pngPath);
      console.log('ICO path:', icoPath);
      
      // Create a red circle with gradient on transparent background
      const svgBuffer = Buffer.from(\`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="redGradient" cx="30%" cy="30%" r="70%" fx="30%" fy="30%">
              <stop offset="0%" style="stop-color:#FF4040"/>
              <stop offset="100%" style="stop-color:#B80000"/>
            </radialGradient>
          </defs>
          <rect width="32" height="32" fill="none"/>
          <circle cx="16" cy="16" r="16" fill="url(#redGradient)"/>
        </svg>
      \`);

      console.log('Creating PNG...');
      
      // Save as PNG with transparency
      await sharp(svgBuffer, { animated: false })
        .resize(32, 32)
        .png({ compressionLevel: 9 })
        .toFile(pngPath);

      console.log('PNG created at:', pngPath);
      console.log('PNG exists:', await fs.stat(pngPath).then(() => true).catch(() => false));

      try {
        // Use magick command with explicit transparency settings
        const magickCmd = \`magick "\${pngPath}" -background none -extent 32x32 "\${icoPath}"\`;
        console.log('Running command:', magickCmd);
        
        const { stdout, stderr } = await exec(magickCmd);
        
        if (stderr) {
          console.error('Magick stderr:', stderr);
        }
        if (stdout) {
          console.log('Magick stdout:', stdout);
        }
        
        console.log('ICO created');
        console.log('ICO exists:', await fs.stat(icoPath).then(() => true).catch(() => false));
        
        // Keep both PNG and ICO files
        console.log('Files generated successfully');
      } catch (error) {
        console.error('Error during conversion:', error);
        throw error;
      }
    }
    
    convert().catch(error => {
      console.error('Conversion error:', error);
      process.exit(1);
    });
    `;
    
    console.log('Writing conversion script...');
    await fs.writeFile(path.join(tempDir, 'convert.mjs'), scriptContent);
    
    // Run the conversion script
    console.log('Running conversion script...');
    const { stdout, stderr } = await execAsync('cd temp && node convert.mjs');
    console.log('Script output:', stdout);
    if (stderr) console.error('Script errors:', stderr);
    
    // Clean up temp directory but keep the generated files
    console.log('Cleaning up temp directory...');
    await execAsync('rm -rf temp');
    
    console.log('Process complete!');
  } catch (error) {
    console.error('Error in main process:', error);
    throw error;
  }
}

generateFavicon().catch(console.error);

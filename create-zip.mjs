import yazl from 'yazl';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zipfile = new yazl.ZipFile();
const themeDir = path.join(__dirname, 'tebex-theme');
const outputPath = path.join(__dirname, 'public', 'fivem-dark-pro-theme.zip');

function addDirectoryToZip(dirPath, zipPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const zipEntryPath = zipPath ? `${zipPath}/${entry.name}` : entry.name;
        
        if (entry.isDirectory()) {
            addDirectoryToZip(fullPath, zipEntryPath);
        } else {
            zipfile.addFile(fullPath, zipEntryPath);
        }
    }
}

addDirectoryToZip(themeDir, '');

zipfile.outputStream.pipe(fs.createWriteStream(outputPath)).on('close', () => {
    console.log('ZIP file created successfully!');
    console.log('Path:', outputPath);
});

zipfile.end();

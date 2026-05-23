const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'public', 'fivem-dark-pro-theme.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log('ZIP file created successfully!');
    console.log('Total bytes: ' + archive.pointer());
});

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);

// Add the tebex-theme directory contents to the root of the zip
archive.directory('tebex-theme/', false);

archive.finalize();

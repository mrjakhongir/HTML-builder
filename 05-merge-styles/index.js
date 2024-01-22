const path = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;

const stylesFolderPath = path.join(__dirname, 'styles');
const bundledStylesPath = path.join(__dirname, 'project-dist', 'bundle.css');

const writableStream = fs.createWriteStream(bundledStylesPath);

async function bundleStyles() {
  const files = await readdir(stylesFolderPath, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(
        path.join(stylesFolderPath, file.name),
        'utf-8',
      );
      readableStream.on('data', (chunk) => {
        writableStream.write(chunk);
      });
    }
  }
}

bundleStyles();

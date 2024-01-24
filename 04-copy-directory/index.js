const { mkdir, readdir } = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

async function copyDir() {
  const newFilesPath = path.join(__dirname, 'files-copy');
  const oldFilesPath = path.join(__dirname, 'files');

  await mkdir(newFilesPath, { recursive: true });

  const files = await readdir(oldFilesPath, { withFileTypes: true });

  for (let file of files) {
    const readableStream = fs.createReadStream(
      path.join(oldFilesPath, file.name),
      'utf-8',
    );
    const writableStream = fs.createWriteStream(
      path.join(newFilesPath, file.name),
    );
    readableStream.on('data', (data) => {
      writableStream.write(data);
    });
  }
}

copyDir();

const path = require('path');
const fs = require('fs');
const { readdir } = require('fs').promises;

const pathToSecretFolder = path.join(__dirname, 'secret-folder');

async function getFileNames(myPath) {
  const files = await readdir(myPath, { withFileTypes: true });
  for (let dirent of files) {
    if (dirent.isFile()) {
      const a = path.join(dirent.path, dirent.name);
      fs.stat(a, (err, stats) => {
        if (err) throw err;
        let fileName = dirent.name.split('.');
        console.log(
          `${fileName[0]} - ${path.extname(dirent.name).substring(1)} - ${
            stats.size / 1024
          } kb`,
        );
      });
    }
  }
}

getFileNames(pathToSecretFolder);

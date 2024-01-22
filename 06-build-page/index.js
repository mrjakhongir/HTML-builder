const { mkdir, readdir } = require('node:fs/promises');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

async function copyDir() {
  if (!fs.existsSync(path.join(__dirname, 'project-dist'))) {
    await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  }
  if (!fs.existsSync(path.join(__dirname, 'project-dist', 'assets'))) {
    await mkdir(path.join(__dirname, 'project-dist', 'assets'), {
      recursive: true,
    });
  }
  const folders = await readdir(path.join(__dirname, 'assets'), {
    withFileTypes: true,
  });

  for (let folder of folders) {
    if (
      !fs.existsSync(
        path.join(__dirname, 'project-dist', 'assets', folder.name),
      )
    ) {
      await mkdir(path.join(__dirname, 'project-dist', 'assets', folder.name), {
        recursive: true,
      });
    }
    const files = await readdir(path.join(__dirname, 'assets', folder.name), {
      withFileTypes: true,
    });
    for (let file of files) {
      const readableStream = fs.createReadStream(
        path.join(__dirname, 'assets', folder.name, file.name),
        'utf-8',
      );
      const writableStream = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'assets', folder.name, file.name),
      );
      readableStream.on('data', (data) => {
        writableStream.write(data);
      });
    }
  }
}

async function bundleStyles() {
  const files = await readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });

  const writableStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );
  for (let file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(
        path.join(path.join(__dirname, 'styles'), file.name),
        'utf-8',
      );
      readableStream.on('data', (chunk) => {
        writableStream.write(`/* ${file.name} */\n\n ${chunk} \n`);
      });
    }
  }
}

async function getArticle() {
  let a = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  let b = await fsPromises.readFile(
    path.join(__dirname, 'components', 'articles.html'),
    'utf-8',
  );
  a.replace('{{articles}}', b);
}

copyDir();
bundleStyles();
getArticle();

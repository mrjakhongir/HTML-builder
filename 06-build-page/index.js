const { mkdir, readdir, readFile, writeFile } = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

async function copyDir() {
  await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });

  await mkdir(path.join(__dirname, 'project-dist', 'assets'), {
    recursive: true,
  });

  const folders = await readdir(path.join(__dirname, 'assets'), {
    withFileTypes: true,
  });

  for (let folder of folders) {
    await mkdir(path.join(__dirname, 'project-dist', 'assets', folder.name), {
      recursive: true,
    });
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

async function bundleHTML() {
  await copyMainFile(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'project-dist', 'index.html'),
  );
  let HTMLfile = await readFile(
    path.join(__dirname, 'project-dist', 'index.html'),
    'utf-8',
  );
  const components = await readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });

  const newHTML = await replaceTags(
    HTMLfile,
    components,
    path.join(__dirname, 'components'),
  );
  await writeFile(path.join(__dirname, 'project-dist', 'index.html'), newHTML);
}

async function copyMainFile(pathToFile, bundleFile) {
  const content = await readFile(pathToFile, 'utf-8');
  await writeFile(bundleFile, content);
}

async function replaceTags(HTMLfile, files, pathDir) {
  for (let i = 0; i < files.length; i += 1) {
    const filePath = path.join(pathDir, files[i].name);
    if (files[i].isFile() && path.extname(filePath) === '.html') {
      const fileName = files[i].name.slice(0, files[i].name.lastIndexOf('.'));
      const fileData = await readFile(filePath, 'utf-8');
      HTMLfile = HTMLfile.replace(`{{${fileName}}}`, fileData);
    }
  }
  return HTMLfile;
}

copyDir();
bundleStyles();
bundleHTML();

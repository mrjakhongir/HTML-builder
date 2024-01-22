const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');

const output = fs.createWriteStream(path.join(__dirname, 'message.txt'));

stdout.write('Enter your message: ');
stdin.on('data', (data) => {
  let msg = data.toString().trim();
  writeMessage(msg);
});

function writeMessage(msg) {
  if (msg.toLowerCase() === 'exit') {
    process.exit();
  }
  output.write(`${msg}\n`);
}

process.on('exit', () =>
  stdout.write(
    'Your messages written in the message.txt file in the directory 02-write-file',
  ),
);

process.on('SIGINT', () => {
  process.exit();
});

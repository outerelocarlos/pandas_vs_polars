// cleanup.js
const { exec } = require('child_process');
const depcheck = require('depcheck');

const options = {
  // ... options for depcheck
};

depcheck(process.cwd(), options, (unused) => {
  if (unused.dependencies.length > 0) {
    const command = 'npm uninstall ' + unused.dependencies.join(' ');
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Stdout: ${stdout}`);
    });
  } else {
    console.log('No unused dependencies found.');
  }
});
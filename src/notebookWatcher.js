// server/notebookWatcher.js
const chokidar = require('chokidar');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

let isProcessing = false;

function resetExecutionCounts(ipynbPath) {
  // Load the ipynb file as JSON
  const notebookContent = fs.readFileSync(ipynbPath, 'utf8');
  const notebookJSON = JSON.parse(notebookContent);

  let modified = false;  // Flag to check if any execution_count was changed

  // Traverse through the cells to find the execution_count fields
  if (notebookJSON.cells) {
    notebookJSON.cells.forEach(cell => {
      if (cell.cell_type === 'code' && cell.execution_count !== null) {
        cell.execution_count = null;
        modified = true;  // Set the flag if a change was made
      }
    });
  }

  // Only write back to the file if there were changes
  if (modified) {
    fs.writeFileSync(ipynbPath, JSON.stringify(notebookJSON, null, 2), 'utf8');
  }
}

function convertNotebook() {
  isProcessing = true;  // Set the flag

  const notebookPath = '../server/notebook.ipynb';

  // First, reset execution counts
  resetExecutionCounts(notebookPath);

  // Convert to HTML as before
  exec(`jupyter nbconvert ${notebookPath} --to html`, handleExecResult);

  // Convert to Markdown and rename to README.md
  exec(`jupyter nbconvert ${notebookPath} --to markdown --output ../README`, (error, stdout, stderr) => {
    handleExecResult(error, stdout, stderr);
    postProcessMarkdown();

    isProcessing = false;  // Unset the flag
  });
}

function handleExecResult(error, stdout, stderr) {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }

  console.log(`Notebook converted: ${stdout}`);
}

function clearPngFilesInImgDir() {
  const imgDir = '../img';
  if (fs.existsSync(imgDir)) {
    const filesInImgDir = fs.readdirSync(imgDir);
    filesInImgDir.forEach(file => {
      if (path.extname(file) === '.png') {
        fs.unlinkSync(path.join(imgDir, file));
      }
    });
  }
}

function postProcessMarkdown() {
  // Step 1: Clear PNG files in the img directory
  clearPngFilesInImgDir();

  // Step 2: Identify the PNG files in the parent directory
  const pngFiles = glob.sync('../*.png');

  // Step 3: Create the img folder (if it doesn't exist) and move those PNG files into it
  const imgDir = '../img';
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir);
  }
  pngFiles.forEach(file => {
    const dest = path.join(imgDir, path.basename(file));
    fs.renameSync(file, dest);
    // Explicitly remove the file from parent directory (though this might be redundant)
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });

  // Step 4: Update references in the README.md file
  const readmePath = '../README.md';
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  readmeContent = readmeContent.replace(/..\/README_files\/..\//g, './img/');
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
}

// Initial conversion
convertNotebook();

// Setup watcher
const watcher = chokidar.watch('../server/notebook.ipynb');

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`);
  if (!isProcessing) {
    convertNotebook();
  }
});

module.exports = (req, res, next) => {
  next();
};
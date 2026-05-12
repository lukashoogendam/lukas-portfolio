const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const srcDir = path.join(__dirname, 'src', 'app');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.endsWith('.ts') || name.endsWith('.html') || name.endsWith('.scss')) {
        files.push(name);
      }
    }
  }
  return files;
}

const files = getFiles(srcDir);
let count = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  if (file.endsWith('.ts') || file.endsWith('.scss')) {
    // strip-comments is great for JS/TS/CSS
    newContent = strip(content, { keepProtected: false });
  } else if (file.endsWith('.html')) {
    // For HTML, strip-comments might work, but let's use a safe regex
    newContent = content.replace(/<!--[\s\S]*?-->/g, '');
  }

  // Remove empty lines created by comment removal
  newContent = newContent.replace(/^\s*[\r\n]/gm, '');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    count++;
  }
}

console.log(`Removed comments from ${count} files.`);

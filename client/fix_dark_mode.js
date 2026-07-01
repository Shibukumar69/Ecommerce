import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir(srcDir, filePath => {
  if (path.extname(filePath) !== '.tsx') return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // If the line contains text-slate-500 but does not contain a dark mode text class
    if (line.includes('text-slate-500') && !line.includes('dark:text-')) {
      lines[i] = line.split('text-slate-500').join('text-slate-500 dark:text-slate-400');
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`Updated text-slate-500 dark overrides in: ${path.relative(srcDir, filePath)}`);
  }
});

console.log('Dark mode text fixes completed.');

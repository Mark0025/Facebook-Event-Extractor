import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const distDir = new URL('../dist', import.meta.url).pathname;

async function fixImports(file) {
  const content = await readFile(file, 'utf8');
  
  // Add .js extension to relative imports
  const fixedContent = content.replace(
    /from ['"](\.[^'"]+)['"]/g,
    (match, path) => {
      if (path.endsWith('.js')) return match;
      return `from '${path}.js'`;
    }
  );
  
  await writeFile(file, fixedContent);
}

async function processDirectory(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.endsWith('.js')) {
      await fixImports(fullPath);
    }
  }
}

try {
  await processDirectory(distDir);
  console.log('Successfully fixed imports in dist directory');
} catch (error) {
  console.error('Error fixing imports:', error);
  process.exit(1);
} 
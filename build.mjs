import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import path from 'path';
import postcss from 'postcss';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

async function collectCssFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectCssFiles(res));
    } else if (entry.isFile() && res.endsWith('.css')) {
      files.push(res);
    }
  }
  return files;
}

async function build() {
  let files = [];
  try {
    files = await collectCssFiles('src');
  } catch (err) {
    console.error('Failed to read src/:', err);
    return;
  }

  if (!files || files.length === 0) {
    console.log('No CSS files found in src/');
    return;
  }

  await Promise.all(files.map(async (file) => {
    const src = await readFile(file, 'utf8');
    const outPath = path.join('dist', path.relative('src', file));
    const result = await postcss([
      atImport(),
      autoprefixer(),
      cssnano({ preset: 'default' })
    ]).process(src, { from: file, to: outPath });

    await mkdir(path.dirname(outPath), { recursive: true });
    const wrappedCss = `@layer eno{${result.css}}`;
    await writeFile(outPath, wrappedCss, 'utf8');
    console.log('written:', outPath);
  }));
}

try {
  await build();
} catch (err) {
  console.error(err);
  process.exit(1);
}
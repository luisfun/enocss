import fg from 'fast-glob';
import { readFile, mkdir, writeFile } from 'fs/promises';
import path from 'path';
import postcss from 'postcss';
import atImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

async function build() {
  const files = await fg('src/**/*.css');
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
    await writeFile(outPath, result.css, 'utf8');
    console.log('written:', outPath);
  }));
}

try {
  await build();
} catch (err) {
  console.error(err);
  process.exit(1);
}
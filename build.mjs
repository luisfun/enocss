// ...existing code...
const fg = require('fast-glob');
const fs = require('fs').promises;
const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

async function build() {
  const files = await fg('src/**/*.css');
  if (files.length === 0) {
    console.log('No CSS files found in src/');
    return;
  }

  await Promise.all(files.map(async (file) => {
    const src = await fs.readFile(file, 'utf8');
    const outPath = path.join('dist', path.relative('src', file));
    const result = await postcss([
      atImport(),
      autoprefixer(),
      cssnano({ preset: 'default' })
    ]).process(src, { from: file, to: outPath });

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, result.css, 'utf8');
    console.log('written:', outPath);
  }));
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
// ...existing code...
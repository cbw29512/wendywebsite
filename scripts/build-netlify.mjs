import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const out = path.join(root, '_site');
const excluded = new Set(['.git', '.github', '_site', 'scripts', 'PROJECT_SPEC.md', 'README.md', 'netlify.toml', '.nojekyll']);

async function copySite() {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (excluded.has(entry.name)) continue;
    await cp(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
  }
}

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await walk(full));
    else found.push(full);
  }
  return found;
}

function canonicalFor(file) {
  const rel = path.relative(out, file).replaceAll(path.sep, '/');
  if (rel === 'index.html') return 'https://wanderedandfound.org/';
  if (rel.endsWith('/index.html')) return `https://wanderedandfound.org/${rel.slice(0, -10)}`;
  return `https://wanderedandfound.org/${rel}`;
}

async function prepareProductionHtml() {
  for (const file of (await walk(out)).filter((item) => item.endsWith('.html'))) {
    let html = await readFile(file, 'utf8');
    html = html.replace(
      '<meta name="robots" content="noindex,nofollow">',
      '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'
    );

    const canonical = canonicalFor(file);
    if (!html.includes('rel="canonical"')) {
      html = html.replace('</head>', `  <link rel="canonical" href="${canonical}">\n</head>`);
    }
    if (!html.includes('property="og:url"')) {
      html = html.replace('</head>', `  <meta property="og:url" content="${canonical}">\n</head>`);
    }
    await writeFile(file, html, 'utf8');
  }
}

async function writeProductionRobots() {
  const robots = 'User-agent: *\nAllow: /\nSitemap: https://wanderedandfound.org/sitemap.xml\n';
  await writeFile(path.join(out, 'robots.txt'), robots, 'utf8');
}

try {
  await copySite();
  await prepareProductionHtml();
  await writeProductionRobots();
  console.log('Production site built in _site with indexing enabled for wanderedandfound.org.');
} catch (error) {
  console.error('Netlify production build failed.', error);
  process.exitCode = 1;
}

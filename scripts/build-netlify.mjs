import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const out = path.join(root, '_site');
const excluded = new Set(['.git', '.github', '_site', 'scripts', 'PROJECT_SPEC.md', 'README.md', 'WENDY_HANDOFF.md', 'netlify.toml', '.nojekyll']);
const neverIndex = new Set(['admin/index.html', '404.html']);

const publicIndexingEnabled = process.env.PUBLIC_INDEXING === 'enabled';
const publicSiteUrl = (process.env.PUBLIC_SITE_URL || 'https://wanderedandfound.org').replace(/\/+$/, '');

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

function relativeWebPath(file) {
  return path.relative(out, file).replaceAll(path.sep, '/');
}

function canonicalFor(file) {
  const rel = relativeWebPath(file);
  if (rel === 'index.html') return `${publicSiteUrl}/`;
  if (rel.endsWith('/index.html')) return `${publicSiteUrl}/${rel.slice(0, -10)}`;
  return `${publicSiteUrl}/${rel}`;
}

function ensurePreviewNoIndex(html) {
  if (html.includes('<meta name="robots"')) {
    return html.replace(
      /<meta name="robots" content="[^"]*">/,
      '<meta name="robots" content="noindex,nofollow">'
    );
  }
  return html.replace('</head>', '  <meta name="robots" content="noindex,nofollow">\n</head>');
}

async function prepareHtml() {
  for (const file of (await walk(out)).filter((item) => item.endsWith('.html'))) {
    let html = await readFile(file, 'utf8');
    const rel = relativeWebPath(file);

    if (neverIndex.has(rel) || !publicIndexingEnabled) {
      html = ensurePreviewNoIndex(html);
    } else {
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
    }

    await writeFile(file, html, 'utf8');
  }
}

async function writeRobots() {
  const robots = publicIndexingEnabled
    ? `User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${publicSiteUrl}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
  await writeFile(path.join(out, 'robots.txt'), robots, 'utf8');
}

try {
  await copySite();
  await prepareHtml();
  await writeRobots();
  console.log(
    publicIndexingEnabled
      ? `Production site built in _site with public indexing enabled for ${publicSiteUrl}.`
      : 'Handoff/preview site built in _site with public indexing disabled.'
  );
} catch (error) {
  console.error('Netlify site build failed.', error);
  process.exitCode = 1;
}

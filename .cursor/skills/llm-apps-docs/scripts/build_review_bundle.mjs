#!/usr/bin/env node

/**
 * Build a shareable, offline HTML review bundle from llm-apps.en.
 *
 * Safety: all source and output paths are derived from this checked-in script.
 * The only subprocesses use fixed executables and arguments; no user input is
 * passed to a shell.
 */

import { execFileSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../../../..');
const workspaceRoot = dirname(repoRoot);
const helpRoot = join(repoRoot, 'help');
const tocPath = join(helpRoot, 'main-toc', 'TOC.md');

const now = new Date();
const stamp = now.toISOString()
  .replace(/[-:]/g, '')
  .replace('T', '-')
  .slice(0, 15);
const bundleName = `llm-apps-doc-review-${stamp}`;
const bundleRoot = join(workspaceRoot, bundleName);
const zipPath = join(workspaceRoot, `${bundleName}.zip`);

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function articleOutput(sourcePath) {
  if (sourcePath === '/help/overview/overview.md') {
    return 'index.html';
  }
  return `${basename(sourcePath, '.md')}.html`;
}

function parseToc(markdown) {
  const sections = [];
  const articles = [];
  let currentSection = 'Overview';

  for (const line of markdown.split('\n')) {
    const sectionMatch = line.match(/^\+ (?!\[)(.+?)(?: \{#[^}]+})?$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      sections.push(currentSection);
      continue;
    }

    const linkMatch = line.match(/^\s*\+ \[([^\]]+)]\((\/help\/[^)]+\.md)\)$/);
    if (linkMatch) {
      articles.push({
        label: linkMatch[1],
        sourcePath: linkMatch[2],
        outputPath: articleOutput(linkMatch[2]),
        section: currentSection
      });
    }
  }

  return { articles, sections };
}

function preprocess(markdown, pathMap) {
  let value = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');

  value = value
    .replace(/\[\!DNL ([^\]]+)]/g, '$1')
    .replace(/\[\!UICONTROL ([^\]]+)]/g, '**$1**')
    .replace(/^>\[!IMPORTANT]\s*$/gm, '> **Important**')
    .replace(/^>\[!NOTE]\s*$/gm, '> **Note**')
    .replace(/^>\[!TIP]\s*$/gm, '> **Tip**')
    .replace(
      /^(#{1,6}) (.+?) \{#([^}]+)}\s*$/gm,
      '<a id="$3"></a>\n$1 $2'
    )
    .replace(
      /\]\((\/help\/[^)#]+\.md)(#[^)]+)?\)/g,
      (_match, target, fragment = '') => {
        const output = pathMap.get(target);
        return output ? `](${output}${fragment})` : _match;
      }
    )
    .replace(/\]\(\/help\/assets\//g, '](assets/');

  return value;
}

function renderMarkdown(markdown) {
  return execFileSync('npx', ['--yes', 'marked'], {
    encoding: 'utf8',
    input: markdown,
    maxBuffer: 20 * 1024 * 1024
  });
}

function pageTemplate({ body, description, nav, title }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)} · LLM Apps Documentation Review</title>
  <link rel="stylesheet" href="review.css">
</head>
<body>
  <header class="review-banner">
    Review build · Offline HTML rendering · Not final Experience League styling
  </header>
  <div class="layout">
    <aside>
      <a class="brand" href="index.html">Adobe LLM Apps</a>
      ${nav}
    </aside>
    <main>
      ${body}
      <footer>Generated ${escapeHtml(now.toLocaleString())}</footer>
    </main>
  </div>
</body>
</html>
`;
}

const styles = `
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --panel: #f5f5f5;
  --text: #202020;
  --muted: #666666;
  --border: #d8d8d8;
  --link: #2457d6;
  --code: #f2f2f2;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1e1e1e;
    --panel: #292929;
    --text: #eeeeee;
    --muted: #b5b5b5;
    --border: #4a4a4a;
    --link: #8ab4ff;
    --code: #2f2f2f;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.review-banner {
  padding: 10px 24px;
  background: #fff2cc;
  color: #4b3b00;
  border-bottom: 1px solid #e0c56e;
  font-size: 14px;
  text-align: center;
}
.layout {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  min-height: calc(100vh - 43px);
}
aside {
  padding: 24px 20px 40px;
  background: var(--panel);
  border-right: 1px solid var(--border);
}
.brand {
  display: block;
  margin-bottom: 24px;
  color: var(--text);
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
}
.nav-section {
  margin: 22px 8px 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .04em;
  text-transform: uppercase;
}
aside a.nav-link {
  display: block;
  padding: 7px 10px;
  border-radius: 5px;
  color: var(--text);
  text-decoration: none;
}
aside a.nav-link:hover,
aside a.nav-link.active {
  background: var(--bg);
  color: var(--link);
}
main {
  width: min(920px, calc(100% - 48px));
  margin: 0 auto;
  padding: 42px 0 80px;
}
h1 { margin-top: 0; font-size: 2.25rem; line-height: 1.2; }
h2 { margin-top: 2.3em; border-bottom: 1px solid var(--border); padding-bottom: .25em; }
h3 { margin-top: 1.8em; }
a { color: var(--link); }
img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 24px auto;
  border: 1px solid var(--border);
}
blockquote {
  margin: 22px 0;
  padding: 12px 18px;
  background: var(--panel);
  border-left: 4px solid var(--link);
}
pre {
  overflow-x: auto;
  padding: 16px;
  background: var(--code);
  border: 1px solid var(--border);
  border-radius: 6px;
}
code {
  padding: .1em .3em;
  background: var(--code);
  border-radius: 3px;
}
pre code { padding: 0; background: transparent; }
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}
th, td {
  padding: 10px 12px;
  border: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}
th { background: var(--panel); }
footer {
  margin-top: 60px;
  padding-top: 20px;
  color: var(--muted);
  border-top: 1px solid var(--border);
  font-size: 13px;
}
@media (max-width: 820px) {
  .layout { display: block; }
  aside { border-right: 0; border-bottom: 1px solid var(--border); }
  main { width: min(100% - 32px, 920px); padding-top: 28px; }
}
`;

mkdirSync(bundleRoot, { recursive: true });
cpSync(join(helpRoot, 'assets'), join(bundleRoot, 'assets'), { recursive: true });
writeFileSync(join(bundleRoot, 'review.css'), styles);

const toc = parseToc(readFileSync(tocPath, 'utf8'));
const pathMap = new Map(
  toc.articles.map((article) => [article.sourcePath, article.outputPath])
);

for (const article of toc.articles) {
  const absolutePath = join(repoRoot, article.sourcePath.slice(1));
  const source = readFileSync(absolutePath, 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  const metadata = frontmatter?.[1] ?? '';
  const title = metadata.match(/^title:\s*(.+)$/m)?.[1] ?? article.label;
  const description = metadata.match(/^description:\s*(.+)$/m)?.[1] ?? '';
  const body = renderMarkdown(preprocess(source, pathMap));

  let currentSection = '';
  const nav = toc.articles.map((item) => {
    let output = '';
    if (item.section !== currentSection) {
      currentSection = item.section;
      output += `<div class="nav-section">${escapeHtml(currentSection)}</div>`;
    }
    const active = item.outputPath === article.outputPath ? ' active' : '';
    output += `<a class="nav-link${active}" href="${item.outputPath}">${escapeHtml(item.label)}</a>`;
    return output;
  }).join('\n');

  writeFileSync(
    join(bundleRoot, article.outputPath),
    pageTemplate({ body, description, nav, title })
  );
}

writeFileSync(
  join(bundleRoot, 'README.txt'),
  [
    'Adobe LLM Apps documentation review bundle',
    '',
    'Open index.html in a web browser.',
    'No server or installation is required.',
    '',
    'This is an offline review rendering, not the final Experience League styling.'
  ].join('\n')
);

execFileSync('zip', ['-qr', basename(zipPath), bundleName], {
  cwd: workspaceRoot,
  stdio: 'inherit'
});

console.log(`Review site: ${bundleRoot}`);
console.log(`Archive: ${zipPath}`);

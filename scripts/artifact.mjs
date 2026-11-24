// Turns dist/index.html into the page body the claude.ai Artifact host expects
// (it adds its own <html>/<head>/<body>), keeping the title, fonts, styles and the app script.
import { readFileSync, writeFileSync } from 'node:fs'
const html = readFileSync('dist/index.html', 'utf8')
const keep = [...html.matchAll(/<title>.*?<\/title>|<link href="https:\/\/fonts[^>]+>|<link rel="stylesheet"[^>]+>|<script type="module"[^>]+><\/script>/g)].map((m) => m[0])
writeFileSync('dist/artifact.html', [...keep, '<div id="root"></div>', ''].join('\n'))
console.log(readFileSync('dist/artifact.html', 'utf8'))

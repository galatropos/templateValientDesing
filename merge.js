const fs = require('fs');
const path = require('path');

// Leer HTML original
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// ----------------------
//  Procesar CSS
// ----------------------
const cssRegex = /<link\s+rel=["']stylesheet["']\s+href=["']\.\/assets\/css\/([^"']+)["']\s*\/?>/g;

let cssMatch;
const cssFiles = [];
while ((cssMatch = cssRegex.exec(html)) !== null) {
  cssFiles.push(cssMatch[1]);
}

const cssCombined = cssFiles
  .map(file => {
    const filePath = path.join(__dirname, 'assets/css', file);
    return fs.readFileSync(filePath, 'utf8');
  })
  .join('\n');

/* Eliminar las etiquetas <link rel="stylesheet" ...> */
html = html.replace(cssRegex, '');

// Insertar el CSS combinado antes de </head>
html = html.replace('</head>', `<style>\n${cssCombined}\n</style>\n</head>`);

// ----------------------
// Procesar JS
// ----------------------
const scriptRegex = /<script\s+src=["']\.\/assets\/js\/([^"']+)["']\s*><\/script>/g;

let scriptMatch;
const scriptFiles = [];
while ((scriptMatch = scriptRegex.exec(html)) !== null) {
  scriptFiles.push(scriptMatch[1]);
}

const jsCombined = scriptFiles
  .map(file => {
    const filePath = path.join(__dirname, 'assets/js', file);
    return fs.readFileSync(filePath, 'utf8');
  })
  .join('\n\n');

/* Eliminar las etiquetas <script src="..."> */
html = html.replace(scriptRegex, '');

// Insertar JS combinado antes de </body>
html = html.replace('</body>', `<script>\n${jsCombined}\n</script>\n</body>`);

// ----------------------
// Guardar el resultado
// ----------------------
const outputPath = path.join(__dirname, 'homepage.html');
fs.writeFileSync(outputPath, html);

console.log('"homepage.html" generado correctamente.');

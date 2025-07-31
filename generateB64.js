const fs = require("fs");
const path = require("path");

// 🖼️ Parte 1: imágenes base64

const inputFile = path.join(__dirname, "assets", "image", "image.js");
const outputFile = path.join(__dirname, "assets", "js", "image64.js");
const imageDir = path.join(__dirname, "assets", "image");

const content = fs.readFileSync(inputFile, "utf-8");
// Extraer objeto $images
const objMatch = content.match(/\$images\s*=\s*{([\s\S]*?)};/);
console.log(content)

if (!objMatch) {
  console.error("❌ No se encontró la definición de $images en image.js");
  process.exit(1);
}

// Parsear líneas
const lines = objMatch[1].split("\n");
const imageEntries = [];
const lineRegex = /\s*(\w+)\s*:\s*["'](.+?)["'],?/;

for (const line of lines) {
  const match = line.match(lineRegex);
  if (match) {
    const key = match[1];
    const relativePath = match[2];
    imageEntries.push({ key, relativePath });
  }
}

let output = "// Archivo generado automáticamente con imágenes en base64 *No modificar*\n\n";
output += "const $images = {\n";

const mimeMap = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

for (const { key, relativePath } of imageEntries) {
  const fileName = path.basename(relativePath);
  const filePath = path.join(imageDir, fileName);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString("base64");

    const ext = path.extname(fileName).toLowerCase();
    const mime = mimeMap[ext] || "application/octet-stream";

    output += `  ${key}: "data:${mime};base64,${base64}",\n`;
  } else {
    console.warn(`⚠️ Imagen no encontrada: ${fileName}`);
  }
}

output += "};\n";

fs.mkdirSync(path.join(__dirname, "assets", "js"), { recursive: true });
fs.writeFileSync(outputFile, output);

console.log("✅ Archivo 'image64.js' generado en: assets/js/");

// Archivos de fuentes a base64 desde fonts.css


const fontsCSSInput = path.join(__dirname, "assets", "fonts", "fonts.css");
const fontsOutputCSS = path.join(__dirname, "assets", "css", "fontsB64.css");
const baseDir = path.join(__dirname, "assets", "fonts");

// Leer el CSS original
let fontsContent = fs.readFileSync(fontsCSSInput, "utf-8");

// Buscar todas las coincidencias de url('./Carpeta/Archivo.ttf')
const fontUrlRegex = /url\(['"]?\.\/([\w\-\/]+\/[\w\-]+\.(woff2?|ttf|otf|woff))['"]?\)/gi;

fontsContent = fontsContent.replace(fontUrlRegex, (match, relativePath) => {
  const fontPath = path.join(baseDir, relativePath);
  if (!fs.existsSync(fontPath)) {
    console.warn(`⚠️ Fuente no encontrada: ${relativePath}`);
    return match;
  }

  const buffer = fs.readFileSync(fontPath);
  const base64 = buffer.toString("base64");
  const ext = path.extname(fontPath).toLowerCase();
  const mimeMap = {
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
  };
  const mime = mimeMap[ext] || "application/octet-stream";

  return `url("data:${mime};base64,${base64}")`;
});

// Crear carpeta /css si no existe
fs.mkdirSync(path.join(__dirname, "assets", "css"), { recursive: true });

// Escribir archivo convertido
fs.writeFileSync(fontsOutputCSS, fontsContent);
console.log("✅ Archivo 'fontsB64.css' generado con fuentes embebidas.");
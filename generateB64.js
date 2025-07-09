const fs = require("fs");
const path = require("path");

// Ruta del archivo original con las rutas de imágenes
const inputFile = path.join(__dirname, "assets", "image", "image.js");

// Nueva ubicación para el archivo generado
const outputFile = path.join(__dirname, "assets", "js", "image64.js");

// Carpeta donde están físicamente las imágenes
const imageDir = path.join(__dirname, "assets", "image");

// Leer contenido del archivo original
const content = fs.readFileSync(inputFile, "utf-8");

// Buscar líneas como: const $Var = "/assets/image/archivo.webp";
const regex = /const\s+(\$\w+)\s*=\s*["']\/assets\/image\/(.+?)["'];/g;

let match;
let output = "// Archivo generado automáticamente con imágenes en base64 *No modificar* \n\n";
let exportList = [];

while ((match = regex.exec(content)) !== null) {
  const varName = match[1];
  const fileName = match[2];
  const filePath = path.join(imageDir, fileName);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString("base64");

    // Detectar MIME según extensión
    const ext = path.extname(fileName).toLowerCase();
    const mimeMap = {
      ".webp": "image/webp",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };
    const mime = mimeMap[ext] || "application/octet-stream";

    output += `const ${varName} = "data:${mime};base64,${base64}";\n`;
    exportList.push(varName);
  } else {
    console.warn(`Imagen no encontrada: ${fileName}`);
  }
}


// Crear carpeta /assets/js si no existe
fs.mkdirSync(path.join(__dirname, "assets", "js"), { recursive: true });

// Guardar el archivo generado
fs.writeFileSync(outputFile, output);

console.log("Archivo 'image64.js' generado en: assets/js/");


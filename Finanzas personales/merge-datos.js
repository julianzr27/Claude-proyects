// Trae el bloque de datos del artifact publicado al archivo local, sin que las
// cifras pasen por la conversación. Con "restore" devuelve el archivo a semilla,
// para que el repositorio siga guardando solo el código.
const fs = require("fs");
const RE = /(<script type="application\/json" id="datos">)([\s\S]*?)(<\/script>)/;

const [, , modo, localPath, vivoPath] = process.argv;

const local = fs.readFileSync(localPath, "utf8");
if (!RE.test(local)) { console.error("no encontré el bloque de datos en el archivo local"); process.exit(1); }

if (modo === "restore") {
  fs.writeFileSync(localPath, local.replace(RE, `$1{"seed":true}$3`));
  console.log("archivo local devuelto a semilla");
  process.exit(0);
}

const vivo = fs.readFileSync(vivoPath, "utf8");
const m = vivo.match(RE);
if (!m) { console.error("no encontré el bloque de datos en la versión publicada"); process.exit(1); }

const json = m[2];
try { JSON.parse(json); } catch (e) { console.error("los datos publicados no son JSON válido:", e.message); process.exit(1); }

// $ en el reemplazo es especial: se usa función para insertar el texto literal
fs.writeFileSync(localPath, local.replace(RE, (_, a, __, c) => a + json + c));

const d = JSON.parse(json);
console.log("datos mezclados —",
  (d.movimientos || []).length, "movimientos,",
  (d.inversiones || []).length, "posiciones,",
  (d.tarjetas || []).length, "tarjetas");

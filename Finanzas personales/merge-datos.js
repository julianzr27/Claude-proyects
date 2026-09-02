// Trae el bloque de datos del artifact publicado al archivo local, sin que las
// cifras pasen por la conversación. Con "restore" devuelve el archivo a semilla,
// para que el repositorio siga guardando solo el código.
const fs = require("fs");
const RE = /(<script type="application\/json" id="datos">)([\s\S]*?)(<\/script>)/;

const [, , modo, localPath, vivoPath] = process.argv;

// `node merge-datos.js selftest` ejercita el modo precios de punta a punta:
// que multiplique por la cantidad, que respete la fecha del precio y no la de
// hoy, que marque lo que no se pudo traer y que rechace un precio inventado.
if (modo === "selftest") {
  const os = require("os"), path = require("path"), { spawnSync } = require("child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "finanzas-"));
  const html = p => path.join(dir, p);
  const datos = {
    v: 1, config: { moneda: "COP", trm: 3000, trmFecha: "2026-01-01", trmConfirmada: true },
    tarjetas: [], movimientos: [],
    inversiones: [
      { id: "a", nombre: "ISA", tipo: "accion", cantidad: 16, montoInvertido: 1, valorActual: 100, fechaActualizacion: "2026-01-01" },
      { id: "b", nombre: "TIN", tipo: "accion", cantidad: 4, montoInvertido: 1, valorActual: 200, fechaActualizacion: "2026-01-01", sinDato: "viejo" },
      { id: "c", nombre: "NUCO", tipo: "accion", cantidad: 4, montoInvertido: 1, valorActual: 300, fechaActualizacion: "2026-01-01" },
      { id: "d", nombre: "Ahorro", tipo: "cuenta", saldo: 500, fechaSaldo: "2026-01-01", tasaEA: 9 }
    ]
  };
  const doc = n => `<html><script type="application/json" id="datos">${JSON.stringify(n)}</script></html>`;
  const correr = (rep, arch) => {
    fs.writeFileSync(html(arch), doc(datos));
    fs.writeFileSync(html(arch + ".json"), JSON.stringify(rep));
    const r = spawnSync(process.execPath, [__filename, "precios", html(arch), html(arch + ".json")], { encoding: "utf8" });
    return { code: r.status, out: r.stdout + r.stderr, d: JSON.parse(fs.readFileSync(html(arch), "utf8").match(RE)[2]) };
  };
  const ok = (c, m) => { if (!c) { console.error("FALLA: " + m); process.exit(1); } };

  const a = correr({ trm: 3184, trmFecha: "2026-09-02",
    precios: { ISA: { precio: 29200, fecha: "2026-09-02" }, TIN: { precio: 13480, fecha: "2026-08-28" } },
    sinDato: { NUCO: "la fuente no respondió" } }, "a.html");
  const inv = n => a.d.inversiones.find(i => i.nombre === n);
  ok(a.code === 0, "salió con error: " + a.out);
  ok(inv("ISA").valorActual === 29200 * 16, "ISA no multiplicó por la cantidad");
  ok(inv("TIN").valorActual === 13480 * 4, "TIN no multiplicó por la cantidad");
  ok(inv("TIN").fechaActualizacion === "2026-08-28", "TIN guardó la fecha de hoy y no la del precio");
  ok(inv("TIN").sinDato === undefined, "TIN conservó el sinDato tras actualizarse bien");
  ok(inv("NUCO").valorActual === 300 && inv("NUCO").sinDato === "la fuente no respondió", "NUCO no quedó marcada sin tocar su precio");
  ok(inv("Ahorro").saldo === 500, "tocó una cuenta, que no le corresponde");
  ok(a.d.config.trm === 3184 && a.d.config.trmFecha === "2026-09-02", "no actualizó la TRM");
  ok(a.d.movimientos.length === 0 && a.d.tarjetas.length === 0, "movió algo fuera de las acciones");

  const b = correr({ precios: { ISA: { precio: 0, fecha: "2026-09-02" } } }, "b.html");
  ok(b.code !== 0 && b.d.inversiones[0].valorActual === 100, "aceptó un precio en cero");
  const c = correr({ precios: { ISA: { precio: 29200, fecha: "ayer" } } }, "c.html");
  ok(c.code !== 0 && c.d.inversiones[0].valorActual === 100, "aceptó una fecha con formato inválido");

  fs.rmSync(dir, { recursive: true, force: true });
  console.log("selftest ok");
  process.exit(0);
}

const local = fs.readFileSync(localPath, "utf8");
if (!RE.test(local)) { console.error("no encontré el bloque de datos en el archivo local"); process.exit(1); }

if (modo === "restore") {
  fs.writeFileSync(localPath, local.replace(RE, `$1{"seed":true}$3`));
  console.log("archivo local devuelto a semilla");
  process.exit(0);
}

// El agente quincenal escribe los precios que consultó por web. Recibe un JSON
// { trm, trmFecha, precios: { NOMBRE: {precio, fecha} }, sinDato: { NOMBRE: razón } }
// y no toca nada más: cantidades, costo e historial quedan como estaban.
if (modo === "precios") {
  const p = JSON.parse(fs.readFileSync(vivoPath, "utf8"));
  const d = JSON.parse(local.match(RE)[2]);
  if (d.seed) { console.error("el archivo local está en semilla: primero haz merge con el artifact vivo"); process.exit(1); }

  const fechaOk = f => /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(f || "");
  const acciones = (d.inversiones || []).filter(i => i.tipo === "accion");
  const vistos = new Set(), lineas = [];

  for (const i of acciones) {
    const nuevo = (p.precios || {})[i.nombre];
    const falla = (p.sinDato || {})[i.nombre];
    if (nuevo) {
      if (!(+nuevo.precio > 0) || !fechaOk(nuevo.fecha)) {
        console.error(i.nombre + ": precio o fecha inválidos, no invento nada"); process.exit(1);
      }
      const cant = +i.cantidad > 0 ? +i.cantidad : 1;
      const antes = +i.valorActual || 0;
      i.valorActual = Math.round(cant * +nuevo.precio);
      i.fechaActualizacion = nuevo.fecha;
      delete i.sinDato;
      lineas.push(i.nombre + ": " + antes + " → " + i.valorActual + " (" + nuevo.precio + " × " + cant + ", precio del " + nuevo.fecha + ")");
    } else if (falla) {
      i.sinDato = String(falla).slice(0, 60);
      lineas.push(i.nombre + ": SIN DATO — " + i.sinDato + " (queda el precio del " + (i.fechaActualizacion || "?") + ")");
    } else {
      lineas.push(i.nombre + ": no venía en el reporte, sin tocar");
    }
    vistos.add(i.nombre);
  }
  for (const n of Object.keys(p.precios || {})) if (!vistos.has(n)) lineas.push(n + ": no existe como posición, ignorado");

  if (p.trm !== undefined) {
    if (!(+p.trm > 0) || !fechaOk(p.trmFecha)) { console.error("TRM o su fecha inválidas"); process.exit(1); }
    lineas.push("TRM: " + d.config.trm + " → " + Math.round(p.trm) + " (del " + p.trmFecha + ")");
    d.config.trm = Math.round(p.trm);
    d.config.trmFecha = p.trmFecha;
    d.config.trmConfirmada = true;
  }

  const json = JSON.stringify(d).replace(/<\//g, "<\\/"); // igual que renderDoc en el dashboard
  fs.writeFileSync(localPath, local.replace(RE, (_, a, __, c) => a + json + c));
  console.log(lineas.join("\n"));
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

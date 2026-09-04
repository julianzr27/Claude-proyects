# Libro de finanzas — contexto del proyecto

Dashboard personal de finanzas de Julián, publicado como Artifact privado de
claude.ai. Todo vive en un solo archivo: `finanzas.html`.

**Artifact:** https://claude.ai/code/artifact/31f788e2-795c-4590-9868-7531740b0751

## Regla de oro: dónde viven los datos

El repositorio guarda **solo el código**. Las cifras reales de Julián viven
únicamente en el Artifact publicado, que es privado. En `finanzas.html` el
bloque `<script id="datos">` queda siempre en `{"seed":true}` cuando se
commitea. Esto es deliberado: el repositorio es público o podría serlo, y no
debe contener información financiera personal.

## Cómo cambiar el código y publicar

La página se guarda a sí misma: cada vez que Julián registra algo, publica una
versión nueva del Artifact con sus datos embebidos. Por eso **nunca se publica
el archivo local tal cual**, o se borrarían sus datos. El ciclo es:

1. Editar `finanzas.html` local (que tiene `seed`).
2. Probar (ver más abajo).
3. Leer el Artifact vivo con la herramienta Artifact (`action: "read"`). El
   visor exige haber leído el archivo completo antes de dejar publicar encima.
4. Fusionar los datos vivos al archivo local:
   `node merge-datos.js merge finanzas.html <ruta-del-artifact-guardado>`
5. Publicar `finanzas.html` pasando la `url` del Artifact.
6. Devolver el archivo a semilla antes de commitear:
   `node merge-datos.js restore finanzas.html`
7. Commit y push.

## Modelo de datos

```
config      { moneda:"COP", trm, trmFecha, trmConfirmada }
tarjetas    [{ id, nombre, diaCorte, diaPago, saldoInicial, saldoSinFacturar }]
inversiones [{ id, nombre, tipo:"cuenta"|"cdt"|"efectivo"|"accion", moneda?:"USD",
               // renta fija: saldo + tasa
               saldo, fechaSaldo, tasaEA, aportado, interesAcumulado, anclaTs,
               vencimiento?,           // solo CDT
               // acciones: cantidad + valor
               cantidad, montoInvertido, valorActual, fechaCompra?,
               aportadoCOP?            // solo USD: pesos que realmente salieron
             }]
movimientos [{ id, ts, fecha, tipo:"gasto"|"ingreso"|"pago_tarjeta"|"traslado",
               categoria, descripcion, monto, medio?, desde?, hacia?,
               fuente:"manual"|"gmail", gmailMsgId?, imagen? }]
```

## Invariantes y decisiones

- **Todo en COP.** Las posiciones en dólares guardan su monto nativo y una TRM
  global las convierte. `aportadoCOP` guarda los pesos que salieron, y de ahí
  sale la separación entre rendimiento del activo y efecto cambiario.
- **La TRM nunca se inventa.** Si Julián no la ha confirmado se usa la del
  último dólar comprado, para que el efecto cambiario salga en cero en vez de
  fabricar una ganancia contra un número arbitrario.
- **El saldo confirmado es el ancla.** El valor de una cuenta es
  `saldo + interés + movimientos posteriores al ancla`. Un movimiento ya está
  dentro del saldo si su fecha es anterior al ancla **o** si se registró antes
  de confirmarlo (por eso cada movimiento guarda `ts`).
- **El interés capitaliza sobre el saldo corriente, no sobre el ancla.** El
  periodo se parte en tramos por cada movimiento y cada tramo capitaliza sobre
  el saldo que había entonces, que es lo que hace el banco: una consignación
  empieza a rendir el día que entra y un retiro deja de rendir el día que sale.
  `movsDe` es la fuente única de esos movimientos; `movNeto` los suma y el
  interés los usa para los tramos, y separarlas dejaría el saldo y su
  rendimiento contando cosas distintas.
- **Un gasto con tarjeta no toca ninguna cuenta.** La plata sale al pagar la
  tarjeta, y ahí se elige de qué cuenta.
- **Los traslados no son gasto ni ingreso.** Mover plata entre cuentas propias
  (incluido retirar efectivo) no cambia el patrimonio.
- **El ciclo de facturación parte el saldo de la tarjeta.** Lo comprado hasta
  el último corte se paga en el próximo pago; lo posterior, un mes después.
- **Las acciones se registran por cantidad y precio**, que es lo que muestra el
  broker. El costo se deduce de la rentabilidad al crear y luego queda fijo:
  actualizar el precio basta.
- El interés de cuentas y CDT **no** cuenta como ingreso del mes; sí suma al
  patrimonio.

## Trampas conocidas

- **El visor bloquea los diálogos nativos.** `prompt`, `confirm` y `alert` se
  ignoran en silencio dentro del marco del Artifact. Usar `pedirValor`,
  `confirmar` y `avisar`, que están definidos en el archivo.
- **Cuidado con los escapes al editar por heredoc.** Escribir expresiones
  regulares con `\d` desde un script de shell ha perdido las barras invertidas
  más de una vez, produciendo bugs silenciosos. Preferir la herramienta Edit, o
  patrones sin escapes como `[^0-9]`.
- **Formato de números colombiano:** el punto separa miles y la coma decimales.
- **Sin acceso a red.** El CSP del Artifact bloquea cualquier llamada externa.
  Lo único disponible es la capability `mcp` con el conector Gmail del visor.

## Cómo probar

No hay framework. Se prueba cargando el archivo en el navegador y ejercitando
la interfaz con `javascript_tool`. Lo que conviene verificar en cada cambio:

- La aritmética contra un cálculo independiente hecho en la misma prueba.
- Que no haya desborde horizontal de 320 a 1920px en las cinco secciones.
- Que no aparezcan `NaN` ni `undefined` en pantalla.
- Si el cambio toca diálogos, probar dentro de un iframe con
  `sandbox="allow-scripts allow-same-origin"` (sin `allow-modals`), que es como
  se comporta el visor real.

`node test-parser.js finanzas.html` ejercita el parser de Gmail con textos
reales de correos de Julián. No copia el código: lo recorta del archivo y lo
evalúa, así que no puede quedar probando una versión vieja.

## El parser de Gmail

El botón «Sincronizar Gmail» propone gastos y Julián los revisa antes de
importar. La revisión no es un trámite: es lo que atrapa lo que el parser no
puede saber. Tres reglas que costaron sangre y están cubiertas por el test:

- **El punto separa miles, no decimales.** `$5.000` son cinco mil. Hasta el
  2026-09-04 la conversión devolvía `5`, así que todo monto redondo entraba
  dividido por mil. Lo único que se lee como decimal es un punto seguido de uno
  o dos dígitos (`107500.00`), que es como manda los montos ePayco.
- **El monto rotulado gana sobre el más grande.** Uber manda «Total $6.985 ·
  Tarifa $9.313 · Promoción −$2.328»; quedarse con el máximo cobraba la tarifa
  sin el descuento. Solo si no hay ningún `Total`/`Monto`/`Valor` se cae al
  máximo.
- **Un correo con monto no es un gasto.** Los avisos de «faltan fondos» de Nu y
  los extractos traen cifras y comercio y se ven igual que una compra. Van en
  `NO_ES_GASTO` y ni siquiera llegan a la tabla de revisión.

El medio de pago sale del nombre que Julián le puso a la tarjeta o la cuenta
(`medioPorTexto`): si el remitente o el asunto lo menciona, es esa, y las
tarjetas ganan porque un cargo llega por la tarjeta aunque el correo nombre al
banco. Palabras genéricas como «banco» o «ahorro» no cuentan.

**Lo que el parser no resuelve y hay que mirar en la revisión:** un mismo gasto
llega por dos remitentes (el Airbnb de noviembre aparece como recibo de Airbnb
y como cargo de RappiCard), y un PSE puede ser tanto un servicio como el pago
de una tarjeta, que no es gasto.

## Fase 2: el agente quincenal de precios

Montado el 2026-09-02 como routine de claude.ai, corriendo el 1 y el 16 de cada
mes a las 9 a.m. de Bogotá (`0 14 1,16 * *` en UTC), con Opus y sin conectores:
solo web. Lee el Artifact vivo, consulta precio por precio, aplica los datos con
`merge-datos.js precios` y republica siguiendo el ciclo de arriba.

**Routine:** https://claude.ai/code/routines/trig_018sJ8kkPugoZPHpwCHDun1f

El agente no edita el JSON del dashboard a mano — es una sola línea enorme y
romperla borra datos. Escribe un reporte y deja que el script lo aplique:

```
node merge-datos.js precios finanzas.html reporte.json
```

```json
{ "trm": 3184, "trmFecha": "2026-09-02",
  "precios": { "ISA": {"precio": 29200, "fecha": "2026-09-02"} },
  "sinDato": { "NUCO": "la fuente no respondió" } }
```

Las llaves son el `nombre` de la posición. El script multiplica por `cantidad`,
guarda la **fecha del precio** (no la de hoy) en `fechaActualizacion`, limpia el
`sinDato` de lo que sí se actualizó, y aborta si un precio viene en cero o una
fecha mal formada: un dato que no se pudo traer se marca, nunca se rellena. Las
cantidades, el costo y el historial no los toca nadie más que Julián.

`node merge-datos.js selftest` ejercita todo eso sin tocar el archivo real.

### Cobertura de las fuentes, verificada el 2026-09-01 y usada el 2026-09-02

- `https://www.larepublica.co/indicadores-economicos/movimiento-accionario/<ticker>`
  responde para PFGRUPOARG (truncado así), ISA, GEB, CELSIA y EXITO. Da 404 para
  `suasco` y `nuco`, y para `tin` carga la página sin precio.
- `https://www.bloomberglinea.com/quote/<TICKER>:CB/` responde para SUASCO, TIN,
  NUCO y también PFGRUPOA, así que sirve como fuente única con La República de
  respaldo.
- La TRM **oficial** sale de `https://www.dolar-colombia.com/`. No usar el spot
  USDCOP de Bloomberg, que es otra cifra.
- `WebSearch` devuelve enlaces pero no precios; el que extrae los números es
  `WebFetch`.

Siete de los ocho precios coincidieron exacto con lo que trii le mostraba a
Julián. La excepción es TIN, un título de titularización poco líquido cuya última
cotización puede tener varios días: por eso cada acción guarda la fecha de su
precio, el dashboard la muestra bajo el nombre y saca una etiqueta de aviso
pasados 30 días (`DESACTUALIZADA`), igual que cuando el precio no tiene fecha o
el agente dejó un `sinDato`. La fecha de la TRM se pone en color de aviso con el
mismo umbral.

**Gmail no sirve para esto.** Se revisaron 38 correos de trii y accivalores de
60 días: casi todos son marketing, y lo transaccional son avisos de dividendo,
confirmaciones de compra puntuales y PDFs de accivalores con el tiquete de una
sola operación. Ningún correo trae el valor de las posiciones. Lo que sí hay ahí
y hoy no se registra son los dividendos (TIN pagó 4 acciones a 383,72 antes de
retención), que valdría la pena capturar aparte.

Plenti es una posición en dólares que rinde una tasa fija, así que no necesita
precio: solo la TRM.

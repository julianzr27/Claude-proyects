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

## Pendiente: Fase 2, el agente mensual

Crear una routine con el skill `schedule` que corra una vez al mes y:

1. Lea el Artifact vivo y saque la lista de posiciones tipo `accion`.
2. Consulte el precio de cada una por web y la TRM oficial del día.
3. Actualice `valorActual` y la fecha del precio de cada acción y `config.trm`,
   siguiendo el ciclo de publicación descrito arriba.
4. Deje marcada cualquier posición que no haya podido actualizar, sin inventar
   el precio.

**Cobertura verificada el 2026-09-01.** Las ocho acciones son de la Bolsa de
Valores de Colombia y todas se pueden obtener, pero de dos fuentes:

- `https://www.larepublica.co/indicadores-economicos/movimiento-accionario/<ticker>`
  responde para PFGRUPOARG, ISA, GEB, CELSIA y EXITO. Da 404 para `suasco` y
  `nuco`, y para `tin` carga la página sin precio.
- `https://www.bloomberglinea.com/quote/<TICKER>:CB/` responde para SUASCO, TIN,
  NUCO y también PFGRUPOA, así que probablemente sirva como fuente única con La
  República de respaldo.
- La TRM **oficial** sale de `https://www.dolar-colombia.com/`. No usar el spot
  USDCOP de Bloomberg, que es otra cifra (3.167 contra 3.214 el mismo día).
- `WebSearch` devuelve enlaces pero no precios; el que extrae los números es
  `WebFetch`.

Siete de los ocho precios coincidieron exacto con lo que trii le mostraba a
Julián. La excepción es TIN, un título de titularización poco líquido cuya
última cotización puede tener varios días: por eso hay que guardar la fecha del
precio y que el dashboard avise cuando el dato esté viejo, en vez de mostrarlo
como si fuera de hoy.

**Gmail no sirve para esto.** Se revisaron 38 correos de trii y accivalores de
60 días: casi todos son marketing, y lo transaccional son avisos de dividendo,
confirmaciones de compra puntuales y PDFs de accivalores con el tiquete de una
sola operación. Ningún correo trae el valor de las posiciones. Lo que sí hay ahí
y hoy no se registra son los dividendos (TIN pagó 4 acciones a 383,72 antes de
retención), que valdría la pena capturar aparte.

Plenti es una posición en dólares que rinde una tasa fija, así que no necesita
precio: solo la TRM.

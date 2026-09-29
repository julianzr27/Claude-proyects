# Skills

Índice de las skills de este proyecto: qué hacen y cuándo se activan.

## Instaladas en `.claude/skills`

### frontend-design
- **Ubicación:** `.claude/skills/frontend-design` (symlink a `.agents/skills/frontend-design/SKILL.md`)
- **Origen:** instalada con `npx skills add https://github.com/anthropics/skills --skill frontend-design`
- **Qué hace:** Guía de dirección estética, tipografía y decisiones de diseño para construir UI nueva o rediseñar una existente, evitando que se vea genérica/plantillera.
- **Se activa con:** pedidos de construir componentes, páginas o apps web donde importa la calidad visual/estética.
- **Nota:** queda local a propósito — es el mismo contenido (misma fuente `anthropics/skills`) que ya trae instalado el plugin global `frontend-design@claude-plugins-official`, así que ya está disponible en todos los proyectos por esa vía. No se migró para no duplicarla.

## Instaladas globalmente (`~/.claude`, disponibles en todos los proyectos)

### git-push
- **Ubicación:** `~/.claude/skills/git-push/SKILL.md`
- **Qué hace:** Sube a GitHub los cambios locales — agrega los archivos modificados, redacta el mensaje de commit automáticamente (sin preguntarle al usuario qué poner) y hace push al remoto, pidiendo confirmación solo antes de ese último paso.
- **Se activa con:** "sube los cambios", "guarda esto en GitHub", "haz commit y push", "sincroniza el repo", "publica lo que hice", "sube mi código", o cualquier pedido de llevar cambios locales al remoto.
- **Nota:** se instaló primero solo en este proyecto (con commits dedicados) y luego se movió a global a pedido de Julián — ya no queda copia en `.claude/skills` de este repo.

### find-skills
- **Ubicación:** `~/.claude/skills/find-skills/SKILL.md`
- **Origen:** instalada con `npx skills add https://github.com/vercel-labs/skills --skill find-skills`
- **Qué hace:** Ayuda a descubrir e instalar skills del ecosistema abierto de agent skills cuando falta alguna capacidad.
- **Se activa con:** "cómo hago X", "hay una skill para X", "busca una skill que...", o cualquier interés en extender lo que se puede hacer.
- **Nota:** se instaló primero solo en este proyecto y luego se movió a global a pedido de Julián — ya no queda copia en `.claude/skills` de este repo.

### graphify
- **Ubicación:** `~/.claude/skills/graphify/SKILL.md` (+ `references/`), registrada en el `CLAUDE.md` global (`~/.claude/CLAUDE.md`).
- **Origen:** paquete externo `graphifyy` (PyPI, doble "y" intencional) de [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), instalado con `pip install graphifyy` (Python 3.12 vía winget, ya que la máquina no tenía Python real). Verificado cruzando GitHub y PyPI antes de instalar (mismo mantenedor, mismo repo, sin señales de typosquatting pese al nombre con doble "y"). Instalada primero solo en este proyecto y luego movida a global a pedido de Julián — ya no queda copia en `.claude/skills` de este repo.
- **Qué hace:** Convierte código, docs, PDFs, etc. en un grafo de conocimiento consultable (AST local vía tree-sitter, sin necesidad de API key para código). Genera visualización HTML, reporte en markdown y JSON.
- **Se activa con:** `/graphify`, `/graphify <path>`, `/graphify query "<pregunta>"`.
- **Nota:** se instaló **solo la skill** (copiando `SKILL.md` + `references/` a mano), sin los hooks `PreToolUse` que el instalador oficial (`graphify claude install` o `graphify install --project`) agrega en `.claude/settings.json` — esos hooks interceptan cada llamada a Bash/Grep/Read/Glob para sugerir usar el grafo en vez de leer archivos en crudo. Se dejaron afuera a propósito para no darle a esta herramienta ese nivel de enganche permanente; se pueden sumar después si se decide que vale la pena.
- **Nota sobre el grafo ya construido:** `graphify-out/` (el grafo de este proyecto) sigue viviendo en la raíz de este repo — eso es output, no la skill, y no se movió.

### higgsfield (paquete de 8 skills)
- **Ubicación:** `~/.claude/skills/higgsfield-*` (directorios reales, cada uno con su `SKILL.md` y sus `references/`).
- **Origen:** instaladas con `npx skills add higgsfield-ai/skills` (repo oficial [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills)). El instalador las dejó en el proyecto (`.agents/skills/` + symlinks en `.claude/skills/`) y después se movieron a global a pedido de Julián — ya no queda copia en este repo, y la entrada correspondiente se sacó del `skills-lock.json`.
- **Dependencia:** todas son un envoltorio sobre la CLI `@higgsfield/cli` (instalada global con `npm i -g @higgsfield/cli`, binarios `higgsfield` / `higgs` / `hf`). Sin la CLI autenticada no funcionan.
- **Qué hacen:** generación de imagen, video, audio y 3D vía Higgsfield AI, cada una especializada en un caso de uso —
  - `higgsfield-generate`: generación genérica de imagen/video/audio/3D, workflows y Marketing Studio. Es la puerta de entrada por defecto.
  - `higgsfield-brandkit`: sistemas de identidad visual completos (paletas, logos SVG, tipografía, mockups, brandbook en PPTX/PDF).
  - `higgsfield-product-photoshoot`: fotografía de producto de calidad comercial (studio, lifestyle, ad creative, try-on virtual).
  - `higgsfield-marketplace-cards`: fichas de producto para marketplaces (imagen principal compliant, secundarias, contenido A+).
  - `higgsfield-soul-id`: entrena un "Soul Character" sobre una cara para mantener identidad consistente entre generaciones.
  - `higgsfield-video-explainer`: videos explicativos narrados, armados por bloques de 10 segundos.
  - `higgsfield-youtube-thumbnail`: miniaturas de YouTube y portadas verticales.
  - `higgsfield-websites`: sitios, apps y juegos full-stack (React 19 + TanStack Start sobre Cloudflare Workers).
- **Se activan con:** pedidos del estilo "genera una imagen", "haz un video", "anima esta foto", "foto de producto", "crea un brand kit", "miniatura para YouTube", "arma un explainer", "constrúyeme un sitio".
- **Cuenta:** autenticada por OAuth (`higgsfield auth login`) con jzr2712@gmail.com, credenciales en `~/.config/higgsfield`, workspace privado `3e31490e…`, plan free. **Ojo con los créditos:** cada generación consume del saldo de la cuenta, así que no son skills gratuitas de ejecutar.

### remotion (paquete de 12 skills)
- **Ubicación:** `~/.claude/skills/remotion-*` (copias reales; el instalador también dejó una copia fuente en `~/.agents/skills/`).
- **Origen:** instaladas con `npx skills add remotion-dev/skills -g -a claude-code -y`, siguiendo la guía oficial ([remotion.dev/docs/ai/skills](https://www.remotion.dev/docs/ai/skills)). Fuente: [remotion-dev/skills](https://github.com/remotion-dev/skills). Todas salieron "Safe" en Gen y sin alertas en Socket; Snyk marcó `remotion-docs` como riesgo alto (el resto bajo).
- **Qué hacen:** ayudan a crear videos programáticos con React usando Remotion —
  - `remotion-best-practices`: router hacia el resto de las skills del paquete.
  - `remotion-create`: arranca un proyecto de video nuevo.
  - `remotion-markup`: buenas prácticas de contenido, animación y efectos.
  - `remotion-studio` / `remotion-render`: previsualizar y exportar el video.
  - `remotion-captions`: transcripción y subtítulos animados.
  - `remotion-maps`, `remotion-multimedia` (Mediabunny), `remotion-interactivity`, `remotion-saas`, `remotion-docs`, `remotion-upgrade`.
- **Se activan con:** pedidos de hacer, editar, previsualizar o renderizar videos con Remotion o con código React.

### hyperframes (paquete de 10 skills, grupo "Core Skills")
- **Ubicación:** `~/.claude/skills/hyperframes*` y `~/.claude/skills/media-use` (copias reales; fuente también en `~/.agents/skills/`).
- **Origen:** instaladas con `npx skills add heygen-com/hyperframes -g -a claude-code -y --skill <cada core skill>`, siguiendo el README oficial de [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes), que recomienda instalar solo el grupo "Core Skills" (el repo publica 21). La vía alternativa de plugin (`claude plugin marketplace add heygen-com/hyperframes`) falló en Windows: el monorepo pesa más de 550 MB con LFS y tiene rutas que superan el límite de longitud.
- **Riesgo según el instalador:** `hyperframes-creative` salió "Med Risk" en Gen; `media-use` con 1 alerta en Socket; `hyperframes`, `hyperframes-cli` y `media-use` "Med Risk" en Snyk. El resto, bajo.
- **Requisitos:** Node.js 22+ (hay v24) y FFmpeg para renderizar (instalado con `winget install Gyan.FFmpeg`, v9.0.2).
- **Qué hacen:** crean videos a partir de composiciones HTML (framework de HeyGen) —
  - `hyperframes`: punto de entrada obligatorio; enruta a la skill adecuada.
  - `hyperframes-core` / `hyperframes-studio`: contrato de la composición y organización del timeline.
  - `hyperframes-animation` / `hyperframes-keyframes`: animación (GSAP, Lottie, Three.js, etc.) y movimientos de cámara.
  - `hyperframes-creative`: dirección creativa (paletas, tipografía, narración).
  - `hyperframes-audio`: mezcla de audio ya colocado.
  - `hyperframes-cli`: flujo de la CLI (init, preview, render, publish).
  - `hyperframes-registry`: ~400 bloques y efectos ya hechos.
  - `media-use`: música, efectos de sonido, imágenes, voz, subtítulos y remoción de fondo.
- **Se activan con:** pedidos de hacer, editar, animar o renderizar un video, motion graphic, explainer, promo o slideshow. **Ojo:** se superponen con Remotion y con `higgsfield-video-explainer`; `hyperframes` se declara framework por defecto salvo que se pida otro de forma explícita.

### impeccable
- **Ubicación:** `~/.claude/skills/impeccable/` (incluye el motor `scripts/bin/windows-x64/impeccable.exe`, v0.1.5) + 4 subagentes en `~/.claude/agents/impeccable-*.md` (asset-producer, documenter, finish-reviewer, manual-edit-applier).
- **Origen:** instalada con el instalador oficial del README de [pbakaus/impeccable](https://github.com/pbakaus/impeccable): `npx impeccable install --providers=claude --global -y`. Para actualizar: `npx impeccable update`.
- **Qué hace:** vocabulario de diseño compartido con 24 comandos (`/impeccable polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, etc.) para pulir y criticar interfaces, más un detector de problemas de diseño.
- **Se activa con:** `/impeccable <comando>`. En cada proyecto nuevo conviene correr primero `/impeccable init` para armar el contexto de diseño.
- **Nota sobre hooks:** el instalador agrega hooks (`PostToolUse` en Edit/Write sobre archivos de UI y un `Stop` con revisión profunda) en el `.claude/settings.local.json` del **proyecto** donde se ejecuta, no a nivel global. Se corrió desde una carpeta temporal, así que no quedó ningún hook activo ni se tocó `~/.claude/settings.json`. Si se quieren en un proyecto: `npx impeccable install --providers=claude --project` desde ese proyecto (o `/impeccable init`).
- **Se superpone con:** `frontend-design` (dirección estética de UI).

### bpmn
- **Ubicación:** `~/.claude/skills/bpmn/` (`SKILL.md`, `references/`, `scripts/bpmn-tool.mjs` + `lib.mjs`, `node_modules/`).
- **Origen:** carpeta `skills/bpmn` de [architawr/claude-bpmn-skill](https://github.com/architawr/claude-bpmn-skill) (v1.3.0, MIT), copiada a mano. Revisada antes de instalar: los scripts solo leen y escriben el `.bpmn` que se les pasa (sin red, sin `child_process`, sin variables de entorno), las dos dependencias (`bpmn-moddle`, `bpmn-auto-layout`, ambas de bpmn.io) vienen de npmjs con hash de integridad y sin scripts de instalación, `npm audit` sin vulnerabilidades y el `SKILL.md` no trae instrucciones raras. Dependencias instaladas con `npm ci --ignore-scripts`; pasan 43/44 tests (el que falla busca la carpeta `evals/` del repo, que no se copió).
- **Qué hace:** leer, explicar, crear y editar diagramas BPMN 2.0 (`.bpmn`): layout automático no destructivo, validación, lint de flujo (deadlocks, tokens atascados, nodos inalcanzables), `diff` entre versiones y `find`.
- **Se activa con:** trabajar con un archivo `.bpmn` o pedir modelar un proceso como diagrama (Camunda, bpmn.io, etc.).
- **Limitación detectada (probada con `produccion-cupcakes.bpmn`):** en una colaboración, `layout` ignora las lanes, no dibuja pools colapsados (caja negra) y descarta los flujos de mensaje que tocan ese pool, y aun así `validate` da VALID porque solo revisa los elementos del proceso. Workaround: hacer el layout del proceso solo (con lanes) y envolverlo después en la colaboración con un script propio.
- **Nota:** no se instalaron los slash commands del plugin (`/bpmn:create`, `/bpmn:diff`, etc.), que son atajos a la misma skill. Si se quieren: `claude plugin marketplace add architawr/claude-bpmn-skill` y luego `claude plugin install bpmn@bpmn-tools`.

### voz-julian (combinada con humanizer)
- **Ubicación:** `~/.claude/skills/voz-julian/SKILL.md`. Copia empaquetada en [voz-julian.skill](voz-julian.skill).
- **Qué hace:** redacta en la voz de Julián (casual/semiformal, sin "tú", párrafos, conectores, "es decir") y después hace una pasada anti-IA con el plugin `humanizer`, usando el párrafo calibrado como muestra de voz. Trae reglas de precedencia para cuando chocan: los conectores y las construcciones impersonales se conservan, el contraste "no es solo X, sino Y" se permite una vez si ambas mitades aportan, y no se usan guiones largos.
- **Se activa con:** cualquier pedido de escribir, redactar o mejorar texto, "en mi estilo", "humaniza esto", "que no suene a IA".
- **Nota:** claude.ai tiene su propia copia (`anthropic-skills:voz-julian`), que es la versión vieja sin humanizer. Para igualarla hay que volver a subir `voz-julian.skill` y también humanizer (ZIP del repo) en Settings de claude.ai.

## Plugins instalados vía `claude plugin` (alcance usuario, no project-scoped)

### humanizer
- **Origen:** plugin de [blader/humanizer](https://github.com/blader/humanizer) (MIT, v3.1.0), instalado con el método oficial para Claude Code: `claude plugin marketplace add blader/humanizer` + `claude plugin install humanizer@humanizer --scope user`. Es solo un `SKILL.md`, sin hooks ni scripts que se ejecuten.
- **Qué hace:** reescribe texto que suena a IA para que suene a persona, sin cambiar lo que dice. Revisa 26 patrones basados en la guía de Wikipedia "Signs of AI writing" (contrastes "no X sino Y", cierres de una línea, tríadas forzadas, guiones largos, vocabulario inflado, negritas decorativas, restos de chat).
- **Se activa con:** `/humanizer:humanizer` o "humaniza este texto". Además la usa `voz-julian` como segunda pasada.

### ponytail
- **Origen:** plugin de [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (87.3k estrellas, MIT), instalado vía marketplace nativo de Claude Code: `claude plugin marketplace add DietrichGebert/ponytail` + `claude plugin install ponytail@ponytail`. Verificado antes de instalar (repo, autor, y manifiesto `.claude-plugin/plugin.json` leídos directamente — sin señales de riesgo).
- **Qué hace:** Modo "lazy senior dev" — empuja a escribir la solución más simple que funcione (YAGNI, stdlib antes que dependencias, sin abstracciones no pedidas). Tres niveles de intensidad: `lite`, `full` (default), `ultra`.
- **Se activa con:** `/ponytail [lite|full|ultra|off]`, `/ponytail-review` (analiza un diff), `/ponytail-audit` (analiza todo el repo), `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`. También reacciona a frases como "sé más simple", "modo lazy", "yagni".
- **Hooks instalados:** `SessionStart` (carga el modo activo), `SubagentStart` (lo propaga a subagentes), `UserPromptSubmit` (detecta cambios de modo escritos en el prompt). Revisé el código: solo leen/escriben archivos locales bajo `~/.claude/`, sin llamadas de red. No interceptan Bash/Read/Grep como los hooks de Graphify.
- **Alcance:** instalado a nivel usuario (`scope: user`), por lo que va a estar disponible en todos los proyectos de Claude Code, no solo en este.

## Otros archivos relacionados con skills (no instalados como skill)

### voz-julian.skill
- **Ubicación:** raíz del proyecto.
- **Qué es:** Paquete `.skill` (zip) con el mismo `SKILL.md` que está instalado globalmente en `~/.claude/skills/voz-julian` (ver sección global). Se regeneró al combinarla con humanizer, así que sirve para volver a subirla a claude.ai.
- **Contenido equivalente en texto plano:** [vozJulian.md](vozJulian.md) (solo la voz, sin la pasada de humanizer).

## Notas
- [Julian.md](Julian.md) — perfil/bio de Julián, no es una skill, sirve como contexto de quién es el usuario.

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

## Plugins instalados vía `claude plugin` (alcance usuario, no project-scoped)

### ponytail
- **Origen:** plugin de [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (87.3k estrellas, MIT), instalado vía marketplace nativo de Claude Code: `claude plugin marketplace add DietrichGebert/ponytail` + `claude plugin install ponytail@ponytail`. Verificado antes de instalar (repo, autor, y manifiesto `.claude-plugin/plugin.json` leídos directamente — sin señales de riesgo).
- **Qué hace:** Modo "lazy senior dev" — empuja a escribir la solución más simple que funcione (YAGNI, stdlib antes que dependencias, sin abstracciones no pedidas). Tres niveles de intensidad: `lite`, `full` (default), `ultra`.
- **Se activa con:** `/ponytail [lite|full|ultra|off]`, `/ponytail-review` (analiza un diff), `/ponytail-audit` (analiza todo el repo), `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help`. También reacciona a frases como "sé más simple", "modo lazy", "yagni".
- **Hooks instalados:** `SessionStart` (carga el modo activo), `SubagentStart` (lo propaga a subagentes), `UserPromptSubmit` (detecta cambios de modo escritos en el prompt). Revisé el código: solo leen/escriben archivos locales bajo `~/.claude/`, sin llamadas de red. No interceptan Bash/Read/Grep como los hooks de Graphify.
- **Alcance:** instalado a nivel usuario (`scope: user`), por lo que va a estar disponible en todos los proyectos de Claude Code, no solo en este.

## Otros archivos relacionados con skills (no instalados como skill)

### voz-julian.skill
- **Ubicación:** raíz del proyecto
- **Qué es:** Paquete `.skill` (zip) que contiene un `SKILL.md` con las reglas de tono y estilo de escritura de Julián — casual/semiformal, en español, sin "tú" directo, párrafos sobre bullets, uso de conectores y "es decir", evitando frases clichés y textos que suenen generados por IA.
- **Contenido equivalente en texto plano:** [vozJulian.md](vozJulian.md)
- **Estado:** no está instalada en `.claude/skills` — si se quiere activar como skill utilizable, habría que descomprimirla ahí.

## Notas
- [Julian.md](Julian.md) — perfil/bio de Julián, no es una skill, sirve como contexto de quién es el usuario.

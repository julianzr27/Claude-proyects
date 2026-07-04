---
name: git-push
description: Sube a GitHub los cambios locales de un repositorio Git - agrega los archivos modificados, escribe automáticamente un mensaje de commit descriptivo (sin preguntarle al usuario qué poner), y hace push al remoto configurado, pidiendo confirmación justo antes de ese paso porque afecta el repositorio compartido. Usa esta skill siempre que el usuario pida guardar, subir, sincronizar, respaldar o publicar su trabajo en GitHub o en el repositorio remoto - por ejemplo "sube los cambios", "guarda esto en github", "haz commit y push", "sincroniza el repo", "publica lo que hice", "sube mi código" - incluso si no menciona la palabra "git" explícitamente, siempre que quede claro que se refiere a llevar cambios locales al remoto (no a crear un repo nuevo ni a clonar uno).
---

# Subir cambios a GitHub (git add + commit + push)

## Por qué existe esta skill

El usuario no quiere memorizar ni escribir `git add`, `git commit -m "..."` y `git push` cada vez
que termina de trabajar. Quiere decir "sube los cambios" y que el commit quede bien descrito sin
tener que dictarlo él mismo. Al mismo tiempo, `git push` modifica un repositorio remoto compartido
(GitHub), así que ese paso concreto sigue mereciendo una confirmación rápida antes de ejecutarse,
aunque el resto del flujo sea automático.

## Pasos

1. **Verifica que estás en un repositorio Git** con `git status`. Si el comando falla porque no
   hay repositorio, avisa al usuario en vez de intentar inicializar uno tú mismo.

2. **Revisa qué cambió.** Con `git status` y `git diff` (para archivos ya rastreados) mira qué se
   modificó, agregó o borró. Si no hay ningún cambio (working tree limpio y nada por subir), dile
   al usuario que no hay nada que subir y detente ahí.

3. **Agrega los cambios** con `git add -A`. Esto respeta lo que esté en `.gitignore`, así que no
   te preocupes por archivos de configuración local que el usuario ya haya excluido ahí.

4. **Redacta tú mismo el mensaje de commit** — no se lo preguntes al usuario. Basa el mensaje en
   `git diff --cached` (el diff de lo ya agregado) y en la lista de archivos:
   - Una primera línea corta (idealmente bajo ~65 caracteres), en modo imperativo y en el mismo
     idioma en que el usuario te está hablando (español por defecto aquí).
   - Si hay varios cambios claramente distintos (por ejemplo, se tocaron archivos no relacionados),
     agrega un cuerpo con 2-4 viñetas breves debajo de la primera línea. Si es un cambio único y
     simple, la primera línea basta.
   - Describe *qué cambió*, no el hecho genérico de "actualicé archivos". Ejemplos:
     - `Agrega sección de precios a la página de inicio`
     - `Corrige el cálculo de impuestos en el checkout`
     - `Actualiza dependencias y ajusta configuración de build`

5. **Muestra un resumen breve antes de subir**: cuántos archivos cambiaron y el mensaje de commit
   que vas a usar. Pide confirmación explícita al usuario antes de continuar al push — este es el
   único punto de fricción intencional del flujo, porque el push sí toca el repositorio remoto y
   puede ser visible para otros o difícil de deshacer limpiamente. Si el usuario ya dijo algo como
   "sube todo sin preguntar" en este mismo mensaje, puedes saltarte esta confirmación puntual.

6. **Haz el commit y el push**:
   ```
   git commit -m "<mensaje generado>"
   git push
   ```
   Si la rama actual no tiene upstream configurado todavía, usa `git push -u origin <rama-actual>`
   en su lugar.

7. **Si el push es rechazado** (por ejemplo, porque el remoto tiene commits que el usuario no tiene
   localmente), no fuerces el push. Explica la situación y ofrece hacer `git pull` (o
   `git pull --rebase`) para traer esos cambios primero, y solo continúa si el usuario está de
   acuerdo. Si al traer los cambios aparecen conflictos, detente y pide al usuario que decida cómo
   resolverlos — no elijas tú una versión del código en su lugar.

8. **Confirma el resultado** al final con un mensaje corto: qué se subió y el enlace o nombre del
   repo si es útil, sin repetir todo el detalle técnico ya mostrado antes.

## Cosas que esta skill NO debe hacer

- No debe inventar un mensaje de commit vacío o genérico tipo "cambios" o "update" - siempre debe
  reflejar qué cambió realmente.
- No debe usar `git push --force` ni `git reset --hard` bajo ninguna circunstancia dentro de este
  flujo.
- No debe crear el repositorio remoto ni cambiar de rama por su cuenta; asume que el repo y el
  remoto ya existen y están configurados (si no lo están, avisa en vez de configurarlos sin que el
  usuario lo pida).

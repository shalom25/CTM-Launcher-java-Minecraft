# CTM Laucher
[![Downloads](https://img.shields.io/github/downloads/shalom25/CTM-Launcher-java-Minecraft/total)]
Launcher de escritorio para Windows orientado a Minecraft Java.

## Incluye

- Login offline por nickname.
- Selector de versiones oficiales desde Mojang.
- Ajustes de memoria RAM.
- Configuracion de ruta de Java.
- Carpeta de juego dedicada.
- Panel de noticias.
- Registro de actividad en tiempo real.
- Boton para descargar la version seleccionada.
- Boton para lanzar Minecraft Java con `minecraft-launcher-core`.

## Estructura

- `electron/main.js`: backend principal, IPC, ajustes y logica de lanzamiento.
- `electron/preload.js`: puente seguro entre Electron y la interfaz.
- `renderer/index.html`: interfaz principal.
- `renderer/app.js`: logica de UI.
- `renderer/styles.css`: estilos del launcher.

## Ejecutar

```bash
npm install
npm start
```

## Empaquetar

```bash
npm run dist
```

## Notas

- Esta base usa login offline. Si quieres, el siguiente paso natural es integrar login Microsoft.
- Para lanzar Minecraft necesitas tener Java instalado y accesible desde `java` o indicar su ruta manualmente.
- La descarga de archivos del juego y el arranque usan `minecraft-launcher-core`.

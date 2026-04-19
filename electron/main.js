const { app, BrowserWindow, ipcMain, dialog, shell, session } = require('electron');
const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const axios = require('axios');
const { Client, Authenticator } = require('minecraft-launcher-core');
const VERSION_MANIFEST_URL =
  'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json';
const NEWS_JSON_URL =
  'https://raw.githubusercontent.com/shalom25/launcher-news/main/news.json';
const DEFAULT_LAUNCHER_UPDATE_URL =
  'https://github.com/shalom25/CTM-Launcher-java-Minecraft';
const DEFAULT_JAVA_PATH = 'java';
const STORE_FILE = 'launcher-settings.json';
const FALLBACK_NEWS = [
  {
    id: 'n1',
    title: 'Launcher listo para jugar',
    summary:
      'Inicia sesion con nickname offline, elige una version y descarga todo lo necesario desde Mojang.',
    url: 'https://www.minecraft.net/es-es',
  },
  {
    id: 'n2',
    title: 'Instancia dedicada',
    summary:
      'El launcher usa una carpeta propia para mantener separada tu instalacion y configuracion.',
    url: 'https://www.minecraft.net/es-es/download',
  },
];

let mainWindow = null;

function getSkinsRoot() {
  return path.join(app.getPath('userData'), 'skins-library');
}

function getSkinsMetadataPath() {
  return path.join(getSkinsRoot(), 'skins.json');
}

function getAppRoot() {
  // In packaged builds the renderer lives inside app.asar, which app.getAppPath()
  // resolves correctly for loadFile().
  return app.getAppPath();
}

function getRendererPath(...parts) {
  return path.join(getAppRoot(), 'renderer', ...parts);
}

function getBundledNewsPath() {
  return path.join(getAppRoot(), 'news.json');
}

function getStorePath() {
  return path.join(app.getPath('userData'), STORE_FILE);
}

function getLegacyInstanceRoot() {
  return path.join(app.getPath('userData'), 'minecraft-instance');
}

function getInstanceRoot() {
  return path.join(app.getPath('appData'), '.minecraft');
}

function getDefaultSettings() {
  return {
    username: 'Jugador',
    version: '1.20.1',
    memoryMax: 4096,
    memoryMin: 2048,
    javaPath: DEFAULT_JAVA_PATH,
    language: 'es',
    launcherEnabled: true,
    launcherUpdateUrl: DEFAULT_LAUNCHER_UPDATE_URL,
    gameDirectory: getInstanceRoot(),
    activeSkin: null,
    lastStatus: 'Listo para iniciar.',
  };
}

async function ensureDirectory(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function readSettings() {
  const defaults = getDefaultSettings();
  const storePath = getStorePath();

  try {
    const raw = await fsp.readFile(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    const merged = { ...defaults, ...parsed };
    const legacyRoot = path.resolve(getLegacyInstanceRoot());
    const currentGameDirectory = path.resolve(merged.gameDirectory || defaults.gameDirectory);

    // Migrate older launcher-specific installs to the user's real .minecraft folder.
    if (
      currentGameDirectory === legacyRoot ||
      currentGameDirectory === path.resolve(path.join(legacyRoot, 'game')) ||
      currentGameDirectory.startsWith(`${legacyRoot}${path.sep}`)
    ) {
      merged.gameDirectory = defaults.gameDirectory;
    }

    if (typeof merged.activeSkin === 'string' && merged.activeSkin.startsWith('default-')) {
      merged.activeSkin = null;
    }

    if (!merged.launcherUpdateUrl) {
      merged.launcherUpdateUrl = DEFAULT_LAUNCHER_UPDATE_URL;
    }

    return merged;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('No se pudieron leer los ajustes:', error);
    }
    await writeSettings(defaults);
    return defaults;
  }
}

async function writeSettings(settings) {
  const storePath = getStorePath();
  await ensureDirectory(path.dirname(storePath));
  await fsp.writeFile(storePath, JSON.stringify(settings, null, 2), 'utf8');
}

async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await fsp.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`No se pudo leer ${filePath}:`, error);
    }
    return fallbackValue;
  }
}

async function writeJsonFile(filePath, value) {
  await ensureDirectory(path.dirname(filePath));
  await fsp.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
}

async function getImagePreviewData(filePath) {
  try {
    const buffer = await fsp.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const mimeType =
      extension === '.svg'
        ? 'image/svg+xml'
        : extension === '.jpg' || extension === '.jpeg'
          ? 'image/jpeg'
          : 'image/png';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    return null;
  }
}

async function readSkinsMetadata() {
  return readJsonFile(getSkinsMetadataPath(), { skins: [] });
}

async function writeSkinsMetadata(metadata) {
  await writeJsonFile(getSkinsMetadataPath(), metadata);
}

async function listSkins() {
  const metadata = await readSkinsMetadata();
  const settings = await readSettings();
  const skins = [];

  for (const skin of metadata.skins || []) {
    const absolutePath = path.join(getSkinsRoot(), skin.fileName);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    skins.push({
      id: skin.id,
      name: skin.name,
      fileName: skin.fileName,
      isActive: settings.activeSkin === skin.id,
      preview: await getImagePreviewData(absolutePath),
    });
  }

  return skins;
}

async function importSkin() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'PNG', extensions: ['png'] }],
  });

  if (result.canceled || !result.filePaths.length) {
    return null;
  }

  const sourcePath = result.filePaths[0];
  const originalName = path.basename(sourcePath, path.extname(sourcePath));
  const fileName = `${Date.now()}-${sanitizeFileName(path.basename(sourcePath))}`;
  const destinationPath = path.join(getSkinsRoot(), fileName);

  await ensureDirectory(getSkinsRoot());
  await fsp.copyFile(sourcePath, destinationPath);

  const metadata = await readSkinsMetadata();
  const id = `${Date.now()}`;
  metadata.skins.push({
    id,
    name: originalName,
    fileName,
  });
  await writeSkinsMetadata(metadata);

  const settings = await readSettings();
  if (!settings.activeSkin) {
    settings.activeSkin = id;
    await writeSettings(settings);
  }

  return {
    id,
    name: originalName,
    fileName,
    isActive: !settings.activeSkin || settings.activeSkin === id,
    preview: await getImagePreviewData(destinationPath),
  };
}

async function setActiveSkin(skinId) {
  const settings = await readSettings();
  settings.activeSkin = skinId;
  await writeSettings(settings);
  return settings;
}

async function deleteSkin(skinId) {
  const metadata = await readSkinsMetadata();
  const target = (metadata.skins || []).find((skin) => skin.id === skinId);
  if (!target) {
    return listSkins();
  }

  const absolutePath = path.join(getSkinsRoot(), target.fileName);
  metadata.skins = (metadata.skins || []).filter((skin) => skin.id !== skinId);
  await writeSkinsMetadata(metadata);

  if (fs.existsSync(absolutePath)) {
    await fsp.unlink(absolutePath);
  }

  const settings = await readSettings();
  if (settings.activeSkin === skinId) {
    settings.activeSkin = metadata.skins[0]?.id || null;
    await writeSettings(settings);
  }

  return listSkins();
}

async function clearLauncherCache() {
  const cacheDirs = [
    path.join(app.getPath('userData'), 'Cache'),
    path.join(app.getPath('userData'), 'Code Cache'),
    path.join(app.getPath('userData'), 'GPUCache'),
    path.join(app.getPath('userData'), 'DawnCache'),
  ];

  await session.defaultSession.clearCache();
  await session.defaultSession.clearStorageData({
    storages: ['serviceworkers', 'cachestorage'],
  });

  await Promise.all(
    cacheDirs.map(async (dirPath) => {
      try {
        await fsp.rm(dirPath, { recursive: true, force: true });
      } catch (error) {
        console.warn(`No se pudo limpiar cache en ${dirPath}:`, error);
      }
    }),
  );

  return {
    ok: true,
    message: 'La cache del launcher fue limpiada correctamente.',
  };
}

async function listInstalledMods(gameDirectory) {
  const modsDir = path.join(gameDirectory, 'mods');
  await ensureDirectory(modsDir);

  const entries = await fsp.readdir(modsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .filter((entry) => /\.(jar|zip|disabled)$/i.test(entry.name))
    .map((entry) => ({
      name: entry.name,
      type: path.extname(entry.name).replace('.', '') || 'archivo',
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function sendToRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function attachLauncherEvents(launcherClient, contextLabel = 'Launcher') {
  const prefix = `[${contextLabel}] `;

  launcherClient.on('debug', (message) => {
    sendToRenderer('launcher:event', {
      type: 'debug',
      message: `${prefix}${message}`,
      timestamp: Date.now(),
    });
  });

  launcherClient.on('data', (message) => {
    sendToRenderer('launcher:event', {
      type: 'data',
      message: `${prefix}${String(message)}`,
      timestamp: Date.now(),
    });
  });

  launcherClient.on('download-status', (status) => {
    sendToRenderer('launcher:event', {
      type: 'download-status',
      message: `${prefix}${status.name || 'Archivo'}: ${status.current}/${status.total}`,
      payload: status,
      timestamp: Date.now(),
    });
  });

  launcherClient.on('progress', (progress) => {
    sendToRenderer('launcher:event', {
      type: 'progress',
      message: `${prefix}${`${progress.task || 'Descargando'} ${progress.total ? `(${progress.current}/${progress.total})` : ''}`.trim()}`,
      payload: progress,
      timestamp: Date.now(),
    });
  });

  launcherClient.on('arguments', (args) => {
    sendToRenderer('launcher:event', {
      type: 'arguments',
      message: `${prefix}Argumentos preparados: ${args.length}`,
      payload: args,
      timestamp: Date.now(),
    });
  });

  launcherClient.on('close', (code) => {
    sendToRenderer('launcher:event', {
      type: 'close',
      message: `${prefix}Minecraft se cerro con codigo ${code}`,
      payload: { code },
      timestamp: Date.now(),
    });
  });
}

function isVersionInstalled(rootPath, version) {
  const versionDir = path.join(rootPath, 'versions', version);
  const versionJson = path.join(versionDir, `${version}.json`);
  const versionJar = path.join(versionDir, `${version}.jar`);

  return fs.existsSync(versionJson) && fs.existsSync(versionJar);
}

function getLocalVersionKind(versionId) {
  const normalized = versionId.toLowerCase();
  if (normalized.includes('fabric')) return 'fabric';
  if (normalized.includes('forge')) return 'forge';
  if (normalized.includes('neoforge')) return 'neoforge';
  if (normalized.includes('quilt')) return 'quilt';
  return 'local';
}

async function getLocalInstalledVersions() {
  const versionsRoot = path.join(getInstanceRoot(), 'versions');

  try {
    const entries = await fsp.readdir(versionsRoot, { withFileTypes: true });
    const localVersions = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const versionId = entry.name;
      const versionDir = path.join(versionsRoot, versionId);
      const versionJson = path.join(versionDir, `${versionId}.json`);

      if (!fs.existsSync(versionJson)) {
        continue;
      }

      const stats = await fsp.stat(versionJson);
      localVersions.push({
        id: versionId,
        type: getLocalVersionKind(versionId),
        releaseTime: stats.mtime.toISOString(),
        source: 'installed',
      });
    }

    return localVersions.sort((a, b) => {
      const customPriority = a.type === 'local' ? 1 : 0;
      const otherPriority = b.type === 'local' ? 1 : 0;
      if (customPriority !== otherPriority) {
        return customPriority - otherPriority;
      }
      return b.releaseTime.localeCompare(a.releaseTime);
    });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('No se pudieron leer las versiones instaladas:', error);
    }
    return [];
  }
}

async function getVersions() {
  const [localVersions, remoteManifest] = await Promise.all([
    getLocalInstalledVersions(),
    axios.get(VERSION_MANIFEST_URL, { timeout: 10000 }),
  ]);

  const remoteVersions = ((remoteManifest.data.versions || [])
    .filter((item) => item.type === 'release')
    .slice(0, 20)
    .map((item) => ({
      id: item.id,
      type: item.type,
      releaseTime: item.releaseTime,
      source: 'official',
    })));

  const merged = new Map();
  [...localVersions, ...remoteVersions].forEach((item) => {
    if (!merged.has(item.id)) {
      merged.set(item.id, item);
    }
  });

  return Array.from(merged.values());
}

async function getBootstrapVersions(selectedVersion) {
  const localVersions = await getLocalInstalledVersions();

  if (
    selectedVersion &&
    !localVersions.some((item) => item.id === selectedVersion)
  ) {
    localVersions.unshift({
      id: selectedVersion,
      type: 'selected',
      releaseTime: new Date(0).toISOString(),
      source: 'saved',
    });
  }

  return localVersions;
}

function normalizeNewsItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => item && item.title && item.summary && item.url)
    .map((item, index) => ({
      id: item.id || `news-${index + 1}`,
      title: String(item.title).trim(),
      summary: String(item.summary).trim(),
      url: String(item.url).trim(),
      image: item.image ? String(item.image).trim() : undefined,
    }));
}

async function getRemoteNewsJson() {
  const { data } = await axios.get(NEWS_JSON_URL, {
    timeout: 10000,
    responseType: 'json',
    headers: {
      'User-Agent': 'Mozilla/5.0 CTM-Launcher',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    },
  });

  const news = normalizeNewsItems(data);
  if (!news.length) {
    throw new Error('El news.json remoto no contiene noticias validas.');
  }

  return news;
}

async function getBundledNewsJson() {
  const bundledNewsRaw = await fsp.readFile(getBundledNewsPath(), 'utf8');
  const news = normalizeNewsItems(JSON.parse(bundledNewsRaw));
  if (!news.length) {
    throw new Error('El news.json local no contiene noticias validas.');
  }
  return news;
}

async function getNews() {
  const remoteResult = await Promise.allSettled([getRemoteNewsJson()]);
  if (remoteResult[0].status === 'fulfilled') {
    return remoteResult[0].value;
  }

  try {
    return await getBundledNewsJson();
  } catch (error) {
    return FALLBACK_NEWS;
  }
}

function buildLaunchOptions(settings, authorization, detached = false) {
  return {
    authorization,
    root: getInstanceRoot(),
    version: {
      number: settings.version,
      type: 'release',
    },
    memory: {
      max: `${settings.memoryMax}M`,
      min: `${settings.memoryMin}M`,
    },
    javaPath: settings.javaPath || DEFAULT_JAVA_PATH,
    overrides: {
      detached,
      gameDirectory: settings.gameDirectory,
      cwd: settings.gameDirectory,
    },
  };
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1240,
    minHeight: 780,
    backgroundColor: '#09111f',
    autoHideMenuBar: true,
    resizable: true,
    minimizable: true,
    maximizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  await mainWindow.loadFile(getRendererPath('index.html'));
}

ipcMain.handle('launcher:bootstrap', async () => {
  const settings = await readSettings();
  const [versions, skins] = await Promise.all([
    getBootstrapVersions(settings.version),
    listSkins(),
  ]);

  return {
    settings,
    versions,
    news: FALLBACK_NEWS,
    skins,
    mods: [],
    system: {
      userData: app.getPath('userData'),
      instanceRoot: getInstanceRoot(),
      platform: os.platform(),
    },
  };
});

ipcMain.handle('launcher:save-settings', async (_event, partialSettings) => {
  const current = await readSettings();
  const nextSettings = {
    ...current,
    ...partialSettings,
    memoryMax: Number(partialSettings.memoryMax ?? current.memoryMax),
    memoryMin: Number(partialSettings.memoryMin ?? current.memoryMin),
  };

  await ensureDirectory(nextSettings.gameDirectory);
  await writeSettings(nextSettings);
  return nextSettings;
});

ipcMain.handle('launcher:select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  });

  if (result.canceled || !result.filePaths.length) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle('launcher:open-external', async (_event, url) => {
  await shell.openExternal(url);
  return true;
});

ipcMain.handle('launcher:refresh-versions', async () => {
  return getVersions();
});

ipcMain.handle('launcher:refresh-news', async () => {
  return getNews();
});

ipcMain.handle('launcher:list-skins', async () => {
  return listSkins();
});

ipcMain.handle('launcher:import-skin', async () => {
  return importSkin();
});

ipcMain.handle('launcher:set-active-skin', async (_event, skinId) => {
  await setActiveSkin(skinId);
  return listSkins();
});

ipcMain.handle('launcher:delete-skin', async (_event, skinId) => {
  return deleteSkin(skinId);
});

ipcMain.handle('launcher:list-mods', async (_event, gameDirectory) => {
  return listInstalledMods(gameDirectory);
});

ipcMain.handle('launcher:open-mods-folder', async (_event, gameDirectory) => {
  const modsDir = path.join(gameDirectory, 'mods');
  await ensureDirectory(modsDir);
  await shell.openPath(modsDir);
  return modsDir;
});

ipcMain.handle('launcher:clear-cache', async () => {
  return clearLauncherCache();
});

ipcMain.handle('launcher:test-java', async (_event, javaPath) => {
  const candidate = javaPath && javaPath.trim() ? javaPath.trim() : DEFAULT_JAVA_PATH;

  try {
    const childProcess = require('child_process');
    const versionOutput = childProcess.spawnSync(candidate, ['-version'], {
      encoding: 'utf8',
    });

    if (versionOutput.error) {
      throw versionOutput.error;
    }

    return {
      ok: true,
      output: `${versionOutput.stderr || ''}${versionOutput.stdout || ''}`.trim(),
    };
  } catch (error) {
    return {
      ok: false,
      output: error.message,
    };
  }
});

ipcMain.handle('launcher:download-version', async (_event, partialSettings) => {
  const settings = await readSettings();
  const merged = { ...settings, ...partialSettings };
  const authorization = await Authenticator.getAuth(merged.username || 'Jugador');
  const rootPath = getInstanceRoot();

  await ensureDirectory(rootPath);
  await ensureDirectory(merged.gameDirectory);

  if (isVersionInstalled(rootPath, merged.version)) {
    return {
      ok: true,
      message: `La version ${merged.version} ya existe en ${rootPath}.`,
    };
  }

  const options = buildLaunchOptions(merged, authorization, false);
  const launcherClient = new Client();
  attachLauncherEvents(launcherClient, `Descarga ${merged.version}`);
  sendToRenderer('launcher:event', {
    type: 'status',
    message: `Preparando archivos para la version ${merged.version}...`,
    timestamp: Date.now(),
  });

  const processHandle = await launcherClient.launch(options);
  if (processHandle) {
    processHandle.kill();
  }

  return {
    ok: true,
    message: `La version ${merged.version} quedo descargada en la instancia.`,
  };
});

ipcMain.handle('launcher:launch', async (_event, partialSettings) => {
  const settings = await readSettings();
  const merged = {
    ...settings,
    ...partialSettings,
  };

  await ensureDirectory(getInstanceRoot());
  await ensureDirectory(merged.gameDirectory);
  await writeSettings(merged);

  try {
    const authorization = await Authenticator.getAuth(merged.username || 'Jugador');
    const options = buildLaunchOptions(merged, authorization, true);
    const launcherClient = new Client();
    const contextLabel = `${merged.username} - ${merged.version}`;
    attachLauncherEvents(launcherClient, contextLabel);
    const processHandle = await launcherClient.launch(options);

    if (!processHandle) {
      return {
        ok: false,
        message:
          'No se pudo iniciar Minecraft. Revisa si Java esta instalado y accesible.',
      };
    }

    if (typeof processHandle.unref === 'function') {
      processHandle.unref();
    }

    return {
      ok: true,
      message: `Lanzando Minecraft ${merged.version} para ${merged.username}.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
});

app.whenReady().then(async () => {
  await ensureDirectory(getInstanceRoot());
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

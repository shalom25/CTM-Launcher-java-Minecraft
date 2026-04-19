const state = {
  activeTab: 'info',
  settings: null,
  versions: [],
  news: [],
  skins: [],
  mods: [],
  events: [],
};

const translations = {
  es: {
    'sidebar.launcher': 'Launcher',
    'sidebar.session': 'Sesion',
    'brand.title': 'CTM Launcher',
    'tabs.info': 'Informacion y noticias',
    'tabs.console': 'Consola',
    'tabs.edit': 'Editar perfil',
    'tabs.mods': 'Mods instalados',
    'tabs.launcherSettings': 'Launcher ajustes',
    'tabs.profile': 'Mi perfil',
    'hero.eyebrow': 'Minecraft Java Launcher',
    'hero.title': 'CTM Launcher para Minecraft Java',
    'hero.text': 'Gestiona una instancia dedicada, selecciona versiones oficiales y lanza Minecraft desde una app de escritorio para Windows.',
    'hero.statusLabel': 'Estado del launcher',
    'buttons.downloadLauncher': 'Descargar actualizacion',
    'buttons.refreshNews': 'Actualizar noticias',
    'buttons.testJava': 'Comprobar Java',
    'buttons.change': 'Cambiar',
    'buttons.importPng': 'Importar PNG',
    'buttons.saveProfile': 'Guardar perfil',
    'buttons.openMods': 'Abrir carpeta mods',
    'buttons.refreshMods': 'Actualizar mods',
    'buttons.saveLauncherSettings': 'Guardar ajustes',
    'buttons.clearCache': 'Limpiar cache',
    'buttons.playNow': 'Jugar ahora',
    'edit.account': 'Cuenta',
    'edit.offline': 'Offline',
    'edit.nickname': 'Nickname',
    'edit.nicknamePlaceholder': 'Jugador',
    'edit.version': 'Version',
    'edit.ramMin': 'RAM min',
    'edit.ramMax': 'RAM max',
    'edit.javaInstance': 'Java e instancia',
    'edit.javaPath': 'Ruta Java',
    'edit.javaPlaceholder': 'java',
    'edit.gameFolder': 'Carpeta del juego',
    'edit.skin': 'Skin',
    'edit.skinNote': 'La skin queda guardada en el launcher, pero Minecraft vanilla offline no la aplica automaticamente dentro del juego sin un sistema adicional.',
    'edit.profileActions': 'Acciones del perfil',
    'news.title': 'Noticias',
    'news.openLink': 'Abrir enlace',
    'mods.title': 'Mods instalados',
    'launcherSettings.language': 'Idioma',
    'launcherSettings.tag': 'Launcher',
    'launcherSettings.chooseLanguage': 'Selecciona idioma',
    'launcherSettings.updateUrl': 'URL actualizacion GitHub',
    'launcherSettings.updateUrlPlaceholder': 'https://github.com/...',
    'launcherSettings.maintenance': 'Mantenimiento',
    'launcherSettings.cacheTag': 'Cache',
    'launcherSettings.cacheText': 'Limpia la cache interna del launcher sin borrar tu perfil ni tus ajustes.',
    'profile.title': 'Mi perfil',
    'profile.summary': 'Resumen',
    'profile.system': 'Sistema',
    'profile.instance': 'Instancia',
  },
  en: {
    'sidebar.launcher': 'Launcher',
    'sidebar.session': 'Session',
    'brand.title': 'CTM Launcher',
    'tabs.info': 'Information and news',
    'tabs.console': 'Console',
    'tabs.edit': 'Edit profile',
    'tabs.mods': 'Installed mods',
    'tabs.launcherSettings': 'Launcher settings',
    'tabs.profile': 'My profile',
    'hero.eyebrow': 'Minecraft Java Launcher',
    'hero.title': 'CTM Launcher for Minecraft Java',
    'hero.text': 'Manage a dedicated instance, select official versions and launch Minecraft from a Windows desktop app.',
    'hero.statusLabel': 'Launcher status',
    'buttons.downloadLauncher': 'Download update',
    'buttons.refreshNews': 'Refresh news',
    'buttons.testJava': 'Check Java',
    'buttons.change': 'Change',
    'buttons.importPng': 'Import PNG',
    'buttons.saveProfile': 'Save profile',
    'buttons.openMods': 'Open mods folder',
    'buttons.refreshMods': 'Refresh mods',
    'buttons.saveLauncherSettings': 'Save settings',
    'buttons.clearCache': 'Clear cache',
    'buttons.playNow': 'Play now',
    'edit.account': 'Account',
    'edit.offline': 'Offline',
    'edit.nickname': 'Nickname',
    'edit.nicknamePlaceholder': 'Player',
    'edit.version': 'Version',
    'edit.ramMin': 'Min RAM',
    'edit.ramMax': 'Max RAM',
    'edit.javaInstance': 'Java and instance',
    'edit.javaPath': 'Java path',
    'edit.javaPlaceholder': 'java',
    'edit.gameFolder': 'Game folder',
    'edit.skin': 'Skin',
    'edit.skinNote': 'The skin is saved in the launcher, but vanilla offline Minecraft does not apply it automatically in-game without an additional system.',
    'edit.profileActions': 'Profile actions',
    'news.title': 'News',
    'news.openLink': 'Open link',
    'mods.title': 'Installed mods',
    'launcherSettings.language': 'Language',
    'launcherSettings.tag': 'Launcher',
    'launcherSettings.chooseLanguage': 'Choose language',
    'launcherSettings.updateUrl': 'GitHub update URL',
    'launcherSettings.updateUrlPlaceholder': 'https://github.com/...',
    'launcherSettings.maintenance': 'Maintenance',
    'launcherSettings.cacheTag': 'Cache',
    'launcherSettings.cacheText': 'Clear the internal launcher cache without removing your profile or settings.',
    'profile.title': 'My profile',
    'profile.summary': 'Summary',
    'profile.system': 'System',
    'profile.instance': 'Instance',
  },
};

function getCopy() {
  const locale = state.settings?.language || 'es';
  return translations[locale] || translations.en;
}

const els = {
  tabButtons: document.querySelectorAll('[data-tab-button]'),
  tabPanels: document.querySelectorAll('[data-tab-panel]'),
  username: document.getElementById('username'),
  version: document.getElementById('version'),
  memoryMin: document.getElementById('memoryMin'),
  memoryMax: document.getElementById('memoryMax'),
  javaPath: document.getElementById('javaPath'),
  language: document.getElementById('language'),
  gameDirectory: document.getElementById('gameDirectory'),
  systemInfo: document.getElementById('systemInfo'),
  launcherState: document.getElementById('launcherState'),
  statusText: document.getElementById('statusText'),
  newsList: document.getElementById('newsList'),
  skinPreview: document.getElementById('skinPreview'),
  activeSkinName: document.getElementById('activeSkinName'),
  skinList: document.getElementById('skinList'),
  profileSummary: document.getElementById('profileSummary'),
  sidebarUser: document.getElementById('sidebarUser'),
  sidebarVersion: document.getElementById('sidebarVersion'),
  socialLinks: document.querySelectorAll('[data-social-url]'),
  modsList: document.getElementById('modsList'),
  logBox: document.getElementById('logBox'),
  eventCount: document.getElementById('eventCount'),
  saveProfile: document.getElementById('saveProfile'),
  saveLauncherSettings: document.getElementById('saveLauncherSettings'),
  clearLauncherCache: document.getElementById('clearLauncherCache'),
  chooseDirectory: document.getElementById('chooseDirectory'),
  refreshVersions: document.getElementById('refreshVersions'),
  importSkin: document.getElementById('importSkin'),
  refreshMods: document.getElementById('refreshMods'),
  openModsFolder: document.getElementById('openModsFolder'),
  testJava: document.getElementById('testJava'),
  downloadVersion: document.getElementById('downloadVersion'),
  launchGame: document.getElementById('launchGame'),
};

function setLauncherState(isActive) {
  const forcedInactive = state.settings?.launcherEnabled === false;
  const active = !forcedInactive && isActive;

  els.launcherState.textContent = active ? 'Activo' : 'Inactivo';
  els.launcherState.classList.toggle('launcher-state--active', active);
  els.launcherState.classList.toggle('launcher-state--inactive', !active);
}

function setStatus(message, type = 'info') {
  els.statusText.textContent = message;

  if (state.settings?.launcherEnabled === false) {
    setLauncherState(false);
    return;
  }

  setLauncherState(type !== 'error');
}

function applyLanguage() {
  const locale = state.settings?.language || 'es';
  const copy = getCopy();

  document.documentElement.lang = locale;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (copy[key]) {
      element.textContent = copy[key];
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (copy[key]) {
      element.placeholder = copy[key];
    }
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;

  els.tabButtons.forEach((button) => {
    button.classList.toggle('nav-tab--active', button.dataset.tabButton === tabId);
  });

  els.tabPanels.forEach((panel) => {
    panel.classList.toggle('tab-panel--active', panel.dataset.tabPanel === tabId);
  });
}

function addEvent(message, type = 'info') {
  state.events.unshift({
    message,
    type,
    timestamp: new Date().toLocaleTimeString('es-ES'),
  });

  state.events = state.events.slice(0, 80);
  renderEvents();
}

function getEventLabel(type) {
  if (type === 'error') return 'Error';
  if (type === 'debug') return 'Debug';
  if (type === 'download-status') return 'Descarga';
  if (type === 'progress') return 'Progreso';
  if (type === 'close') return 'Cierre';
  if (type === 'arguments') return 'Args';
  if (type === 'data') return 'Salida';
  return 'Info';
}

function renderEvents() {
  els.eventCount.textContent = `${state.events.length} eventos`;
  els.logBox.innerHTML = '';

  state.events.forEach((entry) => {
    const row = document.createElement('div');
    row.className = `log-entry log-entry--${entry.type}`;

    const meta = document.createElement('div');
    meta.className = 'log-entry__meta';
    meta.textContent = `${entry.timestamp} · ${getEventLabel(entry.type)}`;

    const text = document.createElement('div');
    text.className = 'log-entry__text';
    text.textContent = entry.message;

    row.appendChild(meta);
    row.appendChild(text);
    els.logBox.appendChild(row);
  });
}

function renderVersions() {
  const selected = state.settings?.version;
  els.version.innerHTML = '';

  state.versions.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    const sourceLabel =
      item.source === 'installed'
        ? item.type === 'fabric'
          ? 'Fabric instalada'
          : item.type === 'forge'
            ? 'Forge instalada'
            : item.type === 'neoforge'
              ? 'NeoForge instalada'
              : item.type === 'quilt'
                ? 'Quilt instalada'
                : 'Instalada'
        : 'Oficial';
    option.textContent = `${item.id} (${sourceLabel})`;
    if (item.id === selected) {
      option.selected = true;
    }
    els.version.appendChild(option);
  });

  if (!state.versions.length && selected) {
    const option = document.createElement('option');
    option.value = selected;
    option.textContent = selected;
    option.selected = true;
    els.version.appendChild(option);
  }
}

function renderNews() {
  els.newsList.innerHTML = '';
  const copy = getCopy();

  state.news.forEach((item) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'news-item';
    card.innerHTML = `
      ${item.image ? `<img class="news-thumb" src="${item.image}" alt="${item.title}">` : ''}
      <span class="tag">Info</span>
      <h4>${item.title}</h4>
      <p>${item.summary}</p>
      <span class="news-link">${copy['news.openLink']}</span>
    `;
    card.addEventListener('click', async () => {
      await window.launcherApi.openExternal(item.url);
    });
    els.newsList.appendChild(card);
  });
}

function renderSkins() {
  els.skinList.innerHTML = '';

  const activeSkin = state.skins.find((skin) => skin.isActive);
  els.activeSkinName.textContent = activeSkin
    ? `${activeSkin.name} (activa)`
    : 'Sin skin seleccionada';
  els.skinPreview.src =
    activeSkin?.preview ||
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4Ij48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iIzBjMTQyNCIvPjx0ZXh0IHg9IjY0IiB5PSI2OCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2M2ZDdmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2luIHNraW48L3RleHQ+PC9zdmc+';

  state.skins.forEach((skin) => {
    const item = document.createElement('div');
    item.className = `skin-item${skin.isActive ? ' skin-item--active' : ''}`;

    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.className = 'skin-item__button';
    selectButton.innerHTML = `
      <img src="${skin.preview}" alt="${skin.name}" />
      <div>
        <strong>${skin.name}</strong>
        <span>${skin.isActive ? 'Activa' : 'Disponible'}</span>
      </div>
    `;
    selectButton.addEventListener('click', async () => {
      state.skins = await window.launcherApi.setActiveSkin(skin.id);
      renderSkins();
      addEvent(`Skin activa: ${skin.name}`);
      setStatus(`Skin activa seleccionada: ${skin.name}.`);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'skin-delete';
    deleteButton.textContent = 'X';
    deleteButton.title = 'Eliminar skin';
    deleteButton.addEventListener('click', async (event) => {
      event.stopPropagation();
      state.skins = await window.launcherApi.deleteSkin(skin.id);
      renderSkins();
      addEvent(`Skin eliminada: ${skin.name}`);
      setStatus(`Skin eliminada: ${skin.name}.`);
    });

    item.appendChild(selectButton);
    item.appendChild(deleteButton);
    els.skinList.appendChild(item);
  });

  renderProfileSummary();
}

function renderMods() {
  els.modsList.innerHTML = '';

  if (!state.mods.length) {
    const empty = document.createElement('div');
    empty.className = 'mod-item mod-item--empty';
    empty.textContent = 'No hay mods instalados en la carpeta actual.';
    els.modsList.appendChild(empty);
    return;
  }

  state.mods.forEach((mod) => {
    const item = document.createElement('div');
    item.className = 'mod-item';
    item.innerHTML = `
      <strong>${mod.name}</strong>
      <span>${mod.type.toUpperCase()}</span>
    `;
    els.modsList.appendChild(item);
  });
}

function renderProfileSummary() {
  if (!state.settings) {
    return;
  }

  const activeSkin = state.skins.find((skin) => skin.isActive);
  const copy = getCopy();
  const profileItems = [
    [copy['edit.nickname'], state.settings.username || 'Jugador'],
    [copy['edit.version'], state.settings.version || '-'],
    ['RAM', `${state.settings.memoryMin || 0}M / ${state.settings.memoryMax || 0}M`],
    [copy['edit.javaPath'], state.settings.javaPath || 'java'],
    [copy['edit.skin'], activeSkin?.name || 'Sin skin'],
    [copy['edit.gameFolder'], state.settings.gameDirectory || '-'],
  ];

  els.profileSummary.innerHTML = profileItems
    .map(
      ([label, value]) => `
        <div class="profile-row">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join('');

  els.sidebarUser.textContent = state.settings.username || 'Jugador';
  els.sidebarVersion.textContent = `Version: ${state.settings.version || '-'}`;
}

function fillForm() {
  const settings = state.settings;
  els.username.value = settings.username || '';
  els.memoryMin.value = settings.memoryMin || 2048;
  els.memoryMax.value = settings.memoryMax || 4096;
  els.javaPath.value = settings.javaPath || 'java';
  els.language.value = settings.language || 'es';
  els.gameDirectory.value = settings.gameDirectory || '';
  renderVersions();
}

function getFormSettings() {
  return {
    username: els.username.value.trim() || 'Jugador',
    version: els.version.value,
    memoryMin: Number(els.memoryMin.value),
    memoryMax: Number(els.memoryMax.value),
    javaPath: els.javaPath.value.trim() || 'java',
    language: els.language.value || 'es',
    gameDirectory: els.gameDirectory.value,
  };
}

async function persistSettings() {
  const nextSettings = await window.launcherApi.saveSettings(getFormSettings());
  state.settings = nextSettings;
  fillForm();
  renderProfileSummary();
  applyLanguage();
  setStatus('Ajustes guardados correctamente.', 'info');
  addEvent('Se guardaron los ajustes del launcher.');
}

async function saveProfile() {
  await persistSettings();
  setStatus('Perfil guardado correctamente.', 'info');
  addEvent('Se guardo el perfil del jugador.');
}

async function saveLauncherSettings() {
  const nextSettings = await window.launcherApi.saveSettings({
    language: els.language.value || 'es',
  });
  state.settings = nextSettings;
  fillForm();
  renderProfileSummary();
  applyLanguage();
  setStatus('Ajustes del launcher guardados.', 'info');
  addEvent(`Idioma configurado: ${state.settings.language}.`);
}

async function refreshNews() {
  setStatus('Actualizando noticias...', 'info');
  try {
    state.news = await window.launcherApi.refreshNews();
    renderNews();
    setStatus('Noticias actualizadas.', 'info');
    addEvent(`Se refrescaron ${state.news.length} noticias.`);
  } catch (error) {
    setStatus('No se pudieron actualizar las noticias.', 'error');
    addEvent(error.message, 'error');
  }
}

async function hydrateRemoteData() {
  const [versionsResult, newsResult] = await Promise.allSettled([
    window.launcherApi.refreshVersions(),
    window.launcherApi.refreshNews(),
  ]);

  if (versionsResult.status === 'fulfilled') {
    state.versions = versionsResult.value;
    renderVersions();
    addEvent(`Versiones sincronizadas: ${state.versions.length}`, 'debug');
  } else {
    addEvent('No se pudieron sincronizar las versiones remotas.', 'debug');
  }

  if (newsResult.status === 'fulfilled') {
    state.news = newsResult.value;
    renderNews();
    addEvent(`Noticias sincronizadas: ${state.news.length}`, 'debug');
  } else {
    addEvent('No se pudieron sincronizar las noticias remotas.', 'debug');
  }
}

async function hydrateMods() {
  try {
    state.mods = await window.launcherApi.listMods(els.gameDirectory.value);
    renderMods();
    addEvent(`Mods sincronizados: ${state.mods.length}`, 'debug');
  } catch (error) {
    addEvent('No se pudieron sincronizar los mods.', 'debug');
  }
}

async function chooseDirectory() {
  const selected = await window.launcherApi.selectDirectory();
  if (!selected) {
    return;
  }

  els.gameDirectory.value = selected;
  await persistSettings();
  await refreshMods();
}

async function testJava() {
  setStatus('Comprobando Java...', 'info');
  const result = await window.launcherApi.testJava(els.javaPath.value);
  if (result.ok) {
    setStatus('Java detectado correctamente.', 'info');
    addEvent(result.output || 'Java disponible.');
    return;
  }

  setStatus('No se pudo ejecutar Java.', 'error');
  addEvent(result.output || 'Java no disponible.', 'error');
}

async function downloadVersion() {
  const url = state.settings?.launcherUpdateUrl?.trim();
  if (!url) {
    setStatus('Configura una URL de GitHub para descargar el launcher.', 'error');
    addEvent('Falta la URL de actualizacion del launcher.', 'error');
    switchTab('launcher-settings');
    return;
  }

  await window.launcherApi.openExternal(url);
  setStatus('Abriendo descarga del launcher.', 'info');
  addEvent(`Descarga del launcher abierta: ${url}`);
}

async function launchGame() {
  setStatus('Iniciando Minecraft...', 'info');
  addEvent('Solicitud de inicio enviada al backend.');
  const result = await window.launcherApi.launchGame(getFormSettings());
  setStatus(result.message, result.ok ? 'info' : 'error');
  addEvent(result.message, result.ok ? 'info' : 'error');
}

async function importSkin() {
  const skin = await window.launcherApi.importSkin();
  if (!skin) {
    return;
  }

  state.skins = await window.launcherApi.listSkins();
  renderSkins();
  setStatus(`Skin importada: ${skin.name}.`, 'info');
  addEvent(`Skin importada: ${skin.name}. Recuerda: Minecraft offline no la aplica por si solo.`);
}

async function refreshMods() {
  try {
    state.mods = await window.launcherApi.listMods(els.gameDirectory.value);
    renderMods();
    addEvent(`Mods detectados: ${state.mods.length}`);
  } catch (error) {
    addEvent(error.message, 'error');
  }
}

async function openModsFolder() {
  await window.launcherApi.openModsFolder(els.gameDirectory.value);
  addEvent('Carpeta de mods abierta.');
}

async function clearLauncherCache() {
  const result = await window.launcherApi.clearCache();
  setStatus(result.message, result.ok ? 'info' : 'error');
  addEvent(result.message, result.ok ? 'info' : 'error');
}

async function openSocialLink(url) {
  await window.launcherApi.openExternal(url);
  addEvent(`Enlace abierto: ${url}`);
}

function bindActions() {
  els.tabButtons.forEach((button) => {
    button.addEventListener('click', () => switchTab(button.dataset.tabButton));
  });
  els.socialLinks.forEach((button) => {
    button.addEventListener('click', () => openSocialLink(button.dataset.socialUrl));
  });
  els.saveProfile.addEventListener('click', saveProfile);
  els.saveLauncherSettings.addEventListener('click', saveLauncherSettings);
  els.clearLauncherCache.addEventListener('click', clearLauncherCache);
  els.chooseDirectory.addEventListener('click', chooseDirectory);
  els.refreshVersions.addEventListener('click', refreshNews);
  els.importSkin.addEventListener('click', importSkin);
  els.refreshMods.addEventListener('click', refreshMods);
  els.openModsFolder.addEventListener('click', openModsFolder);
  els.testJava.addEventListener('click', testJava);
  els.downloadVersion.addEventListener('click', downloadVersion);
  els.launchGame.addEventListener('click', launchGame);
}

async function bootstrap() {
  bindActions();
  window.launcherApi.onEvent((event) => {
    if (event.type === 'status' || event.type === 'close') {
      setStatus(event.message, event.type === 'close' ? 'error' : 'info');
    }

    if (event.type === 'error') {
      setStatus(event.message, 'error');
    }

    addEvent(event.message, event.type);
  });

  try {
    const payload = await window.launcherApi.bootstrap();
    state.settings = payload.settings;
    state.versions = payload.versions;
    state.news = payload.news;
    state.skins = payload.skins;
    state.mods = payload.mods;

    fillForm();
    renderNews();
    renderSkins();
    renderMods();
    renderEvents();
    renderProfileSummary();
    applyLanguage();
    switchTab(state.activeTab);

    els.systemInfo.innerHTML = `
      <span>Plataforma: ${payload.system.platform}</span>
      <span>Datos: ${payload.system.userData}</span>
      <span>Instancia: ${payload.system.instanceRoot}</span>
    `;

    setStatus(
      state.settings.lastStatus || 'Launcher cargado.',
      state.settings.launcherEnabled === false ? 'error' : 'info',
    );
    addEvent('Launcher inicializado correctamente.');
    queueMicrotask(() => {
      hydrateRemoteData().catch((error) => {
        addEvent(error.message, 'debug');
      });
    });
    queueMicrotask(() => {
      hydrateMods().catch((error) => {
        addEvent(error.message, 'debug');
      });
    });
  } catch (error) {
    setStatus('No se pudo cargar el launcher.', 'error');
    addEvent(error.message, 'error');
  }
}

bootstrap();

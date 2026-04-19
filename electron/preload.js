const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('launcherApi', {
  bootstrap: () => ipcRenderer.invoke('launcher:bootstrap'),
  saveSettings: (settings) => ipcRenderer.invoke('launcher:save-settings', settings),
  selectDirectory: () => ipcRenderer.invoke('launcher:select-directory'),
  openExternal: (url) => ipcRenderer.invoke('launcher:open-external', url),
  refreshVersions: () => ipcRenderer.invoke('launcher:refresh-versions'),
  refreshNews: () => ipcRenderer.invoke('launcher:refresh-news'),
  listSkins: () => ipcRenderer.invoke('launcher:list-skins'),
  importSkin: () => ipcRenderer.invoke('launcher:import-skin'),
  setActiveSkin: (skinId) => ipcRenderer.invoke('launcher:set-active-skin', skinId),
  deleteSkin: (skinId) => ipcRenderer.invoke('launcher:delete-skin', skinId),
  listMods: (gameDirectory) => ipcRenderer.invoke('launcher:list-mods', gameDirectory),
  openModsFolder: (gameDirectory) =>
    ipcRenderer.invoke('launcher:open-mods-folder', gameDirectory),
  clearCache: () => ipcRenderer.invoke('launcher:clear-cache'),
  testJava: (javaPath) => ipcRenderer.invoke('launcher:test-java', javaPath),
  downloadVersion: (settings) => ipcRenderer.invoke('launcher:download-version', settings),
  launchGame: (settings) => ipcRenderer.invoke('launcher:launch', settings),
  onEvent: (listener) => {
    const wrapped = (_event, payload) => listener(payload);
    ipcRenderer.on('launcher:event', wrapped);
    return () => ipcRenderer.removeListener('launcher:event', wrapped);
  },
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("packgod", {
  getState: () => ipcRenderer.invoke("browser:get-state"),
  newTab: (url) => ipcRenderer.invoke("browser:new-tab", url),
  activateTab: (id) => ipcRenderer.invoke("browser:activate-tab", id),
  closeTab: (id) => ipcRenderer.invoke("browser:close-tab", id),
  navigate: (id, url) => ipcRenderer.invoke("browser:navigate", id, url),
  command: (id, command) => ipcRenderer.invoke("browser:command", id, command),
  onState: (callback) => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on("browser:state", listener);
    return () => ipcRenderer.removeListener("browser:state", listener);
  }
});
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: "#000",

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
      webviewTag: true
    }
  });

  win.loadFile("index.html");

  // 💀 dev tools (remove later if you want)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
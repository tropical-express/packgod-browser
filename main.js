const { app, BrowserWindow, WebContentsView, ipcMain, session } = require("electron");
const path = require("node:path");

const HEADER_HEIGHT = 142;
const SEARCH_URL = "https://www.google.com/search?q=";
const tabs = new Map();
let mainWindow;
let activeTabId = null;
let nextTabId = 1;

function safeTarget(input) {
  const value = String(input || "").trim();
  if (!value || value === "packgod://newtab") return "packgod://newtab";

  let candidate = value;
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(candidate)) {
    candidate = candidate.includes(".") && !candidate.includes(" ")
      ? `https://${candidate}`
      : SEARCH_URL + encodeURIComponent(candidate);
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return SEARCH_URL + encodeURIComponent(value);
    }
    return parsed.href;
  } catch {
    return SEARCH_URL + encodeURIComponent(value);
  }
}

function tabSnapshot(tab) {
  const contents = tab.view?.webContents;
  return {
    id: tab.id,
    title: tab.title,
    url: tab.url,
    loading: tab.loading,
    active: tab.id === activeTabId,
    canGoBack: !!contents && contents.navigationHistory.canGoBack(),
    canGoForward: !!contents && contents.navigationHistory.canGoForward()
  };
}

function sendState() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const current = tabs.get(activeTabId);
  mainWindow.webContents.send("browser:state", {
    tabs: [...tabs.values()].map(tabSnapshot),
    activeTabId,
    active: current ? tabSnapshot(current) : null
  });
}

function layoutActiveView() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const bounds = mainWindow.getContentBounds();
  for (const tab of tabs.values()) {
    if (!tab.view) continue;
    if (tab.id === activeTabId) {
      tab.view.setBounds({
        x: 0,
        y: HEADER_HEIGHT,
        width: bounds.width,
        height: Math.max(0, bounds.height - HEADER_HEIGHT)
      });
    } else {
      tab.view.setBounds({ x: 0, y: HEADER_HEIGHT, width: 0, height: 0 });
    }
  }
}

function attachView(tab) {
  if (tab.view || !mainWindow) return;
  const browserSession = session.fromPartition("persist:packgod-browser");
  browserSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));

  const view = new WebContentsView({
    webPreferences: {
      session: browserSession,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  tab.view = view;
  mainWindow.contentView.addChildView(view);

  view.webContents.setWindowOpenHandler(({ url }) => {
    const target = safeTarget(url);
    if (target.startsWith("http://") || target.startsWith("https://")) {
      createTab(target);
    }
    return { action: "deny" };
  });

  view.webContents.on("will-navigate", (event, url) => {
    try {
      const protocol = new URL(url).protocol;
      if (protocol !== "https:" && protocol !== "http:") event.preventDefault();
    } catch {
      event.preventDefault();
    }
  });

  view.webContents.on("did-start-loading", () => {
    tab.loading = true;
    sendState();
  });
  view.webContents.on("did-stop-loading", () => {
    tab.loading = false;
    sendState();
  });
  view.webContents.on("page-title-updated", (_event, title) => {
    tab.title = title || "Untitled";
    sendState();
  });
  view.webContents.on("did-navigate", (_event, url) => {
    tab.url = url;
    sendState();
  });
  view.webContents.on("did-navigate-in-page", (_event, url) => {
    tab.url = url;
    sendState();
  });
  view.webContents.on("render-process-gone", () => {
    tab.loading = false;
    tab.title = "Page crashed";
    sendState();
  });

  layoutActiveView();
}

function navigateTab(tab, input) {
  const target = safeTarget(input);
  tab.url = target;
  tab.title = target === "packgod://newtab" ? "New Tab" : "Loading…";

  if (target === "packgod://newtab") {
    if (tab.view) {
      mainWindow.contentView.removeChildView(tab.view);
      tab.view.webContents.close();
      tab.view = null;
    }
    tab.loading = false;
    sendState();
    return;
  }

  attachView(tab);
  tab.loading = true;
  layoutActiveView();
  tab.view.webContents.loadURL(target).catch((error) => {
    tab.loading = false;
    tab.title = "Could not load page";
    console.error("Navigation failed:", error.message);
    sendState();
  });
  sendState();
}

function createTab(url = "packgod://newtab") {
  const id = String(nextTabId++);
  const tab = { id, title: "New Tab", url: "packgod://newtab", loading: false, view: null };
  tabs.set(id, tab);
  activeTabId = id;
  navigateTab(tab, url);
  layoutActiveView();
  sendState();
  return id;
}

function activateTab(id) {
  if (!tabs.has(id)) return;
  activeTabId = id;
  layoutActiveView();
  sendState();
}

function closeTab(id) {
  const tab = tabs.get(id);
  if (!tab) return;
  if (tab.view) {
    mainWindow.contentView.removeChildView(tab.view);
    tab.view.webContents.close();
  }
  tabs.delete(id);

  if (activeTabId === id) {
    const remaining = [...tabs.keys()];
    activeTabId = remaining.length ? remaining[remaining.length - 1] : null;
  }
  if (!activeTabId) createTab();
  else {
    layoutActiveView();
    sendState();
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: "#08090a",
    title: "Packgod Browser",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile("index.html");
  mainWindow.on("resize", layoutActiveView);
  mainWindow.webContents.once("did-finish-load", () => {
    if (!tabs.size) createTab();
    else sendState();
  });

  if (process.env.PACKGOD_DEVTOOLS === "1") mainWindow.webContents.openDevTools();
  mainWindow.on("closed", () => { mainWindow = null; });
}

function requireTrustedUi(event) {
  if (!mainWindow || event.sender !== mainWindow.webContents) {
    throw new Error("Blocked IPC from an untrusted renderer");
  }
}

ipcMain.handle("browser:get-state", (event) => {
  requireTrustedUi(event);
  return ({
  tabs: [...tabs.values()].map(tabSnapshot),
  activeTabId,
  active: tabs.has(activeTabId) ? tabSnapshot(tabs.get(activeTabId)) : null
  });
});
ipcMain.handle("browser:new-tab", (event, url) => { requireTrustedUi(event); return createTab(url); });
ipcMain.handle("browser:activate-tab", (event, id) => { requireTrustedUi(event); return activateTab(String(id)); });
ipcMain.handle("browser:close-tab", (event, id) => { requireTrustedUi(event); return closeTab(String(id)); });
ipcMain.handle("browser:navigate", (event, id, url) => {
  requireTrustedUi(event);
  const tab = tabs.get(String(id));
  if (tab) navigateTab(tab, url);
});
ipcMain.handle("browser:command", (event, id, command) => {
  requireTrustedUi(event);
  const tab = tabs.get(String(id));
  const contents = tab?.view?.webContents;
  if (!tab) return;
  if (command === "back" && contents?.navigationHistory.canGoBack()) contents.navigationHistory.goBack();
  if (command === "forward" && contents?.navigationHistory.canGoForward()) contents.navigationHistory.goForward();
  if (command === "reload" && contents) contents.reload();
  if (command === "home") navigateTab(tab, "packgod://newtab");
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
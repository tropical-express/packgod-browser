const { contextBridge } = require("electron");
const path = require("path");

// 🔊 load audio system safely
const { play, chaosBurst, assets } = require("./utils/audio");

contextBridge.exposeInMainWorld("api", {
  play,
  chaosBurst,
  assets,
  path
});
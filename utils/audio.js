const path = require("path");

const basePath = process.resourcesPath || __dirname;

const assets = {
  boot: path.join(basePath, "assets/boot.mp3"),
  click: path.join(basePath, "assets/click.mp3"),
  roast: path.join(basePath, "assets/roast.mp3"),
  vine: path.join(basePath, "assets/vineboom.mp3"),
  laugh: path.join(basePath, "assets/laugh.mp3"),
  muy: path.join(basePath, "assets/muycaliente.mp3"),
  storm: path.join(basePath, "assets/stormtrooper.mp3")
};

function play(src) {
  const a = new Audio(src);
  a.volume = Math.random() * 0.7 + 0.2;
  a.play().catch(() => {});
}

function chaosBurst() {
  const keys = Object.keys(assets);
  const pick = keys[Math.floor(Math.random() * keys.length)];
  play(assets[pick]);
}

module.exports = { play, chaosBurst, assets };
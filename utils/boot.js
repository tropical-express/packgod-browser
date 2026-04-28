const { play, assets } = require("./audio");

let booting = true;

function startBoot(onFinish) {
  // ðŸ”Š play startup sound
  play(assets.boot);

  // ðŸ”¥ boot phase lasts 3 seconds
  setTimeout(() => {
    booting = false;
    if (onFinish) onFinish();
  }, 3000);
}

function isBooting() {
  return booting;
}

module.exports = { startBoot, isBooting };
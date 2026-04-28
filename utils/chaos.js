const { chaosBurst, play, assets } = require("./audio");
const { randomRoast } = require("./roasts");
const { glitch, shake, tilt } = require("./effects");
const { isBooting } = require("./boot");

// ðŸ¤¡ fake popup spam
function fakeWarning() {
  const msgs = [
    "bad decision detected",
    "packgod is watching you",
    "this site ain't it ðŸ˜­",
    "why are you still here?",
    "internet privileges revoked (jk)"
  ];

  const div = document.createElement("div");
  div.innerText = msgs[Math.floor(Math.random() * msgs.length)];

  div.style.position = "fixed";
  div.style.top = Math.random() * 80 + "%";
  div.style.left = Math.random() * 80 + "%";
  div.style.background = "black";
  div.style.color = "red";
  div.style.padding = "10px";
  div.style.zIndex = 9999;
  div.style.fontWeight = "bold";

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 1500);
}

// ðŸ¤¡ input sabotage
function messInput(input) {
  if (!input) return;

  if (Math.random() < 0.3) {
    input.style.transform =
      `rotate(${Math.random()*4-2}deg)`;

    setTimeout(() => {
      input.style.transform = "none";
    }, 150);
  }

  if (Math.random() < 0.2) {
    input.value += ["ðŸ’€","ðŸ˜­","ðŸ”¥"][Math.floor(Math.random()*3)];
  }
}

// ðŸ”¥ main chaos engine
function runChaos(roastBox, input) {
  if (isBooting()) return;

  const roll = Math.random();

  if (roll < 0.85) chaosBurst();

  if (roll < 0.8 && roastBox) {
    roastBox.innerText = randomRoast();
    play(assets.roast);

    setTimeout(() => {
      roastBox.innerText = "";
    }, 1200);
  }

  if (roll < 0.6) glitch();
  if (roll < 0.5) shake();
  if (roll < 0.4) tilt();
  if (roll < 0.3) fakeWarning();

  if (roll < 0.4) messInput(input);
}

module.exports = { runChaos };
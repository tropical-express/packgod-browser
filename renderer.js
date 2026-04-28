const bootScreen = document.getElementById("bootScreen");
const bootImage = document.getElementById("bootImage");

const app = document.getElementById("app");

const input = document.getElementById("url");
const button = document.getElementById("go");
const webview = document.getElementById("webview");

// 🔊 SOUND (must be triggered by click)
const bootSound = new Audio("assets/muycaliente.mp3");
bootSound.preload = "auto";

// 💀 ENTER APP FUNCTION
function enterApp() {
  console.log("Boot clicked");

  // reset + play sound
  bootSound.currentTime = 0;
  bootSound.volume = 1.0;

  bootSound.play()
    .then(() => console.log("sound playing"))
    .catch(err => console.log("audio blocked:", err));

  // switch UI
  bootScreen.style.display = "none";
  app.style.display = "block";
}

// attach to BOTH (reliable)
bootScreen.addEventListener("click", enterApp);
bootImage.addEventListener("click", enterApp);

// 🌐 NAVIGATION
function go() {
  let url = input.value.trim();
  if (!url) return;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  console.log("Loading:", url);
  webview.src = url;
}

button.addEventListener("click", go);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") go();
});
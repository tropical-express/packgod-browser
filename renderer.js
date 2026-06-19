const bootScreen = document.getElementById("bootScreen");
const bootImage = document.getElementById("bootImage");

const app = document.getElementById("app");

const input = document.getElementById("url");
const button = document.getElementById("go");
const webview = document.getElementById("webview");

// ----------------------
// SAFETY CHECKS
// ----------------------
if (!bootScreen || !app || !input || !webview) {
  console.error("Missing DOM elements");
}

// ----------------------
// SOUND
// ----------------------
const bootSound = new Audio("assets/muycaliente.mp3");
bootSound.preload = "auto";

// ----------------------
// URL FIXER (IMPORTANT)
// ----------------------
function fixUrl(url) {
  url = url.trim();

  if (!url) return "https://google.com";

  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://")
  ) {
    return "https://" + url;
  }

  return url;
}

// ----------------------
// ENTER APP
// ----------------------
function enterApp() {
  console.log("Boot clicked");

  try {
    bootSound.currentTime = 0;
    bootSound.volume = 1.0;

    const playPromise = bootSound.play();

    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log("Audio blocked:", err);
      });
    }
  } catch (e) {
    console.log("Audio error:", e);
  }

  bootScreen.style.opacity = "0";

  setTimeout(() => {
    bootScreen.style.display = "none";
    app.style.display = "flex";
  }, 250);
}

// ----------------------
// EVENTS (BOOT)
// ----------------------
bootScreen?.addEventListener("click", enterApp);
bootImage?.addEventListener("click", enterApp);

// ----------------------
// NAVIGATION
// ----------------------
function go() {
  let url = fixUrl(input.value);

  console.log("Loading:", url);

  webview.src = url;
  input.value = url;
}

// ----------------------
// BUTTON + ENTER KEY
// ----------------------
button.addEventListener("click", go);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") go();
});

// ----------------------
// OPTIONAL: SYNC URL BAR
// ----------------------
webview.addEventListener("did-navigate", (e) => {
  input.value = e.url;
});
const $ = (id) => document.getElementById(id);
const tabsElement = $("tabs");
const addressInput = $("url");
const homePage = $("homePage");
const statusText = $("statusText");
const chaosToggle = $("chaosToggle");

let browserState = { tabs: [], activeTabId: null, active: null };
let chaosEnabled = true;

function activeId() {
  return browserState.activeTabId;
}

function renderTabs() {
  tabsElement.replaceChildren();
  for (const tab of browserState.tabs) {
    const item = document.createElement("div");
    item.className = "tab" + (tab.active ? " active" : "");
    item.title = tab.url;

    const label = document.createElement("button");
    label.className = "tab-label";
    label.type = "button";
    label.textContent = tab.title || "New Tab";
    label.addEventListener("click", () => window.packgod.activateTab(tab.id));

    const close = document.createElement("button");
    close.className = "tab-close";
    close.type = "button";
    close.textContent = "×";
    close.title = "Close tab";
    close.setAttribute("aria-label", "Close tab");
    close.addEventListener("click", (event) => {
      event.stopPropagation();
      window.packgod.closeTab(tab.id);
    });

    item.append(label, close);
    item.addEventListener("click", () => window.packgod.activateTab(tab.id));
    tabsElement.append(item);
  }
}

function renderState(state) {
  browserState = state;
  renderTabs();

  const active = state.active;
  const isHome = !active || active.url === "packgod://newtab";
  homePage.hidden = !isHome;

  if (active) {
    addressInput.value = isHome ? "" : active.url;
    addressInput.placeholder = "Search the web or enter an address…";
    $("back").disabled = !active.canGoBack;
    $("forward").disabled = !active.canGoForward;
    $("reload").disabled = isHome;
    statusText.textContent = active.loading ? "LOADING…" : "READY WHEN YOU ARE.";
  }
}

async function navigate(value) {
  if (!activeId()) await window.packgod.newTab();
  const id = activeId();
  await window.packgod.navigate(id, value);
}

$("addressForm").addEventListener("submit", (event) => {
  event.preventDefault();
  navigate(addressInput.value);
});
$("heroSearch").addEventListener("submit", (event) => {
  event.preventDefault();
  navigate($("heroInput").value);
});
$("newTab").addEventListener("click", () => window.packgod.newTab());
$("back").addEventListener("click", () => window.packgod.command(activeId(), "back"));
$("forward").addEventListener("click", () => window.packgod.command(activeId(), "forward"));
$("reload").addEventListener("click", () => window.packgod.command(activeId(), "reload"));
$("home").addEventListener("click", () => window.packgod.command(activeId(), "home"));

document.querySelectorAll("[data-url]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.url));
});

chaosToggle.addEventListener("click", () => {
  chaosEnabled = !chaosEnabled;
  chaosToggle.setAttribute("aria-pressed", String(chaosEnabled));
  document.body.classList.toggle("chaos-off", !chaosEnabled);
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === "l") {
    event.preventDefault();
    addressInput.focus();
    addressInput.select();
  } else if ((event.ctrlKey || event.metaKey) && key === "t") {
    event.preventDefault();
    window.packgod.newTab();
  } else if ((event.ctrlKey || event.metaKey) && key === "w") {
    event.preventDefault();
    if (activeId()) window.packgod.closeTab(activeId());
  } else if ((event.ctrlKey || event.metaKey) && key === "r") {
    event.preventDefault();
    window.packgod.command(activeId(), "reload");
  } else if (event.altKey && key === "arrowleft") {
    window.packgod.command(activeId(), "back");
  } else if (event.altKey && key === "arrowright") {
    window.packgod.command(activeId(), "forward");
  } else if (key === "escape" && document.activeElement === addressInput) {
    addressInput.blur();
  }
});

window.packgod.onState(renderState);
window.packgod.getState().then(renderState).catch((error) => {
  console.error("Could not initialize browser UI:", error);
  statusText.textContent = "BROWSER INITIALIZATION FAILED.";
});
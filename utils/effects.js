function glitch() {
  document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;

  document.body.style.transform =
    `translate(${Math.random()*6-3}px, ${Math.random()*6-3}px)`;

  setTimeout(() => {
    document.body.style.filter = "none";
    document.body.style.transform = "none";
  }, 200);
}

function shake() {
  document.body.style.transform =
    `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`;

  setTimeout(() => {
    document.body.style.transform = "none";
  }, 100);
}

function tilt() {
  document.body.style.transform =
    `rotate(${Math.random()*2-1}deg)`;

  setTimeout(() => {
    document.body.style.transform = "none";
  }, 150);
}

module.exports = { glitch, shake, tilt };
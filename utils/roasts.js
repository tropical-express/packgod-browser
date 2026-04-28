const roasts = [
  "bro what are you doing ðŸ’€",
  "this tab is cooked",
  "packgod is disappointed",
  "you really clicked that ðŸ˜­",
  "internet privileges revoked",
  "this is NOT it",
  "log off immediately"
];

function randomRoast() {
  return roasts[Math.floor(Math.random() * roasts.length)];
}

module.exports = { randomRoast };
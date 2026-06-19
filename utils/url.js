export function fixUrl(input) {
  if (!input) return "https://google.com";

  if (!input.startsWith("http")) {
    return "https://" + input;
  }

  return input;
}
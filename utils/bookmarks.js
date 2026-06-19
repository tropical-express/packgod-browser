export const bookmarks = {
  get() {
    return JSON.parse(localStorage.getItem("bookmarks") || "[]");
  },

  add(url) {
    const list = this.get();
    if (!list.includes(url)) {
      list.push(url);
      localStorage.setItem("bookmarks", JSON.stringify(list));
    }
  }
};
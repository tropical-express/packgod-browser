export const history = {
  stack: [],
  index: -1,

  push(url) {
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(url);
    this.index++;
  },

  back() {
    if (this.index > 0) {
      this.index--;
      return this.stack[this.index];
    }
  },

  forward() {
    if (this.index < this.stack.length - 1) {
      this.index++;
      return this.stack[this.index];
    }
  }
};
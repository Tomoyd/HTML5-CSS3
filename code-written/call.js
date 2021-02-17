Function.prototype.myCall = function (context, ...args) {
  context.func = this;
  if (!args) {
    return context.func();
  }
  return context.func(...args);
};

function add(a, b) {
  return this.c + a + b;
}

console.log(add.myCall({ c: 9 }, 6, 7));

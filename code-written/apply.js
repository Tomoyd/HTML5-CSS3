// 让调用者成为context的一个属性，并通过context去调用它
Function.prototype.myApply = function (context, args) {
  context.func = this;
  let ret;
  if (!args) {
    ret = context.func();
  } else {
    ret = context.func(...args);
  }
  return ret;
};
function add(a, b) {
  return a + b + this.c;
}
console.log(add.myApply({ c: 9 }, [6, 7]));

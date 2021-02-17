// bind原理就是一种分步传参的函数柯里化,
// bind 的逻辑，第一个参数指定调用者的this指向，返回一个新函数
Function.prototype.myBind = function (context, ...args) {
  return (...rest) => this.apply(context, [...args, ...rest]);
};

function add(a, b) {
  return this.c + a + b;
}

const addRest = add.myBind({ c: 1 });
console.log(addRest(4, 6));

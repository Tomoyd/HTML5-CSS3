// 创建实例 __proto__指向原型，原型的constructor指向构造函数，构造函数this指向实例
function myNew(func, ...args) {
  const instance = {};
  instance.__proto__ = func.prototype;
  func.prototype.constructor = func;
  let obj = func.apply(instance, args);
  return obj instanceof Object ? obj : instance;
}

function Animal(name) {
  this.name = name;
}

const animal = myNew(Animal, "cat");
console.log(animal.name);

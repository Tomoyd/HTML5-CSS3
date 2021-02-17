// 判断类型的原型是不是该对象原型
function myInstanceOf(l, r) {
  return r.prototype.isPrototypeOf(l);
}
// 判断对象实例的原型链是不是存在与类的原型相等
function myInstanceOf2(l, r) {
  while (true) {
    if (!l) return false;
    if (l.__proto__ == r.prototype) return true;
    l = l.__proto__;
  }
}

console.log(myInstanceOf([], Array));

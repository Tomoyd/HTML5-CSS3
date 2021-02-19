let a = {};
Object.defineProperty(a, "name", {
  //   configurable: false, //  不可被删除，不可被重新配置描述符

  //   enumerable: false, //是否被Object.keys 等枚举
  // 当有getter setter事不可有writable和value属性
  //   writable: true,
  //   value: "1"
  get() {
    return a.value;
  },
  set(value) {
    console.log("value :>> ", value);
    a.value = value;
  }
});
// 因为前面configurable所以不能被重新配置
// Object.defineProperty(a, "name", {
//     configurable: false, //  不可被删除，不可被重新配置描述符
//     writable: true,
//     enumerable: false, //是否被Object.keys 等枚举
//     value: "1"
//     //   get() {
//     //     this.value;
//     //   },
//     //   set(value) {
//     //     this.value = value;
//     //   }
//   });
console.log("a.name :>> ", a.name);
a.name = 1;
console.log("a.name :>> ", a.name);
a.name = [122];
a.name[0] = 123;
console.log("a :>> ", a.name);

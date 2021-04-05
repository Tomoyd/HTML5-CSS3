/**
 * 实现深度拷贝
 */

function getType(value) {
  const str = Object.prototype.toString.call(value);
  return str.substring(8, str.length - 1);
}

function handleArray(arr = []) {
  const newArr = [];

  arr.forEach((item) => {
    if (getType(item) === "Array") {
      return newArr.push(handleArray(item));
    }
    if (getType(item) === "Object") {
      return newArr.push(deepCopy(item));
    }
    return newArr.push(item);
  });
  return newArr;
}

function deepCopy(origin) {
  const obj = {};
  let curValue;
  Object.keys(origin).forEach((k) => {
    curValue = origin[k];
    if (getType(curValue) === "Array") {
      return (obj[k] = handleArray(curValue));
    }
    if (getType(curValue) === "Object") {
      return (obj[k] = deepCopy(curValue));
    }

    obj[k] = curValue;
  });

  return obj;
}

const ori = { name: 1, value: 2, arr: [123], sub: { name: 3, value: 4 } };

const copy = deepCopy(ori);

copy.sub.value = 5;

console.log({ ori, copy });

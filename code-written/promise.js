/**
 * Promise
 * 一.规范扼要
 * 1. Promise本质是一个状态机，每个Promise只能是3种状态中的一种:pending，fulfilled,rejected;
 * 且只能pending->fulfilled 或者pending->rejected;状态转变不可逆
 * 2.then可以被同一个promise调用多次
 * 3.then必须返回一个promise；一般返回一个新的Promise而非复用老的
 * 4.值穿透
 */

function isFunction(func) {
  return !func ? false : typeof func === "function";
}

function isObject(obj) {
  return typeof obj === "object";
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

const PENDING = "pending";
const REJECTED = "rejected";
const FULFILLED = "fulfilled";
function MyPromise(callback) {
  if (!isFunction(callback)) {
    throw new TypeError("callback is not function");
  }
  const self = this;
  self.state = PENDING;
  self.value = undefined;
  self.reason = undefined;
  self.onFulfilled = [];
  self.onRejected = [];
  function resolve(val) {
    if (self.state === PENDING) {
      self.state = FULFILLED;
      self.value = val;
      self.onFulfilled.forEach((item) => {
        item(val);
      });
    }
  }
  function reject(val) {
    if (self.state === PENDING) {
      self.state = REJECTED;
      self.reason = val;
      self.onRejected.forEach((item) => {
        item(val);
      });
    }
  }
  try {
    callback(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const self = this;

  const promiseNew = new MyPromise((resolve, reject) => {
    if (isFunction(onFulfilled)) {
      if (self.state === FULFILLED) {
        let o = onFulfilled(self.value);
        resolve(o, resolve, reject);
      }
      if (self.state === PENDING) {
        self.onFulfilled.push((value) => {
          let o = onFulfilled(value);
          resolve(o, resolve, reject);
        });
      }
    }
    if (isFunction(onRejected)) {
      if (self.state === REJECTED) {
        let o = onRejected(self.reason);
        resolve(o, resolve, reject);
      }
      if (self.state === PENDING) {
        self.onRejected.push((reason) => {
          let o = onRejected(reason);
          resolve(o, resolve, reject);
        });
      }
    }
  });

  return promiseNew;
};

function thenablePromise(preReturn, resolve, reject) {
  try {
    if (preReturn instanceof MyPromise) {
      preReturn.then(
        (f) => {
          thenablePromise(f, resolve, reject);
        },
        (r) => {
          reject(r);
        }
      );
    } else {
      resolve(x);
    }
  } catch (e) {
    reject(e);
  }
}

const myPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(111);
  }, 10);
});

myPromise.then((res) => {
  console.log("res :>> ", res);
});

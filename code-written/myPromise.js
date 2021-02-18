const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(callback) {
  const _self = this;
  _self.onFulfilled = [];
  _self.onRejected = [];
  _self.state = PENDING;
  _self.value = undefined;
  _self.reason = "";

  function resolve(val) {
    if (_self.state === PENDING) {
      _self.state = FULFILLED;
      _self.value = val;
      setTimeout(() => {
        _self.onFulfilled.forEach((func) => func(val));
      }, 0);
    }
  }
  function reject(err) {
    if (_self.state === PENDING) {
      _self.state = REJECTED;
      _self.value = err;
      setTimeout(() => {
        _self.onRejected.forEach((func) => func(err));
      }, 0);
    }
  }

  try {
    callback(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

function isFunction(func) {
  return !func ? false : typeof func === "function";
}

MyPromise.prototype.then = function (onResolve, onRejected) {
  return new MyPromise((resolve, reject) => {
    if (isFunction(onResolve)) {
      this.onFulfilled.push(() => {
        const v = onResolve(this.value);
        resolvePromise(v, resolve, reject);
      });
    }
    if (isFunction(onRejected)) {
      this.onRejected.push(() => {
        let o = onRejected(this.value);
        resolvePromise(o, resolve, reject);
      });
    }
  });
};

function resolvePromise(preVal, resolve, reject) {
  try {
    if (!preVal) {
      return resolve(preVal);
    }
    if (preVal instanceof MyPromise) {
      return preVal.then(
        (res) => {
          resolvePromise(res, resolve, reject);
        },
        (err) => {
          reject(err);
        }
      );
    }
    resolve(preVal);
  } catch (e) {
    reject(e);
  }
}

const promise = new MyPromise((resolve, reject) => {
  reject(3);
});
promise
  .then(
    (res) => {
      console.log("res :>> ", res);
    },
    (err) => {
      console.log(err);
    }
  )
  .then((res2) => {
    console.log("res2 :>> ", res2);
  });

promise.then(
  (res) => {
    console.log("res11 :>> ", res);
  },
  (err) => {
    console.log(err);
  }
);

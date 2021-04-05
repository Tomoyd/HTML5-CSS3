/**
 * 一段时间内，只对重复操作执行一次，在这段周期时间内，重复的操作将被忽略，
 * 直到下一个周期内才继续生效
 */

function throttle(fn, delay) {
  let timer = null;
  return (...args) => {
    if (!timer) {
      fn(...args);
      timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}

const testThrottle = throttle(() => {}, 2000);

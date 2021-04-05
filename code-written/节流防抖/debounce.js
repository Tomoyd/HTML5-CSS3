/**
 * 一段时间多次重复触发，则需重新等待一段时间，最终只执行了一次
 */

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (!timer) {
      fn(...args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
}

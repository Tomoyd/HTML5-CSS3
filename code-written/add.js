/**
 * 实现一个 add(1)(2)(3)(4)
 */

function add(a) {
  function sum(b) {
    a = a + b;
    return sum;
  }

  sum.toString = () => {
    return a;
  };

  return sum();
}

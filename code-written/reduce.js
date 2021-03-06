const a = ["1", "2", "3"];

const r = a.reduce((pre, cur, curIndex, self) => {
  //  curIndex 从1开始
  console.log(pre, cur, curIndex);
  return pre + cur;
});

console.log(r);

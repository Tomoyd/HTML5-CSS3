new Promise((resolve, reject) => {
  reject(999);
})
  .then(null, (err) => {
    console.log(err);
  })
  .then((res) => {
    console.log("res2", res);
  });

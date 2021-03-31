navigator.serviceWorker.register("./self.js").then(() => {
  console.log("Service worker :>> 注册成功");
});

navigator.serviceWorker.addEventListener("message", function (e) {
  const data = e.data;
  console.log("data :>> ", data);
});

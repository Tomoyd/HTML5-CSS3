const bc = new BroadcastChannel("channel");

bc.onmessage = function (e) {
  console.log("bc Channel :>> ", e.data);
};

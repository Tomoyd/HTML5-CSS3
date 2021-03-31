self.addEventListener("message", (e) => {
  console.log("service receive", e.data);
  e.waitUntil(
    self.clients.matchAll().then(function (clients) {
      if (!clients || clients.length === 0) {
        return;
      }
      clients.forEach(function (client) {
        client.postMessage(e.data);
      });
    }),
  );
});

function handleResponse(data) {
  console.log("data :>> ", data);
}
function jsonp(origin) {
  const scriptEl = document.createElement("script");
  scriptEl.src = origin + "?callback=handleResponse";
  document.body.insertBefore(newScript, document.body.firstChild);
}

jsonp("https://www.baidu.name");

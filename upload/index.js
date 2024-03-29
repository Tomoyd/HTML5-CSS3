function request({
  url,
  method = "post",
  onProgress = (e) => e,
  data,
  headers = {},
  requestList,
}) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = onProgress;
    xhr.open(method, url);
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.send(data);

    xhr.onload = (e) => {
      resolve({ data: e.target.response });
    };
  });
}
const LENGTH = 10;
const container = {
  file: null,
  data: [],
};

let selectors = [];
function handleFleChange(e) {
  // console.log(`e`, e.target.files[0])
  const [file] = e.target.files;
  if (!file) {
    return;
  }
  container.file = file;
}

function createFileChunk(file, length = LENGTH) {
  const fileChunkList = [];
  const chunkSize = Math.ceil(file.size / LENGTH);
  let cur = 0;
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + chunkSize) });
    cur += chunkSize;
  }

  return fileChunkList;
}
//   https://mp.weixin.qq.com/s/bzl4_O-bEU1h-6Vh8ZurlQ
async function uploadChunks(fileData = [], filename, fileHash) {
  const requestList = fileData
    .map(({ chunk, hash }, index) => {
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("hash", hash);
      formData.append("filename", filename);
      formData.append("chunkHash", fileHash + "-" + index);
      formData.append("fileHash", fileHash);
      return { formData };
    })
    .map(({ formData }, index) =>
      request({
        url: "http://localhost:3000",
        data: formData,
        onProgress: (e) => handleProgress(e, index),
      }),
    );
  console.log(`requestList`, requestList);
  await Promise.all(requestList);
}

function handleProgress(e, index) {
  container.data[index].percentage = parseInt(String(e.loaded / e.total) * 100);
  selectors[index].innerText = `${container.data[index].percentage}%`;
  let total = 0;
  container.data.forEach((item) => {
    total += item.percentage || 0;
  });
  selectors[10].innerText = `${total / 10}%`;
}

async function handleUpload() {
  if (!container.file) return;
  selectors = document.querySelector(".ul").children;
  const fileChunkList = createFileChunk(container.file);
  const hash = await createFileHash(fileChunkList);
  const fileData = fileChunkList.map(({ file }, index) => ({
    fileHash: hash,
    chunk: file,
    hash: container.file.name + "_" + index,
  }));
  container.data = fileData;
  const res = await requestHasResource();
  if (res.data.includes("true")) {
    return;
  }
  await uploadChunks(fileData, container.file.name, hash);
  await mergeRequest();
}

async function mergeRequest() {
  console.log("container.file :>> ", container.file);
  await request({
    url: "http://localhost:3000/merge",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      filename: container.file.name,
      fileHash: container.fileHash,
    }),
  });
}

async function requestHasResource() {
  console.log("container.file :>> ", container.file);
  return await request({
    url: "http://localhost:3000/hasExit",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      filename: container.file.name,
      fileHash: container.fileHash,
    }),
  });
}

function createFileHash(fileChunkList) {
  return new Promise((resolve) => {
    container.worker = new Worker("./worker.js");
    container.worker.postMessage({ fileChunkList });

    container.worker.onmessage = (e) => {
      const { percentage, hash } = e.data;
      container.percentage = percentage;
      if (hash) {
        container.fileHash = hash;
        resolve(hash);
      }
    };
  });
}

const http = require("http");
const server = http.createServer();
const multiparty = require("multiparty");
const fse = require("fs-extra");
const path = require("path");
const UPLOAD_DIR = path.resolve(__dirname, "target");

const getExt = (filename) => filename.split(".").pop();
server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }
  res.status = 200;
  if (req.url === "/hasExit") {
    const data = await resolveData(req);
    const { filename, fileHash } = data;

    if (hasExisted(fileHash, filename, res)) {
      return true;
    } else {
      res.end(
        JSON.stringify({
          success: false,
        }),
      );
      return;
    }
  }

  if (req.url === "/merge") {
    try {
      const ret = await handleMerge(req, res);
      if (ret) {
        return;
      }
      res.end(
        JSON.stringify({
          success: true,
        }),
      );
    } catch (e) {
      console.log("merge :>> ", e);
      res.end(
        JSON.stringify({
          success: false,
        }),
      );
    }

    return;
  }
  const { error, files, fields } = await handleRequest(req);
  if (!error) {
    console.log("object :>> ", files);
    const [chunk] = files.chunk;
    const [chunkHash] = fields.chunkHash;
    // const [filename] = fields.filename;
    const [fileHash] = fields.fileHash;

    const chunkDir = `${UPLOAD_DIR}/${fileHash}`;
    console.log("path :>> ", `${chunkDir}`);
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }

    try {
      if (!fse.existsSync(`${chunkDir}/${chunkHash}`)) {
        await fse.move(chunk.path, `${chunkDir}/${chunkHash}`);
      }
    } catch (e) {
      console.log("e :>> ", chunkHash);
    }
    res.end("received file chunk");
  }
});
const resolveData = (req) => {
  return new Promise((resolve) => {
    let chunk = "";
    req.on("data", (data) => {
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });
};

const hasExisted = (fileHash, filename, res) => {
  const ext = getExt(filename);
  const filepath = `${UPLOAD_DIR}/${fileHash}.${ext}`;
  if (fse.existsSync(filepath)) {
    res.end(
      JSON.stringify({
        success: true,
      }),
    );
    return true;
  }
  return false;
};

async function handleMerge(req, res) {
  const data = await resolveData(req);
  const { filename, fileHash } = data;

  if (hasExisted(fileHash, filename, res)) {
    return true;
  }
  const ext = getExt(filename);
  const filepath = `${UPLOAD_DIR}/${fileHash}.${ext}`;
  await mergeChunk(filepath, fileHash);
}

const mergeChunk = async (filepath, fileHash) => {
  const chunkDir = `${UPLOAD_DIR}/${fileHash}`;
  const chunkPaths = await fse.readdir(chunkDir);
  await fse.writeFile(filepath, "");
  chunkPaths.forEach((chunkPath) => {
    fse.appendFileSync(filepath, fse.readFileSync(`${chunkDir}/${chunkPath}`));
    // fse.unlinkSync(`${chunkDir}/${chunkPath}`);
  });

  // fse.rmdirSync(chunkDir);
};

function handleRequest(req) {
  const form = new multiparty.Form();
  return new Promise((resolve) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        resolve({ error: err });
      }

      resolve({ fields, files });
    });
  });
}

server.listen(3000, () => {
  console.log(" :>> ", "http://localhost:3000");
});

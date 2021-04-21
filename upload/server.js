const http = require("http");
const server = http.createServer();
const multiparty = require("multiparty");
const fse = require("fs-extra");
const path = require("path");
const UPLOAD_DIR = path.resolve(__dirname, "target");
server.on("request", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }

  if (req.url === "/merge") {
    try {
      await handleMerge(req, res);
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
    const [hash] = fields.hash;
    const [filename] = fields.filename;

    const chunkDir = `${UPLOAD_DIR}/${filename.replace(".", "_")}`;
    console.log("path :>> ", `${chunkDir}`);
    if (!fse.existsSync(chunkDir)) {
      await fse.mkdirs(chunkDir);
    }
    console.log("path :>> ", `${chunkDir}/${hash}`);
    try {
      await fse.move(chunk.path, `${chunkDir}/${hash}`);
    } catch (e) {
      console.log("e :>> ", e);
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
async function handleMerge(req, res) {
  const data = await resolveData(req);
  const { filename } = data;
  await mergeChunk(`${UPLOAD_DIR}/${filename}`, filename);
}

const mergeChunk = async (filepath, filename) => {
  const chunkDir = `${UPLOAD_DIR}/${filename.replace(".", "_")}`;
  const chunkPaths = await fse.readdir(chunkDir);
  await fse.writeFile(filepath, "");
  chunkPaths.forEach((chunkPath) => {
    fse.appendFileSync(filepath, fse.readFileSync(`${chunkDir}/${chunkPath}`));
    fse.unlinkSync(`${chunkDir}/${chunkPath}`);
  });
  fse.rmdirSync(chunkDir);
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

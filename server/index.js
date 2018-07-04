const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs");

traverse = folder => {
  let data = {
    files: [],
    size: 0
  };

  fs.readdirSync(folder).forEach(fileName => {
    let filePath = path.resolve(folder, fileName);
    let fileJson = { name: fileName };

    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const contents = traverse(filePath);
      fileJson.contents = contents.files;
      fileJson.size = contents.size;
      fileJson.type = "folder";
    } else {
      fileJson.type = path.extname(fileName);
      fileJson.mtime = stats.mtimeMs;
      fileJson.size = stats.size;
    }

    data.size += fileJson.size;
    data.files.push(fileJson);
  });

  return data;
};

rename = (path, name) => {
  path = path.split("/");

  let folder = ".";
  if (path.length > 1) {
    folder = Array.from(path).slice(0, -1);
    folder = folder.join("/");
  }

  fs.readdirSync(folder).forEach(fileName => {
    if (fileName === newName) {
      throw Error("Filename already exists!");
    }
  });

  // fs.renameSync(path.join("/", `${folderPath}/${newName}`);
  fs.rename(path.join("/"), `${folder}/${name}`, error => console.log(error));
};

remove = path => {
  let stats = fs.statSync(path);
  if (stats.isDirectory()) {
    fs.rmdir(path, error => console.log(error));
  } else {
    fs.unlink(path, error => console.log(error));
  }
};

filter = input => {
  const absolutePath = path.resolve(`${input.join("/")}`);
  const relativePath = `${__dirname}/${input.join("/")}`;

  // console.log(`Absolute Path: ${absolutePath}`);
  // console.log(`Relative Path: ${relativePath}`);

  const stats = fs.statSync(absolutePath);
  if (absolutePath !== relativePath) {
    throw new Error("Absolute and relative paths do not match.");
  }

  return absolutePath;
};

getIP = request => {
  const ip =
    // request.headers["x-forwarded-for"].split(",").pop() ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  return ip;
};

refresh = () => {
  return traverse("./");
};

const port = process.env.PORT || 5000;
const app = express();

let root = traverse("./");
let sessions = new Set();

/**
 * 1. DO NOT leak errors.
 * 2. DO NOT reveal exterior directories.
 * 3. CHECK user credentials before dispatching resources.
 */

app.use(express.static(path.join(__dirname, "../client/build")));
app.use(bodyParser.json());
app.use(helmet());

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.post("/auth/login", (request, response) => {
  // issue token
});

app.post("/auth/logout", (request, response) => {
  // remove token
});

app.post("/api/files", (request, response) => {
  // console.log(`Token: ${JSON.stringify(request.body)}`);
  response.send(root);
});

app.post("/api/download", (request, response) => {
  try {
    const path = filter(request.body);
    response.download(path);
  } catch (error) {
    response.status(500);
  }
});

app.post("/api/rename", (request, response) => {
  try {
    const absolutePath = filter(request.body.oldPath);
    rename(absolutePath, request.body.newName);
    response.send("Filename successfully changed.");
    root = refresh();
  } catch (error) {
    response.status(500);
  }
});

app.post("/api/delete", (request, response) => {
  try {
    const path = filter(request.body);
    delete path;
    response.send("File successfully deleted.");
    root = reset();
  } catch (error) {
    response.status(500);
  }
});

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

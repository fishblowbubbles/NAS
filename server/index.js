const express = require("express");
const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");

traverseDirectory = folder => {
  let data = {
    files: [],
    size: 0
  };

  fs.readdirSync(folder).forEach(fileName => {
    let filePath = path.resolve(folder, fileName);
    let fileJson = { name: fileName };

    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const contents = traverseDirectory(filePath);
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

renameFile = (oldPath, newName) => {
  oldPath = oldPath.split("/");

  let folderPath = ".";
  if (oldPath.length > 1) {
    folderPath = Array.from(oldPath).slice(0, -1);
    folderPath = folderPath.join("/");
  }

  fs.readdirSync(folderPath).forEach(fileName => {
    if (fileName === newName) {
      throw Error("Filename already exists!");
    }
  });

  oldPath = oldPath.join("/");
  newPath = `${folderPath}/${newName}`;

  fs.renameSync(oldPath, newPath);
};

deleteFile = path => {
  let stats = fs.statSync(path);
  if (stats.isDirectory()) {
    fs.rmdirSync(path);
  } else {
    fs.unlinkSync(path);
  }
};

filterRequestPath = input => {
  const absolutePath = path.resolve(`${input.join("/")}`);
  const relativePath = `${__dirname}/${input.join("/")}`;

  console.log(`Absolute Path: ${absolutePath}`);
  console.log(`Relative Path: ${relativePath}`);

  if (absolutePath !== relativePath) {
    throw new Error("Absolute and relative paths do not match.");
  }
  fs.statSync(absolutePath);

  return absolutePath;
};

getRequestingIP = request => {
  const ip =
    // request.headers["x-forwarded-for"].split(",").pop() ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  return ip;
};

resetRoot = () => {
  return traverseDirectory("./");
};

const port = process.env.PORT || 5000;
const app = express();

let root = traverseDirectory("./");
let users = new Set();

/**
 * 1. DO NOT leak errors.
 * 2. DO NOT reveal exterior directories.
 * 3. CHECK user credentials before dispatching resources.
 * 4. STICK to a uniform format.
 */

app.use(express.static(path.join(__dirname, "../client/build")));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(helmet());

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.post("/auth/login", (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  if (username === "username" && password === "password") {
    response.send("Success");
    users.add(username);
  } else {
    response.send("Failure");
  }
});

app.post("/auth/logout", (request, response) => {
  const username = request.body;
  users.delete(username);

  if (!users.has(username)) {
    response.send("Success");
  } else {
    response.send("Failure");
  }
});

app.post("/api/files", (request, response) => {
  const username = request.body.username;
  if (users.has(username)) {
    response.send(root);
  }
});

app.post("/api/download", (request, response) => {
  try {
    console.log(`\nDownload request from IP: ${getRequestingIP(request)}`);
    const path = filterRequestPath(request.body);
    const fileName = request.body[request.body.length - 1];

    response.download(path, fileName, error => {
      if (error) {
        throw new Error("Could not send file.");
      }
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    response.send("Error occured.");
  }
});

app.post("/api/rename", (request, response) => {
  try {
    console.log(`\nRename request from IP: ${getRequestingIP(request)}`);
    const absolutePath = filterRequestPath(request.body.oldPath);
    renameFile(absolutePath, request.body.newName);
    root = resetRoot();
  } catch (error) {
    console.log(`Error: ${error.message}`);
    response.send("Error occured.");
  }
});

app.post("/api/delete", (request, response) => {
  try {
    console.log(`\nDelete request from IP: ${getRequestingIP(request)}`);
    const absolutePath = filterRequestPath(request.body);
    deleteFile(absolutePath);
    root = resetRoot();
  } catch (error) {
    console.log(`Error: ${error.message}`);
    response.send("Error occurred.");
  }
});

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

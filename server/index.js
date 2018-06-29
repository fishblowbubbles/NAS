const express = require("express");
const bodyParser = require("body-parser");
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
  if (oldPath.length > 1) {
    folderPath = Array.from(oldPath).slice(0, -1);
    folderPath = folderPath.join("/");
  } else {
    folderPath = ".";
  }

  // check folder for conflicts
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
  fs.rmdirSync(path);
};

filterRequest = input => {
  const absolutePath = path.resolve(`${input.join("/")}`);
  const relativePath = `${__dirname}/${input.join("/")}`;

  console.log("Absolute Path: " + absolutePath);
  console.log("Relative Path: " + relativePath);

  if (absolutePath !== relativePath) {
    console.log("Warning: Intruder Alert!");
  }

  return absolutePath;
};

getRequestingIP = request => {
  const ip = request.headers['x-forwarded-for'].split(',').pop() || 
         request.connection.remoteAddress || 
         request.socket.remoteAddress || 
         request.connection.socket.remoteAddress
  return ip;
};

const port = process.env.PORT || 5000;
const app = express();

let root = traverseDirectory("./");

app.use(express.static(path.join(__dirname, "../client/build")));
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/api/files", (request, response) => {
  response.send(root);
});

app.post("/api/download", (request, response) => {
  console.log("\n --- INCOMING DOWNLOAD REQUEST --- ");
  console.log("From IP: " + getRequestingIP(request));

  try {
    const path = filterRequest(request.body);
    const exists = fs.statSync(path);
    response.sendFile(path);
  } catch (error) {
    response.send("Error occured.");
  } finally {
    console.log(" --------- END OF REQUEST --------- \n");
  }
});

app.post("/api/rename", (request, response) => {
  console.log("\n ---- INCOMING RENAME REQUEST ---- ");
  console.log("IP: " + getRequestingIP(request));

  let message;
  try {
    const path = filterRequest(request.body.oldPath);
    const exists = fs.statSync(path);
    renameFile(path, request.body.newName);
    root = traverseDirectory("./");
    console.log("Operation completed.");
  } catch (error) {
    console.log(error.message);
    message = "Error occured.";
  }
  response.send(message);

  console.log(" --------- END OF REQUEST --------- \n");
});

app.post("/api/delete", (request, response) => {
  console.log("\n ---- INCOMING DELETE REQUEST ---- ");
  console.log("IP: " + request.connection.remoteAddress);

  let message;
  try {
    const path = filterRequest(request.body.path);
    const exists = fs.statSync(path);
    deleteFile(path);
    root = traverseDirectory("./");
  } catch (error) {
    console.log(error.message);
    message = "Error occured.";
  }
  response.send(message);

  console.log(" --------- END OF REQUEST --------- \n");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

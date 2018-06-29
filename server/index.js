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
  let folderPath;
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

  fs.renameSync(oldPath, newPath)
};

deleteFile = (path) => {
  path = path.join("/");
  fs.rmdirSync(path);
}

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
  response.sendFile(path.join(__dirname, `/${request.body.join("/")}`));
});

app.post("/api/rename", (request, response) => {
  let message;
  try {
    renameFile(request.body.oldPath, request.body.newName);
    root = traverseDirectory("./");
    message = "Filename successfully changed!";
  } catch (error) {
    message = error.message;
  }
  response.send(message);
});

app.post("/api/delete", (request, response) => {
  let message;
  try {
    deleteFile(request.body.path);
    root = traverseDirectory("./");
    message ="File successfully deleted!";
  } catch (error) {
    message = error.message;
  }
  response.send(message);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

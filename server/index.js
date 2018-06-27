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

const port = process.env.PORT || 5000;
const app = express();

let root = traverseDirectory("../");

app.use(express.static(path.join(__dirname, "../client/build")));
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/api/files", (request, response) => {
  response.send(root);
});

app.post("/api/download", (request, response) => {
  response.sendFile(path.join(__dirname, "/" + request.body.join("/")));
});

app.post("/api/rename", (request, response) => {
  console.log(request);
});

app.post("/api/delete", (request, response) => {
  console.log(request);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

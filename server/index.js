const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

traverseDirectory = directory => {
  let data = {
    files: [],
    size: 0
  };

  fs.readdirSync(directory).forEach(fileName => {
    let filePath = path.resolve(directory, fileName);
    let fileJson = { name: fileName };

    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const contents = traverseDirectory(filePath);
      fileJson.contents = contents.files;
      fileJson.size = contents.size;
      fileJson.type = "directory";
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

let root = traverseDirectory("../");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../client/build", "index.html"))
})

app.get("/api/files", (request, response) => {
  response.send(root);
});

app.post("/api/download", (request, response) => {
  const path = request.body;
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

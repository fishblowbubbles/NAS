const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

function traverseDirectory(directory) {
  let data = {
    files: [],
    size: 0
  };

  fs.readdirSync(directory).forEach(function(fileName) {
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
}

const root = traverseDirectory("../");

app.get("/api/files", function(request, response) {
  response.send(root);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});

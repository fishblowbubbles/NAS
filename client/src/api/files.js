const { options, send } = require("./commons.js");
const fileSaver = require("file-saver");

export function root(token, callback) { 
  send("/api/files", options(token), "json")
    .then(data => callback(data))
    .catch(error => console.log(error));
}

export function download(path) {
  const filename = path[path.length - 1];

  let file;
  function save(data) {
    file = new File([data], filename);
    fileSaver.saveAs(file);
  }

  send("/api/download", options(path), "text")
    .then(data => {
      save(data);
    })
    .catch(error => console.log(error));
}

export function rename(path, name, callback) {
  const body = {
    oldPath: path,
    newName: name
  };

  send("/api/rename", options(body), "text")
    .then(data => {
      callback(data);
    })
    .catch(error => {
      console.log(error);
    });
}

export function remove(path, callback) {
  send("/api/delete", options(path), "text")
    .then(data => callback(data))
    .catch(error => console.log(error));
}

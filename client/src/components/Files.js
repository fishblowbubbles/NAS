import React, { Component } from "react";
import { FilesContext } from "./Main.js";
import "../stylesheets/Files.less";

class Files extends Component {
  state = {
    path: []
  };

  handleDirectoryClick = directory => e => {
    let newPath = this.state.path;
    newPath.push(directory);
    this.updatePath(newPath);
  };

  handleBackClick = e => {
    let newPath = this.state.path;
    newPath.pop();
    this.updatePath(newPath);
  };

  updatePath = newPath => {
    this.setState({
      path: newPath
    });
  };

  displayDirectoryContents = files => {
    const directory =
      this.state.path.length === 0 ? files : this.getContentFromPath(files, 0);

    return directory.map(item => (
      <li
        className="list-group-item"
        onClick={item.contents ? this.handleDirectoryClick(item.name) : ""}
      >
        <img src={setIcon(item.type)} />
        <div>{item.name}</div>
        <div className="item-mtime">
          {item.mtime ? new Date(item.mtime).toLocaleString() : "-"}
        </div>
        <div className="item-size">{convertBytes(item.size)}</div>
        <button>. . .</button>
      </li>
    ));
  };

  getContentFromPath = (directory, depth) => {
    for (let i = 0; i < directory.length; i += 1) {
      if (directory[i].name === this.state.path[depth]) {
        return depth === this.state.path.length - 1
          ? directory[i].contents
          : this.getContentFromPath(directory[i].contents, (depth += 1));
      }
    }
  };

  
  render() {
    return (
      <div className="files">
        <div className="files-heading">
          <div className="files-heading-text">FILES</div>
          <Search />
        </div>
        <li className="list-group-heading">
          {this.state.path.length === 0 ? (
            <div />
          ) : (
            <button onClick={this.handleBackClick}>BACK</button>
          )}
          <div>Name</div>
          <div>Modified</div>
          <div>Size</div>
          <div />
        </li>
        <ul className="list-group list-group-flush">
          <FilesContext.Consumer>
            {context =>
              context.loading
              ? ""
              : this.displayDirectoryContents(context.files)
            }
          </FilesContext.Consumer>
        </ul>
      </div>
    );
  }
}

const Search = () => (
  <div className="search">
    <input className="form-control" type="text" placeholder="SEARCH" />
  </div>
);

const setIcon = fileType => {
  let icon = "/assets/file.png";
  if (fileType === "directory") {
    icon = "/assets/folder.png";
  } else if (fileType === ".js") {
    icon = "/assets/js.png";
  } else if (fileType === ".json") {
    icon = "/assets/json.png";
  }
  return icon;
};

const convertBytes = sizeInBytes => {
  const kiloBytes = sizeInBytes / Math.pow(2, 10);
  if (kiloBytes >= 100) {
    const megaBytes = kiloBytes / Math.pow(2, 10);
    if (megaBytes >= 100) {
      const gigaBytes = megaBytes / Math.pow(2, 10);
      return gigaBytes.toFixed(1) + " GB";
    } else {
      return megaBytes.toFixed(1) + " MB";
    }
  } else {
    return kiloBytes.toFixed(1) + " KB";
  }
};

export default Files;

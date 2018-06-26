import React, { Component } from "react";
import Dropdown from "./Dropdown.js";
import { FilesContext } from "./Main.js";
import "../stylesheets/Files.less";

export const DropdownContext = React.createContext();

class Files extends Component {
  state = {
    path: []
  };

  handleDirectoryClick = directory => e => {
    this.state.path.push(directory);
    this.updatePath();
  };

  handleBackClick = e => {
    this.state.path.pop();
    this.updatePath();
  };

  updatePath = () => {
    this.setState({
      path: this.state.path
    });
  };

  displayDirectoryContents = files => {
    const directory =
      this.state.path.length === 0 ? files : this.getContentsFromPath(files, 0);
    return directory.length > 0 ? this.createListItems(directory) : <Empty />;
  };

  getContentsFromPath = (directory, depth) => {
    for (let i = 0; i < directory.length; i += 1) {
      if (directory[i].name === this.state.path[depth]) {
        return depth === this.state.path.length - 1
          ? directory[i].contents
          : this.getContentsFromPath(directory[i].contents, (depth += 1));
      }
    }
  };

  createListItems = directory => {
    return directory.map(item => {
      let itemPath = Array.from(this.state.path);
      itemPath.push(item.name);

      return (
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
          <DropdownContext.Provider
            value={{
              path: itemPath
            }}
          >
            <Dropdown />
          </DropdownContext.Provider>
        </li>
      );
    });
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

const Empty = () => (
  <div className="folder-empty">
    <img src="/assets/empty.png" />
    <div>Empty</div>
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

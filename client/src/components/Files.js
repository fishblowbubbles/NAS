import React, { Component } from "react";
import Dropdown from "./Dropdown.js";
import { FilesContext } from "./Main.js";
import Toolbar from "./Toolbar.js";
import "../stylesheets/Files.less";

export const PathContext = React.createContext();

class Files extends Component {
  state = {
    path: []
  };

  handleFolderClick = folder => e => {
    this.state.path.push(folder);
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

  displayFolderContents = files => {
    const folder =
      this.state.path.length === 0 ? files : this.getContentsFromPath(files, 0);
    return folder.length > 0 ? this.createListItems(folder) : <Empty />;
  };

  getContentsFromPath = (folder, depth) => {
    for (let i = 0; i < folder.length; i += 1) {
      if (folder[i].name === this.state.path[depth]) {
        return depth === this.state.path.length - 1
          ? folder[i].contents
          : this.getContentsFromPath(folder[i].contents, (depth += 1));
      }
    }
  };

  createListItems = folder =>
    folder.map(item => {
      let itemPath = Array.from(this.state.path);
      itemPath.push(item.name);

      return (
        <li
          className="list-group-item"
          onClick={item.contents ? this.handleFolderClick(item.name) : ""}
        >
          {this.setFileIcon(item.type)}
          <div className="item-name">{item.name}</div>
          <div className="item-mtime">
            {item.mtime ? new Date(item.mtime).toLocaleString() : "-"}
          </div>
          <FilesContext.Consumer>
            {context => (
              <div className="item-size">{context.convertBytes(item.size)}</div>
            )}
          </FilesContext.Consumer>
            <Dropdown path={itemPath}/>
        </li>
      );
    });

  setNavIcon = () =>
    this.state.path.length === 0 ? (
      <img src="/assets/home.png" />
    ) : (
      <button
        className="btn btn-outline-secondary"
        onClick={this.handleBackClick}
      >
        <img src="/assets/back.png" />
      </button>
    );

  setFileIcon = type => {
    let src = "/assets/file.png";
    if (type === "folder") {
      src = "/assets/folder.png";
    } else if (type === ".js") {
      src = "/assets/js.png";
    } else if (type === ".json") {
      src = "/assets/json.png";
    }
    return <img src={src} />;
  };

  render() {
    return (
      <div className="files">
        <div className="files-heading">
          <div>
            <div className="files-heading-text">FILES</div>
            <PathContext.Provider value={this.state}>
              <Breadcrumb />
            </PathContext.Provider>
          </div>
          <Toolbar />
        </div>
        <li className="list-group-heading">
          {this.setNavIcon()}
          <div>Name</div>
          <div>Modified</div>
          <div>Size</div>
          <div />
        </li>
        <ul className="list-group list-group-flush">
          <FilesContext.Consumer>
            {context =>
              context.state.loading
                ? ""
                : this.displayFolderContents(context.state.files)
            }
          </FilesContext.Consumer>
        </ul>
      </div>
    );
  }
}

const Breadcrumb = () => (
  <ol className="breadcrumb">
    <li className="breadcrumb-item">{""}</li>
    <PathContext.Consumer>
      {context =>
        context.path.map(
          (item, index) =>
            index === context.path.length - 1 ? (
              <li className="breadcrumb-item">{item}</li>
            ) : (
              <li className="breadcrumb-item active">{item}</li>
            )
        )
      }
    </PathContext.Consumer>
  </ol>
);

const Empty = () => (
  <div className="folder-empty">
    <img src="/assets/empty.png" />
    <div>Empty</div>
  </div>
);

export default Files;

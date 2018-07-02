import React, { Component } from "react";
import { FilesContext } from "./Main.js";
import Item from "./Item.js";
import Toolbar from "./Toolbar.js";
import "../stylesheets/Files.less";

class Files extends Component {
  state = {
    path: []
  };

  updatePath = newPath => {
    this.setState({
      path: newPath
    });
  };

  handleFolderClick = folder => {
    let newPath = Array.from(this.state.path);
    newPath.push(folder);
    this.updatePath(newPath);
  };

  handleBackClick = e => {
    let newPath = Array.from(this.state.path);
    newPath.pop();
    this.updatePath(newPath);
  };

  displayFolderContents = files => {
    let folder = files;
    if (this.state.path.length > 0) {
      folder = this.getContentsFromPath(files, 0);
    }

    if (folder.length > 0) {
      return this.createListItems(folder);
    } else {
      return <Empty />;
    }
  };

  getContentsFromPath = (folder, depth) => {
    for (let i = 0; i < folder.length; i += 1) {
      if (folder[i].name === this.state.path[depth]) {
        if (depth !== this.state.path.length - 1) {
          return this.getContentsFromPath(folder[i].contents, 
              (depth += 1));
        } else {
          return folder[i].contents;
        }
      }
    }
  };

  createListItems = folder =>
    folder.map(item => {
      let itemPath = Array.from(this.state.path);
      itemPath.push(item.name);

      return (
        <Item
          path={itemPath}
          name={item.name}
          size={item.size}
          mtime={item.mtime}
          type={item.type}
          contents={item.contents}
          handleFolderClick={folder => this.handleFolderClick(folder)}
        />
      );
    });

  setNavigationIcon = () =>
    this.state.path.length > 0 ? (
      <button className="btn btn-light" onClick={this.handleBackClick}>
        <img src="/assets/back.png" />
      </button>
    ) : (
      <div />
    );

  render() {
    return (
      <div className="files">
        <div className="files-heading">
          <div>
            <div className="files-heading-text">F I L E S</div>
            <Breadcrumb path={this.state.path} />
          </div>
          <Toolbar />
        </div>
        <li className="list-group-heading">
          {this.setNavigationIcon()}
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

const Breadcrumb = props => (
  <ol className="breadcrumb">
    <li className="breadcrumb-item">{""}</li>
    {props.path.map(
      (item, index) =>
        index === props.path.length - 1 ? (
          <li className="breadcrumb-item">{item}</li>
        ) : (
          <li className="breadcrumb-item active">{item}</li>
        )
    )}
  </ol>
);

const Empty = () => (
  <div className="folder-empty">
    <img src="/assets/empty.png" />
    <div>Empty</div>
  </div>
);

export default Files;

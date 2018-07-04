import React, { Component } from "react";
import Dropdown from "./Dropdown.js";
import { FilesContext } from "./Main.js";
import { download, rename, remove } from "../api/files.js";

class Item extends Component {
  state = {
    panelOpen: false,
    inputOpen: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.input) {
      this.input.focus();
    }
  }

  togglePanel = () => {
    this.setOutsideClickListener(this.state.panelOpen, this.togglePanel);
    this.setState({
      panelOpen: !this.state.panelOpen
    });
  };

  toggleInput = () => {
    this.setOutsideClickListener(this.state.inputOpen, this.toggleInput);
    this.setState({
      inputOpen: !this.state.inputOpen
    });
  };

  setOutsideClickListener = (isOpen, callback) => {
    if (isOpen) {
      document.removeEventListener("click", callback);
    } else {
      document.addEventListener("click", callback);
    }
  };

  handleMenuClick = e => {
    e.stopPropagation();
    this.togglePanel();
  };

  handlePreviewClick = e => {
    e.stopPropagation();
    this.togglePanel(e);
  };

  handleDownloadClick = e => {
    e.stopPropagation();
    this.togglePanel();
    download(this.props.path);
  };

  handleRenameClick = e => {
    e.stopPropagation();
    this.togglePanel();
    this.toggleInput();
  };

  handleDeleteClick = (e, refreshPage) => {
    this.togglePanel();
    remove(this.props.path, this.onResponse);
    refreshPage();
  };

  handleKeyPress = (e, refreshPage) => {
    if (e.key === "Enter") {
      this.toggleInput();
      rename(this.props.path, e.target.value, this.onResponse);
      e.target.value = "";
      refreshPage();
    }
  };

  onResponse = data => {
    console.log(data);
  }

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

  showInputBox = () => (
    <FilesContext.Consumer>
      {context => (
        <input
          className="form-control"
          ref={c => (this.input = c)}
          type="text"
          placeholder={this.props.path[this.props.path.length - 1]}
          onClick={e => e.stopPropagation()}
          onKeyPress={e => this.handleKeyPress(e, context.refreshPage)}
        />
      )}
    </FilesContext.Consumer>
  );

  render() {
    return (
      <div>
        <li
          className="list-group-item"
          onClick={
            this.props.contents
              ? e => this.props.handleFolderClick(this.props.name)
              : e => e.stopPropagation()
          }
        >
          {this.setFileIcon(this.props.type)}
          <div className="item-name">
            {this.state.inputOpen ? this.showInputBox() : this.props.name}
          </div>
          <div className="item-mtime">
            {this.props.mtime
              ? new Date(this.props.mtime).toLocaleString()
              : "-"}
          </div>
          <FilesContext.Consumer>
            {context => (
              <div className="item-size">
                {context.convertBytes(this.props.size)}
              </div>
            )}
          </FilesContext.Consumer>
          <FilesContext.Consumer>
            {context => (
              <Dropdown
                panelOpen={this.state.panelOpen}
                handleMenuClick={this.handleMenuClick}
                handlePreviewClick={this.handlePreviewClick}
                handleDownloadClick={this.handleDownloadClick}
                handleRenameClick={this.handleRenameClick}
                handleDeleteClick={e =>
                  this.handleDeleteClick(e, context.refreshPage)
                }
              />
            )}
          </FilesContext.Consumer>
        </li>
      </div>
    );
  }
}

export default Item;

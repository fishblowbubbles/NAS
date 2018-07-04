import React, { Component } from "react";
import Dropdown from "./Dropdown.js";
import { FilesContext } from "./Main.js";
import { download, rename, remove } from "../api/files.js";
import { convertBytes, setIcon } from "../api/commons.js";

class Item extends Component {
  state = {
    panel: false,
    input: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.input) {
      this.input.focus();
    }
  }

  togglePanel = () => {
    this.toggleClickListener(this.state.panel, this.togglePanel);
    this.setState({
      panel: !this.state.panel
    });
  };

  toggleInput = () => {
    this.toggleClickListener(this.state.input, this.toggleInput);
    this.setState({
      input: !this.state.input
    });
  };

  toggleClickListener = (open, callback) => {
    if (open) {
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

  handleDeleteClick = (e, refresh) => {
    this.togglePanel();
    remove(this.props.path, this.onResponse);
    refresh();
  };

  handleKeyPress = (e, refresh) => {
    if (e.key === "Enter") {
      this.toggleInput();
      rename(this.props.path, e.target.value, this.onResponse);
      e.target.value = "";
      refresh();
    }
  };

  onResponse = data => {
    console.log(data);
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
          onKeyPress={e => this.handleKeyPress(e, context.refresh)}
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
          <img src={setIcon(this.props.type)} />

          <div className="item-name">
            {this.state.input ? this.showInputBox() : this.props.name}
          </div>
          <div className="item-mtime">
            {this.props.mtime
              ? new Date(this.props.mtime).toLocaleString()
              : "-"}
          </div>

          <div className="item-size">{convertBytes(this.props.size)}</div>

          <FilesContext.Consumer>
            {context => (
              <Dropdown
                panel={this.state.panel}
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

import React, { Component } from "react";
import FileSaver from "file-saver";
import { FilesContext } from "./Main.js";
import Dropdown from "./Dropdown.js";

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

  togglePanel = e => {
    this.setOutsideClickListener(this.state.panelOpen, this.togglePanel);
    this.setState({
      panelOpen: !this.state.panelOpen
    });
    e.stopPropagation();
  };

  toggleInput = e => {
    this.setOutsideClickListener(this.state.inputOpen, this.toggleInput);
    this.setState({
      inputOpen: !this.state.inputOpen
    });
    e.stopPropagation();
  };

  setOutsideClickListener = (isOpen, callback) => {
    if (isOpen) {
      document.removeEventListener("click", callback);
    } else {
      document.addEventListener("click", callback);
    }
  };

  handleMenuClick = e => {
    this.togglePanel(e);
  };

  handlePreviewClick = e => {
    this.togglePanel(e);
  };

  handleDownloadClick = e => {
    this.togglePanel(e);
    this.downloadFile();
  };

  handleRenameClick = e => {
    this.togglePanel(e);
    this.toggleInput(e);
  };

  handleDeleteClick = (e, refreshPage) => {
    this.togglePanel(e);
    this.deleteFile();
    refreshPage();
  };

  handleRenameSubmit = e => {
    this.toggleInput(e);
    this.renameFile(e.target.value);
  };

  handleKeyPress = (e, refreshPage) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleRenameSubmit(e);
      e.target.value = "";
      refreshPage();
    }
  };

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

  downloadFile = () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.props.path)
    };

    this.sendPostRequest("/api/download", options).then(body => {
      const fileName = this.props.path[this.props.path.length - 1];
      FileSaver.saveAs(new File([body], fileName));
    });
  };

  renameFile = name => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPath: this.props.path,
        newName: name
      })
    };

    this.sendPostRequest("/api/rename", options).then(body => {
      console.log(body);
    });
  };

  deleteFile = () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.props.path)
    };

    this.sendPostRequest("/api/delete", options).then(body =>
      console.log(body)
    );
  };

  sendPostRequest = async (request, options) => {
    try {
      const response = await fetch(request, options);
      const data = await response.text();

      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

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

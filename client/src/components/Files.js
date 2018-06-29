import React, { Component } from "react";
import { FilesContext } from "./Main.js";
import Toolbar from "./Toolbar.js";
import "../stylesheets/Files.less";

class Files extends Component {
  state = {
    path: []
  };

  handleFolderClick = folder => {
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

  setNavIcon = () =>
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

class Item extends Component {
  state = {
    panelOpen: false,
    inputOpen: false,
    previewOpen: false,
    contents: ""
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.input) this.input.focus();
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

  togglePreview = () => {
    this.setState({
      previewOpen: !this.state.previewOpen
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
    this.togglePanel();
    this.togglePreview();
    this.fetchFileData();
  };

  handleDownloadClick = e => {
    e.stopPropagation();
    this.togglePanel();
    this.fetchFileData();
  };

  handleRenameClick = e => {
    e.stopPropagation();
    this.togglePanel(); // close panel
    this.toggleInput(); // open input
  };

  handleRenameSubmit = e => {
    e.preventDefault();
    this.toggleInput();
    this.changeFileName(e.target.value);
  };

  handleDeleteClick = e => {
    this.togglePanel();
  };

  handleKeyPress = (e, callback) => {
    if (e.key === "Enter") {
      const status = this.handleRenameSubmit(e);
      e.target.value = "";
      callback();
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

  toggleModal = () => <div />;

  fetchFileData = () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.props.path)
    };

    this.sendPostRequest("/api/download", options).then(body => {
      console.log(body);
      this.setState({
        contents: body
      });
    });
  };

  changeFileName = name => {
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

  deleteFile = path => {
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
      <React.Fragment>
        <li
          className="list-group-item"
          onClick={
            this.props.contents
              ? e => this.props.handleFolderClick(this.props.name)
              : ""
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
          <Dropdown
            panelOpen={this.state.panelOpen}
            handleMenuClick={this.handleMenuClick}
            handlePreviewClick={this.handlePreviewClick}
            handleDownloadClick={this.handleDownloadClick}
            handleRenameClick={this.handleRenameClick}
            handleDeleteClick={this.handleDeleteClick}
          />
        </li>
        <div
          id={this.state.previewOpen ? "visible" : "hidden"}
          className="preview"
          name={this.props.name}
        >
          {this.state.contents}
        </div>
      </React.Fragment>
    );
  }
}

const Dropdown = props => (
  <div className="dropdown">
    <button
      className="btn btn-light dropdown-button"
      onClick={props.handleMenuClick}
    >
      . . .
    </button>
    <div
      id={props.panelOpen ? "visible" : "hidden"}
      className="dropdown-panel btn-group-vertical"
    >
      <DropdownButton text="Preview" handleClick={props.handlePreviewClick} />
      <DropdownButton text="Download" handleClick={props.handleDownloadClick} />
      <DropdownButton text="Rename" handleClick={props.handleRenameClick} />
      <DropdownButton text="Delete" handleClick={props.handleDeleteClick} />
    </div>
  </div>
);

const DropdownButton = props => (
  <button className="btn btn-light btn-block" onClick={props.handleClick}>
    {props.text}
  </button>
);

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

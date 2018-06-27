import React, { Component } from "react";

class Dropdown extends Component {
  state = {
    open: false
  };

  togglePanel = e => {
    e.stopPropagation();

    if (this.state.open) {
      document.removeEventListener("click", this.handleOutsideClick, false);
    } else {
      document.addEventListener("click", this.handleOutsideClick, false);
    }

    this.setState({
      open: !this.state.open
    });
  };

  handleOutsideClick = e => {
    this.togglePanel(e);
  };

  handleToggleClick = e => {
    this.togglePanel(e);
  };

  handlePreviewClick = path => e => {
    this.fetchFileData(path);
    this.togglePanel(e);
  };

  handleDownloadClick = path => e => {
    this.fetchFileData(path);
    this.togglePanel(e);
  };

  handleRenameClick = path => e => {
    this.togglePanel(e);
  };

  handleDeleteClick = path => e => {
    this.togglePanel(e);
  };

  fetchFileData = async path => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(path)
    };

    try {
      const response = await fetch("/api/download", options);
      const data = await response.text();

      if (!response.ok) {
        throw Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="dropdown-wrapper">
        <div className="dropdown">
          <button
            className="btn btn-outline-secondary dropdown-button"
            onClick={this.handleToggleClick}
          >
            . . .
          </button>
          <div
            id={this.state.open ? "visible" : "hidden"}
            className="dropdown-panel btn-group-vertical"
          >
            <button
              className="btn btn-outline-secondary btn-block"
              onClick={this.handlePreviewClick(this.props.path)}
            >
              Preview
            </button>
            <button
              className="btn btn-outline-secondary btn-block"
              onClick={this.handleDownloadClick(this.props.path)}
            >
              Download
            </button>
            <button
              className="btn btn-outline-secondary btn-block"
              onClick={this.handleRenameClick(this.props.path)}
            >
              Rename
            </button>
            <button
              className="btn btn-outline-secondary btn-block"
              onClick={this.handleDeleteClick(this.props.path)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dropdown;

import React, { Component } from "react";
import { DropdownContext } from "./Files.js";

class Dropdown extends Component {
  state = {
    open: false
  };

  handleTogglePanel = e => {
    this.setState({
      open: !this.state.open
    });
    e.stopPropagation();
  };

  handlePreviewClick = path => e => {
    try {
      this.fetchFileData(path);
    } catch (error) {
      console.log(error);
    }
    e.stopPropagation();
  };

  handleDownloadClick = path => e => {
    e.stopPropagation();
  };

  handleRenameClick = path => e => {
    e.stopPropagation();
  };

  handleDeleteClick = path => e => {
    e.stopPropagation();
  };

  fetchFileData = async path => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/html",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(path)
    };

    const response = await fetch("/api/download", options);
    const body = await response.text();

    if (!response.ok) {
      throw Error(response.statusText);
    }
    return body;
  };
  
  render() {
    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={this.handleTogglePanel}>
          . . .
        </button>
        <div
          id={this.state.open ? "visible" : "hidden"}
          className="dropdown-panel"
        >
          <DropdownContext.Consumer>
            {context => (
              <React.Fragment>
                <button onClick={this.handlePreviewClick(context.path)}>
                  Preview
                </button>
                <button onClick={this.handleDownloadClick(context.path)}>
                  Download
                </button>
                <button onClick={this.handleRenameClick(context.path)}>
                  Rename
                </button>
                <button onClick={this.handleDeleteClick(context.path)}>
                  Delete
                </button>
              </React.Fragment>
            )}
          </DropdownContext.Consumer>
        </div>
      </div>
    );
  }
}

export default Dropdown;

import React, { Component } from "react";
import Panel from "./Panel.js";
import Files from "./Files.js";
import { root } from "../api/files.js";
import "../stylesheets/Main.less";

export const FilesContext = React.createContext();

class Main extends Component {
  state = {
    files: [],
    used: 0,
    loading: true,
    token: {
      header: "1234",
      payload: "5678",
      signature: "abcd"
    }
  };

  componentDidMount() {
    this.fetchRoot();
  }

  componentDidUpdate(nextProps, nextState) {
    if (!nextState.loading) {
      this.fetchRoot();
    }
  }

  refreshPage = () => {
    this.setState({
      loading: true
    });
  };

  fetchRoot = () => {
    root(this.state.token, this.onResponse);
  }

  onResponse = data => {
    this.setState({
      files: data.files,
      used: data.size,
      loading: false
    });
  };

  convertBytes = sizeInBytes => {
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

  render() {
    return (
      <div className="content">
        <FilesContext.Provider
          value={{
            state: this.state,
            refreshPage: this.refreshPage,
            convertBytes: this.convertBytes
          }}
        >
          <Panel
            history={this.props.history}
            handleClick={this.props.handleClick}
          />
          <Files />
        </FilesContext.Provider>
      </div>
    );
  }
}

export default Main;

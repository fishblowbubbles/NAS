import React, { Component } from "react";
import Panel from "./Panel.js";
import Files from "./Files.js";
import "../stylesheets/Main.less";

export const FilesContext = React.createContext();

class Main extends Component {
  state = {
    files: [],
    used: 0,
    loading: true
  };

  componentDidMount() {
    this.fetchDirectoryMap();
  }

  componentDidUpdate(nextProps, nextState) {
    if (!nextState.loading) {
      this.fetchDirectoryMap();
    }
  }

  refreshPage = () => {
    this.setState({
      loading: true
    });
  };

  fetchDirectoryMap = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: "username" })
      };

      const response = await fetch("/api/files", options);
      const data = await response.json();

      if (!response.ok) {
        throw Error(response.statusText);
      }

      this.setState({
        files: data.files,
        used: data.size,
        loading: false
      });
    } catch (error) {
      console.log(error);
    }
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
          <Panel history={this.props.history} handleClick={this.props.handleClick} />
          <Files />
        </FilesContext.Provider>
      </div>
    );
  }
}

export default Main;

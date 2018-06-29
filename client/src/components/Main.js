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
    console.log("Loading: " + nextState.loading);
    if (!nextState.loading) {
      console.log("GET from database...");
      this.fetchDirectoryMap();
    }
  }
  
  refreshPage = () => {
    console.log("Refreshing page...");
    this.setState({
      loading: true
    });
  };

  fetchDirectoryMap = async () => {
    try {
      const response = await fetch("/api/files");
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
          <Panel handleClick={this.props.handleClick} />
          <div className="content-wrapper">
            <Files />
          </div>
        </FilesContext.Provider>
      </div>
    );
  }
}

export default Main;

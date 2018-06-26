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
    try {
      this.fetchDirectoryMap().then(map => {
        this.setState({
          files: map.files,
          used: map.size,
          loading: false
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchDirectoryMap = async () => {
    const response = await fetch("/api/files");
    const body = await response.json();

    if (!response.ok) {
      throw Error(response.statusText);
    }
    return body;
  };

  render() {
    return (
      <div className="content">
        <FilesContext.Provider value={this.state}>
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

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
      this.fetchFileData().then(data => {
        this.setState({
          files: data.files,
          used: data.size,
          loading: false
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchFileData = async () => {
    const response = await fetch("/api/files");
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  };

  render() {
    return (
      <div className="content">
        <FilesContext.Provider value={this.state}>
          <Panel handleClick={this.props.handleClick}/>
          <div className="content-wrapper">
            <Files />
          </div>
        </FilesContext.Provider>
      </div>
    );
  }
}

export default Main;

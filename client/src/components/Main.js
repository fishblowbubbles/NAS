import React, { Component } from "react";
import Panel from "./Panel.js";
import Files from "./Files.js";
import { root } from "../api/files.js";
import { convertBytes } from "../api/commons.js";
import "../stylesheets/Main.less";

export const FilesContext = React.createContext();

class Main extends Component {
  state = {
    files: [],
    used: 0,
    loading: true,
  };

  componentDidMount() {
    root(this.state.token, this.onResponse);
  }

  componentDidUpdate(nextProps, nextState) {
    if (!nextState.loading) {
      root(this.state.token, this.onResponse);  
    }
  }

  refresh = () => {
    this.setState({
      loading: true
    });
  };

  onResponse = data => {
    this.setState({
      files: data.files,
      used: data.size,
      loading: false
    });
  };

  render() {
    return (
      <div className="content">
        <FilesContext.Provider
          value={{
            state: this.state,
            refresh: this.refresh,
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

import React, { Component } from "react";
import { NavigationContext } from "./App.js";
import { FilesContext } from "./Main.js";
import "../stylesheets/Panel.less";

class Panel extends Component {
  handleLogoutClick = e => {
    this.sendLogoutRequest();
  };

  sendLogoutRequest = async () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "username"
      })
    };

    try {
      const response = await fetch("/auth/logout", options);
      const data = await response.text();

      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        this.props.history.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="panel">
        <div className="panel-heading">
          <img src="/assets/raspberry.png" />
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <h5>F I L E S</h5>
          </li>
          <li className="list-group-item">
            <h5>S E T T I N G S</h5>
          </li>
          <Logout handleClick={this.handleLogoutClick} />
        </ul>
        <Storage />
      </div>
    );
  }
}

const Storage = () => (
  <div className="progress-wrapper">
    <FilesContext.Consumer>
      {context => {
        if (context.state.loading) return;
        const style = {
          width: (context.state.used / Math.pow(2, 40)) * 100 + "%"
        };

        return (
          <React.Fragment>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={style} />
            </div>
            {/* <div>{context.convertBytes(context.state.used)} OF 1 TB USED</div> */}
          </React.Fragment>
        );
      }}
    </FilesContext.Consumer>
  </div>
);

const Logout = props => (
  <li className="list-group-item" onClick={props.handleClick}>
    <h5>L O G O U T</h5>
  </li>
);

export default Panel;

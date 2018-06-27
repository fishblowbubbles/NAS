import React from "react";
import { NavigationContext } from "./App.js";
import { FilesContext } from "./Main.js";
import "../stylesheets/Panel.less";

const Panel = props => {
  return (
    <div className="panel">
      <div className="panel-heading">
        <img src="/assets/raspberry.png" />
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <h5>FILES</h5>
        </li>
        <li className="list-group-item">
          <h5>SETTINGS</h5>
        </li>
        <Logout />
      </ul>
      <Storage />
    </div>
  );
};

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
            <div>{context.convertBytes(context.state.used)} OF 1 TB USED</div>
          </React.Fragment>
        );
      }}
    </FilesContext.Consumer>
  </div>
);

const Logout = () => (
  <NavigationContext.Consumer>
    {context => (
      <li className="list-group-item" onClick={context.handleClick}>
        <h5>LOGOUT</h5>
      </li>
    )}
  </NavigationContext.Consumer>
);

export default Panel;

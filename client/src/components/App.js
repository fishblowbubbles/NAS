import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Login from "./Login.js";
import Main from "./Main.js";
import "../stylesheets/App.css";

export const NavigationContext = React.createContext();

class App extends Component {
  state = {
    login: false
  };

  render() {
    return (
      <Switch>
        <NavigationContext.Provider value={{ handleClick: this.handleLogout }}>
          <Route exact path="/" component={Login} />
          <Route exact path="/main" component={Main} />
        </NavigationContext.Provider>
      </Switch>
    );
  }
}

export default withRouter(App);

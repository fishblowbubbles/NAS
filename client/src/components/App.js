import React, { Component } from "react";
import Login from "./Login.js";
import Main from "./Main.js";
import "../stylesheets/App.css";

export const NavigationContext = React.createContext();

class App extends Component {
  state = {
    login: false
  };

  handleLogin = e => {
    this.setState({
      login: true
    });
  };

  handleLogout = e => {
    this.setState({
      login: false
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.login ? (
          <NavigationContext.Provider value={{ handleClick: this.handleLogout}}>
            <Main />
          </NavigationContext.Provider>
        ) : (
          <Login handleClick={this.handleLogin} />
        )}
      </React.Fragment>
    );
  }
}

export default App;

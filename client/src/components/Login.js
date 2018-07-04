import React, { Component } from "react";
import { login, logout } from "../api/login.js";
import "../stylesheets/Login.less";

class Login extends Component {
  handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  handleSubmit = e => {
    const credentials = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value
    }

    login(credentials, this.onResponse);
  }

  onResponse = data => {
    if (data.token) {
      this.props.history.push("/main");
    }
  }

  render() {
    document.addEventListener("keypress", this.handleKeyPress);
    return (
      <div className="login">
        <div className="login-heading">
          <img src="/assets/raspberry.png" alt="" />
        </div>
        <div className="login-form">
          <form className="form-group">
            <input
              id="username"
              className="form-control"
              type="text"
              placeholder="Username"
              autoComplete="off"
            />
          </form>
          <form className="form-group">
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="Password"
            />
          </form>
        </div>
        <button id="submit" className="btn btn-primary" onClick={this.handleSubmit}>
          L O G I N
        </button>
      </div>
    );
  }
}

export default Login;

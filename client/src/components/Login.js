import React, { Component } from "react";
import "../stylesheets/Login.less";

class Login extends Component {
  sendLoginRequest = async () => {
    const options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
      })
    };

    try {
      const response = await fetch("/auth/login", options);
      const data = await response.text();

      if (!response.ok) {
        throw Error(response.statusText);
      } 

      if (data === "Success") {
        this.props.history.push("/main");
      } else {
        document.getElementById("username").focus();
        console.log("Invalid credentials.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.sendLoginRequest();
    }
  };

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
        <button id="submit" className="btn btn-primary" onClick={this.sendLoginCredentials}>
          L O G I N
        </button>
      </div>
    );
  }
}

export default Login;

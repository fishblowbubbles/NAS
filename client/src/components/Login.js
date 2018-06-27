import React from "react";
import "../stylesheets/Login.less";

const Login = props => {
  return (
    <div className="login">
      <div className="login-heading">
        <img src="/assets/raspberry.png" alt="" />
      </div>
      <div className="login-form">
        <form className="form-group">
          <input
            className="form-control"
            type="text"
            name="username"
            placeholder="Username"
          />
        </form>
        <form className="form-group">
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Password"
          />
        </form>
        <br />
        <button className="btn btn-primary" onClick={props.handleClick}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

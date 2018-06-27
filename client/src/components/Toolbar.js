import React, { Component } from "react";

class Toolbar extends Component {
  state = {
    search: false
  };

  handleSearchClick = () => {
    this.setState({
      search: !this.state.search
    });
  };

  handleUploadClick = () => {};

  render() {
    return (
      <div className="btn-toolbar">
        <div className="btn-group" role="group">
          <Button
            src="/assets/search.png"
            handleClick={this.handleSearchClick}
          />
          <Button src="/assets/notifications.png" />
          <Button src="/assets/upload.png" />
        </div>
      </div>
    );
  }
}

const Button = props => (
  <button
    type="button"
    className="btn btn-outline-secondary"
    data-toggle="tooltip"
    onClick={props.handleClick}
  >
    <img src={props.src} />
  </button>
);
export default Toolbar;

import React from "react";
import "../stylesheets/Dropdown.less";

const Dropdown = props => (
  <div className="dropdown">
    <button
      className="btn btn-light dropdown-button"
      onClick={props.handleMenuClick}
    >
      . . .
    </button>
    <div
      id={props.panelOpen ? "visible" : "hidden"}
      className="dropdown-panel btn-group-vertical"
    >
      <DropdownButton text="Preview" handleClick={props.handlePreviewClick} />
      <DropdownButton text="Download" handleClick={props.handleDownloadClick} />
      <DropdownButton text="Rename" handleClick={props.handleRenameClick} />
      <DropdownButton text="Delete" handleClick={props.handleDeleteClick} />
    </div>
  </div>
);

const DropdownButton = props => (
  <button className="btn btn-light btn-block" onClick={props.handleClick}>
    <div className="text-left">{props.text}</div>
  </button>
);

export default Dropdown;

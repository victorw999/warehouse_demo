import React from "react";

const switchStyle = {
  // position: "absolute",
  // left: "30rem"
  padding: "2rem"
};

const ToggleListStyle = props => {
  return (
    <span className="switch toggleByAuthor" style={switchStyle}>
      <label>
        View by Styles
        <input type="checkbox" onChange={props.handleToggle} />
        <span className="lever" />
        View by Orders
      </label>
    </span>
  );
};

export default ToggleListStyle;

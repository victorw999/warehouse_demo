import React from "react";

const switchStyle = {
  // position: "absolute",
  // left: "30rem"
  padding: "2rem"
};

const ToggleByAuthor = props => {
  return (
    <span className="switch toggleByAuthor" style={switchStyle}>
      <label>
        Projects Sort By Time
        <input type="checkbox" onChange={props.handleToggle} />
        <span className="lever" />
        Projects Sort By Author
      </label>
    </span>
  );
};

export default ToggleByAuthor;

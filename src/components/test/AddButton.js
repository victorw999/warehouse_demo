import React from "react";

const AddButton = props => {
  return (
    <div>
      <span> from AddButton.js</span>
      <button onClick={props.addTrip}>Add a thing</button>
    </div>
  );
};

export default AddButton;

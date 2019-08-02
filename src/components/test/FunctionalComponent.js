import React from "react";

const FunctionalComponent = props => {
  return (
    <div>
      <span> from FunctionalComponent.js</span>
      <p>props's name is {props.name} </p>
    </div>
  );
};

export default FunctionalComponent;

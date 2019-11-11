// react remove item from a list
// ref: https://codepen.io/marekdano/pen/bVNYpq?editors=1010

// 190731 change item.js from class to function
import React from "react";
import IntegerInput from "./IntegerInput";

const Item = props => {
  const handleChangeInIntegerInput = newValue => {
    /**
     *  take the newValue passed up from IntegerInput,
     *  combined w/ current index, send 'em into parent's param
     *  */
    props.handleChangeInIntegerInput(newValue, props.index);
  };

  const handleRemoveClick = () => {
    var index = parseInt(props.index);
    props.removeItem(index);
  };

  return (
    <li className="collection-item text-center row valign-wrapper">
      <div className="btn-flat col s5">{props.item.sku}</div>
      <div className="col s4">
        {/* <IntegerInput
          value={props.item.quantity}
          min={props.min}
          max={props.max}
          onChange={handleChangeInIntegerInput}
        /> */}
        <IntegerInput
          item={props.item}
          min={props.min}
          max={props.max}
          onChange={handleChangeInIntegerInput}
        />
        <span className="red-text">
          {props.item.msg !== "" ? (
            <span>
              <i className="material-icons tiny">warning</i> {props.item.msg}
            </span>
          ) : (
            ""
          )}
        </span>
      </div>

      <div className="col s3">
        <button
          id="btn_remove"
          className="btn-floating waves-effect waves-light red right-align"
          style={{ marginTop: "0", marginBottom: "0" }}
          onClick={handleRemoveClick}
        >
          <i className="material-icons">remove</i>
        </button>
      </div>
    </li>
  );
};

export default Item;

// react remove item from a list
// ref: https://codepen.io/marekdano/pen/bVNYpq?editors=1010

import React, { Component } from "react";
import IntegerInput from "./IntegerInput";

class Item extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeInIntegerInput = this.handleChangeInIntegerInput.bind(
      this
    );
  }

  handleClick = () => {
    var index = parseInt(this.props.index);
    this.props.removeItem(index);
  };

  handleChangeInIntegerInput = newValue => {
    /**
     *  take the newValue passed up from IntegerInput,
     *  combined w/ current index, send 'em into parent's param
     *  */
    // console.log("newValue: " + newValue + "  index:" + this.props.index);
    this.props.handleChangeInIntegerInput(newValue, this.props.index);
  };

  render() {
    console.log(this.state);
    return (
      <li className="collection-item text-center row valign-wrapper ">
        <span className="btn-flat col s6">{this.props.item.sku}</span>
        <span className="col s4">
          <IntegerInput
            value={this.props.item.quantity}
            min={this.props.min}
            max={this.props.max}
            onChange={this.handleChangeInIntegerInput}
          />
        </span>

        <span className="col s2">
          <button
            id="btn_remove"
            className="btn-floating waves-effect waves-light red right-align"
            style={{ marginTop: "0", marginBottom: "0" }}
            onClick={this.handleClick}
          >
            <i className="material-icons">remove</i>
          </button>
        </span>
      </li>
    );
  }
}

export default Item;

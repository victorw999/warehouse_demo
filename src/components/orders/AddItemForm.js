// implement "controlled input" ref: https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/
// ref: https://codepen.io/gaearon/pen/VmmPgp?editors=0010

// enable btn after validation ref: https://stackoverflow.com/questions/30187781/react-js-disable-button-when-input-is-empty

import React, { Component } from "react";

// http://jsfiddle.net/are207L0/1/
function isNullOrWhitespace(input) {
  return !input || !input.trim();
}

class AddItemForm extends Component {
  constructor() {
    super();
    this.state = {
      sku: "",
      qty: ""
    };
  }

  // handleSubmit = e => {
  //   e.preventDefault();
  //   var sku = this.refs.sku_input.value;
  //   var qty = this.refs.quantity_input.value;

  //   //if we have a value
  //   //call the addFruit method of the App component
  //   //to change the state of the fruit list by adding an new item
  //   if (typeof sku === "string" && sku.length > 0) {
  //     this.props.addItem([sku, qty]); // pass in array as arg, to CreateOrder.js's func

  //     this.refs.addItemForm.reset(); //reset the form
  //   }
  // };

  resetForm = () => {
    this.setState({
      sku: "",
      qty: ""
    });
  };

  handleClick = e => {
    e.preventDefault();
    let sku = this.state.sku;
    let qty = this.state.qty;
    if (typeof sku === "string" && sku.length > 0 && qty > 0) {
      this.props.addItem([sku, qty]); // pass in array as arg, to CreateOrder.js's func
      this.resetForm(); //reset the form
    }
  };

  handleSkuChange = e => {
    this.setState({ sku: e.target.value.trim() });
  };
  handleQtyChange = e => {
    this.setState({ qty: e.target.value });
  };

  validateQtyInput = () => {
    let qty = this.state.qty;
    if (qty.length > 0 && qty > 0 && qty < this.props.qtyMax) {
      return true;
    } else {
      return false;
    }
  };

  validate = () => {
    let sku = this.state.sku;
    if (!isNullOrWhitespace(sku) && this.validateQtyInput()) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    return (
      <div
        ref="addItemForm"
        className="pink lighten-5"
        // onSubmit={this.handleSubmit}
        onChange={this.validate}
      >
        <div className="row valign-wrapper">
          {/*   valign-wrapper vertical align the elements   */}
          <div className="input-field col s5">
            <input
              type="text"
              id="sku"
              ref="sku_input"
              className="validate"
              // required="required"   // this has to be disabled, or it'll block the submit btn in CreateOrder.js
              // aria-required="true"
              value={this.state.sku}
              onChange={this.handleSkuChange}
            />
            <label htmlFor="sku">SKU</label>
          </div>
          <div className="input-field col s4 ">
            <input
              className="validate"
              // required="required"
              // aria-required="true"
              type="number"
              id="quantity"
              ref="quantity_input"
              value={this.state.qty}
              onChange={this.handleQtyChange}
            />
            <label htmlFor="quantity">
              Quantity &nbsp;
              {this.validateQtyInput() || this.state.qty === "" ? (
                ""
              ) : (
                <span className="red-text">
                  <i className="material-icons tiny">warning</i>
                  {this.props.qtyMin} ~ {this.props.qtyMax}
                </span>
              )}
            </label>
          </div>
          <div className="input-field col s3">
            <button
              id="btn_add_item"
              type="submit"
              className="btn-floating btn-large waves-effect waves-light pink"
              onClick={this.handleClick}
              disabled={!this.validate()}
            >
              <i className="material-icons">add</i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddItemForm;

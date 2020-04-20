/**
 *  this page is for user to manually type in an order
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { createOrder } from "../../../store/actions/orderActions";
import ItemList from "../ItemList";
import { DatePicker } from "react-materialize";
import { isNullOrWhitespace, isValidDate } from "../../utilityFunc/functions";
import { Redirect } from "react-router-dom";
import { isSuper } from "../../utilityFunc/functions";

class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // init all fields to avoid the senerio where during firestore update there's a "missing field" err
      amzId: "",
      orderDate: new Date(),
      itemlist: [],
      buyer: "",
      shipAddr: "",
      shipCity: "",
      shipState: "",
      shipZip: "",
      shipOption: "",
    };
    this.validate = this.validate.bind(this);
    this.refDatePicker = React.createRef();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.createOrder(this.state);
    this.props.history.push("/"); // redirect to homepage after finished creating
  };

  validate = () => {
    if (
      !isNullOrWhitespace(this.state.amzId) &&
      this.state.itemlist.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  handleDatePicker = (e) => {
    if (isValidDate(e)) {
      this.setState({
        orderDate: e,
      });
    } else {
      alert("not valid date");
    }
  };

  /**
   * updateList: provide prop function to handle children component Itemlist.js 's addItem(), removeItem()
   *  function defintion in : CreateOrder.js, OrderDeatil.js
   *  1. add item
   *  2. add item w/ same sku
   *  3. remove item
   */
  updateList = (newlist) => {
    this.setState({
      itemlist: newlist,
    });
  };

  check;

  render() {
    // prohits non-super to create order
    if (!isSuper(this.props.profile)) return <Redirect to="/signin" />;

    return (
      <div className="container">
        <form
          className="white"
          onSubmit={this.handleSubmit.bind(this)}
          onChange={this.validate}
        >
          <h5 className="grey-text text-darken-3">Create a New Order</h5>
          <div className="row">
            <DatePicker
              id="orderDate"
              ref={this.refDatePicker}
              options={{
                defaultDate: new Date(),
                setDefaultDate: true,
                autoClose: true,
                onOpen: function() {
                  console.log("DatePicker value:" + this.el.value);
                  console.log(this.date);
                },
              }}
              onChange={this.handleDatePicker.bind(this)}
            />
          </div>

          <div className="row">
            <div className="input-field col s6">
              <input
                type="text"
                id="amzId"
                onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="amzId">order-id</label>
            </div>
            <div className="input-field col s6">
              <input
                type="text"
                id="buyer"
                onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="buyer">buyer</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <input
                type="text"
                id="shipAddr"
                onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="shipAddr">shipAddr</label>
            </div>
            <div className="input-field col s6">
              <input
                type="text"
                id="shipCity"
                onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="shipCity">City</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4">
              <input
                type="text"
                id="shipState"
                onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="shipState">State</label>
            </div>
            <div className="input-field col s4">
              <input
                type="text"
                id="shipZip"
                onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="shipZip">Zip</label>
            </div>
            <div className="input-field col s4">
              <input
                type="text"
                id="shipOption"
                onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="shipOption">shipOption</label>
            </div>
          </div>
          <div className="input-field">
            <ItemList
              itemlist={this.state.itemlist}
              updateList={this.updateList.bind(this)}
            />
          </div>

          <div className="input-field">
            <button className="btn pink lighten-1" disabled={!this.validate()}>
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createOrder: (order) => dispatch(createOrder(order)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);

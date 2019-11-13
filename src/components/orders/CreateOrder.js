import React, { Component } from "react";
import { connect } from "react-redux";
import { createOrder } from "../../store/actions/orderActions";
// import { Redirect } from "react-router-dom";
import ItemList from "./ItemList";

// import moment from "moment";
import { DatePicker } from "react-materialize";

// http://jsfiddle.net/are207L0/1/
function isNullOrWhitespace(input) {
  return !input || !input.trim();
}

//https://stackoverflow.com/a/1353711/5844090
function isValidDate(d) {
  return d instanceof Date && !isNaN(d); // protect against right click insert emoji
}

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
      shipOption: ""
    };
    this.validate = this.validate.bind(this);
    this.refDatePicker = React.createRef();
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    /**
     * use action in mapDispatchToProps()
     * passing local state into action
     * it will run the func in orderActions.js
     */

    // // clear all msg in items
    // let newlist = this.state.itemlist.map(item => {
    //   return { ...item, msg: "" };
    // });
    // this.setState({ ...this.state, itemlist: newlist });

    this.props.createOrder(this.state);
    this.props.history.push("/"); // redirect to homepage after finished creating
  };

  componentDidMount = () => {
    // Init orderDate when the element load/mount
    // trigger handleDatePicker() to setState in this lifecylce func
    // using refs to refer to DatePicker element
    // i can init orderDate here or in the constructor
    // this.handleDatePicker(this.refDatePicker.current.instance.date);
  };

  componentDidUpdate = () => {
    // console.log(this.state);
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

  handleDatePicker = e => {
    if (isValidDate(e)) {
      this.setState({
        orderDate: e
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
  updateList = newlist => {
    this.setState({
      itemlist: newlist
    });
  };

  /*
  REF: add item dynamically
  https://codepen.io/antonietta/pen/KzxxWN
  my codepen: https://codepen.io/victorw999/pen/NZJKrR?editors=0010
*/

  render() {
    // const { auth } = this.props;
    // if (!auth.uid) return <Redirect to="/signin" />;
    // console.log(this.refDatePicker.current);
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
                }
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

// const mapStateToProps = state => {
//   return {
//     auth: state.firebase.auth
//   };
// };

const mapDispatchToProps = dispatch => {
  return {
    createOrder: order => dispatch(createOrder(order))
  };
};

export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(CreateOrder);

import React, { Component } from "react";
import { connect } from "react-redux";
import { createOrder } from "../../store/actions/orderActions";
import { Redirect } from "react-router-dom";
import ItemList from "./ItemList";
import { timingSafeEqual } from "crypto";
import moment from "moment";

// http://jsfiddle.net/are207L0/1/
function isNullOrWhitespace(input) {
  return !input || !input.trim();
}

class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // id: "",
      amzId: "",
      itemlist: []
      // createdBy: "Victor Admin"
    };
    this.validate = this.validate.bind(this);
  }

  // handleOrderId = e => {
  //   this.setState({
  //     amzId: e.target.value
  //   });
  // };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();

    // this.props.history.push("/"); // redirect to homepage after finished creating

    // let newId = "order-" + new Date().getTime(); //generate an unique key
    // this.setState({
    //   id: newId,
    //   createdTime: moment(new Date().getTime()).format()
    // });

    /**
     * use action in mapDispatchToProps()
     * passing local state into action
     * it will run the func in orderActions.js
     */
    this.props.createOrder(this.state);
  };

  updateItemListInOrder = newItemList => {
    this.setState({
      itemlist: newItemList
    });
  };

  componentDidUpdate = () => {
    // console.log("CreateOrder.js:  " + JSON.stringify(this.state.itemlist));
    console.log(this.state);
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

  /*
  REF: add item dynamically
  https://codepen.io/antonietta/pen/KzxxWN
  my codepen: https://codepen.io/victorw999/pen/NZJKrR?editors=0010
*/

  render() {
    // const { auth } = this.props;
    // if (!auth.uid) return <Redirect to="/signin" />;

    return (
      <div className="container">
        <form
          className="white"
          onSubmit={this.handleSubmit.bind(this)}
          onChange={this.validate}
        >
          <h5 className="grey-text text-darken-3">Create a New Order</h5>

          <div className="input-field">
            <input
              type="text"
              id="amzId"
              onChange={this.handleChange.bind(this)}
            />
            <label htmlFor="amzId">order-id</label>
          </div>

          <div className="input-field">
            <textarea
              id="additionalInfo"
              className="materialize-textarea"
              onChange={this.handleChange.bind(this)}
            />
            <label htmlFor="additionalInfo">Additional Info</label>
          </div>

          <div className="input-field">
            <ItemList
              itemlist={this.state.itemlist}
              updateItemListInOrder={this.updateItemListInOrder.bind(this)}
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

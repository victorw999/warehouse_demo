/**
 * @desc
 * 1. import JSON "Amz Order Report" into react
 * 2. re-arrange data obj into the shape of "orders" collection
 * ref: https://howtocreateapps.com/json-html-react-tutorial/
 */
import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { importOrders } from "../../store/actions/importActions";
import { createJob } from "../../store/actions/jobActions";
import moment from "moment";
import prepOrders from "./prepOrders";
import LoaderButton from "../utilityFunc/LoaderButton/LoaderButton";
import { Redirect } from "react-router-dom";

class ImportOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      orders: [],
    };
  }

  componentDidMount() {
    // ref: to fix CORS issue -> // https://www.youtube.com/watch?v=hxyp_LkKDdk

    // designated json feed
    var url = "http://icantoo.com/000_data/json/amz.json";

    fetch("https://cors-anywhere.herokuapp.com/" + url)
      .then((response) => response.json())
      .then(
        // handle the result
        (result) => {
          this.setState({
            isLoaded: true,
            orders: result,
          });
        },

        // Handle error
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    if (!this.props.auth.uid) return <Redirect to="/signin" />;
    const { error, isLoaded, orders } = this.state;

    if (error) {
      return <div>Error in loading</div>;
    } else if (!isLoaded) {
      return <div>Loading ...</div>;
    } else {
      return (
        <div className="import_orders container">
          <LoaderButton
            btnName={"Import Orders"}
            btnFormat={"btn-flat teal lighten-2 white-text"}
            handleClick={() => {
              var arr = prepOrders(orders);
              console.log("arr: ", arr);
              this.props.createJob(arr, "importJSONOrders", "");

              setTimeout(() => {
                this.props.history.push("/"); // redirect to homepage after finished creating
              }, 3000);
            }}
          >
            Import Orders
          </LoaderButton>
          <ol className="order_ol">
            {orders.map((order) => (
              <li key={order["order-item-id"]} align="start">
                <td className="date">
                  {moment(order["purchase-date"]).format("MM/DD")}
                </td>
                <td className="oid">{order["order-id"]}</td>
                <td className="name">{order["buyer-name"]}</td>
              </li>
            ))}
          </ol>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    importOrders: (json) => dispatch(importOrders(json)),
    createJob: (list, jobType, flag) =>
      dispatch(createJob(list, jobType, flag)),
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "orders",
    },
  ])
)(ImportOrders);

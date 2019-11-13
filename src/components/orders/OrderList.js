import React from "react";
import OrderSummary from "./OrderSummary";
// import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

// const deleteOrder =
const OrderList = ({ orders }) => {
  return (
    <div className="project-list section">
      <h5 className="card-title">Orders</h5>
      <table className="responsive-table">
        <thead>
          <tr className="hide-on-small-only">
            <th>Order Details</th>
            <th>Itemlist</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map(order => {
              return <OrderSummary order={order} key={order.id} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

// export default OrderList;
const mapStateToProps = state => {
  /**
   *
   *  don't need to access state from here, rather use props from Parent: Dashboard.js
   *
   */

  return {
    // orders: state.firestore.ordered.orders
    // orders: state.order.orders   // demo data frm 'reducers/orderReducer.js'
  };
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "orders",
      orderBy: ["createdAt", "desc"]
    }
  ])
)(OrderList);

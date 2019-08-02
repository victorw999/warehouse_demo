import React from "react";
import OrderSummary from "./OrderSummary";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

const OrderList = ({ orders }) => {
  return (
    <div className="project-list section">
      <h5 className="card-title">Orders</h5>
      <table>
        <thead>
          <tr>
            {/* <th>id</th> */}
            <th>Order Details</th>
            <th>Itemlist</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map(order => {
              return (
                // <Link to={"/project/" + order.id} key={order.id}>
                //   <OrderSummary order={order} />
                // </Link>
                <OrderSummary order={order} key={order.id} />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
// const mapStateToProps = state => {
//   return {
//     // projects: state.firestore.ordered.projects
//     orders: state.order.orders
//   };
// };
// export default compose(
//   connect(mapStateToProps),
//   // firestoreConnect([
//   //   {
//   //     collection: "projects",
//   //     orderBy: ["createdAt", "desc"]
//   //   }
//   // ])
// )(OrderList);

import React from "react";

import moment from "moment";

const OrderDescription = ({ order }) => {
  if (order) {
    return (
      <div className="description">
        <span className="date hide-on-small-only">
          {order.orderDate
            ? moment(order.orderDate.toDate()).format("L")
            : "missing order date"}
        </span>
        <span className="amzId">{order.amzId}</span>
        <span className="buyer">{order.buyer}</span>
        <span className="shipOption">Shipping: {order.shipOption}</span>
        <span className="city"> {order.shipCity}</span>
        {/* <br className="hide-on-med-and-up" /> */}
        <span className="zip"> {order.shipState + " " + order.shipZip}</span>
      </div>
    );
  } else {
    return (
      <div className="  center">
        <p>Loading ...</p>
      </div>
    );
  }
};

export default OrderDescription;

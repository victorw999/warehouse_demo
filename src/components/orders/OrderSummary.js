import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const OrderSummary = ({ order }) => {
  return (
    <tr>
      <td>
        <span className="black-text"> Order Date: {order.orderDate} </span>{" "}
        <br />
        <span style={{ fontWeight: "800" }}>{order.amzId}</span>
        <br />
        {order.buyer}
        <br />
        <span className="grey-text">
          Shipping:{" "}
          <span className="black-text" style={{ fontWeight: "600" }}>
            {order.shipOption}
          </span>
          <br />
          {order.shipCity + " " + order.shipState + " " + order.shipZip}
        </span>
      </td>
      <td style={{ whiteSpace: "pre-line" }}>
        {order.itemlist.map(item => {
          return (
            <span key={item.key}>
              <span
                className="left badge black-text"
                style={{ textAlign: "left" }}
              >
                {" "}
                {item.sku}
              </span>
              {"  "}
              <span
                className="left badge grey lighten-4 green-text"
                style={{ fontWeight: "800" }}
              >
                {item.quantity}
              </span>
              <br />
            </span>
          );
        })}
      </td>
      <td>
        <Link to={"/order/" + order.id} key={order.id}>
          <button className="btn-flat waves-effect waves-light green">
            {/* {order.id}  */}
            <i className="material-icons white-text">search</i>
          </button>
        </Link>
      </td>
    </tr>
  );
};

export default OrderSummary;

import React from "react";
import { connect } from "react-redux";
import { deleteOrder } from "../../../store/actions/orderActions";

import moment from "moment";
import OrderSummaryBtns from "./OrderSummaryBtns";

const OrderSummaryDone = props => {
  const { order, orderStatus, profile, handleCreateJob } = props;
  // need 'props' variable for dispatch actions

  return (
    <tr className="OrderSummaryDone_row">
      <td>
        <span className="amzId">{order.amzId}</span>
        <br />
        {order.buyer}
        <br />
        <span className="grey-text">
          Shipping:{" "}
          <span className="black-text" style={{ fontWeight: "600" }}>
            {order.shipOption}
          </span>
          <br />
          {order.shipCity + " "}
          <br className="hide-on-med-and-up" />
          {order.shipState + " " + order.shipZip}
        </span>
      </td>
      <td className="itemsdetail">
        <ul className="collection" style={{ border: "none" }}>
          {order.itemlist &&
            order.itemlist.map(item => {
              return (
                <li
                  key={item.key}
                  className="collection-item valign-wrapper itemlist"
                >
                  <span className="black-text">{item.sku}</span>
                  <span className="grey lighten-4 teal-text item_qty">
                    {item.quantity}
                  </span>
                </li>
              );
            })}
        </ul>
      </td>

      {/*
       * ACTIONS section
       */}
      {/* <td className="actions_section">
        <OrderSummaryBtns
          order={order}
          profile={profile}
          handleCreateJob={handleCreateJob}
          deleteOrder={props.deleteOrder} //mapDispatchToProps
          orderStatus={orderStatus}
        />
      </td> */}
      {/*
       * END ACTION SECTION
       */}
    </tr>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    deleteOrder: order => dispatch(deleteOrder(order))
  };
};

export default connect(null, mapDispatchToProps)(OrderSummaryDone);

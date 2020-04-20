import React from "react";
import OrderSummaryDone from "./OrderSummaryDone";
const OrderSummaryDoneCollaps = ({
  doneOrders,
  profile,
  getOrderStatus,
  handleCreateJob,
}) => {
  return (
    <>
      <ul className="collapsible collapsible_doneOrders">
        <li className="collapsible-item">
          {/* collapsible HEADER */}
          <div className="collapsible-header doneOrders_header grey white-text    row  ">
            <span className="name col s12 m3">
              <span className="float_btn_center btn-floating btn-flat white teal-text">
                {!doneOrders[0]
                  ? 0
                  : doneOrders[0].styleno === ""
                  ? 0
                  : doneOrders.length}
              </span>
            </span>
            <span className="col s12 m9"></span>
          </div>
          {/* collapsible BODY */}
          <div className="collapsible-body doneOrders_body">
            <div className="orderlist_table">
              <div className="orderlist_body">
                {doneOrders &&
                  doneOrders.map((order) => {
                    return (
                      <OrderSummaryDone
                        key={order.id}
                        order={order}
                        orderStatus={getOrderStatus(order)}
                        profile={profile}
                        handleCreateJob={handleCreateJob}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default OrderSummaryDoneCollaps;

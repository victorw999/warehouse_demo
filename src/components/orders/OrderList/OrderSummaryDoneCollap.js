import React from "react";
import OrderSummaryDone from "./OrderSummaryDone";
const OrderSummaryDoneCollaps = ({
  doneOrders,
  profile,
  getOrderStatus,
  handleCreateJob
}) => {
  return (
    <>
      <ul className="collapsible collapsible_doneOrders">
        <li className="collapsible-item">
          {/* collapsible HEADER */}
          <div className="collapsible-header doneOrders_header grey white-text">
            <h4 className="name">
              <i className={"material-icons"}> arrow_drop_down_circle </i>
            </h4>
          </div>
          {/* collapsible BODY */}
          <div className="collapsible-body">
            <table className="responsive-table">
              <tbody>
                {doneOrders &&
                  doneOrders.map(order => {
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
              </tbody>
            </table>
          </div>
        </li>
      </ul>
    </>
  );
};

export default OrderSummaryDoneCollaps;

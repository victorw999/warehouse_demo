import React from "react";

const ItemsDetail = ({
  order,
  orderStatus,
  getItemListPickers,
  getStatusIcon,
  showPicker,
}) => {
  if (order) {
    return (
      <>
        <div className="task_status">
          <span className="teal-text itemlistpickers">
            {orderStatus === "" ? "" : getItemListPickers(order.itemlist)}{" "}
          </span>
          <span className="teal-text orderstatus">{orderStatus}</span>
        </div>
        <ul className="itemlist">
          {order.itemlist &&
            order.itemlist.map((item) => {
              return (
                <li key={item.key} className="single_item valign-wrapper">
                  <span className="sku">{item.sku}</span>
                  <span className="teal-text item_qty">{item.quantity}</span>
                  <span className="status valign-wrapper">
                    {getStatusIcon(item.status)}
                  </span>
                  <span className="picker_init">
                    {showPicker ? item.picker_init : ""}
                  </span>
                </li>
              );
            })}
        </ul>
      </>
    );
  }
};

export default ItemsDetail;

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { deleteOrder } from "../../../store/actions/orderActions";

import moment from "moment";
import OrderSummaryBtns from "./OrderSummaryBtns";

const OrderSummary = props => {
  const { order, orderStatus, profile, handleCreateJob } = props;
  // need 'props' variable for dispatch actions

  const [showPicker, setshowPicker] = useState(false);

  /**
   * @desc - decide if should display authorFirstName
   */
  useEffect(() => {
    if (shouldShowPicker(order.itemlist)) {
      setshowPicker(true);
    } else {
      setshowPicker(false);
    }
  }, [order.itemlist]);

  /**
   *
   * @desc - depends on item's status, display icons
   */
  const getStatusIcon = status => {
    if (status === "picking") {
      return <i className="fas fa-walking picking"></i>;
    } else if (status === "pick_complete") {
      return (
        <>
          <i className="fas fa-walking pick_complete"></i>
          <i className="far fa-check-circle pick_complete"></i>
        </>
      );
    } else if (status === "packing") {
      return <i className="fas fa-box-open packing"></i>;
    } else if (status === "pack_complete") {
      return (
        <>
          <i className="fas fa-box-open pack_complete"></i>
          <i className="far fa-check-circle pack_complete"></i>
        </>
      );
    } else if (status === "n/a") {
      return <i className="material-icons orange-text">warning</i>;
    } else {
      return (
        <>
          {/* <i className="material-icons green white-text">directions_run</i>
          <i className="material-icons orange-text">warning</i>
          <i className="fas fa-box-open pick_complete"></i>
          <i className="far fa-check-circle pick_complete"></i> */}
        </>
      );
    }
  };

  /**
   *  decide what to display on top of list, for picker(s)
   */
  const getItemListPickers = itemlist => {
    if (itemlist) {
      if (shouldShowPicker(itemlist)) {
        return "shared";
      } else {
        let picker = itemlist[0].picker ? itemlist[0].picker : "";
        return picker;
      }
    } else {
      return "";
    }
  };

  /**
   *
   * this func is used to decide wheather to display picker by the side of item
   * packer will not be displayed on the side,
   * there should be only 1 packer for each list,
   * therefore, it'll be displayed on top of the list
   */
  const shouldShowPicker = itemlist => {
    /**
     * 1. item is either in "pick" status or "pack" status, or "no status"
     * 2. there could also be a senario: in a list, some item is "pick" status, some is "pack" status
     * 3. no matter what stage this list is current on (pick or pack)
     *    if there're multiple pickers, we need to display them
     */
    if (itemlist) {
      let picker_arr = itemlist.map(i => i.picker);
      if (picker_arr.length < 2) {
        return false;
      } else {
        let result = picker_arr.every(p => p === picker_arr[0]);
        return !result;
      }
    } else {
      return false;
    }
  };

  return (
    <tr className="OrderSummary_row">
      <td>
        {/* pc view */}
        <span className="black-text hide-on-small-only">
          Order Date:{" "}
          {order.orderDate
            ? moment(order.orderDate.toDate()).format("L")
            : "missing order date"}
        </span>
        {/* mobile view */}
        <span className="hide-on-med-and-up">
          {order.orderDate
            ? moment(order.orderDate.toDate()).format("L")
            : "missing order date"}
        </span>

        <br />
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
        <span className="teal-text itemlistpickers">
          {orderStatus === "" ? "" : getItemListPickers(order.itemlist)}{" "}
        </span>
        <span className="teal-text orderstatus">{orderStatus}</span>
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
      </td>

      {/*
       * ACTIONS section
       */}
      <td className="actions_section">
        <OrderSummaryBtns
          order={order}
          profile={profile}
          handleCreateJob={handleCreateJob}
          deleteOrder={props.deleteOrder} //mapDispatchToProps
          orderStatus={orderStatus}
        />
      </td>
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

export default connect(null, mapDispatchToProps)(OrderSummary);

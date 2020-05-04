import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { deleteOrder } from "../../../store/actions/orderActions";
import OrderSummaryBtns from "./ordersummary/OrderSummaryBtns";
import OrderDescription from "./ordersummary/OrderDescription";
import ItemsDetail from "./ordersummary/ItemsDetail";
import Message from "./ordersummary/Message";

import {
  getStatusIcon,
  getItemListPickers,
  shouldShowPicker,
} from "./ordersummary/func";

const OrderSummary = (props) => {
  const { order, orderStatus, profile, handleCreateJob } = props;
  const [msg, setMsg] = useState("");
  const setOdrSumMsg = (m) => {
    setMsg(m);
  };

  // clear msg after 5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setMsg("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [msg]);

  return (
    <div className="OrderSummary_row row card-panel z-depth-1">
      {msg === "" ? "" : <Message msg={msg} />}

      {/* {msg === "" ? "" : <div className="odr_sum_msg orange"> {msg}</div>} */}
      <div className="ordersummary_detail col s12 m4">
        <OrderDescription order={order} />
      </div>
      <div className="itemsdetail col s12 m6 center">
        <ItemsDetail
          order={order}
          orderStatus={orderStatus}
          getItemListPickers={getItemListPickers}
          getStatusIcon={getStatusIcon}
          showPicker={() => {
            shouldShowPicker(order.itemlist);
          }}
        />
      </div>

      {/*
       * ACTIONS section
       */}
      <div className="actions_section col s12 m2">
        <OrderSummaryBtns
          order={order}
          profile={profile}
          handleCreateJob={handleCreateJob}
          deleteOrder={props.deleteOrder} //mapDispatchToProps
          orderStatus={orderStatus}
          setOdrSumMsg={setOdrSumMsg}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteOrder: (order) => dispatch(deleteOrder(order)),
  };
};

export default connect(null, mapDispatchToProps)(OrderSummary);

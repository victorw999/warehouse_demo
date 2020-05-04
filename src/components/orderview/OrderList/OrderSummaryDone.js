import React from "react";
import { connect } from "react-redux";
import { deleteOrder } from "../../../store/actions/orderActions";
import OrderDescription from "./ordersummary/OrderDescription";
import ItemsDetail from "./ordersummary/ItemsDetail";

import {
  getStatusIcon,
  getItemListPickers,
  shouldShowPicker,
} from "./ordersummary/func";

const OrderSummaryDone = (props) => {
  const { order, orderStatus } = props;
  return (
    <div className="OrderSummary_row row card-panel z-depth-1">
      <div className="ordersummary_detail col s12 m6">
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
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteOrder: (order) => dispatch(deleteOrder(order)),
  };
};

export default connect(null, mapDispatchToProps)(OrderSummaryDone);

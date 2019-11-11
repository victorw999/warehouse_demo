import React, { useState } from "react";
import { connect } from "react-redux";
import { deleteOrder } from "../../store/actions/orderActions";
import { Link } from "react-router-dom";
import moment from "moment";
import ConfirmDeletion from "./ConfirmDeletion";

const OrderSummary = props => {
  const { order } = props; // need 'props' variable for dispatch actions
  const [modalOpen, setModalOpen] = useState(false); // hooks for Modal ConfirmDeletion

  const modalYes = () => {
    console.log(order.id);
    props.deleteOrder(order); //Send 'order' props to Action Creator 'deleteOrder', which will extract the doc.id necessary for delete operation
    setModalOpen(false); // close modal
  };
  const modalNo = () => {
    setModalOpen(false);
  };
  const handleDelete = () => {
    setModalOpen(true); // open modal for user confirmation
  };
  return (
    <tr>
      <td>
        {/* pc view */}
        <span className="black-text hide-on-small-only">
          Order Date:{" "}
          {order.orderDate
            ? moment(order.orderDate.toDate()).format("LLLL")
            : "missing order date"}
        </span>
        {/* mobile view */}
        <span className="hide-on-med-and-up">
          {order.orderDate
            ? moment(order.orderDate.toDate()).format("L")
            : "missing order date"}
        </span>

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
          {order.shipCity + " "}
          <br className="hide-on-med-and-up" />
          {order.shipState + " " + order.shipZip}
        </span>
      </td>
      <td style={{ whiteSpace: "pre-line" }}>
        <ul className="collection" style={{ border: "none" }}>
          {order.itemlist &&
            order.itemlist.map(item => {
              return (
                <li
                  key={item.key}
                  // className="left badge"
                  className="collection-item"
                  style={{ padding: "0", border: "none" }}
                >
                  <span
                    // className="left badge black-text"
                    className=" black-text"
                  >
                    {" "}
                    {item.sku}
                  </span>
                  {"  "}
                  <span
                    className="  badge grey lighten-4 teal-text"
                    // className="left badge grey lighten-4 teal-text"
                    style={{ fontWeight: "800" }}
                  >
                    {item.quantity}
                  </span>
                </li>
              );
            })}
        </ul>
      </td>
      <td>
        <Link to={"/order/" + order.id} key={order.id}>
          <button
            className="btn-flat waves-effect waves-light teal"
            style={{ marginRight: "15px" }}
          >
            <i className="material-icons white-text">search</i>
          </button>
        </Link>

        <button
          className="btn-flat waves-effect waves-light red"
          onClick={handleDelete}
        >
          <i className="material-icons white-text">remove</i>
        </button>
      </td>
      {/* "confirmation modal" ref: https://stackoverflow.com/a/54392589/5844090 */}
      <ConfirmDeletion
        onClickYes={null}
        onClickNo={null}
        name={order.amzId}
        open={modalOpen}
        actions={[
          <button
            onClick={modalNo}
            className="modal-close waves-effect waves-green btn-flat"
          >
            No
          </button>,
          <button
            onClick={modalYes}
            className="modal-close waves-effect waves-light btn-flat red white-text"
          >
            Yes
          </button>
        ]}
      />
    </tr>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    deleteOrder: order => dispatch(deleteOrder(order))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(OrderSummary);

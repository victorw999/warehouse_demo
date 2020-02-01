import React, { useState } from "react";
import { connect } from "react-redux";
import { deleteOrder } from "../../../store/actions/orderActions";
import { Link } from "react-router-dom";
import moment from "moment";
import ConfirmDeletion from "../Modals/ConfirmDeletion";
import LoaderButton from "../../utilityFunc/LoaderButton/LoaderButton";

const OrderSummary = props => {
  const {
    order,
    handleCreatePickTask,
    handleDeletePickTask,
    deleteMultiPickTasks
  } = props; // need 'props' variable for dispatch actions
  const [modalOpen, setModalOpen] = useState(false); // hooks for Modal ConfirmDeletion

  const modalYes = () => {
    props.deleteOrder(order); //Send 'order' props to Action Creator 'deleteOrder', which will extract the doc.id necessary for delete operation
    setModalOpen(false); // close modal
  };

  const modalNo = () => {
    setModalOpen(false);
  };

  const handleDelete = () => {
    setModalOpen(true); // open modal for user confirmation
  };

  const getStatusIcon = status => {
    if (status === "picking") {
      return <i className="fas fa-walking picking"></i>;
    } else if (status === "pick_complete") {
      return (
        <>
          {/* <i className="material-icons green white-text">directions_run</i> */}
          <i className="material-icons orange-text">warning</i>
          <i className="fas fa-walking picking"></i>
          <i className="far fa-check-circle picking"></i>
          <i className="fas fa-box-open pick_complete"></i>
          <i className="far fa-check-circle pick_complete"></i>
        </>
      );
    }
  };

  const checkAllStatus = itemlist => {
    if (itemlist && itemlist.length > 0) {
      var result_status = [];
      result_status.push(itemlist[0].status);

      // grab all status
      itemlist.forEach(i => {
        if (!result_status.some(s => s === i.status)) {
          result_status.push(i.status);
        }
      });

      // remove empty items
      result_status.filter(x => x !== "");

      if (result_status.length > 1) return "mixed";
      if (result_status.length === 1) return result_status[0];
    }
    return "";
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
      <td style={{ whiteSpace: "pre-line" }}>
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
                </li>
              );
            })}
        </ul>
      </td>

      {/*
       *
       * ACTIONS section
       */}
      <td className="actions_section">
        <Link to={"/order/" + order.id} key={order.id}>
          <button className="btn-flat teal  act_btn">
            <i className="material-icons white-text">search</i>
          </button>
        </Link>

        <button className="btn-flat red act_btn" onClick={handleDelete}>
          <i className="material-icons white-text ">delete_forever</i>
        </button>

        {/* 
            PICK BUTTON
        */}
        {checkAllStatus(order.itemlist) === "picking" ? (
          ""
        ) : (
          <LoaderButton
            btnName={"PICK"}
            btnFormat={"btn-flat grey lighten-2 teal-text act_btn"}
            handleClick={() => {
              if (order.itemlist) {
                // filter out no-status items, so item already have status, cannot be re-tasked
                var picktask_itemlist = order.itemlist.filter(f => {
                  if (f.status === "" || f.status === undefined) {
                    return true;
                  } else {
                    return false;
                  }
                });

                // add additional info to itemlist
                picktask_itemlist = picktask_itemlist.map(i => {
                  return {
                    ...i,
                    oid: order.amzId,
                    buyer: order.buyer,
                    order_docId: order.docId,
                    msg: "note_trigger_not_update_order" // add to skip trigger
                  };
                });
                handleCreatePickTask({ itemlist: picktask_itemlist });
              }
            }}
          />
        )}

        {/* 
            CANCEL PICK BUTTON
        */}
        {checkAllStatus(order.itemlist) === "picking" ? (
          // <button className="">
          //   <i className="material-icons white-text">cancel</i> Pick
          // </button>

          <LoaderButton
            btnName={"PICK"} // cancel pick
            btnFormat={"btn-flat red act_btn"}
            hasIcon={true}
            icon={"cancel"}
            handleClick={() => {
              if (order.itemlist) {
                // filter out item whose status is 'picking'
                var picktask_itemlist = order.itemlist
                  .filter(f => {
                    if (f.status === "picking") {
                      return true;
                    } else {
                      return false;
                    }
                  })
                  .map(x => {
                    return {
                      ...x,
                      order_docId: order.docId,
                      msg: "note_trigger_not_update_order"
                    };
                  });
                deleteMultiPickTasks(picktask_itemlist);
              }
            }}
          />
        ) : (
          ""
        )}

        <button className="btn-flat grey ligthen-2 act_btn">PACK</button>
        <button className="btn-flat grey ligthen-2 act_btn">N/A</button>

        <button className="btn-flat grey ligthen-2 act_btn">CXL2</button>
      </td>
      {/*
       *
       * "confirmation modal" ref: https://stackoverflow.com/a/54392589/5844090
       * */}
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

export default connect(null, mapDispatchToProps)(OrderSummary);

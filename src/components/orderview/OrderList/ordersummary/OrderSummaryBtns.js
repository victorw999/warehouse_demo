import React, { useState } from "react";
import MsgModal from "../../../modals/MsgModal";
import { Link } from "react-router-dom";
import ConfirmDeletion from "../../../modals/ConfirmDeletion";
import stopLoader from "../../../modals/stopLoader";
import BtnPack from "./BtnPack";
import BtnPackCxl from "./BtnPackCxl";
import BtnPick from "./BtnPick";
import BtnPickCxl from "./BtnPickCxl";
import { isSuper } from "../../../utilityFunc/functions";

const OrderSummaryBtns = ({
  order,
  orderStatus, // this order's overall status, picking, packing, mixed, n/a
  profile,
  handleCreateJob,
  deleteOrder,
}) => {
  /**
   *  STATES:
   */
  const [modalOpen_deleteOrder, setmodalOpen_deleteOrder] = useState(false); // hooks for Modal ConfirmDeletion
  const [modalOpen_cancelViolation, setmodalOpen_cancelViolation] = useState(
    false
  );

  /**
   *  FUNCTION
   *  Delete this order
   */
  const handleDelete = () => {
    setmodalOpen_deleteOrder(true); // open modal for user confirmation
  };

  /**
   *  FUNCTION: controls delete order modal
   */
  const modalYes_deleteOrder = () => {
    deleteOrder(order);
    setmodalOpen_deleteOrder(false); // close modal
  };
  const modalNo_deleteOrder = () => {
    setmodalOpen_deleteOrder(false);
  };

  /**
   *  FUNCTION: controls cancel violation modal
   */
  const modalNo_cancelViolation = () => {
    setmodalOpen_cancelViolation(false);
  };

  /**
   *  RETURN
   */
  return (
    <>
      {isSuper(profile) ? (
        <>
          {/* // EDIT ORDER */}
          <Link to={"/order/" + order.id}>
            <button className="btn-flat teal lighten-1 act_btn">
              <i className="material-icons white-text">search</i>
            </button>
          </Link>
          {/* // DELETE ORDER */}
          <button className="btn-flat red act_btn" onClick={handleDelete}>
            <i className="material-icons white-text ">delete_forever</i>
          </button>
        </>
      ) : (
        ""
      )}

      {/*
       *    PICK BUTTON
       */}

      {showPick(orderStatus) ? (
        ""
      ) : (
        <BtnPick order={order} handleCreateJob={handleCreateJob} />
      )}

      {/* 
           CANCEL PICK BUTTON
           Only display when all items' status are 'picking', or is undergoing deleting_pick
       */}
      {showPickCxl(orderStatus) ? (
        <BtnPickCxl
          order={order}
          handleCreateJob={handleCreateJob}
          stopLoader={stopLoader}
          profile={profile}
          setmodalOpen_cancelViolation={setmodalOpen_cancelViolation}
        />
      ) : (
        ""
      )}
      {/*
       *    CREATE PACK
       */}
      {orderStatus === "pick_complete" ? (
        <BtnPack order={order} handleCreateJob={handleCreateJob} />
      ) : (
        ""
      )}
      {/*
       *    CANCEL PACK
       */}
      {orderStatus === "packing" ? (
        <BtnPackCxl
          order={order}
          handleCreateJob={handleCreateJob}
          stopLoader={stopLoader}
          profile={profile}
          setmodalOpen_cancelViolation={setmodalOpen_cancelViolation}
        />
      ) : (
        ""
      )}
      {/*
       *    N/A OrderNADetails.js
       */}
      {showNA(orderStatus) ? (
        <Link to={"/orderna/" + order.id} key={order.id}>
          <button className="btn-flat orange act_btn">
            <i className="material-icons white-text">warning</i>
          </button>
        </Link>
      ) : (
        ""
      )}
      {/* 
          END ACTION BTNS
       */}
      {/*
       *
       * "confirmation modal" ref: https://stackoverflow.com/a/54392589/5844090
       * */}
      <ConfirmDeletion
        onClickYes={null}
        onClickNo={null}
        name={order.amzId}
        open={modalOpen_deleteOrder}
        header={"Are you sure to Delete this order?"}
        actions={[
          <button
            onClick={modalNo_deleteOrder}
            className="modal-close waves-green btn-flat"
          >
            No
          </button>,
          <button
            onClick={modalYes_deleteOrder}
            className="modal-close btn-flat red white-text"
          >
            Yes
          </button>,
        ]}
      />
      {/* 
      END MODAL
       */}
      {/* 
          CANCEL VIOLATION MsgModal 
      */}
      <MsgModal
        id="cancel_violation"
        open={modalOpen_cancelViolation}
        header="Cancel Violation"
        content="can NOT cancel tasks belong to others !!!"
        actions={[
          <button
            onClick={modalNo_cancelViolation}
            className="modal-close teal lighten-1 btn-flat"
          >
            Close
          </button>,
        ]}
        options={{
          onCloseEnd: modalNo_cancelViolation, // reset the local var for trigger next time
        }}
      />
      {/* 
          END: CANCEL VIOLATION MsgModal 
      */}
    </>
  );
};

/**
 *  @param {string} current order's "status summary"
 *                  when these "cases", DON'T show btn
 *  @return boolean
 */
const showPick = (status) => {
  switch (status) {
    case "n/a":
    case "all_in_pick_stage": // items are either 'picking/pick_complete'. "pick" btn should be hidden, becuase no more picktasks; 'packing' btn also hidden, because the whole order is not ready
    case "picking":
    case "packing":
    case "pick_complete":
    case "mixed": // 'N/A' btn is clicked, if user wants to cancel, they should
      return true;
    default:
      return false;
  }
};

/**
 *  @param {string} current order's "status summary"
 *  @return boolean
 */
const showPickCxl = (status) => {
  switch (status) {
    case "mixed": // 'N/A' btn is clicked, if user wants to cancel, they should
    // case "n/a":
    case "all_in_pick_stage":
    case "picking":
      return true;
    default:
      return false;
  }
};

const showNA = (status) => {
  switch (status) {
    case "mixed":
    case "n/a":
    case "all_in_pick_stage":
    case "picking":
    case "pick_complete_and_empty": // rare but happens : refer to OrderList.js > "pick_complete_and_empty"
    case "n/a_and_empty":
      return true;
    default:
      return false;
  }
};

export default OrderSummaryBtns;

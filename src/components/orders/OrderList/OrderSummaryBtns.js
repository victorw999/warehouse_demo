import React, { useState } from "react";
import MsgModal from "../../modals/MsgModal";
import { Link } from "react-router-dom";
import ConfirmDeletion from "../../modals/ConfirmDeletion";
import stopLoader from "../../modals/stopLoader";
import BtnPack from "./BtnPack";
import BtnPackCxl from "./BtnPackCxl";
import BtnPick from "./BtnPick";
import BtnPickCxl from "./BtnPickCxl";

const OrderSummaryBtns = ({
  order,
  orderStatus, // this order's overall status, picking, packing, mixed, n/a
  profile,
  handleCreateJob,
  deleteOrder
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
      {/*
       *    EDIT ORDER
       */}
      <Link to={"/order/" + order.id} key={order.id}>
        <button className="btn-flat teal act_btn">
          <i className="material-icons white-text">search</i>
        </button>
      </Link>
      {/*
       *    DELETE ORDER
       */}
      <button className="btn-flat red act_btn" onClick={handleDelete}>
        <i className="material-icons white-text ">delete_forever</i>
      </button>
      {/*
       *    PICK BUTTON
       */}
      {orderStatus === "picking" ||
      orderStatus === "pick_complete" ||
      orderStatus === "all_in_pick_stage" ||
      // special case: when all of items either is 'picking' or 'pick_complete'
      // when that happens, pick btn should be hidden, becuase no more needs pick
      // and 'packing' btn also hidden, because the whole order is not ready
      orderStatus === "packing" ||
      orderStatus === "n/a" ? (
        ""
      ) : (
        <BtnPick order={order} handleCreateJob={handleCreateJob} />
      )}

      {/* 
           CANCEL PICK BUTTON
           Only display when all items' status are 'picking', or is undergoing deleting_pick
       */}

      {orderStatus === "picking" ? (
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
       *    N/A
       */}
      {/* <button className="btn-flat grey ligthen-2 act_btn">N/A</button> */}

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
          </button>
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
          </button>
        ]}
        options={{
          onCloseEnd: modalNo_cancelViolation // reset the local var for trigger next time
        }}
      />
      {/* 
          END: CANCEL VIOLATION MsgModal 
      */}
    </>
  );
};

export default OrderSummaryBtns;

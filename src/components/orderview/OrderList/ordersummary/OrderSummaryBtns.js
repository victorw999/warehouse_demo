import React, { useState, useRef } from "react";
import MsgModal from "../../../modals/MsgModal";
import { Link } from "react-router-dom";
import ConfirmDeletion from "../../../modals/ConfirmDeletion";
import stopLoader from "../../../modals/stopLoader";
import BtnPack from "./BtnPack";
import BtnPackCxl from "./BtnPackCxl";
import BtnPick from "./BtnPick";
import BtnPickCxl from "./BtnPickCxl";
import { isSuper } from "../../../utilityFunc/functions";
import LoaderButton from "../../../utilityFunc/LoaderButton/LoaderButton";

const OrderSummaryBtns = ({
  order,
  orderStatus, // this order's overall status, picking, packing, mixed, n/a
  profile,
  handleCreateJob,
  deleteOrder,
  setOdrSumMsg,
}) => {
  /**
   * ref for ConfirmDeletion Modal's trigger
   */
  const ref_hidden_modal_trigger = useRef(null);

  /**
   *  STATES:
   */
  const [modalOpen_deleteOrder, setmodalOpen_deleteOrder] = useState(false); // hooks for Modal ConfirmDeletion
  const [modalOpen_cancelViolation, setmodalOpen_cancelViolation] = useState(
    false
  );

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
  if (order) {
    return (
      <div>
        {isSuper(profile) ? (
          <div>
            {/* // EDIT ORDER */}
            <Link to={"/order/" + order.id}>
              <button className="btn-flat teal lighten-1 act_btn">
                <i className="material-icons white-text">search</i>
              </button>
            </Link>
            {/* // DELETE ORDER */}
            <button
              className="btn-flat red act_btn"
              onClick={() => {
                ref_hidden_modal_trigger.current.click(); // trigger the ConfirmDeletion Modal
              }}
            >
              <i className="material-icons white-text ">delete_forever</i>
            </button>
          </div>
        ) : (
          ""
        )}

        {/*
         *    PICK BUTTON
         */}

        {hidePick(orderStatus) ? (
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
            profile={profile}
            setmodalOpen_cancelViolation={setmodalOpen_cancelViolation}
            setOdrSumMsg={setOdrSumMsg}
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
          MODAL        
        */}
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
          // hidden trigger
          trigger={
            <button
              className="hidden-modal-trigger"
              style={{ visibility: "hidden", position: "absolute" }}
              ref={(button) => (ref_hidden_modal_trigger.current = button)}
            >
              HIDDEN MODAL TRIGGER
            </button>
          }
        />

        {/* 
      END MODAL
       */}
        {/* 
          CANCEL VIOLATION MsgModal 
      */}

        {/* react-materialize Modal causing breaking err after updated react-script to v3 */}
        {/* <MsgModal
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
            // onCloseEnd: () => {
            //   setmodalOpen_cancelViolation(false);
            // },
            onCloseEnd: modalNo_cancelViolation, // reset the local var for trigger next time
          }}
        /> */}

        {/* 
          END: CANCEL VIOLATION MsgModal 
      */}
      </div>
    );
  } else {
    return <p>Loading ...</p>;
  }
};

/**
 *  @param {string} current order's "status summary"
 *                  when these "cases", DON'T show btn
 *  @return boolean
 */
const hidePick = (status) => {
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

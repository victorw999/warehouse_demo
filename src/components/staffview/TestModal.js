import React, { useState, useRef } from "react";
import ConfirmDeletion from "../modals/ConfirmDeletion";
import { Modal } from "react-materialize";
import MsgModal from "../modals/MsgModal";

const TestModal = () => {
  const ref_hidden_modal_btn = useRef(null);

  const [modalOpen, setModalOpen] = useState(false); // hooks for Modal ConfirmDeletion

  const modal_yse_btn_clicked = () => {
    setModalOpen(false);
  };

  const modal_no_btn_clicked = () => {
    setModalOpen(false);
  };

  return (
    <div className="container">
      <p>
        <button
          className="btn orange"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          setModalOpen(true)
        </button>
      </p>
      <p className="card">
        <button
          id="trigger"
          className="btn"
          onClick={() => {
            ref_hidden_modal_btn.current.click();
          }}
        >
          Trigger "button"
        </button>
      </p>

      <ConfirmDeletion
        header="ConfirmDeletion Component"
        open={modalOpen}
        actions={[
          <button
            onClick={modal_no_btn_clicked}
            className="modal-close waves-green btn-flat"
          >
            No
          </button>,
          <button
            onClick={modal_yse_btn_clicked}
            className="modal-close btn-flat red white-text"
          >
            Yes
          </button>,
        ]}
        // hidden trigger
        trigger={
          <button
            className="hidden-modal-trigger"
            style={{ visibility: "hidden" }}
            ref={(button) => (ref_hidden_modal_btn.current = button)}
            // ref={ref_hidden_modal_btn}
          >
            HIDDEN MODAL BTN
          </button>
        }
      />
    </div>
  );
};

export default TestModal;

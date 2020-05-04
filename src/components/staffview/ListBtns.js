/**
 * @desc - render "action btns" for each task in Staff View
 */

import React, { useState, useRef } from "react";
import LoaderButton from "../utilityFunc/LoaderButton/LoaderButton";
import ConfirmDeletion from "../modals/ConfirmDeletion";
import { Modal, Button } from "react-materialize";
import MsgModal from "../modals/MsgModal";

const ListBtns = ({
  task,
  handleCreateJob,
  tasks, // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
}) => {
  /**
   * ref for ConfirmDeletion Modal's trigger
   */
  const ref_hidden_modal_trigger = useRef(null);
  /**
   * var that toggles Modal On/off, diffenert from trigger
   */
  const [modalOpen, setModalOpen] = useState(false); // hooks for Modal ConfirmDeletion
  const [toDeleteTask, setToDeleteTask] = useState({});

  // ConfirmDeletion Modal's "YES" btn clicked
  const modalYes = () => {
    try {
      if (toDeleteTask) {
        let jobType;
        if (task.type === "pick") {
          jobType = "deletePickTask";
        } else if (task.type === "pack") {
          jobType = "deletePackTask";
        } else {
          jobType = "unknown";
        }

        (async () => {
          let result = await handleCreateJob(
            [toDeleteTask],
            jobType, // deletePickTask / deletePackTask
            "staff_view"
          );
          setModalOpen(false); // close modal
        })();
      }
    } catch (e) {
      console.log("modal err: ", e);
    }
  };
  // ConfirmDeletion Modal's "NO" btn clicked
  const modalNo = () => {
    setModalOpen(false);
  };

  /**
   *  @desc - prohibit "cancel pick" once order is 'packing'
   *  @param task -  current
   *  @param tasks -  the whole "tasks" colleciton
   *  @returns - true/false
   */
  const allowDelete = (task, tasks) => {
    // grab all statuses of the tasks which belong to same order
    let statuses = tasks
      .filter((t) => t.order_docId === task.order_docId)
      .map((t) => t.status);
    // if 'packing' exsits AND type is 'pick', then return FALSE
    if (
      statuses.some((s) => s === "packing" || s === "pack_complete") &&
      task.type === "pick"
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      {/* 
        CANCEL TASK
      */}
      {allowDelete(task, tasks) ? (
        <LoaderButton
          btnFormat="btn-flat red act_btn"
          hasIcon={true}
          icon="cancel"
          iconPos="middle"
          handleClick={() => {
            if (allowDelete(task, tasks)) {
              setToDeleteTask(task); // pass the whole task
              ref_hidden_modal_trigger.current.click(); // trigger the ConfirmDeletion Modal
            } else {
              alert("Order is packing, can't delete pick task now");
            }
          }}
        />
      ) : (
        ""
      )}
      {/* 
        COMPLETE TASK
      */}
      {task.status === "pick_complete" || task.status === "pack_complete" ? (
        // change btn css once task is completed
        <button className="btn-flat act_btn teal_after">
          <i className="material-icons">check_circle</i>
        </button>
      ) : (
        <LoaderButton
          btnFormat={"btn-flat act_btn teal_before"}
          hasIcon={true}
          icon="check"
          iconPos="middle"
          handleClick={() => {
            let newStatus, jobType;
            if (task.type === "pick") {
              newStatus = "pick_complete";
              jobType = "updatePickTask";
            } else if (task.type === "pack") {
              newStatus = "pack_complete";
              jobType = "updatePackTask";
            } else {
              newStatus = "unknown";
              jobType = "unknown";
            }

            handleCreateJob(
              {
                list: [task], // pass in the whole task
                newStatus: newStatus,
              },
              jobType, // COMPLETE using updatePickTask / updatePackTask
              "staff_view"
            );
          }}
        />
      )}
      {/* 
          Modal: ConfirmDeletion
      */}
      <ConfirmDeletion
        header={"Cancel this task?"}
        name={task.buyer + " " + task.status + " task"}
        open={modalOpen}
        actions={[
          <button
            onClick={modalNo}
            className="modal-close waves-green btn-flat"
          >
            No
          </button>,
          <button
            onClick={modalYes}
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
        END: Modal
      */}
    </>
  );
};

export default ListBtns;

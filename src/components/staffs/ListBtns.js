/**
 * @desc - render "action btns" for each task in Staff View
 */

import React, { useState } from "react";
import LoaderButton from "../utilityFunc/LoaderButton/LoaderButton";
import ConfirmDeletion from "../modals/ConfirmDeletion";

const ListBtns = ({
  task,
  handleCreateJob,
  tasks // for ListBtns.js logic: prohibit cxl pick once order is 'packing'
}) => {
  const [modalOpen, setModalOpen] = useState(false); // hooks for Modal ConfirmDeletion
  const [toDeleteTask, setToDeleteTask] = useState({});
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
          await console.log("ListBtn.js ==> ", result);
          setModalOpen(false); // close modal
        })();
      }
    } catch (e) {
      console.log("modal err: ", e);
    }
  };

  const modalNo = () => {
    setModalOpen(false);
  };

  /**
   *  @desc - prohibit cxl pick once order is 'packing'
   *  @param
   *      task: current
   *      tasks: the whole "tasks" colleciton
   *  @returns - true/false
   */
  const allowDelete = (task, tasks) => {
    // grab all statuses of the tasks which belong to same order
    let statuses = tasks
      .filter(t => t.order_docId === task.order_docId)
      .map(t => t.status);
    // if 'packing' exsits AND type is 'pick', then return FALSE
    if (
      statuses.some(s => s === "packing" || s === "pack_complete") &&
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
              setModalOpen(true); // open modal for user confirmation
            } else {
              // logic will not reach here!
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
                newStatus: newStatus
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
        onClickYes={null}
        onClickNo={null}
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
            className="modal-close  btn-flat red white-text"
          >
            Yes
          </button>
        ]}
        options={{
          onCloseEnd: modalNo // reset the local var for trigger next time
        }}
      />
      {/*  
        END: Modal
      */}
    </>
  );
};

export default ListBtns;

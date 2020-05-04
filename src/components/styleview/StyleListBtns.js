import React, { useState } from "react";
import LoaderButton from "../utilityFunc/LoaderButton/LoaderButton";
import MsgModal from "../modals/MsgModal";
import stopLoader from "../modals/stopLoader";

const StyleListBtns = ({ profile, item, handleCreateJob }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [stopLoaderMsg, setStopLoaderMsg] = useState("");
  const modalNo = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="row utilButton_row">
        {/* 
            n/a BUTTON
        */}
        <span className="col s12 m4">
          {item.skuStatus === "mixed" ? (
            ""
          ) : (
            <LoaderButton
              btnName="N/A"
              btnFormat="btn-flat orange utilButton"
              hasIcon={true}
              icon="warning"
              status={item.skuStatus}
              handleClick={() => {
                handleCreateJob(
                  {
                    list: [...item.itemlist],
                    newStatus: "n/a",
                  },
                  "updatePickTask",
                  "style_view"
                );
              }}
            />
          )}
        </span>
        {/* 
            CANCEL BUTTON
        */}
        <span className="col s12 m4">
          <LoaderButton
            btnName="CANCEL"
            btnFormat="btn-flat red utilButton"
            hasIcon={true}
            icon="cancel"
            stop_loader={stopLoaderMsg} // when closing popup, modalNo() will tell Loader.js to stop loader animation
            handleClick={() => {
              let allowAction = false;

              // at least 1 item should belong to user, otherwise abandon "action"
              for (let i of item.itemlist) {
                allowAction = profile.firstName === i.picker ? true : false;
                if (allowAction) {
                  break;
                }
              }
              if (allowAction) {
                // jobAction.js will filterd out the essential 3 fields to send to cloud func
                handleCreateJob(item.itemlist, "deletePickTask", "style_view");
              } else {
                setModalOpen(true);
                // when closing popup, modalNo() will tell Loader.js to stop loader animation
              }

              /**
               *  reset state var, which then notify LoaderButton to stop animation
               */
              stopLoader(setStopLoaderMsg);
            }}
          />
        </span>
      </div>

      <MsgModal
        id="cancel_violation"
        open={modalOpen}
        header="Cancel Violation"
        content="can NOT cancel tasks belong to others !!!"
        actions={[
          <button
            onClick={modalNo}
            className="modal-close teal lighten-1 btn-flat"
          >
            Close
          </button>,
        ]}
      />
    </>
  );
};

export default StyleListBtns;

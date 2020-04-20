import React from "react";
import LoaderButton from "../../../utilityFunc/LoaderButton/LoaderButton";

const BtnPickCxl = ({
  order,
  handleCreateJob,
  profile,
  setmodalOpen_cancelViolation,
}) => {
  return (
    <>
      <LoaderButton
        btnName={"PICK"} // cancel pick
        btnFormat={"btn-flat red act_btn"}
        hasIcon={true}
        icon={"cancel"}
        animationDuration={5000}
        handleClick={() => {
          let allowAction = false;
          // at least 1 item should belong to user, otherwise abandon "action"
          for (let i of order.itemlist) {
            allowAction = profile.firstName === i.picker ? true : false;
            if (allowAction) {
              break;
            }
          }

          if (allowAction) {
            if (order.itemlist) {
              // filter out item whose status is 'picking'
              var picktask_itemlist = order.itemlist
                .filter((f) => f.status === "picking")
                .map((x) => {
                  return {
                    ...x,
                    order_docId: order.id, // add order doc ref
                  };
                });

              // jobAction will filterd out the essential 3 fields to send to cloud func
              handleCreateJob(
                picktask_itemlist,
                "deletePickTask",
                "order_view"
              );
            } // END: if order.itemlist
          } else {
            setmodalOpen_cancelViolation(true); // Pop up Modal: can't delete tasks belong to others!
          } // END: if (allowAction)
        }}
      />
    </>
  );
};

export default BtnPickCxl;

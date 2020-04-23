import React from "react";
import LoaderButton from "../../../utilityFunc/LoaderButton/LoaderButton";

const BtnPackCxl = ({
  order,
  handleCreateJob,
  profile,
  setmodalOpen_cancelViolation,
}) => {
  return (
    <LoaderButton
      btnName={"PACK"} // cancel pack
      btnFormat={"btn-flat red act_btn"}
      hasIcon={true}
      icon={"cancel"}
      animationDuration={"infinite"}
      handleClick={() => {
        let allowAction = false;
        // check user
        for (let i of order.itemlist) {
          allowAction = profile.firstName === i.packer ? true : false;
          if (allowAction) {
            break;
          }
        }
        if (allowAction) {
          if (order.itemlist) {
            // add order_ref
            var list = order.itemlist.map((i) => {
              return { ...i, order_docId: order.id };
            });
            console.log("btnPackXL: ", list);
            handleCreateJob(list, "deletePackTask", "order_view");
          } // END: if (order.itemlist)
        } else {
          setmodalOpen_cancelViolation(true); // Pop up Modal: can't delete tasks belong to others!
        } // END: if (allowAction)
      }}
    />
  );
};

export default BtnPackCxl;

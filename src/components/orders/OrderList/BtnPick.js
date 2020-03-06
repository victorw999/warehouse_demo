import React from "react";
import LoaderButton from "../../utilityFunc/LoaderButton/LoaderButton";

const BtnPick = ({ order, handleCreateJob }) => {
  return (
    <>
      <LoaderButton
        btnName={"PICK"}
        btnFormat={"btn-flat grey lighten-2 teal-text act_btn"}
        animationDuration={"infinite"}
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
                // only add what's needed into task
                sku: i.sku,
                quantity: i.quantity,
                key: i.key,
                oid: order.amzId,
                buyer: order.buyer,
                order_docId: order.id,
                msg: "skip_cloud_trigger" // add to skip trigger
              };
            });

            handleCreateJob(picktask_itemlist, "createPickTask", "order_view");
          }
        }}
      />
    </>
  );
};

export default BtnPick;

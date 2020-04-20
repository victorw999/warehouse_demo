import React from "react";
import LoaderButton from "../../../utilityFunc/LoaderButton/LoaderButton";

const BtnPick = ({ order, handleCreateJob }) => {
  var odr = { ...order };
  return (
    <>
      <LoaderButton
        btnName={"PICK"}
        btnFormat={"btn-flat grey lighten-2 teal-text act_btn"}
        animationDuration={"infinite"}
        handleClick={() => {
          console.log("odr:", odr);
          if (odr.itemlist) {
            // filter out no-status items, so item already have status, cannot be re-tasked
            var picktask_itemlist = odr.itemlist.filter((f) => {
              if (f.status === "" || f.status === undefined) {
                return true;
              } else {
                return false;
              }
            });

            // add additional info to itemlist
            picktask_itemlist = picktask_itemlist.map((i) => {
              return {
                // only add what's needed into task
                sku: i.sku,
                quantity: i.quantity,
                key: i.key,
                oid: odr.amzId,
                buyer: odr.buyer,
                order_docId: odr.id,
                msg: "skip_cloud_trigger", // add to skip trigger
              };
            });

            console.log(
              "=========BtnPick.js: picktask_itemlist: ",
              picktask_itemlist
            );

            var task = {
              itemlist: [
                {
                  sku: "168-TEST",
                  quantity: 12,
                  key: "item+key",
                  buyer: "tester",
                  order_docId: "Ccs0bmfJh6lJTYLn55NX",
                },
              ],
            };
            console.log("=========BtnPick.js: task: ", task);

            handleCreateJob(picktask_itemlist, "createPickTask", "order_view");
          } else {
            console.log("BtnPick.js: list not ready!!!");
          }
        }}
      />
    </>
  );
};

export default BtnPick;

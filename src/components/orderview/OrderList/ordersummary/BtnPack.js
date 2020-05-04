import React from "react";
import LoaderButton from "../../../utilityFunc/LoaderButton/LoaderButton";

const BtnPack = ({ order, handleCreateJob }) => {
  return (
    <LoaderButton
      btnName={"PACK"}
      btnFormat={"btn-flat grey lighten-2 teal-text act_btn"}
      animationDuration={"infinite"}
      handleClick={() => {
        let oid = order.amzId;
        let buyer = order.buyer;
        let order_docId = order.id;

        let job = {
          oid,
          buyer,
          order_docId,
        };

        handleCreateJob([job], "createPackTask", "order_view");
      }}
    />
  );
};

export default BtnPack;

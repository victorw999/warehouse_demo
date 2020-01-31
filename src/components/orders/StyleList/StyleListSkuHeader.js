import React from "react";
import LoaderButton from "../../utilityFunc/LoaderButton/LoaderButton";

const StyleListSkuHeader = ({ item, handleCreatePickTask }) => {
  // insert CSS based on item's status
  function formatStyleHeader(status) {
    if (isEmpty(status)) {
      return " grey darken";
    } else if (status === "picking") {
      return " blue ";
    } else if (status === "pick_complete") {
      return " teal lighten-1 ";
    } else if (status === "n/a" || "mixed") {
      return " orange lighten-1 ";
    }
  }
  function isEmpty(str) {
    if (isUndefined(str)) {
      return false;
    } else {
      return str === null || str.match(/^ *$/) !== null;
    }
  }

  function isUndefined(o) {
    return typeof o === "undefined";
  }

  const convertArrToString = arr => {
    if (arr) {
      var result = "";

      var size = arr.length;

      arr.forEach(i => {
        let separator = size-- > 1 ? ", " : "";
        result += i + separator;
      });
      return result;
    }
    return "";
  };

  return (
    // {/* STYLE HEADER */}
    <div
      className={
        "collapsible-header style_header row valign-wrapper" +
        formatStyleHeader(item.skuStatus)
      }
    >
      {/* QUAUTITY */}
      <span className="col s12 m3">
        <span className="sku_qty btn-floating waves-effect waves-light white teal-text">
          {item && item.sameSkuTotalQty}
        </span>
      </span>
      {/* SKU + BUYER NAME */}
      <span className="col s12 m6">
        <span className="title white-text">{item && item.sku}</span>
        {item
          ? item.itemlist.map(i => {
              return (
                <p key={i.buyer} className="white-text buyer">
                  {i.buyer}
                </p>
              );
            })
          : ""}
      </span>
      {/* PICK BUTTON */}
      <span className="col s12 m3">
        {!isEmpty(item.skuStatus) ? (
          <span className="disablePickBtn">
            {convertArrToString(item.pickers)} {item.skuStatus}
          </span>
        ) : (
          <LoaderButton
            btnName={"PICK"}
            btnFormat={"btn-flat white teal-text pickbtn"}
            handleClick={() => {
              handleCreatePickTask({
                // itemlist be sent to 'picktasks' collection in firestore
                itemlist: item && item.itemlist
              });
            }}
          />
        )}
      </span>
    </div>
    // {/* END: HEADER */}
  );
};

export default StyleListSkuHeader;

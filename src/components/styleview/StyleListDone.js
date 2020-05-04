import React from "react";
import StyleListSkuHeader from "./StyleListSkuHeader";

const StyleListDone = ({ styleGroup }) => {
  return (
    <div className="stylelistdone">
      <ul className="collapsible collapsible_stylelist">
        {!checkOrders(styleGroup)
          ? "NO ORDERS"
          : styleGroup.map(group => {
              if (group.styleno === "") {
                // handle empty "group"
              } else {
                var item_rows = group.members.map(item => {
                  return (
                    <li
                      key={item.sku + item.skuQty}
                      className="collapsible-item"
                    >
                      <StyleListSkuHeader
                        item={item}
                        extraStyle="done_style_row_header"
                      />
                    </li>
                  );
                }); // var item_rows ends here

                var groupheader = (
                  <li className="groupheader left-align " key={group.styleno}>
                    <span className="btn-small grey darken-4 white-text">
                      {group.styleno}
                    </span>
                    <span className="btn-small grey darken-2 white-text">
                      {group.totalQty}
                    </span>
                  </li>
                ); // END: groupheader
              } // END else

              return (
                <React.Fragment key={group.styleno}>
                  {groupheader}
                  {item_rows}
                </React.Fragment>
              );
            })}
      </ul>
    </div>
  );
};

function checkOrders(arr) {
  if (
    arr === "undefined" ||
    arr == null ||
    !Array.isArray(arr) ||
    arr.length < 1
  ) {
    return false;
  } else {
    return true;
  }
}
export default StyleListDone;

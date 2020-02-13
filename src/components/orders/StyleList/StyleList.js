// this file is started using OrderList.js as template

import React, { useState, useEffect } from "react";

import useDataApi from "../useDataApi";
// import { Collapsible, CollapsibleItem } from "react-materialize";
// Import Materialize
import M from "materialize-css";

import LoaderButton from "../../utilityFunc/LoaderButton/LoaderButton";
import StyleListInnerList from "./StyleListInnerList";
import StyleListSkuHeader from "./StyleListSkuHeader";

const StyleList = ({
  orders,
  handleCreatePickTask,
  handleDeletePickTask,
  handleCompletePickTask,
  handleUpdatePickTask,
  handleCreateNotification
}) => {
  // useReducer: custom hook
  const [{ data }, updateData] = useDataApi(orders);

  // use ref to capture the lastest REF: https://overreacted.io/a-complete-guide-to-useeffect/

  // group 'styles' into group
  const [styleGroup, setStyleGroup] = useState([]);

  // materializecss Collapsible Init
  // M.AutoInit(); // the "Collapsible" work w/ just this line, but no 'accordin' option
  let elems = document.querySelectorAll(".collapsible_stylelist");
  let options = {
    accordion: true
  };
  var instances = M.Collapsible.init(elems, options);

  const isSameItemListStatus = (itemlist, status) => {
    let newItemStatus = status;
    if (!status) {
      newItemStatus = ""; // handle if status is undefined
    }
    for (let i of itemlist) {
      if (i.status !== newItemStatus) {
        return false;
      }
    }
    return true;
  };

  // need to verify each picker in the itemlist[]
  const updatePickers = (itemlist, picker) => {
    var pickers = [picker];

    itemlist.forEach(i => {
      if (!pickers.some(p => p === i.picker)) {
        pickers.push(i.picker);
      }
    });
    return [...pickers];
  };

  // initialize array
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // need to check if it's an array because if useDataApi have not fetch the "orders", it'll return the default obj

      let newarray = [];
      for (var order of data) {
        // verify "order.itemlist", or error occurs
        if (order.itemlist) {
          for (let item of order.itemlist) {
            let sameSkuFound = false;
            for (let i = 0; i < newarray.length; i++) {
              if (item.sku === newarray[i].sku) {
                sameSkuFound = true;

                newarray[i] = {
                  ...newarray[i],
                  itemlist: [
                    ...newarray[i].itemlist,
                    {
                      sku: item ? item.sku : "",
                      quantity: item.quantity,
                      key: item.key,
                      oid: order.amzId,
                      buyer: order.buyer,
                      order_docId: order.id,
                      status: item.status ? item.status : "",
                      pickId: item.pickId ? item.pickId : "",
                      picker: item.picker ? item.picker : ""
                    }
                  ],
                  sku: item.sku,
                  sameSkuTotalQty:
                    parseInt(newarray[i].sameSkuTotalQty, 10) +
                    parseInt(item.quantity, 10),
                  skuStatus: isSameItemListStatus(
                    newarray[i].itemlist,
                    item.status
                  )
                    ? item.status === undefined
                      ? ""
                      : item.status
                    : "mixed",
                  pickers:
                    item.picker &&
                    updatePickers(newarray[i].itemlist, item.picker)
                };
              } // end if
            } //end for

            if (!sameSkuFound) {
              newarray.push({
                sku: item ? item.sku : "",
                styleno: item.sku ? item.sku.split("-")[0] : "", // parse the style_number b4 hyphen
                itemlist: item && [
                  {
                    // add a brand new item into list
                    sku: item ? item.sku : "",
                    quantity: item.quantity,
                    key: item.key,
                    oid: order.amzId,
                    buyer: order.buyer,
                    order_docId: order.id,
                    status: item.status ? item.status : "",
                    pickId: item.pickId ? item.pickId : "",
                    picker: item.picker ? item.picker : ""
                  }
                ],
                sameSkuTotalQty: parseInt(item.quantity, 10),
                skuStatus: item.status ? item.status : "",
                pickers: item.picker ? [item.picker] : []
              });
            }
          } // end for
        } //end if
      }

      let newStyleGroup = [
        {
          styleno: newarray[0] ? newarray[0].styleno : "",
          totalQty:
            newarray[0] && parseInt(newarray[0].itemlist[0].quantity, 10),
          members: [newarray[0]]
        }
      ];

      let groupFound = false;

      for (let i = 1; i < newarray.length; i++) {
        for (let group of newStyleGroup) {
          if (group.styleno === newarray[i].styleno) {
            group.totalQty += newarray[i].sameSkuTotalQty;
            group.members.push({
              ...newarray[i]
            });
            groupFound = true;
            break;
          }
        }
        if (!groupFound) {
          newStyleGroup.push({
            styleno: newarray[i].styleno,
            totalQty: newarray[i].sameSkuTotalQty,
            members: [newarray[i]]
          });
        }
        groupFound = false;
      }
      newStyleGroup.sort((a, b) => (a.styleno > b.styleno ? 1 : -1));
      setStyleGroup(newStyleGroup);
    }
  }, [data]);

  // if detecting changes from upstream, update useDataApi
  useEffect(() => {
    updateData(orders); //  update useDataApi w/ the most recent 'orders'
  }, [orders]);

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

  function checkOrders(orders) {
    if (
      typeof orders == "undefined" ||
      orders == null ||
      !Array.isArray(orders) ||
      orders.length < 1
    ) {
      return false;
    } else if (typeof styleGroup[0] !== "undefined") {
      if (isEmpty(styleGroup[0].styleno)) {
        return false;
      } else {
        return true;
      }
    }
  }

  return (
    <div className="stylelist section">
      <h5 className="card-title">Styles</h5>

      {/* how-to-import-javascript-jquery-in-reactjs 
          https://stackoverflow.com/questions/53113921/materializecss-with-reactjs-how-to-import-javascript-jquery-in-reactjs
        */}

      <ul className="collapsible collapsible_stylelist">
        {!checkOrders(orders)
          ? "NO ORDERS "
          : styleGroup.map(group => {
              var item_rows = group.members.map(item => {
                return (
                  <li
                    key={item.sku + item.sameSkuTotalQty}
                    className="collapsible-item"
                  >
                    {/* 
                      collapsible header
                     */}
                    <StyleListSkuHeader
                      item={item}
                      handleCreatePickTask={handleCreatePickTask}
                    />

                    {/* collapsible body */}
                    {!isUndefined(item.skuStatus) &&
                    (item.skuStatus === "picking" ||
                      item.skuStatus === "n/a" ||
                      item.skuStatus === "mixed") ? (
                      <div className="collapsible-body">
                        {item.skuStatus === "n/a" ||
                        item.skuStatus === "picking" ||
                        item.skuStatus === "mixed" ? (
                          <StyleListInnerList
                            innerlist={item.itemlist}
                            itemSku={item.sku}
                            orders={orders}
                            handleUpdatePickTask={handleUpdatePickTask}
                            handleCreatePickTask={handleCreatePickTask}
                            handleCreateNotification={handleCreateNotification}
                          />
                        ) : (
                          ""
                        )}

                        {/* btn section  */}
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
                                handleClick={() => {
                                  item.itemlist.map(i => {
                                    handleUpdatePickTask(i.pickId, "n/a");
                                  });
                                }}
                                status={item.skuStatus}
                              />
                            )}
                          </span>
                          {/* 
                              cancel BUTTON
                          */}
                          <span className="col s12 m4">
                            <LoaderButton
                              btnName="CANCEL"
                              btnFormat="btn-flat red utilButton"
                              hasIcon={true}
                              icon="cancel"
                              handleClick={() => {
                                item.itemlist.forEach(i => {
                                  handleDeletePickTask(i.pickId);
                                });
                              }}
                            />
                          </span>
                          {/* 
                              done BUTTON
                          */}
                          <span className="col s12 m4">
                            <LoaderButton
                              btnName="DONE"
                              btnFormat="btn-flat teal lighten-1 utilButton"
                              hasIcon={true}
                              icon="check_circle"
                              handleClick={() => {
                                handleCompletePickTask(item.pickId);
                              }}
                            />
                          </span>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </li>
                );
              }); // var item_rows ends here

              const groupheader = (
                <li className="groupheader left-align" key={group.styleno}>
                  <span className="btn-small teal darken-4 white-text">
                    {group.styleno}
                  </span>
                  <span className="btn-small teal darken-2 white-text">
                    {group.totalQty}
                  </span>
                </li>
              );

              return (
                <>
                  {groupheader}
                  {item_rows}
                </>
              );
            })}
      </ul>
    </div>
  );
};

export default StyleList;

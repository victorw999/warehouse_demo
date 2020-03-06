// this file is started using OrderList.js as template

import React, { useState, useEffect } from "react";
import useDataApi from "../../utilityFunc/fetchData/useDataApi";
import M from "materialize-css";

import StyleListInnerList from "./StyleListInnerList";
import StyleListSkuHeader from "./StyleListSkuHeader";
import StyleListBtns from "./StyleListBtns";
import StyleListDoneCollap from "./StyleListDoneCollap";

import assortOrders from "./assortOrders"; // functino that classifies 'orders' into style groups
const StyleList = ({
  auth,
  profile,
  orders,
  handleCreatePickTask,
  handleDeletePickTask,
  handleCompletePickTask,
  handleUpdatePickTask,
  handleCreateNotification,
  handleCreateJob
}) => {
  // useReducer: custom hook
  const [{ data }, updateData] = useDataApi(orders);

  // use ref to capture the lastest REF: https://overreacted.io/a-complete-guide-to-useeffect/

  // group 'styles' into group
  const [newStyleGroup, setNewStyleGroup] = useState([]); // incompleted tasks
  const [doneStyleGroup, setDoneStyleGroup] = useState([]); // completed tasks

  // materializecss Collapsible Init
  // M.AutoInit(); // the "Collapsible" work w/ just this line, but no 'accordin' option

  // Collapsible Init: "in-complete style gorup"
  let elems1 = document.querySelectorAll(".collapsible_stylelist");
  var instances1 = M.Collapsible.init(elems1, {
    accordion: true
  });

  // Collapsible Init:  for "completed style group"
  let elems2 = document.querySelectorAll(".collapsible_doneStyles");
  var instances2 = M.Collapsible.init(elems2, {
    accordion: false
  });

  /**
   *  INITIALIZE ARRAY
   *  using the strategy in useDataApi2.js
   *  which is that: utilizing 'didCancel' to be aware of mount/unmount,
   *  use async() to wait the assortOrders() is done
   */
  useEffect(() => {
    let didCancel = false;
    if (data && Array.isArray(data)) {
      const fetchData = async () => {
        await new Promise((resolve, reject) => {
          let result = assortOrders(orders);
          if (result) {
            resolve(result);
          } else {
            reject(" StyleList msg:  not ready ");
          }
        }).then(result => {
          if (!didCancel) {
            setNewStyleGroup(result.new);
            setDoneStyleGroup(result.done);
          }
        });
      };
      fetchData();
    } // END
    /**
     * cleanup func: runs when component unmounts
     */
    return () => {
      didCancel = true;
    };
  }, [data]);

  /**
   * if detecting changes from upstream, update useDataApi
   */
  useEffect(() => {
    updateData(orders);
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
    } else if (typeof newStyleGroup[0] !== "undefined") {
      if (isEmpty(newStyleGroup[0].styleno)) {
        return false;
      } else {
        return true;
      }
    }
  }

  return (
    <div className="stylelist section">
      <h5 className="card-title">Styles</h5>
      <ul className="collapsible collapsible_stylelist">
        {!checkOrders(orders)
          ? "NO ORDERS "
          : newStyleGroup.map(group => {
              var item_rows = group.members.map(item => {
                return (
                  <li key={item.sku + item.skuQty} className="collapsible-item">
                    {/*                      
                        COLLAPSIBLE HEADER
                     */}
                    <StyleListSkuHeader
                      item={item}
                      handleCreatePickTask={handleCreatePickTask}
                      handleCreateJob={handleCreateJob}
                    />
                    {/*                      
                        COLLAPSIBLE BODY
                     */}
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
                            profile={profile}
                            handleCreateJob={handleCreateJob}
                          />
                        ) : (
                          ""
                        )}

                        {/* 
                            BUTTONS SECTION 
                        */}
                        <StyleListBtns
                          auth={auth}
                          profile={profile}
                          handleCreateJob={handleCreateJob}
                          item={item}
                          handleUpdatePickTask={handleUpdatePickTask}
                          handleDeletePickTask={handleDeletePickTask}
                          handleCompletePickTask={handleCompletePickTask}
                        />
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
      {/* DONE STYLE GROUP (COMPLETED) */}
      <h5 className="card-title">Completed</h5>
      <div>
        <StyleListDoneCollap styleGroup={doneStyleGroup} />
      </div>
    </div>
  );
};

export default StyleList;

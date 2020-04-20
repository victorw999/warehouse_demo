import React, { useState, useEffect } from "react";
import useDataApi from "../utilityFunc/fetchData/useDataApi";
import M from "materialize-css";
import StyleListInnerList from "./StyleListInnerList";
import StyleListSkuHeader from "./StyleListSkuHeader";
import StyleListBtns from "./StyleListBtns";
import StyleListDoneCollap from "./StyleListDoneCollap";
import assortOrders from "./assortOrders"; // categorize 'orders' into style groups

const StyleList = ({
  auth,
  profile,
  orders,
  handleCreateNotification,
  handleCreateJob,
}) => {
  // useReducer: custom hook
  const [{ data }, updateData] = useDataApi(orders);

  // group 'styles' into group
  const [newStyleGroup, setNewStyleGroup] = useState([]); // incompleted tasks
  const [doneStyleGroup, setDoneStyleGroup] = useState([]); // completed tasks

  // init collapsible
  useEffect(() => {
    // Collapsible Init: "in-complete style gorup"
    let elems1 = document.querySelectorAll(".collapsible_stylelist");
    var instances1 = M.Collapsible.init(elems1, {
      accordion: false,
    });

    // make sure the collapsible is closed, once itme is picked
    // loop thru each item & close them()
    var items2 = document.querySelectorAll(
      ".collapsible_stylelist .collapsible-item"
    );
    for (var i = 0; i <= items2.length; i++) {
      instances1[0].close(i);
    }

    // console.log(instances1);

    // Collapsible Init:  for "completed style group"
    let elems2 = document.querySelectorAll(".collapsible_doneStyles");
    var instances2 = M.Collapsible.init(elems2, {
      accordion: false,
    });
  });

  /**
   *  INITIALIZE ARRAY
   *  using the strategy in useDataApi.js
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
        }).then((result) => {
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

  const isUndefined = (o) => {
    return typeof o === "undefined";
  };

  const checkOrders = (orders) => {
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
  };

  const showCollapsBody = (itemSkuStatus) => {
    if (!isUndefined(itemSkuStatus)) {
      if (
        itemSkuStatus === "picking" ||
        itemSkuStatus === "n/a" ||
        itemSkuStatus === "mixed"
      ) {
        return true;
      }
    } else {
      return false;
    }
  };

  return (
    <div className="stylelist section">
      <h5 className="card-title diff_views_title">Styles</h5>
      <ul className="collapsible collapsible_stylelist">
        {!checkOrders(orders)
          ? "NO ORDERS "
          : newStyleGroup.map((group) => {
              var item_rows = group.members.map((item) => {
                return (
                  <li key={item.sku + item.skuQty} className="collapsible-item">
                    {/*                      
                        COLLAPSIBLE HEADER
                     */}
                    <StyleListSkuHeader
                      item={item}
                      handleCreateJob={handleCreateJob}
                    />
                    {/*                      
                        COLLAPSIBLE BODY
                     */}
                    {showCollapsBody(item.skuStatus) ? (
                      <div className="collapsible-body">
                        <StyleListInnerList
                          innerlist={item.itemlist}
                          itemSku={item.sku}
                          orders={orders}
                          handleCreateNotification={handleCreateNotification}
                          profile={profile}
                          handleCreateJob={handleCreateJob}
                        />

                        {/* 
                            BUTTONS SECTION 
                        */}
                        <StyleListBtns
                          auth={auth}
                          profile={profile}
                          handleCreateJob={handleCreateJob}
                          item={item}
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
                <React.Fragment key={group.styleno}>
                  {groupheader}
                  {item_rows}
                </React.Fragment>
              );
            })}
      </ul>
      {/* DONE STYLE GROUP (COMPLETED) */}
      <h5 className="card-title diff_views_title">Completed</h5>
      <div>
        <StyleListDoneCollap styleGroup={doneStyleGroup} />
      </div>
    </div>
  );
};

export default StyleList;

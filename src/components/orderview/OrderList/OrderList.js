import React, { useState, useEffect } from "react";
import OrderSummary from "./OrderSummary";
import OrderSummaryDoneCollap from "./OrderSummaryDoneCollap";
import M from "materialize-css";
import getOrderStatus from "./getOrderStatus";

const OrderList = ({ orders, profile, handleCreateJob }) => {
  // group "incomplete orders"
  const [newOrders, setNewOrders] = useState([]);
  // group "completed orders"
  const [doneOrders, setDoneOrders] = useState([]);

  /**
   *
   * Categorize "orders" into "newOrders" & "doneOrders"
   * using the strategy in useDataApi2.js
   * which is that: utilizing 'didCancel' to be aware of mount/unmount,
   * use async() to wait the looping is done
   * maybe a little overkill
   */
  useEffect(() => {
    let didCancel = false;
    if (orders && Array.isArray(orders)) {
      const fetchData = async () => {
        await new Promise((resolve, reject) => {
          var obj = {
            done: [],
            newOdr: [],
          };
          // looping order
          orders.forEach((o) => {
            if (!getOrderStatus(o)) {
              // sometimes, getOrderStatus(o) returns 'undefined'
              obj["newOdr"] = [...obj.newOdr, o];
            } else if (getOrderStatus(o).includes("pack_complete")) {
              obj["done"] = [...obj.done, o];
            } else {
              obj["newOdr"] = [...obj.newOdr, o];
            }
          }); // END: looping orders

          if (obj) {
            resolve(obj);
          } else {
            reject(" OrderList msg:  not ready ");
          }
        })
          .then((result) => {
            if (!didCancel) {
              // console.log(result);
              // only set component state when mounting
              setNewOrders([...result.newOdr]);
              setDoneOrders([...result.done]);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }; // END: fetchData()
      fetchData();
    } // // END:  if (orders && Array.isArray(orders))
    /**
     * cleanup func: runs when component unmounts
     */
    return () => {
      didCancel = true;
      setNewOrders([]); // add to stop the breaking err: refer to Buglog: filed to execute Bug200422-B
      setDoneOrders([]); //
    };
  }, [orders]);

  /**
   * @desc - init OrderSummaryDone.js 's collapsible
   */
  useEffect(() => {
    // grab collapsible elements by 'className'
    var elems = document.querySelectorAll(".collapsible_doneOrders");
    var instances = M.Collapsible.init(elems, {
      accordion: false, // begin with closed accordin
    });
  }, [orders]);

  return (
    <div className="section orderlist">
      <h5 className="card-title diff_views_title">Orders</h5>
      <div className="orderlist_table">
        <div className="orderlist_body">
          {newOrders &&
            newOrders.map((order) => {
              return (
                <OrderSummary
                  key={order.id + order.amzId}
                  // if mod key with genTimeStamp, it'll somehow destroy the downstream's loaderbtn's animation
                  order={order}
                  orderStatus={getOrderStatus(order)}
                  profile={profile}
                  handleCreateJob={handleCreateJob}
                />
              );
            })}
        </div>
      </div>

      {/* 
          COMPLETED ORDERS
       */}
      <h5 className="card-title diff_views_title">Completed</h5>
      <OrderSummaryDoneCollap
        doneOrders={doneOrders}
        getOrderStatus={getOrderStatus}
        profile={profile}
        handleCreateJob={handleCreateJob}
      />
    </div>
  );
};

export default OrderList;

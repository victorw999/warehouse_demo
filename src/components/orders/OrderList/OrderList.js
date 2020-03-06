import React, { useState, useEffect } from "react";
import OrderSummary from "./OrderSummary";
import OrderSummaryDoneCollap from "./OrderSummaryDoneCollap";
import M from "materialize-css";

const OrderList = ({ orders, profile, handleCreateJob }) => {
  // group "incomplete orders"
  const [newOrders, setNewOrders] = useState([]);
  // group "completed orders"
  const [doneOrders, setDoneOrders] = useState([]);

  /**
   *
   * Categorize "orders" into "newOrders" & "doneOrders"
   * using the strategy in useDataApi2.js
   * which is that: utilizing 'didCancel' to be aware of mount/unmount, use async() to wait the looping is done
   * maybe a little overkill
   */
  useEffect(() => {
    let didCancel = false;
    if (orders && Array.isArray(orders)) {
      const fetchData = async () => {
        try {
          await new Promise((resolve, reject) => {
            var obj = {
              done: [],
              new: []
            };
            // looping order
            orders.forEach(o => {
              if (getOrderStatus(o).includes("pack_complete")) {
                obj["done"] = [...obj.done, o];
              } else {
                obj["new"] = [...obj.new, o];
              }
            }); // complete looping orders

            if (obj) {
              resolve(obj);
            } else {
              reject(" OrderList msg:  not ready ");
            }
          })
            .then(result => {
              if (!didCancel) {
                // only set component state when mounting
                setNewOrders([...result.new]);
                setDoneOrders([...result.done]);
              }
            })
            .catch(e => {
              console.error(e);
            });
        } catch (error) {
          if (!didCancel) {
            console.log("failure");
          }
          console.error("useDataApi2.js msg: fetch data error: ", error);
        }
      };
      fetchData();
    } // // END:  if (orders && Array.isArray(orders))
    /**
     * cleanup func: runs when component unmounts
     */
    return () => {
      didCancel = true;
    };
  }, [orders]);

  /**
   * @desc - update "orderStatus", reresents this order's overall status
   *
   *   "orderStatus" outcomes:
   *     picking, pick_complete, packing, pack_complete, mixed, n/a
   */
  const getOrderStatus = order => {
    let itemlist = order.itemlist;
    if (itemlist && itemlist.length > 0) {
      var statuses = [itemlist[0].status]; // push 1st status into "statuses" array

      // generates array contains all unique 'status' appeared in itemlist
      itemlist.forEach(i => {
        if (!statuses.some(s => s === i.status)) {
          statuses.push(i.status);
        }
      });

      // remove empty status frm array
      statuses.filter(x => x !== "");

      // set "orderStatus"
      if (statuses.length > 1) {
        // if all items are either picking/pick_complete
        if (statuses.every(i => i === "picking" || i === "pick_complete")) {
          return "all_in_pick_stage";
        }
        // if all items are either packing/pack_complete
        if (statuses.every(i => i === "packing" || i === "pack_complete")) {
          return "all_in_pack_stage";
        }
        return "mixed";
      } else if (statuses.length === 1) {
        return statuses[0];
      }

      // if "status" field is manually deleted
      if (itemlist[0].status === undefined) {
        return "";
      }
    } else {
      return ""; // order.itemlist is not ready
    }
  };

  /**
   * @desc - init OrderSummaryDone.js 's collapsible
   */
  useEffect(() => {
    // grab collapsible elements by 'className'
    var elems = document.querySelectorAll(".collapsible_doneOrders");
    var instances = M.Collapsible.init(elems, {
      accordion: false // begin with closed accordin
    });
  }, [orders]);

  return (
    <div className="project-list section">
      <h5 className="card-title">Orders</h5>
      <table className="responsive-table">
        <thead>
          <tr className="hide-on-small-only">
            <th>Order Details</th>
            <th>Itemlist</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newOrders &&
            newOrders.map(order => {
              return (
                <OrderSummary
                  key={order.id}
                  order={order}
                  orderStatus={getOrderStatus(order)}
                  profile={profile}
                  handleCreateJob={handleCreateJob}
                />
              );
            })}
        </tbody>
      </table>

      {/* 
          COMPLETED ORDERS
       */}
      <h5 className="card-title">Completed</h5>
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

// this file is started using OrderList.js as template

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import OrderSummary from "./OrderSummary";
// import { Link } from "react-router-dom";

// import { connect } from "react-redux";
// import { firestoreConnect } from "react-redux-firebase";
// import { compose } from "redux";
import useDataApi from "./useDataApi";

const StyleList = ({ orders }) => {
  // useReducer: custom hook
  const [{ data, isLoading, isError }, updateData] = useDataApi(orders);

  // use ref to capture the lastest REF: https://overreacted.io/a-complete-guide-to-useeffect/

  // array to contain
  const [styles, setStyles] = useState([]); // this is just orders array

  // initialize array
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // need to check if it's an array because if useDataApi have not fetch the "orders", it'll return the default obj

      let newarray = [];
      for (var order of data) {
        for (var item of order.itemlist) {
          newarray.push({
            sku: item.sku,
            qty: item.quantity,
            oid: order.amzId
          });
        }
      }
      setStyles(newarray);
    }
  }, [data]);

  // update array when orders being modified
  useLayoutEffect(() => {
    // console.log("detecting orders has been changed....");
    if (data && Array.isArray(data)) {
      // need to check if it's an array because if useDataApi have not fetch the "orders", it'll return the default obj

      let newarray = [];
      for (var order of data) {
        for (var item of order.itemlist) {
          newarray.push({
            sku: item.sku,
            qty: item.quantity,
            oid: order.amzId
          });
        }
      }
      setStyles(newarray);
    }
  }, [orders]);
  return (
    <div className="project-list section">
      <h5 className="card-title">By Styles</h5>
      <ul>
        {styles &&
          styles.map(style => {
            return (
              <li>
                {style.sku} {" - "} {style.qty} {" - "} {style.oid}
              </li>
            );
          })}
      </ul>
      {/* <table className="responsive-table">
        <thead>
          <tr className="hide-on-small-only">
            <th>Order Details</th>
            <th>Itemlist</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map(order => {
              return <OrderSummary order={order} key={order.id} />;
            })}
        </tbody>
      </table> */}
    </div>
  );
};

export default StyleList;

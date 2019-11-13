// this file is started using OrderList.js as template

import React, { useState, useEffect } from "react";
// import OrderSummary from "./OrderSummary";
// import { Link } from "react-router-dom";

// import { connect } from "react-redux";
// import { firestoreConnect } from "react-redux-firebase";
// import { compose } from "redux";
import useDataApi from "./useDataApi";

const StyleList = ({ orders }) => {
  // useReducer: custom hook
  const [{ data }, updateData] = useDataApi(orders);

  // use ref to capture the lastest REF: https://overreacted.io/a-complete-guide-to-useeffect/

  // array to contain
  const [styles, setStyles] = useState([]); // this is just orders array

  // initialize array
  useEffect(() => {
    console.log(Math.floor(Date.now() / 1000), " 'data' has been changed...");
    if (data && Array.isArray(data)) {
      // need to check if it's an array because if useDataApi have not fetch the "orders", it'll return the default obj

      updateData(data); // force useDataApi to update its content w/ the most recent 'orders'

      let newarray = [];
      for (var order of data) {
        for (var item of order.itemlist) {
          newarray.push({
            sku: item.sku,
            qty: item.quantity,
            oid: order.amzId,
            key: item.key
          });
        }
      }
      setStyles(newarray);
    }
  }, [data]);

  return (
    <div className="project-list section">
      <h5 className="card-title">By Styles</h5>
      <ul>
        {styles &&
          styles.map(style => {
            return (
              <li key={style.key}>
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

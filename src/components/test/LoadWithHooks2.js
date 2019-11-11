/**
 * testing loading initial data from firestore
 * using hooks
 * such as useEffect, useState
 *
 * * Tutorial I was following: https://www.robinwieruch.de/react-hooks-fetch-data
 *    I couldn't load firestore data into local componenet state vars.
 *    Therefore, I use 'initFlag' to represent init process:
 *    Basically useEffect check if 'order' is null in every render,
 *    if !null, then it must been initialized, then set 'initFlag' true
 *    it null, then try to load w/ 'async/await' in every render
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

const LoadWithHooks2 = props => {
  const { order } = props;

  const [data, setData] = useState({}); // local component's state variable
  const [initFlag, setInitFlag] = useState(false); // signals if data successfuly loaded into state var 'data'

  useEffect(() => {
    if (order != null) {
      setInitFlag(true);
      console.log(Date.now(), "initFlag has been set to TRUE");
    }
    if (!initFlag) {
      asyncCall(); // only fetch data when 'initFlag' has not been set
    }
  }, [order]); // put 'order' in 2nd args to to check if "firestore->props->order" is complete

  const resolveAfterLoaded = () => {
    return new Promise(resolve => {
      if (order) {
        resolve(order);
      }
    });
  };

  const asyncCall = async () => {
    console.log(Date.now(), "calling async");
    var result = await resolveAfterLoaded();
    console.log(Date.now(), "result: ", result);
    setData(result);
  };

  const changeSomething = () => {
    setData({
      ...data,
      shipZip: parseInt(data.shipZip) + 1
    });
  };

  if (order) {
    return (
      <div className="container" style={{ background: "white" }}>
        <button
          className="pink"
          type="button"
          onClick={() => {
            changeSomething();
          }}
        >
          + Click here to change Local Component's State's shipZip
        </button>
        <div>
          <h5>Props value:</h5>
          {JSON.stringify(order.orderDate.toDate())} <br />
          {order.amzId}
          <br />
          {order.buyer} {order.shipZip}
          <br />
          <h5>Conponent's State:</h5>
          <p>
            amzId : {data ? data.amzId : "loading..."} <br />
            shipZip : {data ? data.shipZip : "loading..."}
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container center">
        <p>Loading ...</p>
      </div>
    );
  }
};

const mapStateToProps = state => {
  const id = "DKA77MC2w3g0ACEy530g";
  const orders = state.firestore.data.orders;
  const order = orders ? orders[id] : null;

  return {
    order: order,
    orderDocId: id
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "orders"
    }
  ])
)(LoadWithHooks2);

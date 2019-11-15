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

  // array contains all items frm each order
  const [styles, setStyles] = useState([]); // this is just orders array

  // group 'styles' into group
  const [styleGroup, setStyleGroup] = useState([]);

  // initialize array
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // need to check if it's an array because if useDataApi have not fetch the "orders", it'll return the default obj

      let newarray = [];
      for (var order of data) {
        for (let item of order.itemlist) {
          newarray.push({
            sku: item.sku,
            styleno: item.sku.split("-")[0], // parse the style_number b4 hyphen
            qty: item.quantity,
            key: item.key,
            oid: order.amzId,
            buyer: order.buyer
          });
        }
      }

      let newStyleGroup = [
        {
          styleno: newarray[0].styleno,
          totalQty: newarray[0].qty,
          members: [newarray[0]]
        }
      ];

      let groupFound = false;

      for (let i = 1; i < newarray.length; i++) {
        for (let group of newStyleGroup) {
          if (group.styleno === newarray[i].styleno) {
            group.totalQty += parseInt(newarray[i].qty, 10);
            group.members.push(newarray[i]);
            groupFound = true;
            break;
          }
        }
        if (!groupFound) {
          newStyleGroup.push({
            styleno: newarray[i].styleno,
            totalQty: newarray[i].qty,
            members: [newarray[i]]
          });
        }
        groupFound = false;
      }
      newStyleGroup.sort((a, b) => (a.styleno > b.styleno ? 1 : -1));
      // console.log(newStyleGroup);
      setStyleGroup(newStyleGroup);
      setStyles(newarray);
    }
  }, [data]);

  // if detecting changes from upstream, update useDataApi
  useEffect(() => {
    // console.log("upstream props's orders has changed...");
    updateData(orders); //  update useDataApi w/ the most recent 'orders'
  }, [orders]);

  const css_class_li =
    "collection-item avatar row valign-wrapper teal lighten-1";
  return (
    <div className="project-list section row">
      <div className="col s12 m12 l8">
        <h5 className="card-title">Styles</h5>
        <ul className="collection">
          {styleGroup &&
            styleGroup.map(group => {
              //  var group_title = return <p>{group.styleno}</p>
              var item_rows = group.members.map(item => {
                return (
                  <li key={item.key} className={css_class_li}>
                    {/* "valign-wrapper" vertically aligns the row, 
                 but disabed the column flexiblility when screensize decrease */}
                    <span className="col s1 m1">
                      <span className="btn-floating waves-effect waves-light white teal-text">
                        {item.qty}
                      </span>
                    </span>
                    <span className="col s6 m6">
                      <span
                        className="title white-text"
                        style={{ fontSize: "1.5rem", fontWeight: "600" }}
                      >
                        {item.sku}
                      </span>
                      <p className="white-text">{item.buyer}</p>
                    </span>

                    <span className="col s12 m2">
                      <button className="btn waves-effect waves-light teal lighten-5 teal-text">
                        PICK
                      </button>
                    </span>
                  </li>
                );
              });

              return (
                <div>
                  <li className="left-align">
                    <span
                      className="btn-small teal darken-4 white-text"
                      style={{ borderRadius: "0" }}
                    >
                      {group.styleno}
                    </span>
                    <span
                      className="btn-small teal darken-2 white-text"
                      style={{ borderRadius: "0" }}
                    >
                      {group.totalQty}
                    </span>
                  </li>
                  {item_rows}
                </div>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default StyleList;

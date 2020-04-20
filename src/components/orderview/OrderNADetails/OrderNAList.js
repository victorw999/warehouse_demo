/**
 * use ItemList.js & StyleListInnerList.js as template
 */

import React, { useState, useEffect } from "react";

const OrderNAList = ({ itemlist, updateList, handleChange }) => {
  /**
   * local state var "payload":
   * holding the itemlists' "values & changes & missing"
   */
  const [payload, setPayload] = useState({
    itemStatus: [] // an exact copy of itemlist, keep it the same shape use in StyleListInnerList.js
  });

  // init payload array
  useEffect(() => {
    setPayload({
      ...payload,
      itemStatus: [...itemlist]
    });
  }, [itemlist]);

  // update upstream's payload changed
  useEffect(() => {
    handleChange(payload.itemStatus);
  }, [payload]);

  // Format button based on "status"
  const formatBtn_cxl = idx => {
    if (!payload.itemStatus) {
      return "grey lighten-3";
    } else if (!payload.itemStatus[idx]) {
      return "grey lighten-3";
    } else if (payload.itemStatus[idx].status === "n/a") {
      return "red";
    } else {
      return "grey lighten-3";
    }
  };
  // Format button based on "status"
  const formatBtn_check = idx => {
    if (!payload.itemStatus) {
      return "grey lighten-2";
    } else if (!payload.itemStatus[idx]) {
      return "grey lighten-2";
    } else if (
      payload.itemStatus[idx].status === "pick_complete" ||
      payload.itemStatus[idx].status === "picking"
    ) {
      return "teal lighten-1";
    } else {
      return "grey lighten-2";
    }
  };

  return (
    <div className="container">
      <ul className="collection with-header">
        {itemlist.map((i, idx) => {
          return (
            <React.Fragment key={getTimeStamp()}>
              <li
                key={idx}
                index={idx}
                className="collection-item row valign-wrapper na_item"
              >
                {/* ITEM INFO */}
                <div className="col s3">
                  <span className="sku">{i.sku}</span>
                </div>
                <div className="col s2">
                  <span className="qty badge teal bold white-text">
                    {i.quantity}
                  </span>
                </div>
                <div className="col s2">
                  <span className="status">{i.status}</span>
                </div>
                {/* 
                    BTN GROUP
                */}
                <span className="col s12 m4 na_btn">
                  {/* 
                      Button: check 
                  */}
                  <button
                    className={"btn-floating " + formatBtn_check(idx)}
                    onClick={e => {
                      e.preventDefault();
                      let arr = [...payload.itemStatus];
                      let exist = false;
                      // change status to 'picking'
                      for (let j = 0; j < arr.length; j++) {
                        if (arr[j].key === i.key) {
                          arr[j].status = "picking";
                          setPayload({
                            ...payload,
                            itemStatus: [...arr]
                          });
                          exist = true;
                          break;
                        }
                      }
                      // change status frm 'empty' to 'picking'
                      if (!exist) {
                        setPayload({
                          ...payload,
                          itemStatus: [
                            ...payload.itemStatus,
                            {
                              ...i,
                              status: "picking"
                            }
                          ]
                        });
                      }
                    }}
                  >
                    <i className="material-icons">check</i>
                  </button>
                  {/* 
                      Button: cancel 
                  */}
                  <button
                    className={"btn-floating " + formatBtn_cxl(idx)}
                    onClick={e => {
                      e.preventDefault();
                      let arr = [...payload.itemStatus];
                      let exist = false;
                      for (let j = 0; j < arr.length; j++) {
                        if (arr[j].key === i.key) {
                          arr[j].status = "n/a";
                          setPayload({
                            ...payload,
                            itemStatus: [...arr]
                          });
                          exist = true;
                          break;
                        }
                      }

                      if (!exist) {
                        setPayload({
                          ...payload,
                          itemStatus: [
                            ...payload.itemStatus,
                            {
                              ...i,
                              status: "n/a"
                            }
                          ]
                        });
                      }
                    }}
                  >
                    <i className="material-icons">clear</i>
                  </button>
                </span>
                {/* FORM */}
                {/* 
                  <div className="col s3">
                    INPUT FORM: for # of missing
                    feature to implement in next release                
                  </div>
                */}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};
/**
 * gen random key
 */
const getTimeStamp = () => {
  let rand = Math.floor(Math.random() * Math.floor(100));
  return new Date().getTime() + rand; //generate an unique key
};
export default OrderNAList;

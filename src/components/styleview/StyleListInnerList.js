/**
 *   when N/A btn is clicked,
 *   first 'mark' each individual order's status to
 *     'complete' with check btn
 *     'incomplete' with 'X' btn
 *
 *   then enter the # that's still missing, click sumbit
 *
 *  */

import React, { useState, useEffect } from "react";
import MsgModal from "../modals/MsgModal";

const StyleListInnerList = ({
  innerlist,
  itemSku,
  orders,
  handleCreateNotification,
  profile,
  handleCreateJob,
}) => {
  var value = 0;

  /**
   * local var "internalValue"
   * holds missing input
   */
  const [internalValue, setInternalValue] = useState(0);

  /**
   * local var "payload":
   * holding the itemlists' "values & changes & missing"
   */
  const [payload, setPayload] = useState({
    itemStatus: [], // an exact copy of itemlist
    missing: 0,
  });

  // init payload array
  useEffect(() => {
    setPayload({
      ...payload,
      itemStatus: [...innerlist],
    });
  }, [innerlist]);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const [modalOpen, setModalOpen] = useState(false);
  const promptSubmitted = () => {
    setModalOpen(true);
  };

  const modalNo = () => {
    setModalOpen(false);
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    setPayload({
      ...payload,
      missing: newValue,
    });
  };
  // Format button based on "status"
  const formatBtn_cxl = (idx) => {
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
  const formatBtn_check = (idx) => {
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

  const formatBtn_submit = () => {
    if (checkFormComplete()) {
      return "teal lighten-1";
    } else {
      return "grey lighten-2";
    }
  };
  const checkFormComplete = () => {
    for (let i of payload.itemStatus) {
      if (!i.status || i.status.length === 0) {
        return false;
      }
    }
    return true;
  };
  const submitChanges = (payload) => {
    console.log("innerlist: payload: ", payload);

    // mixedPickTask
    let mixed = payload.itemStatus.map((i) => {
      if (i.pickId === "") {
        // scenario: StyleList side picked it, and then StaffList side cancel the picktask, thus here create a new task
        return {
          ...i,
          item_jobType: "createPickTask",
        };
      } else {
        return {
          ...i,
          item_jobType: "updatePickTask",
        };
      }
    });

    handleCreateJob(
      {
        list: [...mixed],
        missing: payload.missing,
        innerlistUpdate: true,
      },
      "mixedPickTask",
      "style_view"
    );
  };

  return (
    <>
      <div className="orange lighten-4 StyleListInnerList">
        <ul>
          {innerlist && innerlist.length > 0 && itemSku
            ? innerlist.map((i, idx) => {
                return (
                  <li key={i.key} className="row valign-wrapper">
                    {/* 
                        BUYER
                    */}
                    <div className="col s12 m4 name_status">
                      <span className="name">{i.buyer}</span>
                      <span className="status badge white">
                        {i.picker} {i.status === "" ? "" : i.status}
                      </span>
                    </div>
                    {/* 
                        SKU and QUANTITY
                    */}
                    <span className="col s12 m4">
                      {itemSku} - {i.quantity}
                    </span>
                    {/* 
                        BTN Groups
                    */}
                    <span className="col s12 m4 na_btn">
                      {/* 
                          Button: check 
                      */}
                      <button
                        className={"btn-floating " + formatBtn_check(idx)}
                        onClick={() => {
                          let arr = [...payload.itemStatus];
                          let exist = false;
                          // change status to 'picking'
                          for (let j = 0; j < arr.length; j++) {
                            if (arr[j].key === i.key) {
                              arr[j].status = "picking";
                              setPayload({
                                ...payload,
                                itemStatus: [...arr],
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
                                  status: "picking",
                                },
                              ],
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
                        onClick={() => {
                          let arr = [...payload.itemStatus];
                          let exist = false;
                          for (let j = 0; j < arr.length; j++) {
                            if (arr[j].key === i.key) {
                              arr[j].status = "n/a";
                              setPayload({
                                ...payload,
                                itemStatus: [...arr],
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
                                  status: "n/a",
                                },
                              ],
                            });
                          }
                        }}
                      >
                        <i className="material-icons">clear</i>
                      </button>
                    </span>
                  </li>
                );
              })
            : "no data"}
        </ul>

        <div className="missing">
          <div className="input-field">
            <input
              type="text"
              id="missing"
              value={internalValue}
              onChange={handleChange}
            />
            <label htmlFor="amzId">How many missing? </label>
          </div>
          <div className="input-field">
            <button
              className={"btn " + formatBtn_submit()}
              onClick={(e) => {
                e.preventDefault();

                setPayload({
                  ...payload,
                  missing: parseInt(internalValue, 10),
                });

                // send notification
                if (payload.missing !== "") {
                  handleCreateNotification(
                    `${payload.itemStatus[0].sku} [n/a] ${payload.missing}`
                  );
                }

                // submit
                submitChanges(payload);

                // prompt user that inventory issue submitted
                promptSubmitted();
              }}
            >
              submit
            </button>
          </div>
        </div>
      </div>

      <MsgModal
        id="issue_submitted"
        open={modalOpen}
        header="Issue Submitted"
        content="Issue Submitted"
        actions={[
          <button
            onClick={modalNo}
            className="modal-close teal lighten-1 btn-flat"
          >
            Close
          </button>,
        ]}
      />
    </>
  );
};

export default StyleListInnerList;

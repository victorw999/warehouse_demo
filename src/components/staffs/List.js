import React, { useState } from "react";
import LoaderButton from "../utilityFunc/LoaderButton/LoaderButton";
import ConfirmDeletion from "../orders/Modals/ConfirmDeletion";

export default function List({
  users,
  handleCompletePickTask,
  handleDeletePickTask
}) {
  const [modalOpen, setModalOpen] = useState(false); // hooks for Modal ConfirmDeletion
  const [toDeleteId, setToDeleteId] = useState(""); // hold the 'to be deleted' task id for Modal
  const modalYes = () => {
    try {
      if (toDeleteId && toDeleteId !== "") {
        handleDeletePickTask(toDeleteId);
        setModalOpen(false); // close modal
      }
    } catch (e) {
      console.log("modal err: ", e);
    }
  };

  const modalNo = () => {
    setModalOpen(false);
  };

  const isEmpty = obj => {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    if (obj === undefined) return true;
    if (obj === null) return true;
    if (obj.length === 0) return true;

    if (typeof obj != "object") return true;

    if (obj.length > 0) return false;

    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  };
  const statusColor = status => {
    if (status === "picking") {
      return "blue";
    } else if (status === "pick_complete") {
      return " teal lighten-1";
    } else if (status === "n/a") {
      return " orange lighten-1";
    } else {
      return " black";
    }
  };
  return (
    <ul className="collapsible collapsible_stafflist">
      {!isEmpty(users)
        ? Object.keys(users).map(key => {
            /**
             *  this user's tasks
             */
            const user_tasks = users[key].map(t => {
              return (
                <tr className="staff_task" key={t.key}>
                  <td>
                    {t.authorFirstName} <br />
                    <span
                      className={"badge white-text " + statusColor(t.status)}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.buyer}
                    <br />
                    {t.oid}
                  </td>
                  <td>{t.sku}</td>
                  <td>[{t.quantity}]</td>
                  <td className="actions_section">
                    {/* 
                      Cancel Task Button
                    */}
                    {modalOpen ? (
                      // include this btn to resolve spin btn issue
                      <button className="btn-flat act_btn white">
                        <i className="material-icons">cancel</i>
                      </button>
                    ) : (
                      <LoaderButton
                        btnFormat="btn-flat red act_btn"
                        hasIcon={true}
                        icon="cancel"
                        iconPos="middle"
                        handleClick={() => {
                          setModalOpen(true); // open modal for user confirmation
                          setToDeleteId(t.id); // pass 'to be deleted' task id to state var
                        }}
                      />
                    )}
                    {/* 
                      Complete Task Button
                    */}
                    {t.status === "pick_complete" ? (
                      <button className="btn-flat act_btn teal_after">
                        <i className="material-icons">check_circle</i>
                      </button>
                    ) : (
                      <LoaderButton
                        btnFormat={"btn-flat act_btn teal_before "}
                        hasIcon={true}
                        icon="check"
                        iconPos="middle"
                        handleClick={() => {
                          console.log("t.id = ", t.id);
                          handleCompletePickTask(t.id);
                        }}
                      />
                    )}
                  </td>
                  {/* 
                      Cancel Modal
                   */}
                  <ConfirmDeletion
                    onClickYes={null}
                    onClickNo={null}
                    name={t.buyer + " " + t.status + " task"}
                    open={modalOpen}
                    actions={[
                      <button
                        onClick={modalNo}
                        className="modal-close waves-effect waves-green btn-flat"
                      >
                        No
                      </button>,
                      <button
                        onClick={modalYes}
                        className="modal-close waves-effect waves-light btn-flat red white-text"
                      >
                        Yes
                      </button>
                    ]}
                  />
                </tr>
              );
            });

            /**
             *  user header: get 1st item from user's array, assuming users[key] size is >0
             */
            const user_collaps = (() => {
              const userName = users[key][0].authorFirstName;
              return (
                <li className="collapsible-item" key={key}>
                  <div className="collapsible-header staff_header teal lighten-2 white-text">
                    <h4 className="name">{userName}</h4>
                  </div>
                  {/* collapsible body */}
                  <div className="collapsible-body">
                    <table className="responsive-table">
                      <tbody>{user_tasks}</tbody>
                    </table>
                  </div>
                </li>
              );
            })();

            return <>{user_collaps}</>;
          })
        : "NO DATA (List.js)"}
    </ul>
  );
}

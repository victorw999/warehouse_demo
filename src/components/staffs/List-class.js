import React from "react";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.isEmpty = this.isEmpty.bind(this);
  }

  isEmpty = obj => {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    if (obj === undefined) return true;
    if (obj === null) return true;
    if (obj.length === 0) return true;
    if (obj.length > 0) return false;
    if (typeof obj != "object") return true;
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  };

  render() {
    return (
      <ul className="collapsible collapsible_stafflist">
        {!this.isEmpty(this.props.users)
          ? Object.keys(this.props.users).map(key => {
              /**
               *  this user's tasks
               */
              const users = this.props.users;
              const user_tasks = users[key].map(t => {
                return (
                  <tr className="staff_task" key={t.key}>
                    <td>
                      {t.authorFirstName} <br />
                      <span className="badge blue white-text">pick</span>
                    </td>
                    <td>
                      {t.buyer} <br />
                      {t.oid}
                    </td>
                    <td>{t.sku}</td>
                    <td>[{t.qty}]</td>
                    <td className="actions_section">
                      <button className="btn-flat teal lighten-1 act_btn">
                        <i className="material-icons white-text">
                          check_circle
                        </i>
                      </button>
                      <button className="btn-flat red act_btn">
                        <i className="material-icons white-text">cancel</i>
                      </button>
                    </td>
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
}

export default List;

/** component for edit roles */
import React, { useState, useEffect } from "react";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import LoaderButton from "../utilityFunc/LoaderButton/LoaderButton";
import useDataApi from "../utilityFunc/fetchData/useDataApi";
import { Redirect } from "react-router-dom";
import { updateUsers } from "../../store/actions/userActions";

const Users = (props) => {
  // updateOrder() is passed in as props frm mapDispatchToProps
  const { auth, users, updateUsers } = props;

  // useReducer: custom hook
  const [{ data }, updateData] = useDataApi(users);

  // local var: holds the "changes" that made
  const [payload, setPayload] = useState([]);

  // init payload
  useEffect(() => {
    if (data) {
      setPayload({ ...data });
    }
  }, [data]);

  /**
   * if detecting changes from upstream, update useDataApi
   */
  useEffect(() => {
    updateData(users);
  }, [users]);

  const handleChange = (e) => {
    updateData({
      ...data,
      [e.target.dataset.uid]: {
        ...data[e.target.dataset.uid],
        [e.target.id]: e.target.value,
      },
    });
    console.log(e.target.id, e.target.value, e.target.dataset.uid);
  };

  // router guard
  if (!auth.uid) return <Redirect to="/signin" />;
  if (data) {
    return (
      <div className="container">
        <form className="white">
          <div className=" ">
            <ul className="  ">
              {Object.keys(data).map((u) => {
                return !data[u] ? (
                  ""
                ) : (
                  <li key={"test" + u} className="row">
                    <div className="col s2">
                      <input
                        type="text"
                        id="firstName"
                        data-uid={u}
                        onChange={handleChange}
                        value={data[u].firstName && data[u].firstName}
                      />
                    </div>
                    <div className="col s2">
                      <input
                        type="text"
                        id="lastName"
                        data-uid={u}
                        onChange={handleChange}
                        value={data[u].lastName && data[u].lastName}
                      />
                    </div>
                    <div className="col s2">
                      <input
                        type="text"
                        id="role"
                        className="btn disabled"
                        /** hidden on demo_warehouse */
                        data-uid={u}
                        onChange={handleChange}
                        value={data[u].role && data[u].role}
                      />
                    </div>
                    <div className="col s2">
                      {/* userid hidden on demo_warehouse */}
                      {/* <span className="">{u}</span> */}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 
            Submit Button
           */}
          <div className="input-field">
            <LoaderButton
              btnName={"update"}
              // btnFormat={"btn pink lighten-1"}
              /** hidden on demo_warehouse */
              btnFormat={"btn disabled"}
              // animationDuration={"infinite"}
              handleClick={() => {
                /**
                 *
                 * disabled for demo_warehouse
                 *
                 *
                 */
                // updateUsers(payload);
                // props.history.push("/");
              }}
            />
            <span className="red-text">* not allow to modify on demo</span>
          </div>
        </form>
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

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    users: state.firestore.data.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUsers: (data) => dispatch(updateUsers(data)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "users",
    },
  ])
)(Users);

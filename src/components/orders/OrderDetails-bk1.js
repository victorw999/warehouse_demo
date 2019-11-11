import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";

const OrderDetails = props => {
  const { order, auth } = props;
  if (!auth.uid) return <Redirect to="/signin" />;

  if (order) {
    return (
      <div className="container section project-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <span className="card-title">{order.amzId}</span>
            <p>{order.buyer}</p>
            <p> Shipping:{order.shipOption}</p>
            <p>
              {order.shipAddr +
                " " +
                order.shipCity +
                " " +
                order.shipState +
                " " +
                order.shipZip}
            </p>
            <td style={{ whiteSpace: "pre-line" }}>
              {order.itemlist &&
                order.itemlist.map(item => {
                  return (
                    <span key={item.key}>
                      <span
                        className="left badge black-text"
                        style={{ textAlign: "left" }}
                      >
                        {" "}
                        {item.sku}
                      </span>
                      {"  "}
                      <span
                        className="left badge grey lighten-4 teal-text"
                        style={{ fontWeight: "800" }}
                      >
                        {item.quantity}
                      </span>
                      <br />
                    </span>
                  );
                })}
            </td>
          </div>
          <div className="card-action grey lighten-4 grey-text">
            <div>
              Posted by {order.authorFirstName} {order.authorLastName}
            </div>
            <div>{moment(order.createdAt.toDate()).calendar()}</div>
          </div>
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

const mapStateToProps = (state, ownProps) => {
  // console.log(state);
  const id = ownProps.match.params.id;
  const orders = state.firestore.data.orders;
  const order = orders ? orders[id] : null;
  return {
    order: order,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "orders"
    }
  ])
)(OrderDetails);

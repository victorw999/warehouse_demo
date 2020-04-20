/**
 * OrderNADetail.js
 * @desc -  a form for reporting missing inventory (order_view only)
 */

import React, { useState, useEffect } from "react";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import useDataApi from "../../utilityFunc/fetchData/useDataApi";
import OrderNAList from "./OrderNAList";
import { createJob } from "../../../store/actions/jobActions";
import getOrderStatus from "../OrderList/getOrderStatus";
import LoaderButton from "../../utilityFunc/LoaderButton/LoaderButton";
import { isSuper } from "../../utilityFunc/functions";

const OrderNADetails = (props) => {
  // createJob() is passed in as props frm mapDispatchToProps
  const { order, auth, createJob, orderDocId } = props;

  // useReducer: custom hook
  const [{ data, isLoading, isError }] = useDataApi(order);

  // local var: holds the "changes" that made by <OrderNAList/>
  const [payload, setPayload] = useState([]);

  // retrieve "changes" from child <OrderNAList /> to local "payload"
  const handleChange = (list) => {
    setPayload([...list]);
  };

  // same implementation as StyleListInnerList.js
  const handleSubmit = () => {
    console.log("OrderNADetail: payload: ", payload);

    // mixedPickTask
    let mixed = payload
      .map((i) => {
        if (i.pickId === "" && i.status === "") {
          // means user did NOT select it
          return {
            ...i,
          };
        } else if (i.pickId === "" && i.status === "picking") {
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
      })
      .map((i) => {
        return {
          // add more fields
          ...i,
          order_docId: orderDocId, // add order_docId for mixedTasks.js
          buyer: order.buyer, // required to build new task for staff_view
        };
      });

    console.log("OrderNADetails.js => list: ", mixed);
    createJob(
      {
        list: [...mixed],
        // missing: payload.missing,
        // innerlistUpdate: true
      },
      "mixedPickTask",
      "order_view"
    );

    // give 2s b4 redirect
    setTimeout(() => {
      props.history.push("/"); // redirect to homepage after finished creating
    }, 2000);
  };

  /**
   * use getOrderStatus()
   * check if orderStatus changes after submit
   */
  const [origStat, setOrigStat] = useState("");
  useEffect(() => {
    if (data) {
      setOrigStat(getOrderStatus(data));
      console.log("origStat: ", origStat);
    }
  }, [data]);

  if (!auth.uid) return <Redirect to="/signin" />;
  // prohits non-super to create order
  if (!isSuper(props.profile)) return <Redirect to="/signin" />;

  if (order) {
    return (
      <div className="container white ordernadetails ">
        <div className="card ">
          <div className="card-content">
            <h5>{origStat} </h5>
            <h5 className="card-title">
              Orders N/A Report
              {isError && <span> Something is wrong ... </span>}
              {isLoading ? <span> Loading ... </span> : " "}
            </h5>
            <div className="order_details">
              <p>Order ID: {data.amzId && data.amzId}</p>
              <p>Buyer: {data.buyer && data.buyer} </p>
              <p>
                {data.shipAddr} {data.shipCity}
              </p>
              <p>
                {data.shipState} {data.shipZip} {data.shipOption}
              </p>
            </div>
          </div>
        </div>
        {/* END: card */}

        <form className="white" onSubmit={handleSubmit}>
          <div className="input-field">
            <OrderNAList
              itemlist={data.itemlist ? data.itemlist : []}
              handleChange={handleChange}
            />
          </div>
          <div className="input-field">
            <LoaderButton
              btnName={"Submit N/A"}
              btnFormat={"btn pink lighten-1"}
              animationDuration={"infinite"}
              handleClick={handleSubmit}
            />
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

// updateItemListInOrder = newItemList => {
//   this.setState({
//     itemlist: newItemList
//   });
// };

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const orders = state.firestore.data.orders;
  const order = orders ? orders[id] : null;

  return {
    order: order,
    auth: state.firebase.auth,
    orderDocId: id,
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // updateOrder: data => dispatch(updateOrder(data))
    createJob: (job, jobType, flag) => dispatch(createJob(job, jobType, flag)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "orders",
    },
  ])
)(OrderNADetails);

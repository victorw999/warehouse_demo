/**
 * this is a WORKING IMPLEMENTATION. it works by itself
 * using only useState() and useEffect, not yet useReducer
 *
 * While 'CreateOrder.js' is to create an order,
 * 'OrderDetail.js' is to edit an order
 *
 * 'CreateOrder.js' is constructed with class component
 */

import React, { useState, useEffect, useRef, useReducer } from "react";
import { DatePicker } from "react-materialize";
import { connect } from "react-redux";
import ItemList from "./ItemList";
import { updateOrder } from "../../store/actions/orderActions";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { isValidDate, getTimeStamp } from "./VicUtilityFunctions";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "CHANGE_DATE":
//       return {
//         ...state,
//         orderDate: action.item
//       };
//     case "INIT":
//       return {
//         ...action.item
//       };
//     default:
//       return state;
//   }
// };

const OrderDetail = props => {
  const { order, auth, updateOrder } = props;
  // const [state, dispatch] = useReducer(reducer, initialState);

  // new state var
  const [data, setData] = useState({});
  // local component's state variable, temporarily hold data before resubmit to firestore
  // Do Not remove the braces inside the parathesis, it'll cause error when 'data' is empty

  // intermediary var to store new date when change event is fired in DatePicker
  const [newOrderDate, setNewOrderDate] = useState();

  const [initFlag, setInitFlag] = useState(false); // signals if data successfuly loaded into state var 'data'

  // this flag is to make sure DatePicker will be init only once
  const [initDateFlag, setInitDateFlag] = useState(false);

  /********************************
   * init state section
   ********************************/
  useEffect(() => {
    if (order != null) {
      setInitFlag(true);
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
    await resolveAfterLoaded().then(result => {
      setData(result);
    });
  };

  // init DatePicker
  useEffect(() => {
    if (!initDateFlag && data.orderDate) {
      (async () => {
        await setInitDateFlag(true); // only manually init DatePicker once
        await manuallyLoadDatePicker();
      })();
    }
  }, [data.orderDate]); // check if "data.orderDate" is loaded, or changed

  // update DatePicker
  useEffect(() => {
    if (newOrderDate && data.orderDate) {
      setData({
        ...data,
        orderDate: new Date(newOrderDate)
      });
    }
  }, [newOrderDate]);

  /********************************
   * END: init section
   ********************************/

  let refDatePicker = useRef();

  const manuallyLoadDatePicker = () => {
    if (data.orderDate) {
      refDatePicker.current.instance.setDate(
        new Date(data.orderDate.toDate())
      ); /** initialize DatePicker */
      refDatePicker.current.instance._finishSelection();
    }
  };

  // const handleDatePickerChange = e => {
  //   console.log("handling DatePicker change");
  //   dispatch({ type: "CHANGE_DATE", e });
  // };

  // why when use DatePicker to trigger this func, then the initDateFlag is always false
  // but when use an Input to trigger this func, then the initDateFlag becomes true???
  const handleDatePickerChange = e => {
    // 'initDateFlag' is always false when dealing with DatePicker

    if (isValidDate(e)) {
      setNewOrderDate(e);
    } else {
      alert("not valid date");
    }
  };

  const handleChange = e => {
    setData({
      ...data,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    updateOrder(data); // start dispatching ...

    // console.log(order.orderDate.toDate());
    // this.props.createOrder(this.state);
    props.history.push("/"); // redirect to homepage after finished creating
  };

  /**
   * updateList: provide prop function to handle children component Itemlist.js 's addItem(), removeItem()
   *  function defintion in : CreateOrder.js, OrderDeatil.js
   *  1. add item,
   *  2. add item w/ same sku
   *  3. remove item
   */
  const updateList = newlist => {
    setData({ ...data, itemlist: newlist });
  };

  if (!auth.uid) return <Redirect to="/signin" />;

  if (order) {
    return (
      <div className="container">
        <form className="white" onSubmit={handleSubmit} onChange={validate}>
          <h5 className="grey-text text-darken-3">Order</h5>
          <div className="row">
            <div className="input-field col s6">
              <DatePicker
                id="orderDate_datepicker"
                ref={refDatePicker}
                options={{
                  // since we manually init DatePicker, we don't need 'defaultDate' option
                  // defaultDate: data.orderDate ? new Date(data.orderDate) : "",
                  setDefaultDate: true,
                  autoClose: true,
                  onClose: function() {
                    // due to the peculiar nature of DatePicker, i can only update the hook useState when setDate in onClose
                    handleDatePickerChange(this.date);
                  }
                }}
              />
              <label htmlFor="orderDate_datepicker" className="active">
                order-date
              </label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s6">
              <input
                disabled // don't allow edit
                style={{ color: "black", border: "none" }}
                type="text"
                id="amzId"
                value={data.amzId && data.amzId}
              />
              <label htmlFor="amzId" className="active">
                order-id
              </label>
            </div>
            <div className="input-field col s6">
              <input
                type="text"
                id="buyer"
                onChange={handleChange}
                value={data.buyer && data.buyer}
              />
              <label htmlFor="buyer" className="active">
                buyer
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <input
                type="text"
                id="shipAddr"
                onChange={handleChange}
                value={data.shipAddr}
              />
              <label htmlFor="shipAddr" className="active">
                shipAddr
              </label>
            </div>

            <div className="input-field col s6">
              <input
                type="text"
                id="shipCity"
                onChange={handleChange}
                value={data.shipCity}
              />
              <label htmlFor="shipCity" className="active">
                City
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s4">
              <input
                type="text"
                id="shipState"
                onChange={handleChange}
                value={data.shipState}
              />
              <label htmlFor="shipState" className="active">
                State
              </label>
            </div>
            <div className="input-field col s4">
              <input
                type="text"
                id="shipZip"
                onChange={handleChange}
                value={data.shipZip}
              />
              <label htmlFor="shipZip" className="active">
                Zip
              </label>
            </div>
            <div className="input-field col s4">
              <input
                type="text"
                id="shipOption"
                onChange={handleChange}
                value={data.shipOption}
              />
              <label htmlFor="shipOption" className="active">
                shipOption
              </label>
            </div>
          </div>
          <div className="input-field">
            <ItemList
              itemlist={data.itemlist ? data.itemlist : []}
              updateList={updateList}
            />
          </div>
          <div className="input-field">
            <button
              className="btn pink lighten-1"
              // disabled={! validate()}
            >
              Update Order
            </button>
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

// FORM VALIDATION:
const validate = () => {
  return true;
  // if (!isNullOrWhitespace(this.state.amzId) && this.state.itemlist.length > 0) {
  //   return true;
  // } else {
  //   return false;
  // }
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const orders = state.firestore.data.orders;
  const order = orders ? orders[id] : null;

  return {
    order: order,
    auth: state.firebase.auth,
    orderDocId: id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateOrder: data => dispatch(updateOrder(data))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([
    {
      collection: "orders"
    }
  ])
)(OrderDetail);
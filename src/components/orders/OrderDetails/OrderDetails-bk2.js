import React, { useState, useEffect, useRef, useReducer } from "react";
import { DatePicker } from "react-materialize";
import { connect } from "react-redux";
import ItemList from "../ItemList";
import { updateOrder } from "../../../store/actions/orderActions";

import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";

// http://jsfiddle.net/are207L0/1/
// function isNullOrWhitespace(input) {
//   return !input || !input.trim();
// }

//https://stackoverflow.com/a/1353711/5844090
// function isValidDate(d) {
//   return d instanceof Date && !isNaN(d); // protect against right click insert emoji
// }

const initialState = {
  amzId: 0,
  buyer: "",
  orderDate: 0
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_DATE":
      return {
        ...state,
        orderDate: action.orderDate
      };
    default:
      return state;
  }
};

const OrderDetails2 = props => {
  const { order, auth, orderDocId } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  //hooks: state var to hold prop's order_date
  // const [order_date, setOrderDate] = useState(0); // can't initialize here, cuz the order hasn't fully loaded
  const [tempOrder, setTempOrder] = useState({ itemlist: [], buyer: "" }); // init property here will stop the warning errors

  const [
    loaded,
    setLoaded
  ] = useState(); /** if initialization is done then use a diff useEffect */

  const [isDateChanged, setDateChanged] = useState(false);

  const [count, setCount] = useState(0);
  let refDatePicker = useRef(); /** REF */

  /**
   * use async await to init data
   * 2nd argument is [], means we're only fetching data with the compoment mounts*/
  useEffect(() => {
    console.log("... useEffect() async begin to load 'order' props ");
    const fetchData = async () => {
      console.log("entering async() callback");
      const result = await (() => {
        console.log("entering await() callback");
        return new Promise(resolve => {
          if (order) {
            console.log("order: yes");
            resolve();
            /** if return order here, result won't capture it, dunno y */
          } else {
            console.log("order: no");
          }
        });
      })(); /** WARNING:   if not include () at the end, the anonymous await func won't run */

      console.log("b4 setTempOrder");
      console.log(result);
      setTempOrder({ ...order });
      manuallyLoadDatePicker(); // why run this will erase other properties in tempOrder?
    };
    fetchData();
  }, []); // for some reason, if [], then the input bond w/ tempOrder won't load

  // change tempOrder when input weas changed
  useEffect(() => {
    if (!tempOrder == null) {
      console.log("original useEffect(): update local state: tempOrder");
      // setTempOrder({
      //   ...tempOrder
      //   // orderDate: order.orderDate.toDate() /** initialize order_date */,
      //   // buyer: order.buyer
      // });
    } else {
      console.log("...tempOrder == null --- reload 'order' into local state ");
      // const fetchData = async () => {
      //   await (() => {
      //     return new Promise(resolve => {
      //       if (order) {
      //         resolve(); /** if return order here, result won't capture it, dunno y */
      //       }
      //     });
      //   });
      //   setTempOrder({ ...order });
      //   manuallyLoadDatePicker();
      //   setLoaded(true);
      // };
      // fetchData();
    }
  }, [tempOrder]);

  const manuallyLoadDatePicker = () => {
    if (order) {
      refDatePicker.current.instance.setDate(
        new Date(order.orderDate.toDate()) /** initialize DatePicker */
      );
      refDatePicker.current.instance._finishSelection();
    }
  };

  const handleDatePickerChange = e => {
    console.log("handling DatePicker change");
    setDateChanged(true);
    // setTempOrder({
    //   // ...tempOrder,
    //   orderDate: e
    // });
  };

  const handleChange = e => {
    console.log("handling change");
    setTempOrder({
      ...tempOrder,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(order);

    // use spread operator to create a new obj w/ modifications
    var newObj = { ...order, orderDate: tempOrder.orderDate, id: orderDocId };
    console.log(newObj);

    props.updateOrder(newObj); // start dispatching ...

    // console.log(order.orderDate.toDate());
    // this.props.createOrder(this.state);
    // this.props.history.push("/"); // redirect to homepage after finished creating
  };

  if (!auth.uid) return <Redirect to="/signin" />;

  if (order) {
    return (
      <div className="container">
        <div>
          <p>{JSON.stringify(order.orderDate.toDate())}</p>
          <p>{order.amzId}</p>
          <p>{order.buyer}</p>
        </div>

        <form className="white" onSubmit={handleSubmit} onChange={validate}>
          <h5 className="grey-text text-darken-3">Order</h5>
          <div className="row">
            <div className="input-field col s6">
              <DatePicker
                id="orderDate_datepicker"
                ref={refDatePicker}
                options={{
                  // defaultDate: order ? order.orderDate.toDate() : "",
                  // defaultDate: "",
                  // setDefaultDate: true,
                  autoClose: true,
                  onDraw: function() {
                    // console.log(this); // prompting this when clicked open
                  }
                }}
                onChange={handleDatePickerChange}
              />
              <label htmlFor="orderDate_datepicker" className="active">
                order-date
              </label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s6">
              <input
                type="text"
                id="amzId"
                onChange={handleChange}
                value={order.amzId}
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
                value={tempOrder ? tempOrder.buyer : ""}
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
                value={order.shipAddr}
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
                value={order.shipCity}
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
                value={order.shipState}
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
                value={order.shipZip}
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
                value={order.shipOption}
              />
              <label htmlFor="shipOption" className="active">
                shipOption
              </label>
            </div>
          </div>

          <div className="input-field">
            <ItemList
              itemlist={order.itemlist}
              // updateItemListInOrder={this.updateItemListInOrder.bind(this)}
            />
          </div>

          <div className="input-field">
            <button
              className="btn pink lighten-1"
              // disabled={! validate()}
            >
              Create
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

const validate = () => {
  return true;
  // if (!isNullOrWhitespace(this.state.amzId) && this.state.itemlist.length > 0) {
  //   return true;
  // } else {
  //   return false;
  // }
};

// const handleDatePicker = e => {
//   if (isValidDate(e)) {
//     this.setState({
//       orderDate: e
//     });
//   } else {
//     alert("not valid date");
//   }
// };

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
    updateOrder: order => dispatch(updateOrder(order))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {
      collection: "orders"
    }
  ])
)(OrderDetails2);

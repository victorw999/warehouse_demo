// orderActions.js
// this is the action creator

/**
 *
 * UPDATE
 */
export const updateOrder = order => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    // REF: https://stackoverflow.com/a/49682615/5844090

    firestore
      .collection("orders")
      //.where("id", "==", order.id) // REF: https://bit.ly/343WFFQ
      .where("amzId", "==", order.amzId) // query the entry where the amzId matches
      .get() // retrieve the results which meet the 'where' condition
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log("orderaction.js: ", doc.id);
          try {
            firestore
              .collection("orders")
              .doc(doc.id)
              .update({
                // update() REF: http://tiny.cc/rxwigz
                // amzId: order.amzId, // don't allow to change amzId
                orderDate: order.orderDate ? order.orderDate : "",
                buyer: order.buyer ? order.buyer : "",
                itemlist: order.itemlist ? order.itemlist : "",
                shipAddr: order.shipAddr ? order.shipAddr : "",
                shipCity: order.shipCity ? order.shipCity : "",
                shipState: order.shipState ? order.shipState : "",
                shipZip: order.shipZip ? order.shipZip : "",
                shipOption: order.shipOption ? order.shipOption : ""
              })
              .catch(e => {
                console.error("err in updating..." + e);
              });
          } catch (e) {
            console.error("err accessing firestore collection ..." + e);
          }
        });
      })
      .then(() => {
        dispatch({ type: "UPDATE_ORDER", order });
        console.log("...finished update firestore");
      })
      .catch(err => {
        dispatch({ type: "UPDATE_ORDER_ERROR", err });
      });

    // firestore
    //   .delete({
    //     collection: "orders",
    //     doc: order.id
    //   })
    //   .then(docRef => {
    //     console.log("in Action creator.. deleted......");
    //     console.log(docRef);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    // firestore
    // .collection("orders")
    // .add({
    //   ...order,
    //   authorFirstName: profile.firstName,
    //   authorLastName: profile.lastName,
    //   authorId: authorId,
    //   createdAt: new Date()
    // })
    // .then(docRef => {
    //   console.log("Document written with ID: ", docRef.id);
    // })
    // .then(() => {
    //   dispatch({ type: "CREATE_ORDER", order });
    // })
    // .catch(err => {
    //   dispatch({ type: "CREATE_ORDER_ERROR", err });
    // });
  };
};
/**
 *
 * DELETE
 */
export const deleteOrder = order => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .delete({
        collection: "orders",
        doc: order.id
      })
      .then(() => {
        dispatch({ type: "DELETE_ORDER", order });
      })
      .catch(err => {
        dispatch({ type: "DELETE_ORDER_ERROR", err });
      });
  };
};

/**
 *
 * CREATE
 */
export const createOrder = order => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .collection("orders")
      .add({
        // this will automatically generate a document id on firestore
        ...order,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        createdAt: new Date()
      })
      .then(docRef => {
        // console.log("Document written with ID: ", docRef.id);
        docRef.get().then(snap => {
          // docRef.update({ ...snap.data(), docId: docRef.id });
          // console.log("doc id added to order");
        });
      })
      .then(() => {
        dispatch({ type: "CREATE_ORDER", order });
      })
      .catch(err => {
        dispatch({ type: "CREATE_ORDER_ERROR", err });
      });
  };
};

/**
 * currently not using this anymore
 */
export const updateOrderItemStatus = item => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // const profile = getState().firebase.profile;
    // const authorId = getState().firebase.auth.uid;

    // const queryResult = docRef.get().then(snap => {
    //   var order_itemlist = snap.data().itemlist;
    //   console.log(order_itemlist);
    // });

    firestore
      .collection("orders")
      .doc(`${item.order_docId}`)
      .get()
      .then(doc => {
        // console.log(doc.data());
        var newitemlist = doc.data().itemlist;
        for (let i of newitemlist) {
          if (i.key === item.key) {
            console.log("found item ", i.key);
            // if item already completed, do not update status here
            if (i.status === "pick_complete") {
              console.log("Picktask is aready COMPLETED! ");
            } else {
              i.status = item.status;
            }
            break;
          }
        }
        try {
          firestore
            .collection("orders")
            .doc(`${item.order_docId}`)
            .update({
              itemlist: newitemlist
            });
        } catch (e) {
          console.error("err updateOrderItemStatus() ..." + e);
        }
      })
      .then(() => {
        dispatch({ type: "UPDATE_ORDER_ITEM", item });
        console.log("...UPDATE_ORDER_ITEM");
      })
      .catch(err => {
        dispatch({ type: "UPDATE_ORDER_ITEM_ERROR", err });
      });
  }; // end return
};

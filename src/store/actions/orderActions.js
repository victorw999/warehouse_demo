// orderActions.js
// this is the action creator

export const updateOrder = order => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    // REF: https://stackoverflow.com/a/49682615/5844090

    firestore
      .collection("orders")
      //.where("id", "==", order.id) // where: https://firebase.google.com/docs/firestore/query-data/get-data#get_multiple_documents_from_a_collection
      .where("amzId", "==", order.amzId) // query the entry where the amzId matches
      .get()
      .then(function(querySnapshot) {
        // console.log("updateOrder() action in progress...", order);

        querySnapshot.forEach(function(doc) {
          // console.log(doc.id, " =>=> ", doc.data());
          // Build doc ref from doc.id

          try {
            firestore
              .collection("orders")
              .doc(doc.id)
              .update({
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
        console.log("...finished update firestore");
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
        console.log("Document written with ID: ", docRef.id);
      })
      .then(() => {
        dispatch({ type: "CREATE_ORDER", order });
      })
      .catch(err => {
        dispatch({ type: "CREATE_ORDER_ERROR", err });
      });
  };
};

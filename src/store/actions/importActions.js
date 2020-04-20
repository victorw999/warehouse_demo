/**
 * import JSON to orders
 */
export const importOrders = json => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    json.forEach(order => {
      firestore
        .collection("orders")
        .add({
          ...order
        })
        .then(docRef => {
          console.log("order doc created refID: ", docRef.id);
          docRef.get().then(snap => {});
        })
        .catch(err => {
          console.error(err);
        });
    });
  };
};

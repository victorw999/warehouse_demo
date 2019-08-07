// orderActions.js
// this is the action creator

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
      .then(() => {
        dispatch({ type: "CREATE_ORDER", order });
      })
      .catch(err => {
        dispatch({ type: "CREATE_ORDER_ERROR", err });
      });
  };
};

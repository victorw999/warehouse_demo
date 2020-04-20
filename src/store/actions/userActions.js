export const updateUsers = allUsers => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .collection("users")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          var userRef = firestore.collection("users").doc(doc.id);
          // console.log(doc.id);
          // console.log(allUsers, allUsers[doc.id]);
          userRef.update(allUsers[doc.id]);
        });
      });
  };
};

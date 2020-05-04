/**
 *
 *  CREATE Notification
 */
export const createNotification = content => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    firestore
      .collection("notifications")
      .add({
        content: content,
        user: `${profile.firstName} ${profile.lastName}`,
        time: new Date()
      })
      .then(docRef => {
        console.log("notification added", docRef);
      })
      .catch(err => {
        console.log("noteAction.js: createNotification err ", err);
      });
  };
};

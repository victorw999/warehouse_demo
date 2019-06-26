export const vicActionOne = something => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("vicmod")
      .add({
        ...something
      })
      .then(() => {
        dispatch({ type: "VIC_ACTION_ONE", something });
      })
      .catch(err => {
        dispatch({ type: "VIC_ACTION_ONE_ERROR", err });
      });
  };
};

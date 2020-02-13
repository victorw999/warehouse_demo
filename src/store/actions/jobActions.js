/**
 * CREATE JOBS
 */
export const createJob = (job, jobType, flag) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    // for deleting tasks, mk sure only perform on items belong to current user
    // filter list that belong to current user
    var deleteList = [];
    if (jobType === "deletePickTask") {
      deleteList = job
        .filter(i => {
          if (i.picker === profile.firstName) {
            return true;
          } else {
            console.log("canceling tasks, some are assigned to diff usr");
            return false;
          }
        })
        .map(j => {
          return {
            pickId: j.pickId,
            key: j.key, // item-keys for update orders
            order_docId: j.order_docId
          };
        });
    }
    var payload = {};

    switch (jobType) {
      case "createPickTask":
        payload = {
          // this will automatically generate a document id on firestore
          list: [...job],
          owner: profile.firstName,
          initials: profile.initials,
          ownerId: authorId,
          jobType: jobType, // create/update/deletePickTask, create/update/deletePackTask
          status: "picking", // picking, pick_complete, n/a, packing, pack_complete
          flag: flag // contains info like "items_from_same_order"
        };
        break;
      case "deletePickTask":
        payload = {
          list: [...deleteList],
          jobType: jobType,
          flag: flag
        };
        break;
      default:
        payload = {};
    }

    firestore
      .collection("jobs")
      .add(payload)
      // .then(docRef => {
      //   docRef.get().then(snap => {
      //     docRef.update({ ...snap.data(), docId: docRef.id });
      //   });
      // })
      .then(() => {
        dispatch({ type: "CREATE_JOB", payload });
      })
      .catch(err => {
        dispatch({ type: "CREATE_JOB_ERROR", err });
      });
  };
};

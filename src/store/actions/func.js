/**
 *  THIS IDEA IS ABANDONED, KEEP AS REF
 *
 *  @desc - when 'deletePickTask', check if current order already in 'packing' status
 *          if order already enter in 'packing', we shouldn't allow picktasks' status to be mod anymore
 *
 */

exports.isOrderPacking = (job, firestore) => {
  let order_docId = job[0].order_docId; // if coming from staff view, then only 1 task is in the list
  // console.log("order_docId ", order_docId);

  return firestore
    .collection("tasks")
    .where("order_docId", "==", order_docId)
    .get()
    .then(snap => {
      let promises = [];
      snap.forEach(doc => {
        var task = doc.data();
        if (task.status === "packing") {
          promises.push(Promise.resolve("PACKING_FOUND"));
          return;
        }
      });
      return Promise.all(promises).then(arr => {
        return arr.some(i => i === "PACKING_FOUND") ? true : false;
      });
    });
};

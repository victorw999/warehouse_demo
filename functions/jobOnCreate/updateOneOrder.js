const admin = require("firebase-admin");
const db = admin.firestore();
/**
 *
 * update single order
 */
module.exports = (order_docId, tasksObj, jobType) => {
  var docRef = db.doc(`orders/${order_docId}`);
  var order_itemlist = []; // arr to store retrieved order's itemlist

  return docRef
    .get()
    .then(snap => {
      order_itemlist = snap.data().itemlist;
      /**   looping order_itemlist, create new itemlist  */
      for (let i = 0; i < order_itemlist.length; i++) {
        var status = order_itemlist[i].status;
        // case 1: if status is blank, then add new pick task info
        if (jobType === "createPickTask" && (!status || status === "")) {
          let task = tasksObj[order_itemlist[i].key];
          order_itemlist[i] = {
            ...order_itemlist[i],
            status: task.status,
            picker: task.owner,
            picker_init: task.initials,
            pickId: task.id
          };
        } else if (
          jobType === "deletePickTask" &&
          (status === "picking" ||
            status === "pick_complete" ||
            status === "n/a")
        ) {
          let itemkey = order_itemlist[i].key;
          if (Object.keys(tasksObj).indexOf(itemkey) !== -1) {
            order_itemlist[i] = {
              ...order_itemlist[i],
              status: "",
              picker: "",
              picker_init: "",
              pickId: ""
            };
          }
        } else {
          // case 2: some items are 'picking', 'pick_complete', 'n/a'
        }
      } // end looping order_itemlist
      return Promise.resolve(docRef);
    })
    .then(docRef => {
      return docRef.update({ itemlist: order_itemlist });
    })
    .then(result => {
      // console.log("order updated via job_updateOrder_afterTask() ", result);
    })
    .catch(e => {
      console.error("updateOneOrder() error: ", e);
    });
};

const admin = require("firebase-admin");
const tools = require("./tools.js");
const db = admin.firestore();

/**
 * PICKTASK DELETED
 */
module.exports = doc => {
  const picktask = { ...doc.data(), id: doc.id };
  if (picktask.msg === "skip_cloud_trigger") {
    console.log("msg: ", picktask.msg, picktask.key);
    return new Promise((resolve, reject) => {
      if (true) {
        resolve("skip_cloud_trigger");
      }
    });
  } else {
    console.log("msg:  empty");
    return updateItemStatusOnDelete(picktask);
  }
};

/**
 *  UPDATE ORDER @ PICKTAST DELETED
 */
const updateItemStatusOnDelete = task => {
  let order_docId = task.order_docId;
  var docRef = db.doc(`orders/${order_docId}`);

  const p = docRef
    .get()
    .then(snap => {
      let array = snap.data().itemlist;
      array = array.map(item => {
        if (item.key === task.key && task.id === item.pickId) {
          return {
            ...item,
            status: "",
            picker: "",
            picker_init: "",
            pickId: "",
            pickerId: ""
          };
        } else {
          return item;
        }
      }); // end looping order's itemlist's item
      return Promise.resolve(array);
    })
    .then(array => {
      docRef.update({
        itemlist: array
      });
    })
    .catch(err => {
      console.error("updateItemStatusOnDelete() > error: ", err);
    });
  return Promise.resolve(p);
};

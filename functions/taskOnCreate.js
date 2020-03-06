const admin = require("firebase-admin");
const tools = require("./tools.js");
const db = admin.firestore();

/**
 * PICKTASK CREATED
 */
module.exports = doc => {
  const picktask = { ...doc.data(), id: doc.id };
  if (picktask.msg === "skip_cloud_trigger") {
    console.log("msg: ", picktask.msg, picktask.key);
    return new Promise((resolve, reject) => {
      resolve("Do NOT need to update orders!");
    });
  } else {
    console.log("msg:  empty");
    return updateItemStatusOnCreate(picktask);
  }
};

const updateItemStatusOnCreate = picktask => {
  let order_docId = picktask.order_docId;
  var docRef = db.doc(`orders/${order_docId}`);
  var order_itemlist = [];

  const queryResult = docRef
    .get()
    .then(snap => {
      // re-shape itemlist
      order_itemlist = snap.data().itemlist;

      for (let i = 0; i < order_itemlist.length; i++) {
        if (picktask.key === order_itemlist[i].key) {
          order_itemlist[i] = {
            ...order_itemlist[i],
            status: picktask.status, // update "order" collection frm "picktasks" collection
            picker: picktask.owner,
            picker_init: picktask.initials,
            pickId: picktask.ownerId, // for delete operation
            msg: "" // remove 'skip trigger' msg if it had one.
          };
          break;
        }
      }
      return Promise.resolve(order_itemlist);
    }) // end queryResult
    .then(order_itemlist => {
      // start updating
      return docRef
        .update({
          itemlist: [...order_itemlist]
        })
        .then(() => {
          console.log(`*****>update() ${picktask.sku} finished, `);
        });
    })
    .catch(err => {
      console.log("updateItemStatusOnCreate ", err);
    });

  return queryResult;
};

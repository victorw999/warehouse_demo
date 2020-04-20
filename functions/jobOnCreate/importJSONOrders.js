const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *  import JSON orders via batch()
 */
module.exports = ({ list, jobType, flag }) => {
  var fileP = "^^ importJSONOrders.js "; // current file prompt
  console.log(` `);
  console.log(`${fileP} list:`, list);
  console.log(`${fileP} jobType=${jobType}, flag=${flag}`);

  //Get a new write batch
  var batch = db.batch();

  Promise.all(
    list.map(order => {
      let amzId = order.amzId;
      return db
        .collection("orders")
        .where("amzId", "==", amzId)
        .get()
        .then(snap => {
          console.log(` `);
          console.log(`${fileP} snap.empty = ${snap.empty} `);

          if (snap.empty) {
            /**
             * import here: amzId not exist in collection
             */
            let newRef = db.collection("orders").doc();

            // Set the value
            batch.set(newRef, { ...order });
            console.log(`${fileP} new orders created - ${amzId} `);
          } else {
            /**
             * order exist
             */
            console.log(`${fileP} amzId ALREADY exist! - ${amzId}`);
          }
        }) // END: then()
        .then(() => {
          console.log(`${fileP} loop end ------------------------- `);
        })
        .catch(e => {
          console.log(`${fileP} error inside :`, e);
        });
    }) // END: list.map()
  ) // END: promise.all()
    .then(() => {
      batch.commit();
      return Promise.resolve("import JSON orders completed!");
    })
    .catch(e => {
      console.error(`${fileP} `, e);
    });
};

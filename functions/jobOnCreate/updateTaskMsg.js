const admin = require("firebase-admin");
const db = admin.firestore();

/**
 *
 * clear msg field in picktask
 */
module.exports = taskIds => {
  var batch_update = db.batch();
  for (let t of taskIds) {
    let taskRef = db.collection("tasks").doc(t);
    batch_update.update(taskRef, { msg: "" });
  }
  return batch_update
    .commit()
    .then(result => {
      return new Promise((resolve, reject) => {
        if (true) {
          resolve("update tasks msg is done");
        } else {
          reject("reject!");
        }
      });
    })
    .catch(e => {
      console.error(e);
    });
};

const admin = require("firebase-admin");
const tools = require("./tools.js");
/**
 * PROJRECT CREATE
 */

module.exports = doc => {
  const project = doc.data();
  const notification = {
    content: "Added a new project frm new splitted file",
    user: `${project.authorFirstName} ${project.authorLastName}`,
    time: admin.firestore.FieldValue.serverTimestamp()
  };
  return tools.createNotification(notification);
};

// const createNotification1 = notification => {
//   return admin
//     .firestore()
//     .collection("notifications")
//     .add(notification)
//     .then(doc => {
//       // console.log("notification added", doc);
//     })
//     .catch(error => {
//       console.log("cloudfunc createNotification err", error);
//     });
// };

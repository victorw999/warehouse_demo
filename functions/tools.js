//https://stackoverflow.com/a/16631079/5844090
//  multiple module.exports
const admin = require("firebase-admin");

exports.createNotification = notification => {
  return admin
    .firestore()
    .collection("notifications")
    .add(notification)
    .then(doc => {
      console.log(" put it in tools now notification added", doc);
    })
    .catch(error => {
      console.log("cloudfunc createNotification err", error);
    });
};

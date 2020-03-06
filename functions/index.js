const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const tools = require("./tools.js");

/** children files */
const projectOnCreate = require("./projectOnCreate.js");
const jobOnCreate = require("./jobOnCreate.js");
const taskOnCreate = require("./taskOnCreate.js");
const taskOnDelete = require("./taskOnDelete.js");
/**
 * PROJRECT CREATE
 */
exports.projectCreated = functions.firestore
  .document("projects/{projectId}")
  .onCreate(projectOnCreate);

/**
 *  UPDATE ORDER @ PICKTASK ON_UPDATE
 *
 */
const updateItemStatusOnUpdate = picktask => {
  // need to implement
};

/**
 * PICKTASK CREATED
 */
exports.pickTaskCreated = functions.firestore
  .document("picktasks/{picktask}")
  .onCreate(taskOnCreate);

/**
 * PICKTASK DELETED
 */
exports.pickTaskDeleted = functions.firestore
  .document("picktasks/{picktask}")
  .onDelete(taskOnDelete);

/**
 * PICKTASK updated: completed
 */
exports.pickTaskUpdated = functions.firestore
  .document("picktasks/{picktask}")
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const picktask = { ...newValue, id: change.after.ref.id };
    // console.log("---:: change.after.ref", change.after.ref);
    // console.log("---:: change.after.ref.id", change.after.ref.id);

    if (picktask.msg === "skip_cloud_trigger") {
      console.log("msg: ", picktask.msg);
      return new Promise((resolve, reject) => {
        if (true) {
          resolve("skip_cloud_trigger");
        }
      });
    } else {
      return updateItemStatusOnCreate7(picktask);
    }
    // need to implement
    // return updateItemStatusOnUpdate(picktask);
  });

/**
 *  USER JOINED
 */
exports.userJoined = functions.auth.user().onCreate(user => {
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then(doc => {
      const newUser = doc.data();
      const notification = {
        content: "Joined the party",
        user: `${newUser.firstName} ${newUser.lastName}`,
        time: admin.firestore.FieldValue.serverTimestamp()
      };
      return tools.createNotification(notification);
    });
});

/**
 * JOB CREATE
 */
exports.jobCreated = functions.firestore
  .document("jobs/{jobId}")
  .onCreate(jobOnCreate);

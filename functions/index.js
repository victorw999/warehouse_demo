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
 *  USER JOINED
 */
exports.userJoined = functions.auth.user().onCreate((user) => {
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then((doc) => {
      const newUser = doc.data();
      const notification = {
        content: "Joined the party",
        user: `${newUser.firstName} ${newUser.lastName}`,
        time: admin.firestore.FieldValue.serverTimestamp(),
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

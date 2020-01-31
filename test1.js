exports.updateProfileUsername = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const { userId } = context.params;

    var newUsername = change.after.data().username;
    var previousUsername = change.before.data().username;

    if (newUsername.localeCompare(previousUsername) !== 0) {
      let postCollectionRef = db.collection("posts");
      let postQuery = postCollectionRef.where("userId", "==", `${userId}`);

      return new Promise((resolve, reject) => {
        updateUsernameDocuments(postQuery, reject, newUsername);
      });
    }
  });

function updateUsernameDocuments(query, reject, newValue) {
  query
    .get()
    .then(snapshot => {
      if (snapshot.size === 0) {
        return 0;
      }

      return snapshot.docs.forEach(doc => {
        doc.ref.update({ username: `${newValue}` });
      });
    })
    .catch(reject);
}

//   ---------------------------------------------------

exports.updateProfileUsername = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const { userId } = context.params;

    var newUsername = change.after.data().username;
    var previousUsername = change.before.data().username;

    if (newUsername.localeCompare(previousUsername) !== 0) {
      const postCollectionRef = db.collection("posts");
      const postQuery = postCollectionRef.where("userId", "==", `${userId}`);

      return postQuery.get().then(querySnapshot => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const promises = [];

          querySnapshot.forEach(doc => {
            promises.push(doc.ref.update({ username: `${newUsername}` }));
          });

          return Promise.all(promises);
        }
      });
    } else {
      return null;
    }
  });

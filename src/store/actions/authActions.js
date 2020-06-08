export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch((err) => {
        dispatch({ type: "LOGIN_ERROR", err });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "SIGNOUT_SUCCESS" });
      });
  };
};

export const signUp = (newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    firestore
      .collection("signupcode")
      .doc("001")
      .get()
      .then(function (doc) {
        if (doc.exists) {
          const code = doc.data().code;
          const expiration = doc.data().expiration;
          return Promise.resolve({ code: code, expiration: expiration });
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      })
      .then((result) => {
        let code = result.code;
        let expiration = result.expiration;
        let currentTime = firebase.firestore.Timestamp.now(); // get server timestamp
        if (newUser.signupcode === code && expiration > currentTime) {
          // add new user to collection
          firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then((resp) => {
              return firestore
                .collection("users")
                .doc(resp.user.uid)
                .set({
                  firstName: newUser.firstName,
                  lastName: newUser.lastName,
                  initials: newUser.firstName[0] + newUser.lastName[0],
                  role: "",
                });
            })
            .then(() => {
              dispatch({ type: "SIGNUP_SUCCESS" });
            })
            .catch((err) => {
              dispatch({ type: "SIGNUP_ERROR", err });
            });
        } else {
          //  no or wrong sign up code
          dispatch({
            type: "SIGNUP_ERROR_NO_CODE",
            message: "signup code is not correct!",
          });
        }
      })
      .catch(function (error) {
        console.log("Error", error.authError);
      });
  };
};

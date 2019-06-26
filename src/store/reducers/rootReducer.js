import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import vicReducer from "./vicReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  victor: vicReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;

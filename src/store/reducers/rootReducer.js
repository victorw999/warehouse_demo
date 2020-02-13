import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import vicReducer from "./vicReducer";
import orderReducer from "./orderReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import jobReducer from "./jobReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  victor: vicReducer,
  order: orderReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  job: jobReducer
});

export default rootReducer;

import authReducer from "./authReducer";
import orderReducer from "./orderReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import jobReducer from "./jobReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  job: jobReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
});

export default rootReducer;

// https://codesandbox.io/s/hooks-fetch-data-usestate-useeffect-usereducer-9yniq
// tutorial: https://www.robinwieruch.de/react-hooks-fetch-data#how-to-trigger-a-hook-programmaticallymanually

/**
 * this is a custom hook for fetch/load data from the 'order' prop into state variable
 */
import { useEffect, useReducer } from "react";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "ORDER_FULLY_LOADED":
      // console.log("ORDER_FULLY_LOADED");
      return { ...state, initFlag: true };
    case "UPDATE_DATA":
      // console.log("UPDATE_DATA");
      return { ...state, data: action.payload };
    case "FETCH_INIT":
      // console.log("FETCH_INIT");
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      // console.log("FETCH_SUCCESS");
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      // console.log("FETCH_FAILURE");
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};

// the 'order' param is from:  firestore -> mapStateToProps -> order
const useDataApi = order => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: order
      ? order
      : {
          amzId: "",
          buyer: "",
          shipAddr: "",
          shipCity: "",
          shipState: "",
          shipZip: "",
          shipOption: ""
        },
    initFlag: false // signals if data finished loaded into state var 'data'
  });

  // function for OrderDetail.js to update this API's inner data
  const updateData = updates => {
    dispatch({ type: "UPDATE_DATA", payload: updates });
  };
  /********************************
   * init state section
   ********************************/
  useEffect(() => {
    let didCancel = false;
    if (order != null) {
      dispatch({ type: "ORDER_FULLY_LOADED" });
    }
    if (!state.initFlag) {
      // only fetch data when 'initFlag' has not been set
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });

        try {
          await new Promise((resolve, reject) => {
            if (order) {
              resolve(order);
            } else {
              reject(" prop 'order' not ready ");
            }
          })
            .then(result => {
              if (!didCancel) {
                dispatch({ type: "FETCH_SUCCESS", payload: result });
              }
            })
            .catch(e => {
              console.error(e);
            });
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
          console.error("fetch data error: ", error);
        }
      };
      fetchData();

      // cleanup function
      return () => {
        didCancel = true;
      };
    }
  }, [order]); // put 'order' in 2nd args to to check if "firestore->props->order" is complete

  return [state, updateData];
};

export default useDataApi;

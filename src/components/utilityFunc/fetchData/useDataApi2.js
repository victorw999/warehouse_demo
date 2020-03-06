// https://codesandbox.io/s/hooks-fetch-data-usestate-useeffect-usereducer-9yniq
// tutorial: https://www.robinwieruch.de/react-hooks-fetch-data#how-to-trigger-a-hook-programmaticallymanually

/**
 *
 * this is a new attempt to refactor this custom hook,
 * so  not only it can fetch 'orders', it can also fetch other collections such as 'tasks'
 *
 */
import { useEffect, useReducer } from "react";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FULLY_LOADED":
      // console.log("FULLY_LOADED");
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
/**
 * @desc -    main definition of custom hook
 * @param -   firestore -> mapStateToProps -> "e.g.: order/task"
 *            try to fetch "one" ducument from collection
 */
const useDataApi2 = source => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    initFlag: false, // signals if data finished loaded into state var 'data'
    data: source ? source : {}
  });

  // function for other funcs(e.g:OrderDetail.js ) to update this API's inner data
  const updateData = updates => {
    dispatch({ type: "UPDATE_DATA", payload: updates });
  };

  /**
   * init state
   */
  useEffect(() => {
    let didCancel = false;
    if (source != null) {
      dispatch({ type: "FULLY_LOADED" }); // will set "initFlag" to true
    }
    if (!state.initFlag) {
      // only fetch data when 'initFlag' has not been set
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });

        try {
          await new Promise((resolve, reject) => {
            if (source) {
              resolve(source);
            } else {
              reject("useDataApi2.js msg:  not ready ");
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
          console.error("useDataApi2.js msg: fetch data error: ", error);
        }
      };
      fetchData();

      /**
       * cleanup func: runs when component unmounts
       * If the component unmount, the flag prevents setting the component state
       * after the data fetching has been asynchronously resolved eventually.
       * In other words: we only allow setting the component state, when it mounts
       */
      return () => {
        didCancel = true;
      };
    }
  }, [source]); // put 'order' in 2nd args to to check if "firestore->props->order" is complete

  return [state, updateData];
};

export default useDataApi2;

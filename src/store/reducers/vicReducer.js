const initState = {
  values: []
};

const vicReducer = (state = initState, action) => {
  switch (action.type) {
    case "VIC_ACTION_ONE":
      console.log("victor's action #1", action.victor);
      return state;
    case "VIC_ACTION_ONE_ERROR":
      console.log("victor's action error", action.err);
      return state;
    default:
      return state;
  }
};

export default vicReducer;

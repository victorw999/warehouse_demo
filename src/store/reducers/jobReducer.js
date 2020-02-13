const jobReducer = (state = [], action) => {
  switch (action.type) {
    case "CREATE_JOB":
      console.log("create job", action.order);
      return state;
    case "CREATE_JOB_ERROR":
      console.log("create job error", action.err);
      return state;

    default:
      return state;
  }
};

export default jobReducer;

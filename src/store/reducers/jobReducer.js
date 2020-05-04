const initState = {
  tasks_feedbacks:
    // this state currently is intended to only hold just 1 info,
    // which is the feedback from jobActions.js

    // i want to have a obj w/ taskId as key
    { taskId: { feedback: "" } }
};

const jobReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_JOB":
      // console.log("create job", action.order);
      return state;
    case "CREATE_JOB_ERROR":
      console.log("create job error", action.err);
      return state;
    case "SET_JOB_FEEDBACK":
      var obj = state.tasks_feedbacks;
      obj[action.payload.taskId] = action.payload.feedback;
      return { tasks_feedbacks: obj };

    default:
      return state;
  }
};

export default jobReducer;

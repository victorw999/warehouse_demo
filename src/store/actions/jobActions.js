/**
 * CREATE JOBS
 * @desc - create job that'll trigger cloud func
 *
 */
export const createJob = (job, jobType, flag) => {
  console.log("jobActions.js => input ", job);
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async calls to db: add this order to firebase, b4 dispatch the action
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    /**
     * REDUCE Items to the minimal 3 fields: order ref, item-key, task id.
     */
    var reduced_list = [];
    if (
      jobType === "deletePickTask" ||
      jobType === "deletePackTask" ||
      jobType === "completePickTask"
    ) {
      reduced_list = reduceList(job, jobType, flag, profile);
    }

    /**
     * CONFIG "PAYLOAD"
     */
    var payload = {};
    switch (jobType) {
      case "createPickTask":
      case "createPackTask":
        let status_1 =
          jobType === "createPickTask"
            ? "picking"
            : jobType === "createPackTask"
            ? "packing"
            : "";
        payload = {
          list: [...job],
          owner: profile.firstName,
          initials: profile.initials,
          ownerId: authorId,
          jobType: jobType, // create/update/deletePickTask, create/update/deletePackTask
          status: status_1, // picking, pick_complete, n/a, packing, pack_complete
          flag: flag, // contains info like "order_view"
        };
        break;
      case "deletePickTask":
      case "deletePackTask":
        payload = {
          list: [...reduced_list],
          jobType: jobType,
          flag: flag,
        };
        break;
      case "updatePickTask":
      case "updatePackTask":
        // regular update, complete pick/pack tasks from staff view
        payload = {
          list: [...job.list],
          newStatus: job.newStatus,
          jobType: jobType,
          flag: flag,
        };
        break;
      case "mixedPickTask":
        payload = {
          list: [...job.list],
          jobType: jobType,
          flag: flag,
          missing: job.missing ? job.missing : 0,
          //
          owner: profile.firstName,
          initials: profile.initials,
          ownerId: authorId,
        };
        break;
      case "importJSONOrders":
        payload = {
          list: [...job],
          jobType,
          flag,
        };
        break;
      default:
        payload = {};
    }

    console.log("jobActions.js => payload", payload);
    execute(firestore, payload, dispatch); // returns  a promise
  };
};

/**
 *   @desc - reduce the minimum 3 "field" for each item
 *   for deleting tasks, mk sure only perform on items belong to current user
 *   filter list that belong to current user
 *
 *   @returns - only keep 3 fields, order ref, item-key, and task id
 *
 *   try to put all logic regarding filter/reduce list in this method,
 *     * not in Components, becuase Compoents are focusing on UI
 *     * not in Cloud Funcs, because Clouds are focusing on Database
 */

const reduceList = (job, jobType, flag, profile) => {
  var list = [...job];

  console.log("reduceList() input list:  ", list);
  var result;

  /**
   *
   */
  if (jobType === "deletePackTask") {
    var job_deletePack = {};
    job_deletePack = {
      packId:
        flag === "order_view"
          ? list[0].packId
          : flag === "staff_view"
          ? list[0].id
          : "task_id_unknown", // staff_view, info is from "tasks" collection
      order_docId: list[0].order_docId,
    };
    result = [job_deletePack];
  } else {
    /**
     * others
     */
    result = job
      .filter((i) => {
        if (flag === "staff_view") {
          return true; // staff view, no need check task owner
        }
        if (i.picker === profile.firstName) {
          return true;
        } else {
          console.log("canceling tasks, some are assigned to diff usr");
          return false;
        }
      })
      .map((j) => {
        return {
          /**
           * when deletePickTask from Staff view, since it uses 'task' collection, each task has 'id' field, not 'pickId'
           */
          pickId: flag === "staff_view" ? j.id : j.pickId,
          key: j.key, // item-keys for update orders
          order_docId: j.order_docId,
        };
      });
  }
  return result;
};

/**
 *  @desc - Begin using firestore to create a "job" doc in collection
 */

const execute = (firestore, payload, dispatch) => {
  return (
    firestore
      .collection("jobs")
      .add(payload)
      // .then(docRef => {
      //   docRef.get().then(snap => {
      //     docRef.update({ ...snap.data(), docId: docRef.id });
      //   });
      // })
      .then(() => {
        dispatch({ type: "CREATE_JOB", payload });
      })
      .catch((err) => {
        dispatch({ type: "CREATE_JOB_ERROR", err });
      })
  );
};

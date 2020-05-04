/**
 * do_mixedPickTask()
 *
 * @param  "itemkey"     current item's key
 * @param  "tasksObj"    tasks need to be updated in 'orders' collection
 * @param  "item_input"  current item retrieved frm itemlist
 */
module.exports = (itemkey, tasksObj, item_input) => {
  var fileP = "--- do_mixedPickTask() : ";
  var item = { ...item_input };

  let item_jobType = tasksObj[itemkey] ? tasksObj[itemkey].item_jobType : "";
  //
  console.log(`${fileP} orig item:  "`, item);
  console.log(`${fileP} ${item_jobType} itemkey:`, itemkey);
  //
  if (item_jobType === "") {
    console.log(`${fileP} item_jobType NOT SET! `, itemkey);
  } else if (item_jobType === "createPickTask") {
    let task = tasksObj[itemkey];
    item = {
      ...item,
      status: task.status,
      picker: task.owner,
      picker_init: task.initials,
      pickId: task.id,
    };
  } else if (item_jobType === "updatePickTask") {
    item = {
      ...item,
      status: tasksObj[itemkey].status,
    };
  }

  console.log(`${fileP} final item: `, item);
  return { ...item };
};

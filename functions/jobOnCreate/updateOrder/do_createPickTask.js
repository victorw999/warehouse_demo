/**
 * do_createPickTask() *
 *
 * @param  "itemkey"     current item's key
 * @param  "tasksObj"    tasks need to be updated in 'orders' collection
 * @param  "item_input"  current item retrieved frm itemlist
 */

module.exports = (itemkey, tasksObj, item_input) => {
  var item = { ...item_input };

  let task = tasksObj[itemkey];
  console.log("do_createPickTask---- item:", item);
  console.log("do_createPickTask---- task:", task);
  item = {
    ...item,
    status: task.status,
    picker: task.owner,
    picker_init: task.initials,
    pickId: task.id
  };

  return { ...item };
};

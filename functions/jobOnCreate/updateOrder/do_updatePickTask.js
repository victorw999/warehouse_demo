/**
 * do_updatePickTask() *
 *
 * @param  "itemkey"     current item's key
 * @param  "tasksObj"    tasks need to be updated in 'orders' collection
 * @param  "item_input"  current item retrieved frm itemlist
 */

module.exports = (itemkey, tasksObj, item_input) => {
  var item = { ...item_input };

  /**
   *  UDPATE PICK TASK
   */
  item = {
    ...item,
    status: tasksObj[itemkey].status
  };

  return { ...item };
};

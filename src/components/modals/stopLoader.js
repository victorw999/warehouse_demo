/** 
 *  @param - "changeStatefunc" will be a func, 
 *            which can change that func's the local state,
 *            in other words, stopLoader() will use "changeStatefunc" to manipulate its local var, 
 *            which controls "stopLoaderMsg"
 * 
 *  "stopLoader() "
      will wait for 1 sec,
      then change props to 'stop_loader', to let Loader.js stop animation
      wait another 1 sec
      then change props back to "", to reset the loader button
 * */

export default function (changeStatefunc) {
  console.log("stopLoader.js called");
  (async () => {
    await setTimeout(() => {
      changeStatefunc("stop_loader");
    }, 1000);
    await setTimeout(() => {
      changeStatefunc(""); // reset
    }, 1000);
  })();
}

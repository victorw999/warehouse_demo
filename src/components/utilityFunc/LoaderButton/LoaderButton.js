// REF: https://stackoverflow.com/q/47606594/5844090

// Button component
import Loader from "./Loader";
import React from "react";
const LoaderButton = ({
  handleClick,
  showLoader,
  btnName,
  btnFormat,
  hasIcon,
  icon,
  iconPos = "",
  animationDuration
}) => {
  const iconPos_class = iconPos => {
    if (iconPos === "") {
      return "right"; //default
    } else if (iconPos === "middle") {
      return "";
    }
  };
  return (
    <div>
      <button
        className={btnFormat}
        onClick={() => {
          /**
           * Below logic in async is applied to all LoaderButton instances.
           * we limit animation to run for a fixed duration
           *  @props - 1. "animationDuration" can be passed in as a time
           *           2. but when value is "infinite", the animation persist
           *              e.g.:
           *              when picking (order_view), we need to wait "picking" status
           *              fully updated in order collections, so 'create pick/pack' can not
           *              be clicked for second time.
           *              this "infinite" value is used in BtnPick.js, BtnPack.js
           *
           **/
          (async () => {
            let duration = animationDuration ? animationDuration : 3000; // default
            await showLoader(true);
            if (animationDuration !== "infinite") {
              await setTimeout(() => {
                showLoader(false);
              }, duration);
            }
          })();

          handleClick();
        }}
      >
        {btnName}
        {hasIcon ? (
          <i className={"material-icons " + iconPos_class(iconPos)}> {icon} </i>
        ) : (
          ""
        )}
      </button>
    </div>
  );
};

export default Loader(LoaderButton);

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
  iconPos = ""
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
          showLoader();
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

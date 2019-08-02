import React, { useState, useEffect } from "react";

/**
 * Tutorial: https://spin.atomicobject.com/2019/04/24/react-integer-input/
 * only allow integer
 */

// this structure is using hooks in func, instead of using class

const isValid = (value, min, max) =>
  value !== "" &&
  value !== "-" &&
  (min === undefined || value >= min) &&
  (max === undefined || value <= max);

const IntegerInput = ({ value, min, max, onChange }) => {
  const regexp = new RegExp(`^-?[0-9]*$`);
  const [internalValue, setInternalValue] = useState(value);
  const [valid, setValid] = useState(isValid(value, min, max));

  //
  /**
   * useEffect hook is similar to componentDidUpdate, so i update internalValue
   * to prop's value in this func.
   *  */
  useEffect(() => {
    setInternalValue(value);
  }, [value]); //tell React to skip applying an effect if value hasn’t changed between re-renders

  const handleChange = event => {
    const newValue = event.target.value;
    if (regexp.test(newValue)) {
      setInternalValue(newValue);
      let newValid = isValid(newValue, min, max);
      setValid(newValid);
      if (newValid) {
        onChange(newValue);
      }
    }
  };

  return (
    <div>
      <input
        type="number"
        // className={valid ? "" : "invalid"}
        className={
          valid
            ? "btn-flat green lighten-5  center-align"
            : "btn-flat pink lighten-5 pink-text center-align"
        }
        value={internalValue}
        onChange={handleChange}
        // onChange={event => {
        //   const newValue = event.target.value;
        //   if (regexp.test(newValue)) {
        //     setInternalValue(newValue);
        //     let newValid = isValid(newValue, min, max);
        //     setValid(newValid);
        //     if (newValid) {
        //       onChange(newValue);
        //     }
        //   }
        // }}
        onBlur={() => {
          if (internalValue < min) {
            setInternalValue(min);
          } else if (internalValue > max) {
            setInternalValue(max);
          } else {
            setInternalValue(value);
          }
          setValid(true);
        }}
      />
      {/* <h5>valid: {valid ? "true" : "false"} </h5>
      <h5>internalValue: {internalValue} </h5> */}
    </div>
  );
};

/**
 * set min max as (0 ~ 100)
 * */

// const IntegerInput = props => {
//   const [value, setValue] = useState(props.value);

//   const handleChange = value => e => {
//     // setValue(value);
//     console.log(" ** " + e.target.value);
//     // console.log(" ** " + value);
//   };

//   return (
//     <div>
//       <IntegerInputCore
//         value={value}
//         min={props.min}
//         max={props.max}
//         onChange={value => setValue(value)}
//         // onChange={handleChange(value)}
//       />
//       {/* <input type="number" value="99" onChange={handleChange(value)} /> */}
//     </div>
//   );
// };

export default IntegerInput;

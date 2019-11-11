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

// const IntegerInput = ({ value, min, max, onChange }) => {
const IntegerInput = ({ item, min, max, onChange }) => {
  var value = item.quantity;
  const regexp = new RegExp(`^-?[0-9]*$`);

  const [internalValue, setInternalValue] = useState(0);
  const [valid, setValid] = useState(isValid(value, min, max));
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    onChange({ value: value, msg: msg });
  }, [msg]);

  const handleChange = event => {
    const newValue = event.target.value;
    if (regexp.test(newValue)) {
      setInternalValue(newValue);
      let newValid = isValid(newValue, min, max);

      setValid(newValid);
      if (newValid) {
        setMsg("");
        onChange({ value: newValue, msg: msg });
      } else {
        if (newValue < min) {
          setMsg("too small");
        } else if (newValue > max) {
          setMsg("too big");
        } else {
          setMsg("not valid");
        }
        onChange({ value: value, msg: msg });
      }
    }
  };

  return (
    <div>
      <input
        type="number"
        className={
          valid
            ? "btn-flat green lighten-5 center-align"
            : "btn-flat pink lighten-5 pink-text center-align"
        }
        value={internalValue}
        onChange={handleChange}
        onBlur={() => {
          if (internalValue < min) {
            setInternalValue(min);
            // setMsg("reset to min");
            onChange({ value: min, msg: "" });
          } else if (internalValue > max) {
            setInternalValue(max);
            // setMsg("reset to max");
            onChange({ value: max, msg: "" });
          } else {
            setInternalValue(value);
          }

          setValid(true);
        }}
      />
    </div>
  );
};

export default IntegerInput;

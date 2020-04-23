import React, { useEffect, useState } from "react";

const Message = ({ msg, timeout }) => {
  const [m, setM] = useState(msg);
  useEffect(() => {
    const timer = setTimeout(() => {
      setM("");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return <div className="red">{m}</div>;
};
export default Message;

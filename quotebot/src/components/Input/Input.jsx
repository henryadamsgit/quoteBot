
import React from "react";
import "./Input.scss";

const Input = ({ placeholder }) => {
  return (
    <form className="form">
      <input className="input-field" type="text" placeholder={placeholder} />
    </form>
  );
};

export default Input;

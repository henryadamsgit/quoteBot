import React from "react";
import "./Button.scss";

const Button = ({ onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      new quote
    </button>
  );
};

export default Button;

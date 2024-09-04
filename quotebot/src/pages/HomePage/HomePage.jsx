import React from "react";
import "./HomePage.scss";
import Quotes from "../../components/Quotes/Quotes";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Title from "../../components/TItle/Title";

const HomePage = () => {
  const onClick = () => {};
  return (
    <>
      <Title />
      <Quotes />
      <Input />
      <Button onClick={onClick} />
    </>
  );
};

export default HomePage;

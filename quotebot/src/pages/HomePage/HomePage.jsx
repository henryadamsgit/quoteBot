import React from "react";
import "./HomePage.scss";
import Quotes from "../../components/Quotes/Quotes";
import Input from "../../components/Input/Input";
import Title from "../../components/Title/Title";

const HomePage = () => {
  return (
    <>
      <Title />
      <Quotes />
      <Input />
    </>
  );
};

export default HomePage;

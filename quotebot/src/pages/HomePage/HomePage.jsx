import React from "react";
import "./HomePage.scss";
import Quotes from "../../components/Quotes/Quotes";
import Title from "../../components/Title/Title";
import Time from "../../components/Time/Time";

const HomePage = () => {
  return (
    <div className="homePage">
      <Title />
      <Quotes />
      <Time />
    </div>
  );
};

export default HomePage;

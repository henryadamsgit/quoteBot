import React from "react";
import "./HomePage.scss";
import Quotes from "../../components/Quotes/Quotes";
import Title from "../../components/Title/Title";

const HomePage = () => {
  return (
    <div className="homePage">
      <Title />
      <Quotes />
    </div>
  );
};

export default HomePage;

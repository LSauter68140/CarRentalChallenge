import React, { useState } from "react";
import "./App.css";
import { ShowCar } from "./components/showCar";

const App = () => {
  const [content, setContent] = useState("");

  return (
    <div>
      <h1 className="mainTitle">Car Rental Application</h1>
      <p className="content">
        {content === "" ? "Click on one Button ! " : "You chose : " + content}
      </p>
      <ShowCar fct={setContent} />
    </div>
  );
};

export default App;

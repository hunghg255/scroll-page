import React from "react";

import "./App.css";
import ScrollPage from "./components/ScrollPage";

function App() {
  return (
    <ScrollPage isHorizontalScroll={true} speed={0.06}>
      <div className="box">DIV 1</div>
      <div className="box">DIV 2</div>
      <div className="box">DIV 3</div>
      <div className="box">DIV 4</div>
    </ScrollPage>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";


ReactDOM.render(
    <App />,
    document.getElementById('root')
)

// Needed for Hot Module Replacement
if (module.hot) {
  module.hot.accept()
}

//npm start
//npm run buildDev
//npm run buildProd
//http://localhost:8080
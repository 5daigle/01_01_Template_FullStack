import React from "react";
import ReactDOM from "react-dom";

import App from "./App";


ReactDOM.render(
    <App />,
    document.getElementById('root')
);

// Needed for Hot Module Replacement
if(typeof(module.hot) !== 'undefined') { // eslint-disable-line no-undef  
  module.hot.accept()                    // eslint-disable-line no-undef  
}

//npm start
//npm run buildDev
//npm run buildProd
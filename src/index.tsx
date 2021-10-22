import * as React from "react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom";

import App from "./Components/App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);

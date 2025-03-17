import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Container/App"; // Make sure this path is correct
import { Provider } from "react-redux";
import store from "./Storage/Redux/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

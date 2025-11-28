import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import { past } from "./config/config.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={past}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

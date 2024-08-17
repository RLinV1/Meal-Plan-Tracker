import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import "./index.css";
import { Provider } from 'react-redux';
import store from './redux/store';
import ForgotPassword from "./ForgotPassword";

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot" element={<ForgotPassword />} />
      </Routes>
    </Router>
  </Provider>
);

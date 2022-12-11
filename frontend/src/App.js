import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import { useSelector } from "react-redux";
import Home from "./pages/Home/Home";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile/Profile";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  console.log(loading, "loading valueee");
  return (
    <BrowserRouter>
      <div className="App">
        {loading && (
          <div className="spinner-parent">
            <div className="spinner-border text-white" role="status"></div>
          </div>
        )}
        <Toaster position="top-center" reverseOrder={false} />
        <div className="blur" style={{ top: "-18%", right: "0" }}></div>
        <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>
        {/* <Auth /> */}
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

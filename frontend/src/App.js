import React,{ useEffect} from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import { useDispatch,useSelector } from "react-redux";
import Home from "./pages/Home/Home";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/protectedRoute";
import PublicRoutes from "./components/publicRoutes";
import { fetchUserById } from "./redux/userSlice"

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { user } = useSelector(state => state.users);
  useEffect(() => {
    if(!user){
      dispatch(fetchUserById(token));
    }
  // eslint-disable-next-line
  }, [user])
  const { loading } = useSelector((state) => state.alerts);
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
          <Route path="/" element={<PublicRoutes><Auth /></PublicRoutes>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

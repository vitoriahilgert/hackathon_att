import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Home />} path="/home" />
    </Routes>
  );
};

export default AppRoutes;

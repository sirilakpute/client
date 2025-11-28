import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// นำเข้าหน้า
import Login from "./components/Login";
import Home from "./components/Home";
import Detail from "./components/Detail";
import CameraManage from "./components/CameraPage";
import Stream from "./components/Stream"; // เพิ่ม Stream
import Addcamera from "./components/Addcamera";
import Camera_table from "./components/Camera_table";
import MoveCamera from "./components/MoveCamera";
// ปุ่มลอย
import NavbarFloatingMenu from "./components/Navbar";

// Private Route
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/Login";

  return (
    <div>
      {/* แสดงปุ่มลอยเฉพาะตอนล็อกอินแล้ว */}
      {!hideNavbar && <NavbarFloatingMenu />}

      <Routes>
        {/* ✔ หน้าแรกคือ Login */}
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />

        {/* หน้า Home ต้องล็อกอินก่อน */}
        <Route
          path="/Home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/*  หน้า Detail */}
        <Route
          path="/Detail/:id"
          element={
            <PrivateRoute>
              <Detail />
            </PrivateRoute>
          }
        />

        {/* 🔒 หน้า จัดการกล้อง */}
        <Route
          path="/CameraManage/:id"
          element={
            <PrivateRoute>
              <CameraManage />
            </PrivateRoute>
          }
        />

        <Route
          path="/Addcamera/:id"
          element={
            <PrivateRoute>
              <Addcamera />
            </PrivateRoute>
          }
        />
        <Route
          path="/Addcamera/:id"
          element={
            <PrivateRoute>
              <Addcamera />
            </PrivateRoute>
          }
        />
        <Route
          path="/Camera_table"
          element={
            <PrivateRoute>
              <Camera_table />
            </PrivateRoute>
          }
        />
           <Route
          path="/MoveCamera/:id"
          element={
            <PrivateRoute>
              <MoveCamera/>
            </PrivateRoute>
          }
        />

        <Route path="/stream/:id/live" 
        element={<Camera_table />} />
        {/* 🔒 หน้า Stream (ตาราง Live Stream) */}
        <Route
          path="/Stream/:id"
          element={
            <PrivateRoute>
              <Stream />
            </PrivateRoute>
            
            
          }
        />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./compun/Login";
import Home from "./compun/Home";
import Detail from "./compun/Detail";
import CameraPage from "./compun/CameraPage";
import NavbarFloatingMenu from "./compun/NavbarFloatingMenu";
import Stream from "./compun/Stream"; // ← เพิ่มตรงนี้
import Camera_table from "./compun/Camera_table";
// ฟังก์ชันตรวจสอบว่าล็อกอินหรือยัง
function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem("user");
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/Home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/Detail/:id"
          element={
            <PrivateRoute>
              <Detail />
            </PrivateRoute>
          }
        />

        {/* Camera page (ต้องมี :id) */}
        <Route
          path="/CameraPage/:id"
          element={
            <PrivateRoute>
              <CameraPage />
            </PrivateRoute>
          }
        />

        {/* Stream (ต้องมี :id) */}
        <Route
          path="/Stream/:id"
          element={
            <PrivateRoute>
              <Stream />
            </PrivateRoute>
          }
        />
        <Route
          path="/stream/:id/live"
          element={
            <PrivateRoute>
              <Camera_table />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* อยู่ทุกหน้า ยกเว้นหน้า login (NavbarFloatingMenu จะเช็คเอง) */}
      <NavbarFloatingMenu />
    </>
  );
}

export default App;

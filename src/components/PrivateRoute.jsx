import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = sessionStorage.getItem("user");

  //  ถ้ายังไม่ล็อกอิน → ส่งกลับหน้า Login
  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  // ✔ ผ่าน → เข้าได้
  return children;
}

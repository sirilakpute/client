import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavbarFloatingMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ← ใช้เช็ค path

  // ถ้าเป็นหน้า login → ไม่แสดง Navbar
  if (location.pathname === "/login") return null;

  const goBack = () => {
    if (window.confirm("ต้องการย้อนกลับหรือไม่?")) {
      navigate(-1);
    }
  };

  const logout = () => {
    if (window.confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      sessionStorage.removeItem("user");
      navigate("/login", { replace: true });

      setTimeout(() => {
        window.location.reload();
      }, 50);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-2000 flex flex-col items-end gap-3">
      {/* ปุ่มย้อนกลับ */}
      {open && (
        <div className="flex items-center gap-2">
          <div className="bg-white px-3 py-1.5 rounded-xl text-sm text-gray-700 shadow-md">
            ย้อนกลับ
          </div>

          <button
            onClick={goBack}
            className="w-14 h-14 rounded-full text-white text-2xl flex items-center justify-center shadow-lg 
            bg-linear-to-br from-purple-500 to-indigo-600 hover:scale-105 transition"
          >
            ↩
          </button>
        </div>
      )}

      {/* ปุ่มออกจากระบบ */}
      {open && (
        <div className="flex items-center gap-2">
          <div className="bg-white px-3 py-1.5 rounded-xl text-sm text-gray-700 shadow-md">
            ออกจากระบบ
          </div>

          <button
            onClick={logout}
            className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg
            bg-linear-to-br from-red-500 to-orange-500 hover:scale-105 transition"
          >
            <span className="text-2xl">⎋</span>
          </button>
        </div>
      )}

      {/* ปุ่มหลัก */}
      <button
        onClick={() => setOpen(!open)}
        className="w-16 h-16 rounded-full text-white text-3xl font-bold shadow-xl 
        bg-linear-to-tr from-purple-500 via-indigo-500 to-sky-400 
        hover:scale-110 transition"
      >
        ☰
      </button>
    </div>
  );
}

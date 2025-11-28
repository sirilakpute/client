import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavbarFloatingMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ฟังก์ชันย้อนกลับ
  const goBack = () => {
    if (window.confirm("ต้องการย้อนกลับหรือไม่?")) {
      navigate(-1);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    if (window.confirm("คุณต้องการออกจากระบบหรือไม่?")) {

      // ❗ ลบข้อมูลผู้ใช้
      sessionStorage.removeItem("user");

      // ❗ ป้องกันย้อนกลับ
      navigate("/Login", { replace: true });

      // รีโหลดเพื่อเคลียร์ cache stack (กันกดย้อนกลับ)
      setTimeout(() => {
        window.location.reload();
      }, 50);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "14px",
      }}
    >
      {/* ปุ่มย้อนกลับ + Label */}
      {open && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={labelStyle}>ย้อนกลับ</div>
          <button
            onClick={goBack}
            style={{
              ...subButtonStyle,
              background: "linear-gradient(135deg, #a03bff, #6d3cff)",
            }}
          >
            ↩
          </button>
        </div>
      )}

      {/* ปุ่มออกจากระบบ + Label */}
      {open && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={labelStyle}>ออกจากระบบ</div>

          <button
            onClick={logout}
            style={{
              ...subButtonStyle,
              background: "linear-gradient(135deg, #ff3b3b, #ff7a00)",
            }}
          >
            <span style={{ fontSize: "23px" }}>⎋</span>
          </button>
        </div>
      )}

      {/* ปุ่มเมนูหลัก */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontSize: "28px",
          fontWeight: "bold",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          background: "linear-gradient(135deg, #a03bff, #4f4fff, #1ba4ff)",
          transition: "0.25s",
        }}
      >
        ☰
      </button>
    </div>
  );
}

/* ป้ายข้อความ */
const labelStyle = {
  background: "white",
  padding: "7px 14px",
  borderRadius: "12px",
  fontSize: "14px",
  color: "#333",
  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
};

/* ปุ่มย่อย */
const subButtonStyle = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  color: "white",
  fontSize: "22px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
  transition: "0.2s",
};

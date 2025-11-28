import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_url } from "../config/config";

// นำเข้ารูปโลโก้
import Logo from "../Zoo/IMG4.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      // navigate("/Home");
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(API_url + "/v1/login123", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setErrorMsg(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        sessionStorage.setItem("login_error", data.message);
        setLoading(false);
        return;
      }

      sessionStorage.setItem("user", data.token);
      alert("เข้าสู่ระบบสำเร็จ!");
      setLoading(false);
      navigate("/Home");
    } catch (error) {
      console.log("Error:", error);
      setErrorMsg("ไม่สามารถเชื่อมต่อ API ได้");
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background:
          "linear-gradient(90deg, #67d89cff, #e5eee7ff, #4fdbbfff)",
        padding: "20px",
      }}
    >
      <div
        className="shadow-lg p-4 w-100"
        style={{
          maxWidth: "24rem",
          borderRadius: "25px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        {/* โลโก้ Zoo ตรงกลางด้านบน */}
        <div className="text-center mb-3">
          <img
            src={Logo}
            alt="Zoo Logo"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "contain",
              marginTop: "-10px",
              filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.25))",
            }}
          />
        </div>

        <h2
          className="text-center fw-bold mb-4"
          style={{ color: "#084c41", letterSpacing: "1px" }}
        >
          เข้าสู่ระบบ
        </h2>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label fw-semibold">อีเมล</label>
          <input
            type="email"
            className="form-control p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={{
              borderRadius: "12px",
              border: "1px solid #bcd7db",
            }}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label fw-semibold">รหัสผ่าน</label>
          <input
            type="password"
            className="form-control p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              borderRadius: "12px",
              border: "1px solid #bcd7db",
            }}
          />
        </div>

        {/* ERROR */}
        {errorMsg && (
          <div className="alert alert-danger py-2 text-center">{errorMsg}</div>
        )}

        {/* LOGIN BUTTON */}
        <button
          className="btn w-100 fw-bold text-white p-2"
          style={{
            borderRadius: "14px",
            background: "linear-gradient(90deg, #00c853, #00e676)",
            fontSize: "1.05rem",
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        {/* COPYRIGHT */}
        <div className="text-center mt-4">
          <small style={{ color: "#355c7d", opacity: 0.8 }}>
            © 2024 ZooTV. All rights reserved.
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;

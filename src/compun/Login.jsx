import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Zoo/lolo.png";
import Loading from "./Loading";
import { API_url } from "./config/config";

export default function Login() {
  const navigate = useNavigate();

  const [openLogin, setOpenLogin] = useState(false);
  const [slide, setSlide] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // เปิด popup Login
  const handleOpenLogin = () => {
    setSlide(true);
    setTimeout(() => setOpenLogin(true), 300);
  };

  // ปิด popup Login
  const handleCloseLogin = () => {
    setOpenLogin(false);
    setSlide(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      setErrorMsg("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

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
        setLoading(false);
        return;
      }

      sessionStorage.setItem("user", data.token);

      setLoading(false);
      navigate("/Home");
    } catch (err) {
      console.log("Login Error:", err);
      setErrorMsg("ไม่สามารถเชื่อมต่อ API ได้");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="relative min-h-screen overflow-hidden animated-diagonal-gradient">

      {/* ===== Bubbles Background ===== */}
      <BubbleLayer />

      {/* ===== WELCOME SCREEN ===== */}
      <div
        className={`absolute inset-0 flex flex-col justify-center items-center text-white transition-transform duration-500 ${
          slide ? "-translate-x-[55%] scale-90 opacity-40" : "translate-x-0 opacity-100"
        }`}
      >
        <img src={Logo} className="w-40 drop-shadow-xl mb-6" />

        <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg text-center text-[#0b0b0b]">
          ยินดีต้อนรับสู่ระบบ ZooTV
        </h1>

        <p className="text-xl font-semibold opacity-95 mt-3 text-center text-[#0b0b0b]">
          ระบบจัดการกล้อง CCTV และ Streaming ZooTV
        </p>

        <button
          onClick={handleOpenLogin}
          className="mt-6 px-7 py-3 text-xl bg-white text-[#254534] font-bold rounded-full shadow-md hover:scale-105 transition"
        >
          เข้าสู่ระบบ →
        </button>
      </div>

      {/* ===== LOGIN POPUP ===== */}
      {openLogin && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 relative animate-slideUp">

            {/* LOGO */}
            <div className="flex justify-center mb-2">
              <img
                src={Logo}
                className="w-32 h-32 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              />
            </div>

            {/* CLOSE */}
            <button
              onClick={handleCloseLogin}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
            >
              ×
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-emerald-600 mb-4 text-center">
              เข้าสู่ระบบ
            </h2>

            {/* EMAIL */}
            <label className="font-semibold text-gray-700">อีเมล</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl mb-3 mt-1 focus:ring-2 focus:ring-emerald-300 outline-none"
              placeholder="อีเมลของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            {/* PASSWORD */}
            <label className="font-semibold text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full p-3 border rounded-xl mb-3 mt-1 focus:ring-2 focus:ring-emerald-300 outline-none"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            {/* ERROR */}
            {errorMsg && (
              <div className="text-red-600 bg-red-100 p-2 rounded-xl text-center mb-3">
                {errorMsg}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-linear-to-r from-emerald-600 to-emerald-400 text-white font-bold rounded-xl shadow hover:opacity-90"
            >
              เข้าสู่ระบบ →
            </button>

          </div>
        </div>
      )}

      {/* ===== KEYFRAMES + GRADIENT ===== */}
      <style>{`
        @keyframes slideUp {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }

        /* ==== DIAGONAL GRADIENT ANIMATION ==== */
        @keyframes diagonalGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-diagonal-gradient {
          background: linear-gradient(
            135deg,
            #6ee7ff,
            #7fffe0,
            #8dfd9b,
            #6ee7ff
          );
          background-size: 300% 300%;
          animation: diagonalGradient 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

/* BUBBLES */
function BubbleLayer() {
  return (
    <>
      <div className="bubble w-36 h-36 top-5 left-8"></div>
      <div className="bubble w-48 h-48 top-1/4 right-10"></div>
      <div className="bubble w-28 h-28 bottom-28 left-1/4"></div>
      <div className="bubble w-40 h-40 bottom-10 right-1/3"></div>
      <div className="bubble w-56 h-56 top-1/3 left-1/3"></div>
      <div className="bubble w-32 h-32 bottom-1/3 right-1/5"></div>
      <div className="bubble w-24 h-24 top-1/2 left-10"></div>
      <div className="bubble w-20 h-20 bottom-1/4 right-16"></div>

      <style>{`
        @keyframes bubbleMove {
          0% { transform: translate(0,0) scale(1); }
          25% { transform: translate(35px,-25px) scale(1.08); }
          50% { transform: translate(-30px,20px) scale(0.97); }
          75% { transform: translate(20px,35px) scale(1.05); }
          100% { transform: translate(0,0) scale(1); }
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%,
              rgba(255,255,255,0.9),
              rgba(255,255,255,0.25) 40%,
              rgba(255,255,255,0.1) 65%,
              rgba(255,255,255,0.05) 80%);
          box-shadow:
              inset 0 0 20px rgba(255,255,255,0.8),
              inset 0 0 40px rgba(255,255,255,0.3),
              0 10px 30px rgba(0,0,0,0.15);
          opacity: 0.9;
          filter: blur(10px);
          animation: bubbleMove 12s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

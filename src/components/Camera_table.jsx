import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Camera_table() {
  const location = useLocation();
  const navigate = useNavigate();

  // รับข้อมูลจาก Stream.jsx
  const streams = location.state?.streams || [];

  // ถ้า streams ว่าง → ใช้ข้อมูลตัวอย่าง


  // สร้าง schedule จาก streams ที่ส่งมา
  const [schedule] = useState(
    streams.length > 0
      ? streams.map((s) => ({
          id: s.id,
          title: s.animal,
          video_url: s.image,          // ใช้ลิงก์ live stream จากหน้า Stream
          start_time: s.start + ":00",
          end_time: s.end + ":00",
        }))
      : defaultSchedule
  );

  const [currentVideo, setCurrentVideo] = useState(null);
  const [status, setStatus] = useState("กำลังโหลด YouTube Player...");
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef(null);

  // โหลด YouTube API
  useEffect(() => {
    if (window.YT) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => initPlayer();
  }, []);

  // สร้าง YouTube Player
  const initPlayer = () => {
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player("yt-player", {
      height: "100%",
      width: "100%",
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        mute: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          setPlayerReady(true);
          setStatus("พร้อมใช้งาน | รอเวลาออกอากาศ");
        },
        onError: () => {
          setStatus("เกิดข้อผิดพลาดในการโหลดวิดีโอ");
        },
      },
    });
  };

  // ดึง YouTube ID
  const extractYouTubeId = (url) => {
    const regExp = /(?:embed\/|v=|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // เล่นวิดีโอ
  const playVideo = (url) => {
    if (!playerReady || !playerRef.current) return;

    const id = extractYouTubeId(url);
    if (id) {
      playerRef.current.loadVideoById(id);
    }
  };

  // หยุดวิดีโอ
  const stopVideo = () => {
    if (playerRef.current?.stopVideo) {
      playerRef.current.stopVideo();
    }
  };

  // ตรวจสอบเวลา real-time
  useEffect(() => {
    if (!playerReady) return;

    const checkSchedule = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const timeStr = now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const active = schedule.find((item) => {
        const [sh, sm] = item.start_time.split(":").map(Number);
        const [eh, em] = item.end_time.split(":").map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        return currentMinutes >= startMin && currentMinutes < endMin;
      });

      if (active) {
        if (!currentVideo || currentVideo.id !== active.id) {
          setCurrentVideo(active);
          playVideo(active.video_url);
        }
        setStatus(`กำลังถ่ายทอด: ${active.title} | ${timeStr}`);
      } else {
        if (currentVideo) stopVideo();
        setCurrentVideo(null);
        setStatus(`รอออกอากาศถัดไป | ${timeStr}`);
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 3000);
    return () => clearInterval(interval);
  }, [playerReady, schedule, currentVideo]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        color: "#fff",
        fontFamily: "'Prompt', 'Kanit', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ปุ่มกลับ */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 20,
          background: "rgba(255,255,255,0.2)",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ← กลับ
      </button>

      {/* YouTube Player */}
      <div
        id="yt-player"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      {/* Status */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.6)",
          padding: "12px 28px",
          borderRadius: "50px",
          zIndex: 10,
        }}
      >
        {status}
      </div>

      {/* Schedule list */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(0,0,0,0.6)",
          padding: "15px 20px",
          borderRadius: "16px",
          zIndex: 10,
          fontSize: "0.95rem",
        }}
      >
        <div style={{ marginBottom: "8px", fontWeight: "bold", color: "#58aaff" }}>
          ตารางออกอากาศวันนี้
        </div>
        <ul style={{ paddingLeft: "18px", lineHeight: "1.6" }}>
          {schedule.map((item) => (
            <li
              key={item.id}
              style={{
                color: currentVideo?.id === item.id ? "#58aaff" : "#ddd",
                fontWeight: currentVideo?.id === item.id ? "bold" : "normal",
              }}
            >
              {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)} :{" "}
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 100,
          fontSize: "1.4rem",
          fontWeight: "bold",
          color: "#58aaff",
          zIndex: 10,
        }}
      >
        ZOO LIVE CAM
      </div>
    </div>
  );
}

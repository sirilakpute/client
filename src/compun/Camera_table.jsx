import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Camera_table() {
  const location = useLocation();
  const navigate = useNavigate();

  // รับ schedule จาก Stream.jsx
  const streams = location.state?.streams || [];

  const [schedule] = useState(
    streams.length > 0
      ? streams.map((s) => ({
          id: s.id,
          title: s.animal,
          video_url: s.image,
          start_time: s.start + ":00",
          end_time: s.end + ":00",
        }))
      : []
  );

  const [currentVideo, setCurrentVideo] = useState(null);
  const [status, setStatus] = useState("กำลังโหลด YouTube Player...");
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef(null);

  /* ========================
        LOAD YOUTUBE API
  ======================== */
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

  /* ========================
        CREATE PLAYER
  ======================== */
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
          setStatus("โหลดวิดีโอผิดพลาด");
        },
      },
    });
  };

  /* ========================
        GET YOUTUBE ID
  ======================== */
  const extractYouTubeId = (url) => {
    const regExp = /(?:embed\/|v=|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  /* ========================
        PLAY VIDEO
  ======================== */
  const playVideo = (url) => {
    if (!playerReady || !playerRef.current) return;

    const id = extractYouTubeId(url);
    if (id) playerRef.current.loadVideoById(id);
  };

  /* ========================
        STOP VIDEO
  ======================== */
  const stopVideo = () => {
    if (playerRef.current?.stopVideo) playerRef.current.stopVideo();
  };

  /* ========================
        REALTIME CHECKER
  ======================== */
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
        return currentMinutes >= sh * 60 + sm && currentMinutes < eh * 60 + em;
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
        setStatus(`รอรอบถัดไป | ${timeStr}`);
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 3000);
    return () => clearInterval(interval);
  }, [playerReady, schedule, currentVideo]);

  return (
    <div className="fixed inset-0 bg-black text-white font-[Prompt] flex flex-col">

      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-20 px-5 py-2 bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition"
      >
        ← กลับ
      </button>

      {/* LOGO */}
      <div className="absolute top-5 left-28 text-2xl font-bold text-sky-400 z-20">
        ZOO LIVE CAM
      </div>

      {/* SCHEDULE LIST */}
      <div className="absolute top-5 right-5 bg-black/60 p-4 rounded-2xl z-20 text-sm w-56">
        <div className="text-sky-400 font-bold mb-2">ตารางออกอากาศวันนี้</div>
        <ul className="space-y-1">
          {schedule.map((item) => (
            <li
              key={item.id}
              className={`${
                currentVideo?.id === item.id ? "text-sky-400 font-bold" : "text-gray-300"
              }`}
            >
              {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)} : {item.title}
            </li>
          ))}
        </ul>
      </div>

      {/* YOUTUBE PLAYER */}
      <div id="yt-player" className="absolute inset-0 w-full h-full z-10" />

      {/* STATUS BAR */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-3 rounded-full z-20 text-sm">
        {status}
      </div>
    </div>
  );
}

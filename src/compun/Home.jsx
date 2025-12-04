import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_url } from "./config/config";
import NavbarFloatingMenu from "./NavbarFloatingMenu";

import Chan from "../Zoo/Chan.jpg";
import Kaen from "../Zoo/Kaen.jpg";
import Khao from "../Zoo/Khao.jpg";
import Nakhon from "../Zoo/Nakhon.jpg";
import Song from "../Zoo/Song.jpg";
import Ubon from "../Zoo/Ubon.jpg";

// โลโก้สวนสัตว์แต่ละแห่ง
const Zoologo = {
  1: Khao,
  2: Chan,
  3: Nakhon,
  4: Ubon,
  5: Song,
  6: Kaen,
};

// Static Zoo List
const StaticZooList = [
  { id_zoo: 1, zoo_name: "สวนสัตว์เปิดเขาเขียว" },
  { id_zoo: 2, zoo_name: "สวนสัตว์เชียงใหม่" },
  { id_zoo: 3, zoo_name: "สวนสัตว์โคราช" },
  { id_zoo: 4, zoo_name: "สวนสัตว์อุบลราชธานี" },
  { id_zoo: 5, zoo_name: "สวนสัตว์สงขลา" },
  { id_zoo: 6, zoo_name: "สวนสัตว์ขอนแก่น" },
];

const ZooInfo = {
  1: { en: "Khao Kheow Open Zoo", desc: "The largest open zoo in Thailand." },
  2: { en: "Chiangmai Zoo", desc: "Home of the famous panda house." },
  3: { en: "Nakhon Ratchasima Zoo", desc: "A popular family destination." },
  4: { en: "Ubon Zoo", desc: "Located in northeastern Thailand." },
  5: { en: "Songkhla Zoo", desc: "Beautiful scenic lake view." },
  6: { en: "Khon Kaen Zoo", desc: "Wildlife conservation programs." },
};

export default function Home() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

 useEffect(() => {
    fetch(API_url + "/zoo/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("Zoo List:", data);

        if (Array.isArray(data)) {
          setCards(data);
        }
      })
      .catch((err) => console.error("โหลดข้อมูลล้มเหลว:", err));
  }, []);

  return (
    <div className="relative min-h-screen py-10 px-4 animated-diagonal-bg overflow-hidden">
      {/* ===== Heading ===== */}
      <h1 className="text-center text-3xl font-extrabold text-green-800 drop-shadow mb-4">
        สวนสัตว์ทั่วประเทศไทย
      </h1>
      <p className="text-center text-gray-700 font-bold mb-10">
        ระบบการจัดการกล้อง CCTV และระบบ Streaming ZooTV
      </p>

      {/* ===== Cards Dashboard ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((item) => (
          <div
            key={item.id_zoo}
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all"
          >
            <div className="h-36 bg-linear-to-r from-[hsl(177,80%,71%)] to-[#01c479] flex items-center justify-center">
              <img
                src={Zoologo[item.id_zoo]}
                className="w-24 h-24 rounded-full bg-white p-2 shadow-md object-cover"
                alt=""
              />
            </div>

            <div className="p-5">
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold">
                รหัส: {String(item.id_zoo).padStart(2, "0")}
              </span>

              <h2 className="text-xl font-bold mt-3">{item.zoo_name}</h2>

              <p className="text-gray-600 text-sm">{ZooInfo[item.id_zoo].en}</p>

              <hr className="my-3" />

              <p className="text-gray-800 text-sm">
                {ZooInfo[item.id_zoo].desc}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  className="w-full py-3 rounded-xl font-bold text-white bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-md"
                  onClick={() => navigate(`/Detail/${item.id_zoo}`)}
                >
                  ดูรายละเอียด
                </button>

                <button
                  className="w-full py-3 rounded-xl font-bold text-white bg-linear-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 shadow-md"
                  onClick={() => navigate(`/Stream/${item.id_zoo}`)}
                >
                  ดูตาราง Stream
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Menu */}
      <NavbarFloatingMenu />

      {/* ===== BG Animation CSS ===== */}
      <style>{`
        @keyframes diagonalMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
.animated-diagonal-bg {
  background: linear-gradient(
    135deg,
    #ffffff,
    #dff7ff,
    #a5eaff,
    #71dbff,
    #ffffff
  );
  background-size: 350% 350%;
  animation: diagonalMove 10s ease-in-out infinite;
}

      `}</style>
    </div>
  );
}

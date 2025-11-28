import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_url } from "../config/config";

import Chan from "../Zoo/Chan.jpg";
import Kaen from "../Zoo/Kaen.jpg";
import Khao from "../Zoo/Khao.jpg";
import Nakhon from "../Zoo/Nakhon.jpg";
import Song from "../Zoo/Song.jpg";
import Ubon from "../Zoo/Ubon.jpg";

// โลโก้สวนสัตว์แต่ละแห่ง
const Zoologo = {
  "1": Khao, // เขาเขียว
  "2": Chan, // เชียงใหม่
  "3": Nakhon, // โคราช
  "4": Ubon, // อุบล
  "5": Song, // สงขลา
  "6": Kaen, // ขอนแก่น
};

//ข้อมูลภาษาอังกฤษ + รายละเอียด (ใช้แทน API)
const ZooInfo = {
  1: {
    en: "Khao Kheow Open Zoo",
    desc: "Khao Kheow Open Zoo, the largest open zoo in Thailand.",
  },
  2: {
    en: "Chiangmai Zoo",
    desc: "Chiangmai Zoo, home of the famous panda house.",
  },
  3: {
    en: "Nakhon Ratchasima Zoo",
    desc: "Nakhon Ratchasima Zoo, a popular family destination.",
  },
  4: {
    en: "Ubon Ratchathani Zoo",
    desc: "Ubon Ratchathani Zoo located in northeastern Thailand.",
  },
  5: {
    en: "Songkhla Zoo",
    desc: "Songkhla Zoo, a zoo with a beautiful scenic lake view.",
  },
  6: {
    en: "Khon Kaen Zoo",
    desc: "Khon Kaen Zoo, famous for wildlife conservation programs.",
  },
};

export default function Home() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch(API_url + "/allzoo")
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
    <div
      className="container-fluid py-5"
      style={{
        background:
          "linear-gradient(135deg, #49c8efff 0%, #ebf7f7ff 50%, #49c8efff 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <h1 className="h4 mb-4 text-center text-black fw-bold">
            สวนสัตว์ทั่วประเทศไทย <br />
          <span style={{ fontSize: "1rem", color: "#555" }}>
            ระบบการจัดการกล้อง CCTV และ ระบบ Streamming ZooTV
          </span>
        </h1>

        <div className="row g-4">
          {cards.map((item) => (
            <div key={item.id_zoo} className="col-12 col-md-6 col-lg-4">
              <div
                className="shadow-lg rounded-4 overflow-hidden"
                style={{ background: "white", borderRadius: "20px" }}
              >
                {/* ส่วนหัวกล่อง โลโก้ */}
                <div
                  style={{
                    height: "120px",
                    background: "linear-gradient(90deg, #3cf157ff, #71f8e6ff)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={Zoologo[item.id_zoo]}
                    alt="logo"
                    style={{
                      width: "95px",
                      height: "95px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      background: "white",
                      padding: "10px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>

                {/* เนื้อหา */}
                <div className="p-4">
                  {/* Badge รหัส */}
                  <span
                    style={{
                      background: "#e8f0fe",
                      color: "#1a73e8",
                      padding: "4px 10px",
                      borderRadius: "10px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    รหัส: {String(item.id_zoo).padStart(2, "0")}
                  </span>

                  {/* ชื่อไทย */}
                  <h4 className="fw-bold mt-3" style={{ fontSize: "1.2rem" }}>
                    {item.zoo_name}
                  </h4>

                  {/* ชื่ออังกฤษ */}
                  <div
                    style={{
                      color: "#778",
                      marginTop: "-3px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {ZooInfo[item.id_zoo].en}
                  </div>

                  <hr />

                  {/* รายละเอียด */}
                  <div style={{ fontSize: "0.95rem", color: "#333" }}>
                    {item.zoo_name}
                  </div>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#777",
                      fontStyle: "italic",
                    }}
                  >
                    {ZooInfo[item.id_zoo].desc}
                  </div>

                  {/* ปุ่ม */}
                  <div className="mt-4 d-flex flex-column gap-2">
                    <button
                      className="btn w-100 fw-bold text-white"
                      style={{
                        background: "linear-gradient(90deg, #00cc44, #00e65f)",
                        borderRadius: "12px",
                      }}
                      onClick={() => navigate(`/Detail/${item.id_zoo}`)}
                    >
                      ดูรายละเอียด
                    </button>

                    <button
                      className="btn w-100 fw-bold text-white"
                      style={{
                        background: "linear-gradient(90deg, #ff9d00, #ffa600)",
                        borderRadius: "12px",
                      }}
                      onClick={() => navigate(`/Stream/${item.id_zoo}`)}
                    >
                      ดูตาราง Stream
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

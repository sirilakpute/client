import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_url } from "./config/config";

import Chan from "../Zoo/Chan.jpg";
import Kaen from "../Zoo/Kaen.jpg";
import Khao from "../Zoo/Khao.jpg";
import Nakhon from "../Zoo/Nakhon.jpg";
import Song from "../Zoo/Song.jpg";
import Ubon from "../Zoo/Ubon.jpg";

const Zoologo = {
  1: Khao,
  2: Chan,
  3: Nakhon,
  4: Ubon,
  5: Song,
  6: Kaen,
};

export default function Stream() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [streams, setStreams] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    image: "",
    id_animal: "",
    start: "",
    end: "",
    status: "online",
  });

  /* LOAD ANIMALS */
  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_url}/zoo/${id}`);
      const json = await res.json();
      if (json?.animals) setAnimals(json.animals);
    } finally {
      setLoading(false);
    }
  };

  /* LOAD STREAM */
  const fetchStreamData = async () => {
    try {
      const res = await fetch(`${API_url}/zoo/streamByzoo/${id}`);
      const data = await res.json();

      const formatted = (data.stream || []).map((item) => ({
        id: item.st_id,
        image: item.st_url,
        animal: item.animal?.animal_name || "ไม่ระบุ",
        id_animal: item.st_animal,
        start: (item.s_time || "00:00").substring(0, 5),
        end: (item.e_time || "00:00").substring(0, 5),
        status: item.st_status === 1 ? "online" : "offline",
      }));

      setStreams(formatted);
    } catch (err) {
      console.error("โหลด Stream ผิดพลาด:", err);
    }
  };

  useEffect(() => {
    fetchStreamData();
    fetchAnimals();
  }, [id]);

  /* OPEN EDIT */
  const openEdit = (stream) => {
    setEditId(stream.id);
    setFormData({
      image: stream.image,
      id_animal: stream.id_animal,
      start: stream.start,
      end: stream.end,
      status: stream.status,
    });
    setIsOpen(true);
  };

  /* SUBMIT */
  const submitForm = async () => {
    const payload = {
      st_zoo: parseInt(id),
      st_animal: parseInt(formData.id_animal),
      s_time: formData.start + ":00",
      e_time: formData.end + ":00",
      st_url: formData.image,
      st_status: formData.status === "online" ? 1 : 2,
    };

    try {
      const url = editId ? `${API_url}/stream/${editId}` : `${API_url}/stream`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");

      alert(editId ? "แก้ไขสำเร็จ" : "เพิ่มรายการสำเร็จ");
      setIsOpen(false);
      setEditId(null);

      fetchStreamData();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  /* DELETE */
  const deleteStream = async (deleteId) => {
    if (!window.confirm("ต้องการลบรายการนี้หรือไม่?")) return;

    try {
      const res = await fetch(`${API_url}/stream/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      setStreams((prev) => prev.filter((x) => x.id !== deleteId));
      alert("ลบข้อมูลสำเร็จ");
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  /* ====================== UI ====================== */
  return (
    <div className="min-h-screen bg-[#eef3ff] pb-10">
      <header className="bg-linear-to-r from-emerald-600 to-blue-500 p-8 md:p-12 pb-20 text-white rounded-b-3xl relative">
        <button
          onClick={() => navigate(-1)}
          className="text-lg md:text-xl hover:underline"
        >
          ← กลับ
        </button>

        <img
          src={Zoologo[id]}
          className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white absolute right-4 top-4 md:right-6 md:top-6 object-cover"
        />
      </header>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-3 md:px-6 mt-8">
        {/* SUMMARY */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <p className="text-gray-500 font-semibold">จำนวน Live Stream</p>
          <h1 className="text-3xl md:text-4xl font-bold">{streams.length}</h1>
        </div>

        {/* TITLE + BUTTON */}
        <div className="flex flex-col md:flex-row justify-between gap-3 items-center my-4">
          <h2 className="text-xl md:text-2xl font-bold">ตาราง Live Stream</h2>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditId(null);
                setFormData({
                  image: "",
                  id_animal: "",
                  start: "",
                  end: "",
                  status: "online",
                });
                setIsOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-white font-bold bg-purple-600 hover:bg-purple-700"
            >
              + เพิ่มตาราง
            </button>

            <button
              onClick={() =>
                navigate(`/stream/${id}/live`, { state: { streams } })
              }
              className="px-4 py-2 rounded-xl text-white font-bold bg-orange-500 hover:bg-orange-600"
            >
              Live Stream
            </button>
          </div>
        </div>

        {/* 🟦 RESPONSIVE TABLE / CARD VIEW */}
        <div className="w-full">
          {/* 🔹 Desktop TABLE */}
          <div className="hidden md:block overflow-x-auto rounded-2xl shadow-xl border border-gray-300 bg-white">
            <table className="w-full text-center">
              <thead className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="py-4 px-3 text-sm font-semibold">
                    ลิงก์วิดีโอ
                  </th>
                  <th className="text-sm font-semibold">สัตว์</th>
                  <th className="text-sm font-semibold">เวลา</th>
                  <th className="text-sm font-semibold">สถานะ</th>
                  <th className="text-sm font-semibold">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {streams.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3 text-left break-all max-w-sm">
                      <span className="text-indigo-700 underline cursor-pointer">
                        {item.image}
                      </span>
                    </td>

                    <td className="font-medium">{item.animal}</td>

                    <td className="font-medium">
                      {item.start} - {item.end}
                    </td>

                    <td>
                      {item.status === "online" ? (
                        <span className="px-4 py-1 text-sm bg-green-500 text-white rounded-full shadow">
                          ออนไลน์
                        </span>
                      ) : (
                        <span className="px-4 py-1 text-sm bg-red-500 text-white rounded-full shadow">
                          ออฟไลน์
                        </span>
                      )}
                    </td>

                    <td className="space-x-2 py-3">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow font-bold"
                      >
                        ✎
                      </button>

                      <button
                        onClick={() => deleteStream(item.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow font-bold"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Mobile CARD VIEW */}
          <div className="block md:hidden space-y-4">
            {streams.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-md border border-gray-200"
              >
                <p className="text-sm font-semibold text-gray-700">
                  ลิงก์วิดีโอ
                </p>
                <p className="text-indigo-600 underline break-all mb-2">
                  {item.image}
                </p>

                <p className="text-sm font-semibold text-gray-700">สัตว์</p>
                <p className="mb-2">{item.animal}</p>

                <p className="text-sm font-semibold text-gray-700">เวลา</p>
                <p className="mb-2">
                  {item.start} - {item.end}
                </p>

                <p className="text-sm font-semibold text-gray-700">สถานะ</p>
                <p className="mb-3">
                  {item.status === "online" ? (
                    <span className="px-3 py-1 text-xs bg-green-500 text-white rounded-full shadow">
                      ออนไลน์
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-red-500 text-white rounded-full shadow">
                      ออฟไลน์
                    </span>
                  )}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 py-2 bg-yellow-400 text-white rounded-xl font-bold text-sm"
                  >
                    แก้ไข
                  </button>

                  <button
                    onClick={() => deleteStream(item.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold text-sm"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POPUP */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-3">
            <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl animate-fadeUp">
              <h3 className="text-xl font-bold mb-4">
                {editId ? "แก้ไข Live Stream" : "เพิ่ม Live Stream"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-bold">ลิงก์ Live Stream</label>
                  <input
                    className="w-full p-3 border rounded-xl mt-1 bg-gray-50"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="font-bold">สัตว์</label>
                  <select
                    className="w-full p-3 border rounded-xl bg-gray-50 mt-1"
                    value={formData.id_animal}
                    onChange={(e) =>
                      setFormData({ ...formData, id_animal: e.target.value })
                    }
                  >
                    <option value="">-- เลือกสัตว์ --</option>
                    {animals.map((a) => (
                      <option key={a.id_animal} value={a.id_animal}>
                        {a.animal_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold">เริ่ม</label>
                  <input
                    type="time"
                    className="w-full p-3 border rounded-xl bg-gray-50 mt-1"
                    value={formData.start}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="font-bold">สิ้นสุด</label>
                  <input
                    type="time"
                    className="w-full p-3 border rounded-xl bg-gray-50 mt-1"
                    value={formData.end}
                    onChange={(e) =>
                      setFormData({ ...formData, end: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold">สถานะ</label>
                  <select
                    className="w-full p-3 border rounded-xl bg-gray-50 mt-1"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="online">ออนไลน์</option>
                    <option value="offline">ออฟไลน์</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-400 text-white"
                >
                  ยกเลิก
                </button>

                <button
                  onClick={submitForm}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold"
                >
                  ✓ บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp .25s ease-out; }
      `}</style>
    </div>
  );
}

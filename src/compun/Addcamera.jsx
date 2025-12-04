import React, { useState, useEffect } from "react";
import { API_url } from "./config/config";

function Addcamera({ zooId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    location: "",
    id_animal: "",
    status: "online",
  });

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดสัตว์จากสวนสัตว์นี้
  useEffect(() => {
    fetch(`${API_url}/zoo/${zooId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.animals) {
          setAnimals(data.animals);
        }
        setLoading(false);
      })
      .catch(() => {
        alert("โหลดสัตว์ไม่สำเร็จ");
        setLoading(false);
      });
  }, [zooId]);

  const handleSubmit = () => {
    if (!formData.id_animal) return alert("กรุณาเลือกสัตว์");

    const payload = {
      camera_name: formData.name,
      ip_address: formData.ip,
      View: formData.location,
      id_animal: parseInt(formData.id_animal),
      camera_status: formData.status === "online" ? 1 : 2,
    };

    fetch(`${API_url}/camera`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        alert("เพิ่มกล้องสำเร็จ!");
        onSuccess();
        onClose();
      })
      .catch(() => alert("เพิ่มกล้องไม่สำเร็จ"));
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-4000"
        onClick={onClose}
      >
        {/* POPUP */}
        <div
          className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            เพิ่มกล้องใหม่
          </h3>

          {/* INPUTS */}
          <label className="font-semibold text-gray-700">ชื่อกล้อง</label>
          <input
            className="w-full p-2 border rounded-xl mb-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <label className="font-semibold text-gray-700">IP Address</label>
          <input
            className="w-full p-2 border rounded-xl mb-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            value={formData.ip}
            onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
          />

          <label className="font-semibold text-gray-700">มุมกล้อง (View)</label>
          <input
            className="w-full p-2 border rounded-xl mb-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          <label className="font-semibold text-gray-700">สัตว์ที่เฝ้าดู</label>
          <select
            className="w-full p-2 border rounded-xl mb-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            value={formData.id_animal}
            onChange={(e) =>
              setFormData({ ...formData, id_animal: e.target.value })
            }
          >
            <option value="">-- เลือกสัตว์ --</option>
            {animals.map((a) => (
              <option key={a.id_animal} value={a.id_animal}>
                {a.animal_name} ({a.animal})
              </option>
            ))}
          </select>

          <label className="font-semibold text-gray-700">สถานะกล้อง</label>
          <select
            className="w-full p-2 border rounded-xl mb-4 focus:ring-2 focus:ring-emerald-400 outline-none"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="online">ออนไลน์</option>
            <option value="offline">ออฟไลน์</option>
          </select>

          {/* BUTTONS */}
          <div className="flex gap-3">
            <button
              className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold hover:bg-emerald-700 transition"
              onClick={handleSubmit}
            >
              ✔ บันทึก
            </button>

            <button
              className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold hover:bg-red-600 transition"
              onClick={onClose}
            >
              ✖ ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Addcamera;

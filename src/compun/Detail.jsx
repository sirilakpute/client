import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// โลโก้สวนสัตว์
import Chan from "../Zoo/Chan.jpg";
import Kaen from "../Zoo/Kaen.jpg";
import Khao from "../Zoo/Khao.jpg";
import Nakhon from "../Zoo/Nakhon.jpg";
import Song from "../Zoo/Song.jpg";
import Ubon from "../Zoo/Ubon.jpg";

import { API_img, API_url } from "./config/config";

const ZooLogo = {
  1: Khao,
  2: Chan,
  3: Nakhon,
  4: Ubon,
  5: Song,
  6: Kaen,
};

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [zoo, setZoo] = useState({});
  const [animals, setAnimals] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");

  const [formData, setFormData] = useState({
    id: null,
    animal: "",
    animal_name: "",
    location: "",
    type: 1,
    zoo_name: Number(id),
    camera: "",
    animal_image: null,
  });

  // โหลดข้อมูลจาก API
  const fetchZooData = async () => {
    try {
      const res = await fetch(`${API_url}/zoo/${id}`);
      const data = await res.json();
      setZoo(data);
      setAnimals(data.animals || []);
    } catch {
      console.log("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchZooData();
  }, [id]);

  // ลบสัตว์
  const handleDelete = async (animalId) => {
    if (!window.confirm("คุณต้องการลบสัตว์นี้หรือไม่?")) return;

    const res = await fetch(`${API_url}/animal/${animalId}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (data.success) {
      alert("ลบสำเร็จ!");
      setAnimals(animals.filter((a) => a.id_animal !== animalId));
    } else {
      alert("ลบไม่สำเร็จ");
    }
  };

  // เปิดฟอร์มเพิ่ม
  const openAddForm = () => {
    setFormMode("add");
    setFormData({
      id: null,
      animal: "",
      animal_name: "",
      location: "",
      type: 1,
      zoo_name: Number(id),
      camera: "",
      animal_image: null,
    });
    setIsFormOpen(true);
  };

  // เปิดฟอร์มแก้ไข
  const openEditForm = (item) => {
    setFormMode("edit");
    setFormData({
      id: item.id_animal,
      animal: item.animal,
      animal_name: item.animal_name,
      location: item.location,
      type: item.type?.type_id,
      zoo_name: Number(id),
      camera: item.camera,
      animal_image: null,
    });
    setIsFormOpen(true);
  };

  // Submit ฟอร์ม
  const handleSubmit = async () => {
    if (!formData.animal || !formData.animal_name || !formData.location) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const form = new FormData();
    form.append("animal", formData.animal);
    form.append("animal_name", formData.animal_name);
    form.append("location", formData.location);
    form.append("type", Number(formData.type));
    form.append("zoo_name", Number(id));
    form.append("camera", Number(formData.camera || 0));

    if (formData.animal_image) {
      form.append("img", formData.animal_image);
    }

    const isEdit = formMode === "edit";
    const url = isEdit
      ? `${API_url}/animal/put/${formData.id}`
      : `${API_url}/animal/post`;

    try {
      const res = await fetch(url, { method: "POST", body: form });
      const data = await res.json();

      if (data.success) {
        alert(isEdit ? "แก้ไขสำเร็จ!" : "เพิ่มสำเร็จ!");
        fetchZooData();
        setIsFormOpen(false);
      } else {
        alert("เกิดข้อผิดพลาด: " + data.message);
      }
    } catch {
      alert("เชื่อมต่อ API ไม่สำเร็จ");
    }
  };

  // ===========================================
  // UI – Tailwind ทั้งหมด
  // ===========================================
  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      {/* HEADER */}
      <div className="relative bg-linear-to-r from-green-500 to-blue-500 p-8 rounded-b-2xl text-white">
        <button
          onClick={() => navigate(-1)}
          className="text-white mb-3 hover:underline"
        >
          ← กลับ
        </button>

        <h2 className="text-3xl font-bold">{zoo.nameTH}</h2>
        <p>{zoo.nameEN}</p>

        <img
          src={ZooLogo[zoo.id_zoo]}
          alt="logo"
          className="w-28 h-28 rounded-full border-4 border-white absolute right-6 top-6 object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="px-6 mt-6">
        <h3 className="text-xl font-bold mb-3">รายการสัตว์ในสวน</h3>

        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-linear-to-r from-emerald-500 to-blue-500 
    text-white rounded-xl shadow mb-4"
        >
          + เพิ่มสัตว์
        </button>

        {/* LIST */}
        <div className="mt-5 space-y-4">
          {animals.length === 0 ? (
            <p className="text-center text-gray-500 py-10">ไม่มีข้อมูลสัตว์</p>
          ) : (
            animals.map((item) => (
              <div
                key={item.id_animal}
                className="bg-linear-to-r from-purple-400 via-pink-300 to-rose-300 p-4 rounded-xl text-white shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={item.img ? `${API_img}/${item.img}` : "/no-image.png"}
                    className="w-20 h-20 rounded-full border-2 border-white object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="text-xl font-bold">{item.animal_name}</h4>
                    <p>ชนิด: {item.animal}</p>
                    <p>📍 {item.location}</p>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="px-3 py-1 bg-orange-500 rounded-lg"
                      >
                        ✏ แก้ไข
                      </button>

                      <button
                        onClick={() => handleDelete(item.id_animal)}
                        className="px-3 py-1 bg-red-600 rounded-lg"
                      >
                        ลบ
                      </button>
                      <button
                        onClick={() => navigate(`/CameraPage/${id}`)}
                        className="px-3 py-1 bg-black rounded-lg text-white"
                      >
                        จัดการกล้อง
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* POPUP FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl animate-slideUp">
            <h3 className="text-xl font-bold text-emerald-600 mb-5 text-center">
              {formMode === "add" ? "เพิ่มสัตว์ใหม่" : "แก้ไขข้อมูลสัตว์"}
            </h3>

            {/* Inputs */}
            <Input
              label="ชื่อสัตว์"
              value={formData.animal_name}
              onChange={(v) => setFormData({ ...formData, animal_name: v })}
            />
            <Input
              label="ชนิดสัตว์"
              value={formData.animal}
              onChange={(v) => setFormData({ ...formData, animal: v })}
            />
            <Input
              label="ตำแหน่ง"
              value={formData.location}
              onChange={(v) => setFormData({ ...formData, location: v })}
            />

            <Input
              label="Camera ID"
              type="number"
              value={formData.camera}
              onChange={(v) => setFormData({ ...formData, camera: v })}
            />

            <label className="font-semibold text-gray-700 block mb-2">
              รูปสัตว์
            </label>

            <div className="w-full border rounded-xl bg-white p-2 shadow-sm flex items-center">
              <input
                type="file"
                accept="image/*"
                className="
      w-full
      text-sm 
      text-gray-700
      file:mr-4 
      file:py-2 
      file:px-4
      file:rounded-lg
      file:border-0
      file:text-sm
      file:font-semibold
      file:bg-[#5b5c5a] 
      file:text-white
      cursor-pointer
    "
                onChange={(e) =>
                  setFormData({ ...formData, animal_image: e.target.files[0] })
                }
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
              >
                ✔ บันทึก
              </button>

              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl"
              >
                ✖ ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ----- REUSABLE INPUT ----- */
function Input({ label, type = "text", value, onChange }) {
  return (
    <div className="mb-4">
      <label className="font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        className="w-full p-3 border rounded-xl mt-1 bg-gray-50 focus:ring-2 focus:ring-emerald-300 outline-none"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

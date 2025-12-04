// ============================================================
// CameraPage.jsx — Full Version (Tailwind)
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_url } from "./config/config";
import Addcamera from "./Addcamera";

// ----- Zoo Logo -----
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

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function CameraPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openAdd, setOpenAdd] = useState(false);

  const [animalGroups, setAnimalGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- Edit Popup ----------
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    animal_name: "",
    animal_type: "",
    camera: null,
    name: "",
    ip: "",
    view: "",
    status: "",
  });

  const fetchCameraData = () => {
    fetch(`${API_url}/zoo/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const animals = data.animals || [];
        const grouped = animals.map((animal) => ({
          id_animal: animal.id_animal,
          animal_common: animal.animal,
          animal_name: animal.animal_name,
          location: animal.location,
          type_name: animal.type?.type_name || "ทั่วไป",
          cameras: (animal.cam || []).map((cam) => ({
            id: cam.camera_id,
            name: cam.camera_name,
            ip: cam.ip_address,
            status: cam.camera_status === 1 ? "online" : "offline",
            view: cam.View || "ไม่ระบุมุม",
          })),
        }));

        setAnimalGroups(grouped);
      });
  };

  // ---------- Move Popup ----------
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveData, setMoveData] = useState(null);

  // ============================================================
  // Load Data From API
  // ============================================================

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_url}/zoo/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const animals = data.animals || [];

        const grouped = animals.map((animal) => ({
          id_animal: animal.id_animal,
          animal_common: animal.animal,
          animal_name: animal.animal_name,
          location: animal.location,
          type_name: animal.type?.type_name || "ทั่วไป",
          cameras: (animal.cam || []).map((cam) => ({
            id: cam.camera_id,
            name: cam.camera_name,
            ip: cam.ip_address,
            status: cam.camera_status === 1 ? "online" : "offline",
            view: cam.View || "ไม่ระบุมุม",
          })),
        }));

        setAnimalGroups(grouped);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ============================================================
  // Open Edit Popup
  // ============================================================

  const openFormEdit = (animalName, animalType, camera) => {
    setFormData({
      animal_name: animalName,
      animal_type: animalType,
      camera: camera,
      name: camera.name,
      ip: camera.ip,
      view: camera.view,
      status: camera.status,
    });
    setIsFormOpen(true);
  };

  // ============================================================
  // Submit Edit
  // ============================================================

  const handleSubmit = () => {
    const payload = {
      camera_name: formData.name,
      ip_address: formData.ip,
      View: formData.view,
      camera_status: formData.status === "online" ? 1 : 2,
    };

    fetch(`${API_url}/camera/${formData.camera.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(() => {
      setAnimalGroups((prev) =>
        prev.map((animal) => ({
          ...animal,
          cameras: animal.cameras.map((cam) =>
            cam.id === formData.camera.id
              ? {
                  ...cam,
                  name: formData.name,
                  ip: formData.ip,
                  view: formData.view,
                  status: formData.status,
                }
              : cam
          ),
        }))
      );

      alert("แก้ไขกล้องสำเร็จ!");
      setIsFormOpen(false);
    });
  };

  // ============================================================
  // Delete Camera
  // ============================================================

  const deleteCamera = (animalId, camId) => {
    if (!window.confirm("ต้องการลบกล้องนี้หรือไม่?")) return;

    fetch(`${API_url}/camera/${camId}`, { method: "DELETE" }).then(() => {
      setAnimalGroups((prev) =>
        prev.map((animal) =>
          animal.id_animal === animalId
            ? {
                ...animal,
                cameras: animal.cameras.filter((c) => c.id !== camId),
              }
            : animal
        )
      );
      alert("ลบกล้องสำเร็จ");
    });
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-800">
        <h4 className="text-xl font-bold">กำลังโหลดข้อมูล...</h4>
      </div>
    );
  }

  // ============================================================
  // Render UI
  // ============================================================

  return (
    <div className="max-w-6xl mx-auto p-4 text-gray-800">
      <div className="bg-white p-6 rounded-2xl shadow mb-5">
        <h2 className="text-2xl font-bold">จัดการกล้องตามสัตว์</h2>
      </div>

      {/* Add Camera Button */}
      <button
        onClick={() => setOpenAdd(true)}
        className="w-full py-3 rounded-xl text-white font-bold mb-5 text-lg bg-linear-to-r from-green-500 to-emerald-400 shadow"
      >
        + เพิ่มกล้อง
      </button>

      {openAdd && (
        <Addcamera
          zooId={id}
          onClose={() => setOpenAdd(false)}
          onSuccess={fetchCameraData}
        />
      )}

      {animalGroups.map((animal) => (
        <AnimalCard
          key={animal.id_animal}
          animal={animal}
          zooId={id}
          openFormEdit={openFormEdit}
          deleteCamera={deleteCamera}
          setMoveData={setMoveData}
          setIsMoveOpen={setIsMoveOpen}
        />
      ))}

      {isFormOpen && (
        <EditCameraPopup
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isMoveOpen && moveData && (
        <MoveCameraPopup
          data={moveData}
          onClose={() => setIsMoveOpen(false)}
          onSuccess={() => {
            setIsMoveOpen(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// COMPONENT: Animal Card
// ============================================================

function AnimalCard({
  animal,
  zooId,
  openFormEdit,
  deleteCamera,
  setMoveData,
  setIsMoveOpen,
}) {
  return (
    <div className="bg-linear-to-r from-orange-200 to-pink-300 p-6 rounded-xl mb-6">
      <h4 className="text-xl font-bold">
        {animal.animal_common} - {animal.animal_name}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {animal.cameras.map((cam) => (
          <CameraCard
            key={cam.id}
            cam={cam}
            animal={animal}
            zooId={zooId}
            openFormEdit={openFormEdit}
            deleteCamera={deleteCamera}
            setMoveData={setMoveData}
            setIsMoveOpen={setIsMoveOpen}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Camera Card
// ============================================================

function CameraCard({
  cam,
  animal,
  zooId,
  openFormEdit,
  deleteCamera,
  setMoveData,
  setIsMoveOpen,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center font-bold text-gray-800">
        {cam.name}
        <span
          className={`px-3 py-1 rounded-full text-white text-xs ${
            cam.status === "online" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {cam.status}
        </span>
      </div>

      <p className="text-gray-700 mt-2">
        <strong>IP:</strong> {cam.ip}
      </p>
      <p className="text-gray-700">
        <strong>มุม:</strong> {cam.view}
      </p>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          className="bg-yellow-400 text-white py-2 rounded-md font-bold"
          onClick={() => {
            setMoveData({ camera: cam, animal, zoo_id: zooId });
            setIsMoveOpen(true);
          }}
        >
          ย้าย
        </button>

        <button
          className="bg-blue-500 text-white py-2 rounded-md font-bold"
          onClick={() =>
            openFormEdit(animal.animal_name, animal.type_name, cam)
          }
        >
          แก้ไข
        </button>

        <button
          className="bg-red-500 text-white py-2 rounded-md font-bold"
          onClick={() => deleteCamera(animal.id_animal, cam.id)}
        >
          ลบ
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Popup Edit Camera
// ============================================================

function EditCameraPopup({ formData, setFormData, onSubmit, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-9999">
      <div className="bg-white w-[850px] max-h-[90vh] overflow-y-auto rounded-2xl p-8">
        <h3 className="text-center text-xl font-bold mb-6">
          แก้ไขกล้อง: {formData.camera.name}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <div>
            <label className="font-semibold">ชื่อกล้อง</label>
            <input
              className="w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">IP</label>
            <input
              className="w-full p-2 border rounded-lg"
              value={formData.ip}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">มุม</label>
            <input
              className="w-full p-2 border rounded-lg"
              value={formData.view}
              onChange={(e) =>
                setFormData({ ...formData, view: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-semibold">สถานะ</label>
            <select
              className="w-full p-2 border rounded-lg"
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

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            className="bg-green-500 text-white py-3 rounded-xl font-bold"
            onClick={onSubmit}
          >
            บันทึก
          </button>
          <button
            className="bg-gray-400 text-white py-3 rounded-xl font-bold"
            onClick={onCancel}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Popup Move Camera
// ============================================================

function MoveCameraPopup({ data, onClose, onSuccess }) {
  const { camera, animal, zoo_id } = data;

  const [zoos, setZoos] = useState([]);
  const [selectedZoo, setSelectedZoo] = useState(zoo_id);
  const [animals, setAnimals] = useState([]);

  const [targetAnimal, setTargetAnimal] = useState(animal.id_animal);

  useEffect(() => {
    fetch(`${API_url}/zoo/all`)
      .then((res) => res.json())
      .then((data) => setZoos(data || []));
  }, []);

  useEffect(() => {
    fetch(`${API_url}/zoo/${selectedZoo}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data?.animals || [];
        setAnimals(list);

        if (list.length > 0 && !list.some((a) => a.id_animal == targetAnimal)) {
          setTargetAnimal("");
        }
      });
  }, [selectedZoo]);

  const handleMove = () => {
    if (!targetAnimal) return alert("กรุณาเลือกสัตว์ปลายทาง");

    fetch(`${API_url}/camera/${camera.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_animal: targetAnimal }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("ย้ายกล้องสำเร็จ!");
        onSuccess();
      })
      .catch(() => alert("เกิดข้อผิดพลาดในการย้ายกล้อง"));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-9999">
      <div className="bg-white w-[850px] max-h-[90vh] overflow-y-auto rounded-2xl p-8">
        <h3 className="text-center text-xl font-bold mb-6">
          ย้ายกล้อง: {camera.name}
        </h3>

        <label className="font-bold">เลือกสวนสัตว์ปลายทาง</label>

        <div className="flex flex-wrap gap-4 mt-3">
          {zoos.map((z) => (
            <div
              key={z.id_zoo}
              onClick={() => setSelectedZoo(z.id_zoo)}
              className={`w-32 h-32 rounded-xl flex justify-center items-center cursor-pointer transition border 
              ${
                selectedZoo === z.id_zoo
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300 bg-gray-100"
              }`}
            >
              <img src={Zoologo[z.id_zoo]} className="w-[90%]" />
            </div>
          ))}
        </div>

        <label className="font-bold mt-4 block">เลือกสัตว์ปลายทาง</label>

        <select
          className="w-full p-3 border rounded-xl mt-2"
          value={targetAnimal}
          onChange={(e) => setTargetAnimal(e.target.value)}
        >
          <option value="">-- เลือกสัตว์ --</option>
          {animals.map((a) => (
            <option key={a.id_animal} value={a.id_animal}>
              {a.animal_name} ({a.animal})
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            className="bg-blue-500 text-white py-3 rounded-xl font-bold"
            onClick={handleMove}
          >
            ย้ายกล้อง
          </button>
          <button
            className="bg-gray-400 text-white py-3 rounded-xl font-bold"
            onClick={onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

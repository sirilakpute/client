// ============================================================
// CameraPage.jsx — Full Version (Manage Cameras + Edit + Move Popup)
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_url } from "../config/config";
import Addcamera from "../components/Addcamera";

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
    .then(res => res.json())
    .then(data => {
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

    fetch(`${API_url}/camera1/${formData.camera.id}`, {
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
            ? { ...animal, cameras: animal.cameras.filter((c) => c.id !== camId) }
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
      <div className="text-center py-5" style={{ color: "#222" }}>
        <h4>กำลังโหลดข้อมูล...</h4>
      </div>
    );
  }

  // ============================================================
  // Render UI
  // ============================================================

  return (
    <div className="container py-4" style={{ color: "#222" }}>
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          color: "#222",
        }}
      >
        <h2 className="fw-bold">จัดการกล้องตามสัตว์</h2>
      </div>

 <button
  className="btn fw-bold mb-3"
  onClick={() => setOpenAdd(true)}
  style={{
    width: "100%",
    padding: "14px",
    fontSize: "1.1rem",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #00c853, #00e676)",
    border: "none",
    color: "white",
  }}
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

function AnimalCard({ animal, zooId, openFormEdit, deleteCamera, setMoveData, setIsMoveOpen }) {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #f7d3bcff, #ff73abff)",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "20px",
        color: "#222", // เปลี่ยนเป็นสีดำ
      }}
    >
      <h4 className="fw-bold" style={{ color: "#222" }}>
        {animal.animal_common} - {animal.animal_name}
      </h4>

      <div className="row mt-3">
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

function CameraCard({ cam, animal, zooId, openFormEdit, deleteCamera, setMoveData, setIsMoveOpen }) {
  return (
    <div className="col-md-6 col-lg-4 mt-3">
      <div className="p-3 bg-white shadow-sm rounded" style={{ color: "#222" }}>
        <h6 className="fw-bold d-flex justify-content-between" style={{ color: "#222" }}>
          {cam.name}
          <span className={cam.status === "online" ? "badge bg-success" : "badge bg-danger"}>
            {cam.status}
          </span>
        </h6>

        <p style={{ color: "#222" }}>
          <strong>IP:</strong> {cam.ip}
        </p>
        <p style={{ color: "#222" }}>
          <strong>มุม:</strong> {cam.view}
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn btn-warning w-100"
            onClick={() => {
              setMoveData({ camera: cam, animal, zoo_id: zooId });
              setIsMoveOpen(true);
            }}
          >
            ย้าย
          </button>

          <button
            className="btn btn-primary w-100"
            onClick={() => openFormEdit(animal.animal_name, animal.type_name, cam)}
          >
            แก้ไข
          </button>

          <button
            className="btn btn-danger w-100"
            onClick={() => deleteCamera(animal.id_animal, cam.id)}
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: Popup Edit Camera
// ============================================================

function EditCameraPopup({ formData, setFormData, onSubmit, onCancel }) {
  return (
    <div style={overlay}>
      <div style={popup}>
        <h3 className="fw-bold text-center mb-4" style={{ color: "#222" }}>
          แก้ไขกล้อง: {formData.camera.name}
        </h3>

        <div className="row" style={{ color: "#222" }}>
          <div className="col-md-6">
            <label style={{ color: "#222" }}>ชื่อกล้อง</label>
            <input
              className="form-control"
              value={formData.name}
              style={{ color: "#222" }}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label style={{ color: "#222" }}>IP</label>
            <input
              className="form-control"
              value={formData.ip}
              style={{ color: "#222" }}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label style={{ color: "#222" }}>มุม</label>
            <input
              className="form-control"
              value={formData.view}
              style={{ color: "#222" }}
              onChange={(e) => setFormData({ ...formData, view: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label style={{ color: "#222" }}>สถานะ</label>
            <select
              className="form-select"
              value={formData.status}
              style={{ color: "#222" }}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="online">ออนไลน์</option>
              <option value="offline">ออฟไลน์</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-success w-50" onClick={onSubmit}>
  บันทึก
</button>

          <button className="btn btn-secondary w-50" onClick={onCancel}>
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
    fetch(`${API_url}/allzoo`)
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

    fetch(`${API_url}/camera1/${camera.id}`, {
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
    <div style={overlay}>
      <div style={popup}>
        <h3 className="fw-bold text-center mb-3" style={{ color: "#222" }}>
          ย้ายกล้อง: {camera.name}
        </h3>

        <label className="fw-bold" style={{ color: "#222" }}>
          เลือกสวนสัตว์ปลายทาง
        </label>

        <div className="d-flex flex-wrap gap-3 mt-2">
          {zoos.map((z) => (
            <div
              key={z.id_zoo}
              onClick={() => setSelectedZoo(z.id_zoo)}
              style={{
                width: 120,
                height: 120,
                borderRadius: 15,
                cursor: "pointer",
                border:
                  selectedZoo === z.id_zoo
                    ? "3px solid #4d9eff"
                    : "1px solid #ccc",
                background:
                  selectedZoo === z.id_zoo ? "#dfeaff" : "#f8f8f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition: "0.25s",
              }}
            >
              <img src={Zoologo[z.id_zoo]} style={{ width: "90%" }} />
            </div>
          ))}
        </div>

        <label className="fw-bold mt-3" style={{ color: "#222" }}>
          เลือกสัตว์ปลายทาง
        </label>

        <select
          className="form-select"
          value={targetAnimal}
          onChange={(e) => setTargetAnimal(e.target.value)}
          style={{
            borderRadius: "12px",
            padding: "12px",
            color: "#222",
          }}
        >
          <option value="">-- เลือกสัตว์ --</option>
          {animals.map((a) => (
            <option key={a.id_animal} value={a.id_animal} style={{ color: "#222" }}>
              {a.animal_name} ({a.animal})
            </option>
          ))}
        </select>

        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-primary w-50 fw-bold" onClick={handleMove}>
            ย้ายกล้อง
          </button>
          <button className="btn btn-secondary w-50 fw-bold" onClick={onClose}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Popup UI CSS
// ============================================================

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popup = {
  background: "white",
  borderRadius: "20px",
  padding: "35px",
  width: "850px",
  maxHeight: "90vh",
  overflowY: "auto",
  color: "#222", // ให้ข้อความทั้งหมดใน popup เป็นสีดำ
};

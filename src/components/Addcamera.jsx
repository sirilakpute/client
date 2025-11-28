import React, { useState, useEffect } from "react";
import { API_url } from "../config/config";

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

  // โหลดสัตว์ตามสวน
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
    if (!formData.id_animal) {
      alert("กรุณาเลือกสัตว์");
      return;
    }

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
        onSuccess(); // refresh list
        onClose();   // close popup
      })
      .catch(() => alert("เพิ่มกล้องไม่สำเร็จ"));
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={popup} onClick={(e) => e.stopPropagation()}>
        
        <h3 className="fw-bold mb-3">เพิ่มกล้องใหม่</h3>

        <label className="fw-bold">ชื่อกล้อง</label>
        <input
          className="form-control mb-3"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <label className="fw-bold">IP Address</label>
        <input
          className="form-control mb-3"
          value={formData.ip}
          onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
        />

        <label className="fw-bold">มุมกล้อง (View)</label>
        <input
          className="form-control mb-3"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />

        <label className="fw-bold">สัตว์ที่เฝ้าดู</label>
        <select
          className="form-select mb-3"
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

        <label className="fw-bold">สถานะกล้อง</label>
        <select
          className="form-select mb-4"
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
        >
          <option value="online">ออนไลน์</option>
          <option value="offline">ออฟไลน์</option>
        </select>

        <div className="d-flex gap-3">
          <button className="btn btn-success w-50" onClick={handleSubmit}>
            ✔ บันทึก
          </button>

          <button className="btn btn-danger w-50" onClick={onClose}>
            ✖ ยกเลิก
          </button>
        </div>

      </div>
    </div>
  );
}

export default Addcamera;

// ========== STYLE ==========
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 4000,
};

const popup = {
  width: "90%",
  maxWidth: "500px",
  background: "#fff",
  borderRadius: "15px",
  padding: "25px",
  boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
};

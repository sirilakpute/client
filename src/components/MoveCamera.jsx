// =============================
// MoveCameraPopup.jsx (FINAL)
// =============================
import React, { useState, useEffect } from "react";
import { API_url } from "../config/config";

import Chan from '../Zoo/Chan.jpg';
import Kaen from '../Zoo/Kaen.jpg';
import Khao from '../Zoo/Khao.jpg';
import Nakhon from '../Zoo/Nakhon.jpg';
import Song from '../Zoo/Song.jpg';
import Ubon from '../Zoo/Ubon.jpg';

const Zoologo = {
  1: Khao,
  2: Chan,
  3: Nakhon,
  4: Ubon,
  5: Song,
  6: Kaen,
};

export default function MoveCameraPopup({ data, onClose, onSuccess }) {
  const { camera, animal, zooId } = data;

  const [zoos, setZoos] = useState([]);
  const [selectedZoo, setSelectedZoo] = useState(zooId);
  const [animals, setAnimals] = useState([]);

  const [formData, setFormData] = useState({
    id_animal: animal.id_animal,
  });

  // Load zoos
  useEffect(() => {
    fetch(`${API_url}/allzoo`)
      .then(res => res.json())
      .then(data => setZoos(data || []));
  }, []);

  // Load animals of selected zoo
  useEffect(() => {
    if (!selectedZoo) return;

    fetch(`${API_url}/zoo/${selectedZoo}`)
      .then(res => res.json())
      .then(data => {
        const list = data?.animals || [];
        setAnimals(list);
      });
  }, [selectedZoo]);

  const handleSubmit = () => {
    if (!formData.id_animal) {
      return alert("กรุณาเลือกสัตว์ปลายทาง");
    }

    const payload = {
      id_animal: parseInt(formData.id_animal),
    };

    fetch(`${API_url}/camera1/${camera.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(() => {
        alert("ย้ายกล้องสำเร็จ!");
        onSuccess();
      })
      .catch(() => alert("ย้ายกล้องไม่สำเร็จ"));
  };

  return (
    <div style={overlay}>

      <div style={popup}>
        <h2 className="fw-bold text-center mb-4">ย้ายกล้องไปยังสัตว์อื่น</h2>

        {/* ชื่อกล้อง */}
        <div className="mb-3">
          <label className="form-label fw-bold">ชื่อกล้อง</label>
          <input className="form-control" disabled value={camera.name} />
        </div>

        {/* เลือกสวนสัตว์ */}
        <label className="FW-bold mt-3">เลือกสวนสัตว์ปลายทาง</label>
        <div className="d-flex flex-wrap gap-4 mt-3 justify-content-center">
          {zoos.map(z => (
            <div key={z.id_zoo}
              onClick={() => setSelectedZoo(z.id_zoo)}
              style={{
                width: "140px",
                height: "140px",
                padding: "10px",
                borderRadius: "18px",
                cursor: "pointer",
                background: selectedZoo === z.id_zoo ? "#EAF1FF" : "#FAFAFA",
                border: selectedZoo === z.id_zoo ? "3px solid #4D9EFF" : "2px solid #DCDCDC",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <img src={Zoologo[z.id_zoo]} style={{ width: "90%" }} />

              {selectedZoo === z.id_zoo && (
                <div style={checkMark}>✔</div>
              )}
            </div>
          ))}
        </div>

        {/* เลือกสัตว์ */}
        <div className="mt-4">
          <label className="form-label fw-bold">เลือกสัตว์ปลายทาง</label>
          <select
            className="form-select"
            value={formData.id_animal}
            onChange={(e) => setFormData({ ...formData, id_animal: e.target.value })}
          >
            <option value="">-- เลือกสัตว์ --</option>
            {animals.map(a => (
              <option key={a.id_animal} value={a.id_animal}>
                {a.animal_name} ({a.animal})
              </option>
            ))}
          </select>
        </div>

        {/* ปุ่ม */}
        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-primary w-50" onClick={handleSubmit}>ย้ายกล้อง</button>
          <button className="btn btn-secondary w-50" onClick={onClose}>ยกเลิก</button>
        </div>

      </div>
    </div>
  );
}

// Popup CSS
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popup = {
  background: "white",
  padding: "35px",
  borderRadius: "20px",
  width: "850px",
  maxHeight: "90vh",
  overflowY: "auto",
};

const checkMark = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "#CAD6F2",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "bold",
};

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_url } from "../config/config";

/* ============================
      LOGO IMPORT
============================ */
import Chan from "../Zoo/Chan.jpg";
import Kaen from "../Zoo/Kaen.jpg";
import Khao from "../Zoo/Khao.jpg";
import Nakhon from "../Zoo/Nakhon.jpg";
import Song from "../Zoo/Song.jpg";
import Ubon from "../Zoo/Ubon.jpg";

const Zoologo = {
  "1": Khao,
  "2": Chan,
  "3": Nakhon,
  "4": Ubon,
  "5": Song,
  "6": Kaen,
};

export default function Stream() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ============================
        STATE
  ============================ */
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

  /* ============================
        FETCH สัตว์
  ============================ */
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

  /* ============================
        FETCH STREAM
  ============================ */
  const fetchStreamData = async () => {
    try {
      const res = await fetch(`${API_url}/streamByzoo/${id}`);
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

  /* ============================
        LOAD เมื่อเข้าเพจ
  ============================ */
  useEffect(() => {
    fetchStreamData();
    fetchAnimals();
  }, [id]);

  /* ============================
        OPEN EDIT POPUP
  ============================ */
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

  /* ============================
        SUBMIT FORM
  ============================ */
  const submitForm = async () => {
    if (!formData.id_animal) return alert("กรุณาเลือกสัตว์");
    if (!formData.image.trim()) return alert("กรุณาใส่ลิงก์วิดีโอ");

    const payload = {
      st_zoo: parseInt(id),
      st_animal: parseInt(formData.id_animal),
      s_time: formData.start + ":00",
      e_time: formData.end + ":00",
      st_url: formData.image,
      st_status: formData.status === "online" ? 1 : 2,
    };

    try {
      const url = editId
        ? `${API_url}/stream/${editId}`
        : `${API_url}/stream`;
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

  /* ============================
        DELETE STREAM
  ============================ */
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

  /* ============================
        UI
  ============================ */
  return (
    <div style={{ background: "#eef3ff", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <header
        style={{
          background: "linear-gradient(90deg, #009970, #0077ff)",
          padding: "35px",
          paddingBottom: "40px",
          color: "white",
          borderBottomLeftRadius: "25px",
          borderBottomRightRadius: "25px",
          position: "relative",
        }}
      >
        <div
          style={{ cursor: "pointer", fontSize: "1.25rem" }}
          onClick={() => navigate(-1)}
        >
          ← กลับ
        </div>

        <img
          src={Zoologo[id]}
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            position: "absolute",
            right: "30px",
            top: "20px",
            border: "5px solid white",
          }}
        />
      </header>

      <div className="container">

        {/* SUMMARY BOX */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "25px 30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            marginTop: "15px",    // ❤️ แก้ไม่ให้ทับแล้ว
            marginBottom: "20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <p className="text-muted fw-bold m-0">จำนวน Live Stream</p>
          <h1 className="fw-bold">{streams.length}</h1>
        </div>

        {/* TITLE + BUTTON */}
        <div className="d-flex justify-content-between align-items-center my-3">
          <h2 className="fw-bold">ตาราง Live Stream</h2>

          <div className="d-flex gap-2">
            <button
              className="btn text-white fw-bold"
              style={{ background: "#5932ea" }}
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
            >
              + เพิ่มตาราง
            </button>

            <button
              className="btn text-white fw-bold"
              style={{ background: "#ff7f11" }}
              onClick={() =>
                navigate(`/stream/${id}/live`, { state: { streams } })
              }
            >
              Live Stream
            </button>
          </div>
        </div>

        {/* TABLE */}
        <table className="table text-center align-middle"
          style={{
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
            border: "1px solid #dadcff",
          }}
        >
          <thead style={{ background: "#4b2eff", color: "white" }}>
            <tr>
              <th style={{ padding: "14px" }}>ลิงก์วิดีโอ</th>
              <th>สัตว์</th>
              <th>เวลา</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {streams.map((item) => (
              <tr key={item.id} style={{ background: "white" }}>
                <td style={{ maxWidth: "250px", wordBreak: "break-all" }}>
                  {item.image}
                </td>
                <td>{item.animal}</td>
                <td>{item.start} - {item.end}</td>
                <td>
                  {item.status === "online" ? (
                    <span className="badge bg-success">ออนไลน์</span>
                  ) : (
                    <span className="badge bg-danger">ออฟไลน์</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => openEdit(item)}
                  >
                    ✎
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteStream(item.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* POPUP */}
        {isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "25px 30px",
                borderRadius: "18px",
                width: "100%",
                maxWidth: "600px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            >
              <h3 className="fw-bold mb-3">
                {editId ? "แก้ไข Live Stream" : "เพิ่ม Live Stream"}
              </h3>

              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label fw-bold">ลิงก์ Live Stream</label>
                  <input
                    className="form-control"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">สัตว์ที่เฝ้าดู</label>
                  <select
                    className="form-select"
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
                </div>

                <div className="col-3">
                  <label className="form-label fw-bold">เริ่ม</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.start}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                  />
                </div>

                <div className="col-3">
                  <label className="form-label fw-bold">สิ้นสุด</label>
                  <input
                    type="time"
                    className="form-control"
                    value={formData.end}
                    onChange={(e) =>
                      setFormData({ ...formData, end: e.target.value })
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">สถานะ</label>
                  <select
                    className="form-select"
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

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
                  ยกเลิก
                </button>
                <button className="btn btn-success" onClick={submitForm}>
                  ✓ บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

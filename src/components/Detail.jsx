// =====================================================
// DETAIL PAGE รองรับสวนสัตว์ทั้ง 6 แห่ง
// =====================================================

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// โลโก้สวนสัตว์
import Chan from "../Zoo/Chan.jpg";
import Kaen from "../Zoo/Kaen.jpg";
import Khao from "../Zoo/Khao.jpg";
import Nakhon from "../Zoo/Nakhon.jpg";
import Song from "../Zoo/Song.jpg";
import Ubon from "../Zoo/Ubon.jpg";

import { API_img, API_url } from "../config/config";

// ตารางแมปโลโก้
const Zoologo = {
  "1": Khao,
  "2": Chan,
  "3": Nakhon,
  "4": Ubon,
  "5": Song,
  "6": Kaen,
};

// =====================================================
// COMPONENT
// =====================================================
export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // ---------- STATE ----------
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
    camera: 13,
    animal_image: null,
  });

  // =====================================================
  // โหลดข้อมูลสวนสัตว์ + รายการสัตว์
  // =====================================================
  const fetchZooData = () => {
    fetch(`${API_url}/zoo/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setZoo(data);
        setAnimals(data.animals || []);
      })
      .catch(() => console.error("โหลดข้อมูลสวนสัตว์ล้มเหลว"));
  };

  useEffect(() => {
    fetchZooData();
  }, [id]);

  // =====================================================
  // ลบสัตว์
  // =====================================================
  const handleDelete = (animalId) => {
    if (!window.confirm("คุณต้องการลบสัตว์นี้หรือไม่?")) return;

    fetch(`${API_url}/animal/${animalId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("ลบสัตว์สำเร็จ!");
          setAnimals(animals.filter((item) => item.id_animal !== animalId));
        } else {
          alert("ลบไม่สำเร็จ");
        }
      })
      .catch(() => alert("เกิดข้อผิดพลาด"));
  };

  // =====================================================
  // เปิดฟอร์ม "เพิ่มสัตว์"
  // =====================================================
  const openAddForm = () => {
    setFormMode("add");
    setFormData({
      id: null,
      animal: "",
      animal_name: "",
      location: "",
      type: 1,
      zoo_name: Number(id),
      camera: 13,
      animal_image: null,
    });
    setIsFormOpen(true);
  };

  // =====================================================
  // เปิดฟอร์ม "แก้ไขสัตว์"
  // =====================================================
  const openEditForm = (item) => {
    setFormMode("edit");
    setFormData({
      id: item.id_animal,
      animal: item.animal,
      animal_name: item.animal_name,
      location: item.location,
      type: item?.type?.type_id,
      zoo_name: Number(id),
      camera: item.camera,
      animal_image: null,
    });
    setIsFormOpen(true);
  };

  // =====================================================
  // Submit Form (รองรับไฟล์ภาพด้วย FormData)
  // =====================================================
  const handleSubmit = () => {
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
    form.append("camera", Number(formData.camera));

    if (formData.animal_image) {
      form.append("img", formData.animal_image);
    }

    const isEdit = formMode === "edit";
    const url = isEdit
      ? `${API_url}/animalput/${formData.id}`
      : `${API_url}/animalpost`;

    fetch(url, { method: "POST", body: form })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(isEdit ? "แก้ไขสำเร็จ!" : "เพิ่มสำเร็จ!");
          fetchZooData();
          setIsFormOpen(false);
        } else {
          alert("เกิดข้อผิดพลาด: " + data.message);
        }
      })
      .catch(() => alert("ผิดพลาดในการเชื่อมต่อ"));
  };

  // =====================================================
  // RENDER UI
  // =====================================================
  return (
    <div style={{ background: "#e9edf5", minHeight: "100vh" }}>
      {/* ---------------- HEADER ---------------- */}
      <div
        style={{
          background: "linear-gradient(90deg, #39b876ff, #0099ff)",
          padding: "30px",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          color: "white",
          position: "relative",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
          ← กลับ
        </div>

        <h2 className="fw-bold">{zoo.nameTH}</h2>
        <p>{zoo.nameEN}</p>

        <img
          src={Zoologo[zoo.id_zoo]}
          alt="logo"
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            position: "absolute",
            right: "25px",
            top: "25px",
            border: "5px solid white",
            objectFit: "cover",
          }}
        />
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="container mt-4">
        <h3 className="fw-bold">รายการสัตว์ในสวน</h3>

        <button
          className="btn mt-3"
          style={{
            background: "linear-gradient(90deg, #30c377ff, #0099ff)",
            color: "white",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: "600",
          }}
          onClick={openAddForm}
        >
          + เพิ่มสัตว์
        </button>

        <br />

        {/* ---------------- รายการสัตว์ ---------------- */}
        {animals.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            ไม่พบข้อมูลสัตว์ในสวนนี้
          </div>
        ) : (
          animals.map((item) => (
            <div
              key={item.id_animal}
              style={{
                background: "linear-gradient(90deg, #c66ee5ff, #e1b3f1ff, rgba(252, 155, 215, 1))",
                padding: "18px",
                borderRadius: "15px",
                marginTop: "15px",
                color: "white",
              }}
            >
              <div className="d-flex gap-3">
                <img
                  src={item.img ? `${API_img}/${item.img}` : "/no-image.png"}
                  alt={item.animal_name}
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid white",
                  }}
                />

                <div style={{ flexGrow: 1 }}>
                  <h4 className="fw-bold">{item.animal_name}</h4>
                  <p>ชนิด: {item.animal}</p>
                  <p>📍 {item.location}</p>

                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn"
                      style={{
                        background: "#ff8c00",
                        color: "white",
                        borderRadius: "10px",
                      }}
                      onClick={() => openEditForm(item)}
                    >
                      ✏ แก้ไข
                    </button>

                    <button
                      className="btn"
                      style={{
                        background: "#dc3545",
                        color: "white",
                        borderRadius: "10px",
                      }}
                      onClick={() => handleDelete(item.id_animal)}
                    >
                      ลบ
                    </button>

                    <button
                      className="btn"
                      style={{
                        background: "#212529",
                        color: "white",
                        borderRadius: "10px",
                      }}
                      onClick={() => navigate(`/CameraManage/${id}`)}
                    >
                      จัดการกล้อง
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* ---------------- POPUP FORM ---------------- */}
        {isFormOpen && (
          <div style={formOverlay} onClick={() => setIsFormOpen(false)}>
            <div style={formContainer} onClick={(e) => e.stopPropagation()}>
              <h3 className="fw-bold mb-3" style={{ color: "#00a651" }}>
                {formMode === "add" ? "เพิ่มสัตว์ใหม่" : "แก้ไขข้อมูลสัตว์"}
              </h3>

              {/* Input Fields */}
              <InputField
                label="ชื่อสัตว์"
                value={formData.animal_name}
                onChange={(v) => setFormData({ ...formData, animal_name: v })}
              />

              <InputField
                label="ชนิดสัตว์"
                value={formData.animal}
                onChange={(v) => setFormData({ ...formData, animal: v })}
              />

              <InputField
                label="ตำแหน่ง"
                value={formData.location}
                onChange={(v) => setFormData({ ...formData, location: v })}
              />

              {/* Camera ID */}
              <InputField
                label="Camera ID"
                type="number"
                value={formData.camera}
                onChange={(v) => setFormData({ ...formData, camera: v })}
              />

              {/* Upload Image */}
              <div className="mb-3">
                <label className="form-label fw-bold">รูปสัตว์</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, animal_image: e.target.files[0] })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <ButtonStyled text="✔ บันทึก" onClick={handleSubmit} />
                <ButtonStyled
                  text="✖ ยกเลิก"
                  bg="#dc3545"
                  onClick={() => setIsFormOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// REUSABLE COMPONENTS (Input + Button)
// =====================================================
const InputField = ({ label, type = "text", value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">{label}</label>
    <input
      type={type}
      className="form-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const ButtonStyled = ({ text, bg, onClick }) => (
  <button
    className="btn"
    onClick={onClick}
    style={{
      background: bg || "linear-gradient(90deg, #00a651, #0099ff)",
      color: "white",
      fontWeight: "600",
      padding: "10px 20px",
      borderRadius: "10px",
    }}
  >
    {text}
  </button>
);

// =====================================================
// STYLE
// =====================================================
const formOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000,
};

const formContainer = {
  width: "90%",
  maxWidth: "500px",
  background: "white",
  borderRadius: "15px",
  padding: "25px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
};

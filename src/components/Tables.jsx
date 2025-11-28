import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const EMPTY = { id: "", firstName: "", lastName: "", phone: "", email: "", password: "" };
const uid = () => Math.random().toString(36).slice(2, 9);
const mask = (pw = "") => (pw ? "•".repeat(Math.min(12, pw.length)) : "—");

function Tables() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [q, setQ] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tables_users");
    if (saved) setRows(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("tables_users", JSON.stringify(rows));
  }, [rows]);

  const openCreate = () => {
    setIsEdit(false);
    setForm(EMPTY);
    setShowPw(false);
    setShow(true);
  };
  const openEdit = (r) => {
    setIsEdit(true);
    setForm({ ...r });
    setShowPw(false);
    setShow(true);
  };
  const close = () => setShow(false);

  const remove = (id) => {
    if (!confirm("ยืนยันลบข้อมูลนี้?")) return;
    setRows((p) => p.filter((r) => r.id !== id));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return;
    if (!/^[0-9+()\\s-]{8,}$/.test(form.phone)) return;
    if ((form.password || "").length < 6) return;

    if (isEdit) setRows((p) => p.map((r) => (r.id === form.id ? form : r)));
    else setRows((p) => [...p, { ...form, id: uid() }]);
    close();
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.firstName, r.lastName, r.phone, r.email]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(s))
    );
  }, [rows, q]);

  return (
    <div
      style={{
        minHeight: "100vh",
      //  background: "linear-gradient(135deg, #2e7d32 0%, #43a047 40%, #81c784 100%)",
        padding: "30px 0",
      }}
    >
      <div className="container py-4 bg-white bg-opacity-75 rounded-4 shadow-sm">
        <div className="position-relative mb-4 text-center py-2 border-bottom">
          <h3 className="fw-bold m-0 text-success">ตารางผู้ใช้งาน</h3>
          <button
            className="btn btn-success position-absolute top-50 translate-middle-y end-0"
            onClick={openCreate}
          >
            + เพิ่มข้อมูล
          </button>
        </div>

        {/* Toolbar */}
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-success text-white">ค้นหา</span>
                  <input
                    className="form-control"
                    placeholder="ชื่อ / นามสกุล / เบอร์ / อีเมล"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                  {q && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQ("")}
                    >
                      ล้าง
                    </button>
                  )}
                </div>
              </div>
              <div className="col text-md-end text-muted">
                ทั้งหมด <span className="badge bg-secondary">{rows.length}</span>
                {q && (
                  <>
                    · ตรงกับผลลัพธ์{" "}
                    <span className="badge bg-info text-dark">{filtered.length}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th className="text-center" style={{ width: 56 }}>#</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th style={{ width: 160 }}>เบอร์โทร</th>
                <th style={{ width: 260 }}>อีเมล</th>
                <th className="text-center" style={{ width: 140 }}>รหัสผ่าน</th>
                <th className="text-end" style={{ width: 160 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    ยังไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id}>
                    <td className="text-center">{i + 1}</td>
                    <td>{r.firstName}</td>
                    <td>{r.lastName}</td>
                    <td>{r.phone}</td>
                    <td>{r.email}</td>
                    <td className="text-center">{mask(r.password)}</td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => openEdit(r)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(r.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {show && (
          <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <form onSubmit={submit} noValidate>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {isEdit ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={close}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* form fields here (unchanged) */}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={close}>
                      ยกเลิก
                    </button>
                    <button type="submit" className="btn btn-success">
                      {isEdit ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tables;

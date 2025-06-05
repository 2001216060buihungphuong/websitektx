import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GuiYeuCauSuaChua() {
  const [maSV, setMaSV] = useState("");
  const [moTa, setMoTa] = useState("");
  const [chiTietSuaChua, setChiTietSuaChua] = useState([
    { maThietBi: "", moTaLoi: "" },
  ]);
  const [message, setMessage] = useState("");

  // ✅ Tự động lấy mã sinh viên từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const ma = user?.maSV || user?.MaSV || "";
    setMaSV(ma);
  }, []);

  const handleChangeChiTiet = (index, field, value) => {
    const updated = [...chiTietSuaChua];
    updated[index][field] = value;
    setChiTietSuaChua(updated);
  };

  const addChiTiet = () => {
    setChiTietSuaChua([...chiTietSuaChua, { maThietBi: "", moTaLoi: "" }]);
  };

  const removeChiTiet = (index) => {
    const updated = [...chiTietSuaChua];
    updated.splice(index, 1);
    setChiTietSuaChua(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!maSV || chiTietSuaChua.length === 0) {
      setMessage("Không tìm thấy mã sinh viên hoặc chưa có thiết bị.");
      return;
    }

    const payload = {
      maSV,
      moTa,
      chiTietSuaChua,
    };

    try {
      const res = await axios.post(
        "https://localhost:5181/api/YeuCauSuaChua/submit",
        payload
      );
      setMessage(res.data.message);
      setMoTa("");
      setChiTietSuaChua([{ maThietBi: "", moTaLoi: "" }]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Gửi Yêu Cầu Sửa Chữa
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🔒 Không cho người dùng sửa mã sinh viên */}
        <div>
          <label className="block font-medium mb-1">Mã sinh viên *</label>
          <input
            type="text"
            className="w-full border p-2 rounded bg-gray-100"
            value={maSV}
            disabled
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mô tả chung (tuỳ chọn)</label>
          <textarea
            className="w-full border p-2 rounded"
            value={moTa}
            onChange={(e) => setMoTa(e.target.value)}
            placeholder="Nhập mô tả chung về sự cố..."
          />
        </div>

        <div className="space-y-3">
          <label className="block font-medium">Chi tiết thiết bị cần sửa *</label>
          {chiTietSuaChua.map((item, index) => (
            <div
              key={index}
              className="border p-3 rounded bg-gray-50 space-y-2 relative"
            >
              <div>
                <label className="block text-sm mb-1">Mã thiết bị *</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={item.maThietBi}
                  onChange={(e) =>
                    handleChangeChiTiet(index, "maThietBi", e.target.value)
                  }
                  placeholder="VD: TB001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Mô tả lỗi *</label>
                <textarea
                  className="w-full border p-2 rounded"
                  value={item.moTaLoi}
                  onChange={(e) =>
                    handleChangeChiTiet(index, "moTaLoi", e.target.value)
                  }
                  placeholder="Chi tiết lỗi xảy ra..."
                  required
                />
              </div>
              {chiTietSuaChua.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChiTiet(index)}
                  className="absolute top-2 right-2 text-red-500"
                  title="Xoá mục này"
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addChiTiet}
            className="text-blue-600 hover:underline"
          >
            + Thêm thiết bị
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Gửi yêu cầu
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center font-semibold text-red-600">
          {message}
        </div>
      )}
    </div>
  );
}

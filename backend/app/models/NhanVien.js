// backend/app/models/NhanVien.js
import mongoose from "mongoose";

const NhanVienSchema = new mongoose.Schema({
  MSNV: { type: String, unique: true, required: true },
  HoTenNV: { type: String, required: true },
  Password: { type: String, required: true, minlength: 8 },
  Chucvu: {
    type: String,
    enum: ["admin", "nhanvien"],
    default: "nhanvien",
    required: true,
  },
  Diachi: { type: String, required: true },
  SoDienThoai: {
    type: String,
    required: true,
    match: [/^[0-9]{9,12}$/, "Số điện thoại không hợp lệ"],
  },
});

const NhanVien = mongoose.model("NhanVien", NhanVienSchema);
export default NhanVien;

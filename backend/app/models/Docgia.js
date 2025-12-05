//models/DocGia.js
import mongoose from "mongoose";

const docGiaSchema = new mongoose.Schema({
  maDocGia: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hoLot: { type: String, required: true },
  tenDocGia: { type: String, required: true },
  diaChi: { type: String },
  dienThoai: { type: String },
  email: { type: String, required: true, unique: true },
  ngaySinh: { type: Date, required: true, default: Date.now },
});

const DocGia = mongoose.model("DocGia", docGiaSchema);
export default DocGia;

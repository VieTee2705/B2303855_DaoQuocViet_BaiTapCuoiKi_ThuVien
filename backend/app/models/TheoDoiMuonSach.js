// models/TheoDoiMuonSach.js
import mongoose from 'mongoose';

const TheoDoiMuonSachSchema = new mongoose.Schema({
  MaDocGia: { type: String, required: true, ref: "DocGia" },
  MaSach: { type: String, required: true, ref: "Sach" },
  NgayMuon: { type: Date, required: true },
  NgayTra: { type: Date } // optional
})

const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', TheoDoiMuonSachSchema);
export default TheoDoiMuonSach;
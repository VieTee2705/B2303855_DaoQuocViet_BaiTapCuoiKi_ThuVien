// models/YeuCauMuonSach.js
import mongoose from "mongoose";

// ... (Giữ nguyên ChiTietSachSchema như cũ) ...
const ChiTietSachSchema = new mongoose.Schema(
  {
    MaSach: { type: String, required: true },
    TenSach: { type: String },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ChiTietSachSchema.virtual("ThongTinSach", {
  ref: "Sach",
  localField: "MaSach",
  foreignField: "MaSach",
  justOne: true,
});

const YeuCauMuonSachSchema = new mongoose.Schema(
  {
    // 1. Bỏ ref ở đây, chỉ lưu chuỗi String
    MaDocGia: { type: String, required: true },

    DanhSachSach: [ChiTietSachSchema],
    NgayYeuCau: { type: Date, default: Date.now },
    TrangThai: {
      type: String,
      enum: ["DangCho", "DaDuyet", "DaTra", "TuChoi"],
      default: "DangCho",
    },
  },
  {
    // 2. QUAN TRỌNG: Bật virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 3. Tạo liên kết ảo để lấy thông tin độc giả
YeuCauMuonSachSchema.virtual("ThongTinDocGia", {
  ref: "DocGia", // Model cần liên kết
  localField: "MaDocGia", // Trường mã ở bảng này
  foreignField: "maDocGia", // Trường mã ở bảng DocGia (chú ý chữ thường/hoa trong file DocGia.js)
  justOne: true,
});

const YeuCauMuonSach = mongoose.model("YeuCauMuonSach", YeuCauMuonSachSchema);
export default YeuCauMuonSach;

import mongoose from "mongoose";

const SachSchema = new mongoose.Schema(
  {
    MaSach: { type: String, unique: true, required: true },
    TenSach: { type: String, required: true },

    // --- BỔ SUNG CÁC TRƯỜNG SỐ (Bắt buộc phải khai báo) ---
    DonGia: { type: Number, default: 0 }, // Kiểu Number
    SoQuyen: { type: Number, default: 0 }, // Kiểu Number
    NamXuatBan: { type: Number }, // Kiểu Number

    // Các trường khác
    MaNXB: { type: String, required: true },
    TacGia: { type: String, required: true },
    HinhAnh: { type: String, required: false },
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate (Giữ nguyên như bạn đã làm)
SachSchema.virtual("thongTinNXB", {
  ref: "NhaXuatBan",
  localField: "MaNXB",
  foreignField: "maNXB", // Đảm bảo bảng NXB có trường 'maNXB' (chữ thường/hoa phải khớp)
  justOne: true,
});

const Sach = mongoose.model("Sach", SachSchema);
export default Sach;

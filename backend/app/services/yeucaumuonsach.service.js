// services/yeucaumuonsach.service.js
import YeuCauMuonSach from "../models/YeuCauMuonSach.js";

class YeuCauMuonSachService {
  async create(data) {
    const newYeuCau = new YeuCauMuonSach(data);
    return await newYeuCau.save();
  }

  async findAll() {
    return await YeuCauMuonSach.find()
      .populate("ThongTinDocGia") // <--- SỬA TÊN Ở ĐÂY (trùng với tên virtual)
      .populate("DanhSachSach.ThongTinSach")
      .sort({ NgayYeuCau: -1 });
  }

  async updateStatus(id, trangThai) {
    return await YeuCauMuonSach.findByIdAndUpdate(
      id,
      { TrangThai: trangThai },
      { new: true }
    );
  }
  async findByMaDocGia(maDocGia) {
    // Lưu ý: Populate 'DanhSachSach.ThongTinSach' dựa trên virtual field bạn đã định nghĩa trong Model
    return await YeuCauMuonSach.find({ MaDocGia: maDocGia })
      .populate({
        path: "DanhSachSach.ThongTinSach", // Tên virtual field trong ChiTietSachSchema
        select: "TenSach HinhAnh DonGia TacGia", // Chỉ lấy các trường cần thiết
      })
      .sort({ NgayYeuCau: -1 }); // Mới nhất lên đầu
  }
}

export default new YeuCauMuonSachService();

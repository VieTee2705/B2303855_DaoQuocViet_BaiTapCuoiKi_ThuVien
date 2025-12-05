import NhanVien from "../models/NhanVien.js";

class NhanVienService {
  // Tạo nhân viên mới
  async create(payload) {
    const nhanVien = new NhanVien(payload);
    // Lưu ý: pre('save') trong Model sẽ tự động hash password
    return await nhanVien.save();
  }

  // Lấy danh sách tất cả nhân viên (Trừ password)
  async findAll() {
    return await NhanVien.find({}).select("-Password");
  }

  // Lấy chi tiết 1 nhân viên
  async findById(id) {
    return await NhanVien.findById(id).select("-Password");
  }

  // Cập nhật nhân viên
  async update(id, payload) {
    // Tìm nhân viên trước
    const nhanVien = await NhanVien.findById(id);
    if (!nhanVien) return null;

    // Cập nhật từng trường có trong payload
    // Lưu ý: Không cập nhật MSNV (thường là cố định)
    if (payload.HoTenNV) nhanVien.HoTenNV = payload.HoTenNV;
    if (payload.Chucvu) nhanVien.Chucvu = payload.Chucvu;
    if (payload.Diachi) nhanVien.Diachi = payload.Diachi;
    if (payload.SoDienThoai) nhanVien.SoDienThoai = payload.SoDienThoai;

    // Nếu có đổi password thì gán vào, pre('save') sẽ tự hash lại
    if (payload.Password && payload.Password.trim() !== "") {
      nhanVien.Password = payload.Password;
    }

    return await nhanVien.save();
  }

  // Xóa nhân viên
  async delete(id) {
    return await NhanVien.findByIdAndDelete(id);
  }
}

export default new NhanVienService();

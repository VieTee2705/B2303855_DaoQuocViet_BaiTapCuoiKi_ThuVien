// app/services/nhanvien.service.js
import NhanVien from "../models/NhanVien.js";
import ApiError from "../api-error.js";

class NhanVienService {
  /**
   * Tạo nhân viên mới
   * Lưu ý: Dùng .save() để kích hoạt middleware mã hóa mật khẩu trong Model
   * @param {object} payload Dữ liệu nhân viên
   */
  async create(payload) {
    try {
      // 1. Kiểm tra xem MSNV đã tồn tại chưa
      const existingNV = await NhanVien.findOne({ MSNV: payload.MSNV });
      if (existingNV) {
        throw new ApiError(409, `Mã nhân viên '${payload.MSNV}' đã tồn tại.`);
      }

      // 2. Tạo đối tượng mới
      const nhanVien = new NhanVien(payload);

      // 3. Lưu vào DB (Lúc này pre('save') sẽ chạy để hash password)
      return await nhanVien.save();
    } catch (error) {
      // Nếu lỗi do mình throw thì ném tiếp
      if (error instanceof ApiError) throw error;

      // Nếu lỗi từ MongoDB (ví dụ duplicate key khác)
      throw new ApiError(500, "Lỗi khi tạo nhân viên: " + error.message);
    }
  }

  /**
   * Tìm kiếm nhân viên theo bộ lọc
   */
  async find(filter) {
    // Trừ trường Password ra để bảo mật khi list danh sách
    return await NhanVien.find(filter).select("-Password");
  }

  /**
   * Tìm theo Tên Nhân Viên (Tìm tương đối)
   */
  async findByTen(ten) {
    return await this.find({
      HoTenNV: { $regex: new RegExp(ten), $options: "i" },
    });
  }

  /**
   * Tìm theo ID (Object ID của Mongo)
   */
  async findById(id) {
    return await NhanVien.findById(id).select("-Password");
  }

  /**
   * Tìm theo Mã Số Nhân Viên (MSNV)
   */
  async findByMSNV(msnv) {
    return await NhanVien.findOne({ MSNV: msnv });
    // Ở hàm này có thể giữ Password để phục vụ chức năng Login (so sánh pass)
    // Nếu chỉ để hiển thị info thì nên thêm .select("-Password")
  }

  /**
   * Cập nhật nhân viên
   */
  async update(id, payload) {
    // 1. Không cho phép sửa MSNV (Key định danh)
    if (payload.MSNV) {
      delete payload.MSNV;
    }

    // 2. Không cho phép cập nhật Password tại đây
    // (Nên làm route đổi mật khẩu riêng để xử lý mã hóa lại)
    if (payload.Password) {
      delete payload.Password;
    }

    // 3. Thực hiện update
    return await NhanVien.findByIdAndUpdate(id, payload, {
      new: true, // Trả về dữ liệu sau khi update
      runValidators: true, // Kiểm tra tính hợp lệ (VD: số điện thoại)
    }).select("-Password");
  }

  /**
   * Xóa nhân viên
   */
  async delete(id) {
    return await NhanVien.findByIdAndDelete(id);
  }

  /**
   * Xóa tất cả nhân viên (Cẩn thận khi dùng)
   */
  async deleteAll() {
    const result = await NhanVien.deleteMany({});
    return result.deletedCount;
  }
}

export default new NhanVienService();

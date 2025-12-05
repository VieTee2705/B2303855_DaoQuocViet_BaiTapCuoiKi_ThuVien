// app/services/sach.service.js
import Sach from "../models/Sach.js";
import ApiError from "../api-error.js";

class SachService {
  /**
   * Tạo mới hoặc cập nhật (upsert) sách dựa trên MaSach
   * @param {object} payload Dữ liệu sách
   * @returns {Promise<object>}
   */
  async create(payload) {
    const filter = { MaSach: payload.MaSach };
    const update = payload;

    try {
      return await Sach.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
        runValidators: true,
      });
    } catch (error) {
      throw new ApiError(500, "Lỗi khi tạo sách: " + error.message);
    }
  }

  /**
   * Tìm kiếm sách
   * @param {object} filter Bộ lọc
   * @returns {Promise<Array>}
   */
  async find(filter) {
    return await Sach.find(filter).populate({
      path: "thongTinNXB", // Tên trường ảo vừa tạo ở Model
      select: "tenNXB diaChi -_id", // Chỉ lấy tên và địa chỉ, bỏ id
    });
  }

  /**
   * Tìm theo Tên Sách
   * @param {string} ten Tên sách
   * @returns {Promise<Array>}
   */
  async findByTenSach(ten) {
    return await this.find({
      TenSach: { $regex: new RegExp(ten), $options: "i" },
    });
  }

  /**
   * Tìm theo ID
   * @param {string} id ID của tài liệu
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    return await Sach.findById(id).populate("MaNXB", "tenNXB");
  }

  /**
   * Cập nhật sách
   * @param {string} id ID của tài liệu
   * @param {object} payload Dữ liệu cập nhật
   * @returns {Promise<object|null>}
   */
  async update(id, payload) {
    if (payload.MaSach) {
      // Không cho cập nhật mã
      delete payload.MaSach;
    }
    return await Sach.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Xóa sách
   * @param {string} id ID của tài liệu
   * @returns {Promise<object|null>}
   */
  async delete(id) {
    return await Sach.findByIdAndDelete(id);
  }

  /**
   * Xóa tất cả
   * @returns {Promise<number>}
   */
  async deleteAll() {
    const result = await Sach.deleteMany({});
    return result.deletedCount;
  }
}

export default new SachService();

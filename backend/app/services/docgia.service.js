// app/services/docgia.service.js
import DocGia from "../models/Docgia.js"; // Tên file là Docia.js

class DocGiaService {
  // Hàm này chỉ chuyên tạo mới
  async create(payload) {
    // Tự sinh mã tại đây (hoặc truyền từ controller vào cũng được)
    const maDocGia = "DG" + Date.now();

    const docGiaData = {
      ...payload,
      maDocGia: maDocGia,
    };

    const docGia = new DocGia(docGiaData);

    try {
      return await docGia.save();
    } catch (error) {
      // Xử lý lỗi trùng lặp (ví dụ email đã tồn tại)
      if (error.code === 11000) {
        // Bạn có thể throw error để controller bắt
        throw new Error(`Email hoặc thông tin duy nhất đã tồn tại.`);
      }
      throw error;
    }
  }
  /**
   * Tìm kiếm độc giả
   * @param {object} filter Bộ lọc
   * @returns {Promise<Array>}
   */
  async find(filter) {
    return await DocGia.find(filter);
  }

  /**
   * Tìm theo Tên
   * @param {string} ten Tên độc giả
   * @returns {Promise<Array>}
   */
    async findByTen(ten) {
      return await this.find({
        tenDocGia: { $regex: new RegExp(ten), $options: "i" },
      });
    }

  /**
   * Tìm theo ID
   * @param {string} id ID của tài liệu
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    return await DocGia.findById(id);
  }

  /**
   * Tìm theo Mã Độc Giả
   * @param {string} maDocGia Mã độc giả
   * @returns {Promise<object|null>}
   */
  async findByMaDocGia(maDocGia) {
    return await DocGia.findOne({ maDocGia });
  }

  /**
   * Cập nhật độc giả
   * @param {string} id ID của tài liệu
   * @param {object} payload Dữ liệu cập nhật
   * @returns {Promise<object|null>}
   */
  async update(id, payload) {
    if (payload.maDocGia) {
      // Không cho cập nhật mã
      delete payload.maDocGia;
    }
    return await DocGia.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Xóa độc giả
   * @param {string} id ID của tài liệu
   * @returns {Promise<object|null>}
   */
  async delete(id) {
    return await DocGia.findByIdAndDelete(id);
  }

  /**
   * Xóa tất cả
   * @returns {Promise<number>}
   */
  async deleteAll() {
    const result = await DocGia.deleteMany({});
    return result.deletedCount;
  }
}

export default new DocGiaService();

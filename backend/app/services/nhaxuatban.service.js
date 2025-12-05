// app/services/nhaxuatban.service.js
import NhaXuatBan from '../models/NhaXuatBan.js';
import ApiError from '../api-error.js';

class NhaXuatBanService {
    /**
     * Tạo mới hoặc cập nhật (upsert) NXB dựa trên maNXB
     * @param {object} payload Dữ liệu NXB
     * @returns {Promise<object>}
     */
    async create(payload) {
        const filter = { maNXB: payload.maNXB };
        const update = payload;
        
        try {
            return await NhaXuatBan.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true,
                runValidators: true,
            });
        } catch (error) {
            throw new ApiError(500, "Lỗi khi tạo NXB: " + error.message);
        }
    }

    /**
     * Tìm kiếm NXB
     * @param {object} filter Bộ lọc
     * @returns {Promise<Array>}
     */
    async find(filter) {
        return await NhaXuatBan.find(filter);
    }

    /**
     * Tìm theo Tên NXB
     * @param {string} ten Tên NXB
     * @returns {Promise<Array>}
     */
    async findByTenNXB(ten) {
        return await this.find({ 
            tenNXB: { $regex: new RegExp(ten), $options: "i" } 
        });
    }

    /**
     * Tìm theo ID
     * @param {string} id ID của tài liệu
     * @returns {Promise<object|null>}
     */
    async findById(id) {
        return await NhaXuatBan.findById(id);
    }

    /**
     * Cập nhật NXB
     * @param {string} id ID của tài liệu
     * @param {object} payload Dữ liệu cập nhật
     * @returns {Promise<object|null>}
     */
    async update(id, payload) {
        if (payload.maNXB) { // Không cho cập nhật mã
            delete payload.maNXB;
        }
        return await NhaXuatBan.findByIdAndUpdate(id, payload, { 
            new: true, 
            runValidators: true 
        });
    }

    /**
     * Xóa NXB
     * @param {string} id ID của tài liệu
     * @returns {Promise<object|null>}
     */
    async delete(id) {
        return await NhaXuatBan.findByIdAndDelete(id);
    }

    /**
     * Xóa tất cả
     * @returns {Promise<number>}
     */
    async deleteAll() {
        const result = await NhaXuatBan.deleteMany({});
        return result.deletedCount;
    }
}

export default new NhaXuatBanService();
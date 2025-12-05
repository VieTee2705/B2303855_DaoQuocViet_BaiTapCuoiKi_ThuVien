// app/services/theodoimuonsach.service.js
import TheoDoiMuonSach from '../models/TheoDoiMuonSach.js';
import ApiError from '../api-error.js';

class TheoDoiMuonSachService {
    /**
     * Tạo một phiếu mượn sách mới
     * @param {object} payload Dữ liệu phiếu mượn
     * @returns {Promise<object>}
     */
    async create(payload) {
        try {
            // Đảm bảo NgayTra là null hoặc không xác định khi tạo
            if (payload.NgayTra) {
                delete payload.NgayTra;
            }
            
            const phieuMuon = new TheoDoiMuonSach(payload);
            return await phieuMuon.save();
        } catch (error) {
            throw new ApiError(500, "Lỗi khi tạo phiếu mượn: " + error.message);
        }
    }

    /**
     * Lấy tất cả phiếu mượn (có thể join thông tin)
     * @param {object} filter Bộ lọc
     * @returns {Promise<Array>}
     */
    async find(filter) {
        return await TheoDoiMuonSach.find(filter)
            .populate('MaDocGia', 'tenDocGia maDocGia') // Lấy tenDocGia, maDocGia từ model DocGia
            .populate('MaSach', 'TenSach MaSach');      // Lấy TenSach, MaSach từ model Sach
    }

    /**
     * Tìm theo ID
     * @param {string} id ID của tài liệu
     * @returns {Promise<object|null>}
     */
    async findById(id) {
        return await TheoDoiMuonSach.findById(id)
            .populate('MaDocGia')
            .populate('MaSach');
    }

    /**
     * Tìm tất cả phiếu mượn của 1 độc giả
     * @param {string} maDocGia Mã độc giả
     * @returns {Promise<Array>}
     */
    async findByMaDocGia(maDocGia) {
        return await this.find({ MaDocGia: maDocGia });
    }

    /**
     * Tìm tất cả phiếu mượn của 1 sách
     * @param {string} maSach Mã sách
     * @returns {Promise<Array>}
     */
    async findByMaSach(maSach) {
        return await this.find({ MaSach: maSach });
    }

    /**
     * Tìm các phiếu mượn chưa trả
     * @returns {Promise<Array>}
     */
    async findChuaTra() {
        return await this.find({ NgayTra: null });
    }

    /**
     * Cập nhật phiếu mượn (thường là để trả sách)
     * @param {string} id ID của tài liệu
     * @param {object} payload Dữ liệu (ví dụ: { NgayTra: Date.now() })
     * @returns {Promise<object|null>}
     */
    async update(id, payload) {
        // Chỉ cho phép cập nhật một số trường, ví dụ NgayTra
        const updateData = {
            NgayTra: payload.NgayTra
        };
        
        return await TheoDoiMuonSach.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true 
        });
    }

    /**
     * Xóa phiếu mượn
     * @param {string} id ID của tài liệu
     * @returns {Promise<object|null>}
     */
    async delete(id) {
        return await TheoDoiMuonSach.findByIdAndDelete(id);
    }

    /**
     * Xóa tất cả
     * @returns {Promise<number>}
     */
    async deleteAll() {
        const result = await TheoDoiMuonSach.deleteMany({});
        return result.deletedCount;
    }
}

export default new TheoDoiMuonSachService();
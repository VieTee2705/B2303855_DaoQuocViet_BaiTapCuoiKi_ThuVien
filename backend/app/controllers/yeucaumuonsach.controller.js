import YeuCauMuonSachService from "../services/yeucaumuonsach.service.js";

// Tạo yêu cầu mượn (User gửi từ giỏ hàng)
export const create = async (req, res, next) => {
  try {
    // req.body cần có: { MaDocGia: "...", DanhSachSach: [{MaSach: "...", TenSach: "..."}] }
    const document = await YeuCauMuonSachService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new Error(`Lỗi khi tạo yêu cầu mượn: ${error.message}`));
  }
};

// Lấy danh sách (Admin)
export const findAll = async (req, res, next) => {
  try {
    const documents = await YeuCauMuonSachService.findAll();
    return res.send(documents);
  } catch (error) {
    return next(new Error(`Lỗi khi lấy danh sách: ${error.message}`));
  }
};

// Duyệt yêu cầu (Admin cập nhật trạng thái)
export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { TrangThai } = req.body; // Ví dụ gửi lên: { "TrangThai": "DaDuyet" }
    const document = await YeuCauMuonSachService.updateStatus(id, TrangThai);

    if (!document) {
      return next(new Error("Không tìm thấy yêu cầu"));
    }
    return res.send({ message: "Cập nhật trạng thái thành công", document });
  } catch (error) {
    return next(new Error(`Lỗi cập nhật: ${error.message}`));
  }
};

export const getHistoryByUser = async (req, res, next) => {
  try {
    const { maDocGia } = req.params;

    // Gọi service tìm kiếm
    const documents = await YeuCauMuonSachService.findByMaDocGia(maDocGia);

    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "Lỗi khi lấy lịch sử mượn: " + error.message)
    );
  }
};

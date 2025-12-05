// app/controllers/theodoimuonsach.controller.js
import TheoDoiMuonSachService from "../services/theodoimuonsach.service.js";
import ApiError from "../api-error.js";

// Tạo phiếu mượn (Mượn sách)
export const create = async (req, res, next) => {
  // Dựa theo model TheoDoiMuonSach.js
  if (!req.body?.MaDocGia || !req.body?.MaSach || !req.body?.NgayMuon) {
    return next(new ApiError(400, "MaDocGia, MaSach, và NgayMuon là bắt buộc"));
  }
  try {
    const document = await TheoDoiMuonSachService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(error);
  }
};

// Cập nhật phiếu mượn (Trả sách)
export const update = async (req, res, next) => {
  // Khi trả sách, chỉ cần gửi lên NgayTra
  if (!req.body?.NgayTra) {
    return next(new ApiError(400, "NgayTra là bắt buộc để cập nhật"));
  }

  try {
    // Service đã được thiết kế để chỉ cập nhật NgayTra
    const document = await TheoDoiMuonSachService.update(
      req.params.id,
      req.body
    );
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send({ message: "Phiếu mượn đã được cập nhật (đã trả sách)" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật phiếu mượn với id=${req.params.id}`)
    );
  }
};

// Tìm tất cả phiếu mượn (có thể lọc)
export const findAll = async (req, res, next) => {
  let documents = [];
  try {
    const { MaDocGia, MaSach, chuaTra } = req.query;

    if (MaDocGia) {
      documents = await TheoDoiMuonSachService.findByMaDocGia(MaDocGia);
    } else if (MaSach) {
      documents = await TheoDoiMuonSachService.findByMaSach(MaSach);
    } else if (chuaTra === "true") {
      documents = await TheoDoiMuonSachService.findChuaTra();
    } else {
      documents = await TheoDoiMuonSachService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất phiếu mượn"));
  }
  return res.send(documents);
};

// Tìm một phiếu mượn
export const findOne = async (req, res, next) => {
  try {
    const document = await TheoDoiMuonSachService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất phiếu mượn với id=${req.params.id}`)
    );
  }
};

// Xóa một phiếu mượn
export const deleteOne = async (req, res, next) => {
  try {
    const document = await TheoDoiMuonSachService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    }
    return res.send({ message: "Phiếu mượn đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xóa phiếu mượn với id=${req.params.id}`)
    );
  }
};

// Xóa tất cả phiếu mượn
export const deleteAll = async (_req, res, next) => {
  try {
    const deletedCount = await TheoDoiMuonSachService.deleteAll();
    return res.send({
      message: `${deletedCount} phiếu mượn đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả phiếu mượn"));
  }
};

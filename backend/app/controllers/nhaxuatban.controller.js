// app/controllers/nhaxuatban.controller.js
import NhaXuatBanService from "../services/nhaxuatban.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
  // Dựa theo model NhaXuatBan.js
  if (!req.body?.maNXB || !req.body?.tenNXB) {
    return next(new ApiError(400, "maNXB và tenNXB là bắt buộc"));
  }
  try {
    const document = await NhaXuatBanService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(error);
  }
};

export const findAll = async (req, res, next) => {
  let documents = [];
  try {
    const { tenNXB } = req.query; // Tìm theo tên NXB
    if (tenNXB) {
      documents = await NhaXuatBanService.findByTenNXB(tenNXB);
    } else {
      documents = await NhaXuatBanService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất nhà xuất bản"));
  }
  return res.send(documents);
};

export const findOne = async (req, res, next) => {
  try {
    const document = await NhaXuatBanService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi truy xuất nhà xuất bản với id=${req.params.id}`
      )
    );
  }
};

export const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }
  try {
    const document = await NhaXuatBanService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Nhà xuất bản đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật nhà xuất bản với id=${req.params.id}`)
    );
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const document = await NhaXuatBanService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    return res.send({ message: "Nhà xuất bản đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xóa nhà xuất bản với id=${req.params.id}`)
    );
  }
};

export const deleteAll = async (_req, res, next) => {
  try {
    const deletedCount = await NhaXuatBanService.deleteAll();
    return res.send({
      message: `${deletedCount} nhà xuất bản đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả nhà xuất bản"));
  }
};

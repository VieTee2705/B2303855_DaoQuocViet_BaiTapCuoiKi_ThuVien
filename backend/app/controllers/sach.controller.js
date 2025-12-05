import SachService from "../services/sach.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
  // 1. Kiểm tra các trường bắt buộc (Giữ nguyên code của bạn)
  if (!req.body?.MaSach) {
    return next(new ApiError(400, "MaSach không được để trống"));
  }
  if (!req.body?.TenSach) {
    return next(new ApiError(400, "TenSach không được để trống"));
  }

  try {
    // --- ĐOẠN CODE MỚI THÊM VÀO ---

    // 2. Lấy đường dẫn ảnh từ req.file (do Multer tạo ra)
    // Nếu có file upload thì tạo đường dẫn "/uploads/ten-file.jpg"
    // Nếu không có file thì để rỗng
    const hinhAnhPath = req.file ? `/uploads/${req.file.filename}` : "";

    // 3. Gộp dữ liệu text và dữ liệu ảnh
    const bookData = {
      ...req.body, // Lấy hết các trường text (TenSach, DonGia...)
      HinhAnh: hinhAnhPath, // Thêm trường HinhAnh vào
    };

    // 4. Gọi Service để lưu vào DB
    const document = await SachService.create(bookData);
    return res.send(document);
  } catch (error) {
    // Console log lỗi ra để dễ debug nếu có sự cố
    console.error("Lỗi tạo sách:", error);
    return next(new ApiError(500, "Đã xảy ra lỗi khi tạo sách"));
  }
};
// Lấy tất cả sách (hoặc tìm theo TenSach)
export const findAll = async (req, res, next) => {
  let documents = [];

  try {
    const { TenSach } = req.query;

    if (TenSach) {
      documents = await SachService.findByTen(TenSach);
    } else {
      documents = await SachService.find({});
    }

    return res.send(documents); // Dùng return để kết thúc hàm
  } catch (error) {
    // Log lỗi ra console để bạn xem nó bị gì
    console.log("Lỗi ở findAll:", error);

    // Sau khi sửa import, dòng dưới này sẽ chạy được
    return next(new ApiError(500, "Đã xảy ra lỗi khi lấy danh sách sách"));
  }
};
// Tìm một sách bằng ID
export const findOne = async (req, res, next) => {
  try {
    const document = await SachService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất sách với id=${req.params.id}`)
    );
  }
};

// Cập nhật thông tin sách
export const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }
  try {
    const document = await SachService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Sách đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật sách với id=${req.params.id}`)
    );
  }
};

// Xóa một sách
export const deleteOne = async (req, res, next) => {
  try {
    const document = await SachService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    return res.send({ message: "Sách đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xóa sách với id=${req.params.id}`)
    );
  }
};

// Xóa tất cả sách
export const deleteAll = async (_req, res, next) => {
  try {
    const deletedCount = await SachService.deleteAll();
    return res.send({
      message: `${deletedCount} sách đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả sách"));
  }
};

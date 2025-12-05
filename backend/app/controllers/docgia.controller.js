// app/controllers/docgia.controller.js
import DocGiaService from "../services/docgia.service.js";
import DocGia from "../models/Docgia.js";
import ApiError from "../api-error.js";

export const create2 = async (req, res, next) => {
  try {
    // 1. Lấy dữ liệu
    const data = req.body;

    // 2. Gọi Service để xử lý logic tạo và lưu
    const result = await DocGiaService.create(data);

    // 3. Trả kết quả
    res.send(result);
  } catch (error) {
    // Xử lý lỗi từ Service ném ra
    console.log(error);
    res.status(500).send({ message: "Lỗi đăng ký: " + error.message });

    // Hoặc nếu dùng middleware xử lý lỗi:
    // return next(new ApiError(500, "Lỗi đăng ký"));
  }
};

export const create = async (req, res, next) => {
  // Dựa theo model của bạn (Docia.js)
  if (!req.body?.maDocGia || !req.body?.tenDocGia || !req.body?.email) {
    return next(new ApiError(400, "maDocGia, tenDocGia, và email là bắt buộc"));
  }
  try {
    // Service sẽ tự động upsert
    const document = await DocGiaService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(error); // Chuyển lỗi cho middleware
  }
};

export const findAll = async (req, res, next) => {
  let documents = [];
  try {
    const { ten } = req.query; // Tìm theo tên
    if (ten) {
      documents = await DocGiaService.findByTen(ten);
    } else {
      documents = await DocGiaService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất độc giả"));
  }
  return res.send(documents);
};

export const findOne = async (req, res, next) => {
  try {
    const document = await DocGiaService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất độc giả với id=${req.params.id}`)
    );
  }
};

export const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }
  try {
    const document = await DocGiaService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Độc giả đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật độc giả với id=${req.params.id}`)
    );
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const document = await DocGiaService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }
    return res.send({ message: "Độc giả đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xóa độc giả với id=${req.params.id}`)
    );
  }
};

export const deleteAll = async (_req, res, next) => {
  try {
    const deletedCount = await DocGiaService.deleteAll();
    return res.send({
      message: `${deletedCount} độc giả đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả độc giả"));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm độc giả theo email
    const docGia = await DocGia.findOne({ email: email });

    // 2. Kiểm tra xem có tìm thấy không
    if (!docGia) {
      return res.status(404).send({ message: "Email không tồn tại!" });
    }

    // 3. So sánh password (dạng văn bản thô như bạn yêu cầu)
    if (password !== docGia.password) {
      return res.status(401).send({ message: "Sai mật khẩu!" });
    }

    // 4. Nếu đúng hết, trả về thông tin độc giả (trừ password ra cho bảo mật chút)
    // Convert sang object thuần để xóa field password
    const info = docGia.toObject();
    delete info.password;

    res.send(info);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Lỗi đăng nhập: " + error.message });
  }
};

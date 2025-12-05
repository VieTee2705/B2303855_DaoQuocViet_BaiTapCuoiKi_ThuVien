// app/controllers/nhanvien.controller.js
import NhanVienService from "../services/nhanvien.service.js";
import ApiError from "../api-error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Controller cho Đăng ký (Create)
export const create = async (req, res, next) => {
  if (!req.body?.MSNV || !req.body?.Password || !req.body?.HoTenNV) {
    return next(new ApiError(400, "MSNV, Password, và HoTenNV là bắt buộc"));
  }
  try {
    // Service đã tự động mã hóa mật khẩu
    const document = await NhanVienService.create(req.body);

    // Không trả mật khẩu về
    document.Password = undefined;
    return res.send(document);
  } catch (error) {
    return next(error); // Chuyển lỗi cho middleware (vd: lỗi 409 duplicate)
  }
};

// Controller cho Đăng nhập
export const login = async (req, res, next) => {
  if (!req.body?.MSNV || !req.body?.Password) {
    return next(new ApiError(400, "MSNV và Password là bắt buộc"));
  }
  try {
    const { MSNV, Password } = req.body;

    // Tìm nhân viên (Service sẽ trả về user CÓ MẬT KHẨU)
    const user = await NhanVienService.findByMSNV(MSNV);
    if (!user) {
      return next(new ApiError(401, "MSNV không tồn tại"));
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return next(new ApiError(401, "Sai mật khẩu"));
    }

    // Tạo JWT Token
    // Cần định nghĩa SECRET_KEY trong file .env
    const token = jwt.sign(
      { id: user._id, MSNV: user.MSNV, Chucvu: user.Chucvu },
      process.env.JWT_SECRET || "your-secret-key", // Thay thế bằng biến môi trường
      { expiresIn: "1h" }
    );

    // Đăng nhập thành công, không trả mật khẩu
    user.Password = undefined;
    return res.send({ user, token });
  } catch (error) {
    return next(error);
  }
};

// ---- CÁC HÀM CRUD CƠ BẢN ----

export const findAll = async (req, res, next) => {
  try {
    const documents = await NhanVienService.find({});
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi truy xuất nhân viên"));
  }
};

export const findOne = async (req, res, next) => {
  try {
    const document = await NhanVienService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi truy xuất nhân viên với id=${req.params.id}`)
    );
  }
};

export const update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }
  try {
    const document = await NhanVienService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Nhân viên đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật nhân viên với id=${req.params.id}`)
    );
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const document = await NhanVienService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy nhân viên"));
    }
    return res.send({ message: "Nhân viên đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Không thể xóa nhân viên với id=${req.params.id}`)
    );
  }
};

export const deleteAll = async (_req, res, next) => {
  try {
    const deletedCount = await NhanVienService.deleteAll();
    return res.send({
      message: `${deletedCount} nhân viên đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa tất cả nhân viên"));
  }
};

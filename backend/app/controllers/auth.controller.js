import NhanVien from "../models/NhanVien.js";
import DocGia from "../models/Docgia.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // --- TRƯỜNG HỢP 1: KIỂM TRA ĐỘC GIẢ (Dùng Email) ---
    // Tìm độc giả theo email
    const docGia = await DocGia.findOne({ email: username });

    if (docGia) {
      // So sánh password trực tiếp (Plain text - Theo yêu cầu đề bài)
      if (docGia.password === password) {
        // Xóa password trước khi trả về client để bảo mật thông tin
        const { password, ...userInfo } = docGia._doc;

        return res.status(200).json({
          user: userInfo,
          role: "docgia",
          message: "Đăng nhập thành công (Độc giả)",
        });
      } else {
        return res.status(401).json({ message: "Mật khẩu không chính xác" });
      }
    }

    // --- TRƯỜNG HỢP 2: KIỂM TRA NHÂN VIÊN (Dùng MSNV) ---
    // Nếu không phải độc giả, tìm trong bảng Nhân Viên theo MSNV
    const nhanVien = await NhanVien.findOne({ MSNV: username });

    if (nhanVien) {
      // Lưu ý: Model NhanVien bạn cung cấp dùng chữ 'P' hoa cho field Password
      if (nhanVien.Password === password) {
        const { Password, ...userInfo } = nhanVien._doc;

        return res.status(200).json({
          user: userInfo,
          role: nhanVien.Chucvu, // 'admin' hoặc 'nhanvien'
          message: "Đăng nhập thành công (Nhân viên)",
        });
      } else {
        return res.status(401).json({ message: "Mật khẩu không chính xác" });
      }
    }

    // --- TRƯỜNG HỢP 3: KHÔNG TÌM THẤY TÀI KHOẢN ---
    return res.status(404).json({ message: "Tài khoản không tồn tại" });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

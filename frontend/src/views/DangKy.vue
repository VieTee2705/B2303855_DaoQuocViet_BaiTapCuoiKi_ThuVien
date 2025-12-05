<script setup>
import { reactive } from 'vue';
import axios from 'axios';

// Khởi tạo state cho form
const formData = reactive({
  hoLot: '',
  tenDocGia: '',
  dienThoai: '',
  email: '',
  password: '',
  gioiTinh: 'Nam', 
  ngaySinh: ''
});


// Hàm xử lý khi submit form
const handleRegister = async () => {
  try {
    // Gọi API xuống backend (Giả sử backend chạy port 3000)
    const response = await axios.post('http://localhost:3000/api/docgia', formData);

    // Backend trả về kết quả (biến result bên controller)
    console.log("Đã lưu thành công:", response.data);
    
    // Thông báo có kèm Mã Độc Giả vừa sinh
    alert(`Đăng ký thành công! Mã độc giả mới là: ${response.data.maDocGia}`);

  } catch (error) {
    console.log(error);
    alert("Lỗi khi đăng ký: " + error.message);
  }
};
</script>

<template>
  <div class="register-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="register-card">
            <h2 class="register-title">Đăng ký</h2>
            <p class="register-desc">Trang này giúp bạn tạo tài khoản Độc giả. Vui lòng cung cấp đầy đủ thông tin.</p>

            <form @submit.prevent="handleRegister">
              <!-- Họ và Tên -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="hoLot" class="form-label">Nhập họ lót:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="hoLot" 
                    v-model="formData.hoLot" 
                    placeholder="Nguyễn Văn" 
                    required
                  >
                </div>
                <div class="col-md-6 mt-3 mt-md-0">
                  <label for="tenDocGia" class="form-label">Nhập tên:</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="tenDocGia" 
                    v-model="formData.tenDocGia" 
                    placeholder="An" 
                    required
                  >
                </div>
              </div>

              <!-- Số điện thoại -->
              <div class="mb-3">
                <label for="dienThoai" class="form-label">Số điện thoại:</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  id="dienThoai" 
                  v-model="formData.dienThoai" 
                  placeholder="09xxxxxxxxx" 
                  pattern="[0-9]{10}" 
                  required
                >
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="formData.email" 
                  placeholder="email@example.com" 
                  required
                >
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">Mật khẩu:</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="formData.password" 
                  placeholder="********" 
                  required
                >
              </div>

              <!-- Giới tính & Ngày sinh & Nút Submit -->
              <div class="row align-items-center mb-4">
                <!-- Giới tính -->
                <div class="col-12 mb-2">
                  <label class="form-label d-block">Giới tính:</label>
                  <div class="d-flex gender-options">
                    <div class="form-check me-4">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        id="nam" 
                        value="Nam" 
                        v-model="formData.gioiTinh"
                      >
                      <label class="form-check-label text-muted" for="nam">Nam</label>
                    </div>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        id="nu" 
                        value="Nu" 
                        v-model="formData.gioiTinh"
                      >
                      <label class="form-check-label text-muted" for="nu">Nữ</label>
                    </div>
                  </div>
                </div>

                <!-- Ngày sinh -->
                <div class="col-9 mt-2">
                  <label for="ngaySinh" class="form-label">Ngày sinh:</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="ngaySinh" 
                    v-model="formData.ngaySinh" 
                    required
                  >
                </div>

                <!-- Nút Submit (Mũi tên) -->
                <div class="col-3 mt-4 d-flex justify-content-end">
                  <button type="submit" class="btn btn-next shadow-sm" title="Đăng ký">
                    <i class="fas fa-arrow-right"></i> <!-- Sử dụng class chuẩn fas của FontAwesome -->
                  </button>
                </div>
              </div>
            </form>

            <!-- Social Options -->
            <div class="mt-4">
              <p class="mb-2 text-muted fw-bold small">Tùy chọn khác:</p>
              <div class="d-flex flex-wrap">
                <a href="#" class="social-btn">
                  <i class="fab fa-facebook-f text-primary"></i> Facebook
                </a>
                <a href="#" class="social-btn">
                  <i class="fab fa-google text-danger"></i> Google
                </a>
                <a href="#" class="social-btn">
                  <i class="fab fa-linkedin-in text-info"></i> LinkedIn
                </a>
              </div>
            </div>

            <!-- Footer Link -->
            <div class="mt-4 pt-2 border-top">
              <router-link to="/dangnhap" class="login-link text-primary small">Bạn đã có tài khoản? Đăng nhập ngay</router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Lưu ý: Để FontAwesome và Bootstrap hoạt động, 
bạn cần import chúng trong main.js hoặc index.html của dự án Vue.
Ví dụ: import 'bootstrap/dist/css/bootstrap.min.css';
*/

.register-page {
  font-family: 'Roboto', sans-serif;
  background-image: url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Lớp phủ mờ */
.register-page::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
  backdrop-filter: blur(4px);
}

.register-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  padding: 40px;
  width: 100%;
  max-width: 550px;
  position: relative;
  z-index: 1;
}

.register-title {
  color: #0d6efd;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 10px;
}

.register-desc {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 30px;
}

.form-label {
  color: #0d6efd;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-control {
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
}

.form-control:focus {
  background-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

/* Nút mũi tên tròn */
.btn-next {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background-color: white;
  color: #0d6efd;
  border: 2px solid #0d6efd;
  transition: all 0.3s ease;
  padding: 0; /* Fix cho button bootstrap */
}

.btn-next:hover {
  background-color: #0d6efd;
  color: white;
  transform: translateX(5px);
}

/* Social Buttons */
.social-btn {
  border: 1px solid #dee2e6;
  background: white;
  color: #555;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.9rem;
  margin-right: 5px;
  margin-bottom: 5px;
}

.social-btn:hover {
  background-color: #f8f9fa;
  color: #000;
}

.social-btn i {
  font-size: 1.1rem;
}

.login-link {
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

/* Custom Radio */
.gender-options .form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">Đăng Nhập Hệ Thống</h2>
      <p class="subtitle">Quản lý thư viện & Mượn trả sách</p>

      <form @submit.prevent="handleLogin">
        <!-- Input Tài khoản -->
        <div class="form-group">
          <label for="username">Tài khoản</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Nhập Email hoặc MSNV"
              required
            />
            <span class="icon left-icon">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <!-- Input Mật khẩu -->
        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-wrapper">
            <input
              :type="isShowPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="........"
              required
            />
            <span class="icon left-icon">
              <i class="fas fa-lock"></i>
            </span>
            <span 
              class="icon right-icon toggle-password" 
              @click="toggleShowPassword"
            >
              <i :class="isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? "Đang xử lý..." : "Đăng nhập" }}
        </button>

        <div class="footer-link">
          Chưa có tài khoản? <a href="/dangky">Đăng ký độc giả</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// State
const username = ref("");
const password = ref("");
const isShowPassword = ref(false);
const errorMessage = ref("");
const isLoading = ref(false);
const router = useRouter();

const toggleShowPassword = () => {
  isShowPassword.value = !isShowPassword.value;
};

const handleLogin = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    // Gọi API login
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      username: username.value,
      password: password.value,
    });

    const { user, role } = response.data;

    // --- QUAN TRỌNG: LƯU THÔNG TIN ĐĂNG NHẬP ---
    // Phải lưu trước khi push route để trang sau có thể đọc được ngay lập tức
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);
    // Lưu thêm flag isLoggedIn để tiện kiểm tra
    localStorage.setItem("isLoggedIn", "true");

    alert(`Đăng nhập thành công! Vai trò: ${role}`);

    // --- SỬA ĐỔI: TẤT CẢ VỀ TRANG CHỦ ---
    // Bất kể là admin, nhanvien hay docgia đều về '/'
    router.push("/");

  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "Lỗi kết nối đến máy chủ";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 40px 12px 35px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #eef3f8;
  font-size: 16px;
  outline: none;
  transition: border 0.3s;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  border-color: #3498db;
  background-color: #fff;
}

.left-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
}

.right-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
}

.right-icon:hover {
  color: #3498db;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.btn-login:hover {
  background-color: #2980b9;
}

.btn-login:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 10px;
}

.footer-link {
  margin-top: 20px;
  font-size: 14px;
  color: #333;
}

.footer-link a {
  color: #3498db;
  text-decoration: none;
}
</style>
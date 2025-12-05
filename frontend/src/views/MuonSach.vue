<template>
  <div class="borrow-request-container">
    <h2>Xác nhận Yêu cầu Mượn Sách</h2>

    <div v-if="cart.length > 0" class="book-list-section">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Sách</th>
            <th>Tên Sách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in cart" :key="book.MaSach || index">
            <td>{{ index + 1 }}</td>
            <td>{{ book.MaSach }}</td>
            <td>{{ book.TenSach }}</td>
            <td>
              <button @click="removeFromCart(index)" class="btn-danger">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-cart">
      <p>Giỏ sách đang trống. Vui lòng chọn sách trước.</p>
      <router-link to="/sach">Quay lại danh mục sách</router-link>
    </div>

    <div v-if="cart.length > 0" class="info-section">
      <div class="form-group">
        <label>Ngày yêu cầu:</label>
        <input type="text" :value="formatDate(new Date())" disabled class="input-readonly" />
      </div>

      <div class="form-group">
        <label>Ngày hẹn trả (Dự kiến):</label>
        <input type="date" v-model="ngayHenTra" class="input-control" />
        <small>Mặc định là 7 ngày sau ngày mượn.</small>
      </div>

      <div class="form-group">
        <label>Ghi chú cho thủ thư:</label>
        <textarea 
          v-model="ghiChu" 
          rows="3" 
          class="input-control"
          placeholder="Ví dụ: Em sẽ đến lấy sách vào sáng thứ 2..."
        ></textarea>
      </div>

      <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
        {{ message }}
      </div>

      <div class="action-buttons">
        <button @click="submitRequest" :disabled="isLoading" class="btn-confirm">
          {{ isLoading ? 'Đang xử lý...' : 'Gửi Yêu Cầu' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// State
const cart = ref([]);
const ngayHenTra = ref('');
const ghiChu = ref('');
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

// Giả lập lấy MaDocGia từ localStorage (khi login bạn đã lưu cái này)
// Nếu bạn dùng Pinia Store thì import store vào để lấy
const getMaDocGia = () => {
  const user = JSON.parse(localStorage.getItem('user')); 
  // Ví dụ user object lưu: { _id: "DGxxx", hoten: "...", role: "docgia" }
  return user ? user._id : null; 
  // Hoặc nếu bạn lưu riêng MaDocGia: return localStorage.getItem('MaDocGia');
};

// Hàm tính ngày mặc định (Hôm nay + 7 ngày)
const getDefaultReturnDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD cho input date
};

// Lifecycle: Load data khi trang được mở
onMounted(() => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart.value = JSON.parse(storedCart);
  }
  ngayHenTra.value = getDefaultReturnDate();
});

// Xóa sách khỏi danh sách hiển thị (và update localStorage)
const removeFromCart = (index) => {
  cart.value.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

// Helper format ngày hiển thị
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

// Gửi yêu cầu (POST)
const submitRequest = async () => {
  const maDocGia = getMaDocGia();
  
  // Validate cơ bản
  if (!maDocGia) {
    message.value = "Bạn chưa đăng nhập. Vui lòng đăng nhập để mượn sách.";
    isError.value = true;
    return;
  }
  if (cart.value.length === 0) {
    message.value = "Giỏ sách trống.";
    isError.value = true;
    return;
  }

  isLoading.value = true;
  message.value = "";
  isError.value = false;

  try {
    // Chuẩn bị payload đúng theo Schema YeuCauMuonSach
    const payload = {
      MaDocGia: maDocGia,
      DanhSachSach: cart.value.map(item => ({
        MaSach: item.MaSach, // Đảm bảo trong 'cart' có trường này
        TenSach: item.TenSach
      })),
      NgayHenTra: ngayHenTra.value,
      GhiChu: ghiChu.value,
      TrangThai: "ChoDuyet" // Mặc định
    };

    // Gọi API
    const response = await axios.post('http://localhost:3000/api/yeucaumuonsach', payload);

    // Thành công
    message.value = "Gửi yêu cầu thành công! Đang chuyển hướng...";
    
    // Xóa cart sau khi mượn thành công
    localStorage.removeItem('cart');
    cart.value = [];

    // Chuyển hướng sau 2 giây (ví dụ về trang lịch sử mượn)
    setTimeout(() => {
      router.push('/lich-su-muon'); 
    }, 2000);

  } catch (error) {
    console.error(error);
    isError.value = true;
    message.value = error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* CSS đơn giản, bạn có thể thay thế bằng class của Bootstrap/Tailwind */
.borrow-request-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th, .table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-readonly {
  background-color: #f9f9f9;
  border: none;
  font-weight: bold;
}

.btn-danger {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-confirm {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-confirm:disabled {
  background-color: #ccc;
}

.alert {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}
.alert-success { background-color: #d4edda; color: #155724; }
.alert-danger { background-color: #f8d7da; color: #721c24; }
</style>
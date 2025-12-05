<template>
  <div class="container mt-5">
    <h2 class="text-primary mb-4">📚 Xác nhận mượn sách</h2>

    <div v-if="cartItems.length > 0">
      <div class="table-responsive shadow-sm rounded-3">
  <table class="table table-hover align-middle mb-0 bg-white">
    <thead style="background-color: #cfe2ff; color: #084298;">
      <tr>
        <th class="py-3 ps-4">Mã Sách</th>
        <th class="py-3">Tên Sách</th>
        <th class="py-3 text-center" style="width: 160px;">Số lượng</th>
        <th class="py-3 text-center" style="width: 100px;">Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in cartItems" :key="index">
        <td class="ps-4 text-muted fw-semibold">
          <span class="badge bg-light text-secondary border">#{{ item.MaSach }}</span>
        </td>
        
        <td>
          <span class="fw-bold text-dark">{{ item.TenSach }}</span>
        </td>
        
        <td>
          <div class="d-flex justify-content-center align-items-center">
            <div class="input-group input-group-sm" style="width: 120px;">
              <button class="btn btn-outline-primary" type="button" @click="decreaseQty(index)">
                <i class="fas fa-minus"></i>
              </button>
              
              <input 
                type="text" 
                class="form-control text-center fw-bold text-primary bg-white" 
                :value="item.SoLuong || 1" 
                readonly
              >
              
              <button class="btn btn-outline-primary" type="button" @click="increaseQty(index)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </td>

        <td class="text-center">
          <button class="btn btn-link text-danger text-decoration-none p-0" @click="removeItem(index)" title="Xóa bỏ">
            <div class="d-flex align-items-center justify-content-center bg-danger-subtle rounded-circle" style="width: 32px; height: 32px;">
               <i class="fas fa-trash-alt"></i>
            </div>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

      <div class="card p-4 shadow-sm border-0 bg-blue-light">
        <h5 class="mb-3">Thông tin người mượn</h5>
        <p><strong>Mã Độc Giả:</strong> {{ currentUser.maDocGia }}</p>
        <p><strong>Họ Tên:</strong> {{ currentUser.hoLot }} {{ currentUser.tenDocGia }}</p>
        
        <div class="d-flex justify-content-end mt-3">
            <button class="btn btn-success btn-lg px-5" @click="submitRequest">
                <i class="bi bi-send-check"></i> Gửi Yêu Cầu
            </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <h4 class="text-muted">Giỏ hàng của bạn đang trống</h4>
      <router-link to="/sach" class="btn btn-primary mt-3">Đi chọn sách</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios"; // Đảm bảo đã cài axios
import { useRouter } from "vue-router";

const cartItems = ref([]);
const currentUser = ref({});
const router = useRouter();

onMounted(() => {
  // 1. Lấy sách từ LocalStorage
  const storedCart = localStorage.getItem("cart"); // Tên key localStorage của bạn
  if (storedCart) {
    cartItems.value = JSON.parse(storedCart);
  }

  // 2. Lấy user đăng nhập (Giả sử bạn lưu user info trong localStorage khi login)
  const storedUser = localStorage.getItem("user"); 
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  } else {
    alert("Vui lòng đăng nhập để mượn sách!");
    router.push("/dangnhap");
  }
});
const increaseQty = (index) => {
  // Nếu chưa có thuộc tính SoLuong thì gán = 1, sau đó cộng thêm
  if (!cartItems.value[index].SoLuong) {
    cartItems.value[index].SoLuong = 1;
  }
  cartItems.value[index].SoLuong++;
  
  // Lưu lại vào LocalStorage (nếu cần)
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
};

// Hàm giảm số lượng
const decreaseQty = (index) => {
  if (cartItems.value[index].SoLuong > 1) {
    cartItems.value[index].SoLuong--;
  } else {
    // Nếu giảm về 0 thì hỏi xóa luôn (tùy chọn)
    if(confirm('Bạn muốn xóa sách này?')) {
        removeItem(index);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
};
const removeItem = (index) => {
  cartItems.value.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
};

const submitRequest = async () => {
  if (cartItems.value.length === 0) return;

  try {
    // Chuẩn bị payload đúng chuẩn Backend yêu cầu
    const payload = {
      MaDocGia: currentUser.value.maDocGia, // Lấy mã độc giả (String)
      DanhSachSach: cartItems.value.map(book => ({
        MaSach: book.MaSach,
        TenSach: book.TenSach
      }))
    };

    await axios.post("http://localhost:3000/api/yeucaumuonsach", payload);
    
    alert("Gửi yêu cầu thành công!");
    // Xóa giỏ hàng sau khi gửi thành công
    localStorage.removeItem("cart");
    cartItems.value = [];
    router.push("/"); // Quay về trang chủ
  } catch (error) {
    console.error(error);
    alert("Lỗi khi gửi yêu cầu!");
  }
};
</script>
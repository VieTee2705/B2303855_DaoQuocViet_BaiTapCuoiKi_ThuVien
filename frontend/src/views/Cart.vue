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
import { ref, computed, onMounted } from "vue";
import axios from "axios"; 
import { useRouter } from "vue-router";

// --- CẤU HÌNH ---
const MAX_BOOKS_ALLOWED = 3; // Giới hạn số sách tối đa
const API_URL = "http://localhost:3000/api/yeucaumuonsach";

// --- STATE ---
const cartItems = ref([]);
const currentUser = ref({});
const router = useRouter();

// --- COMPUTED (Tính toán tự động) ---
// Tính tổng số lượng sách đang có trong giỏ
const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (Number(item.SoLuong) || 1), 0);
});

// --- HELPER FUNCTIONS ---
const updateCartStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
};

// --- LIFECYCLE ---
onMounted(() => {
  // 1. Lấy sách
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cartItems.value = JSON.parse(storedCart);
  }

  // 2. Lấy User
  const storedUser = localStorage.getItem("user"); 
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  } else {
    alert("Vui lòng đăng nhập để mượn sách!");
    router.push("/dangnhap");
  }
});

// --- ACTIONS (Tăng/Giảm/Xóa) ---
const increaseQty = (index) => {
  // Đảm bảo số lượng là số
  if (!cartItems.value[index].SoLuong) {
    cartItems.value[index].SoLuong = 1;
  }
  
  // Kiểm tra nóng: Nếu tăng lên mà vượt quá 3 thì chặn luôn (UX tốt hơn)
  if (totalQuantity.value >= MAX_BOOKS_ALLOWED) {
    alert(`Bạn chỉ được mượn tối đa ${MAX_BOOKS_ALLOWED} quyển sách!`);
    return;
  }

  cartItems.value[index].SoLuong++;
  updateCartStorage();
};

const decreaseQty = (index) => {
  if (cartItems.value[index].SoLuong > 1) {
    cartItems.value[index].SoLuong--;
  } else {
    if(confirm('Bạn muốn xóa sách này khỏi giỏ?')) {
        removeItem(index);
        return; // Đã xóa xong thì return luôn
    }
  }
  updateCartStorage();
};

const removeItem = (index) => {
  cartItems.value.splice(index, 1);
  updateCartStorage();
};

// --- SUBMIT (Gửi yêu cầu) ---
const submitRequest = async () => {
  // 1. Validate Giỏ hàng trống
  if (cartItems.value.length === 0) {
    alert("Giỏ hàng đang trống!");
    return;
  }

  // 2. Validate Tổng số lượng (Chốt chặn quan trọng nhất)
  if (totalQuantity.value > MAX_BOOKS_ALLOWED) {
    alert(`LỖI: Tổng số lượng sách là ${totalQuantity.value}. Bạn chỉ được mượn tối đa ${MAX_BOOKS_ALLOWED} quyển.`);
    return; // Dừng ngay lập tức
  }

  try {
    // 3. Chuẩn bị Payload (Thêm SoLuong vào để Backend lưu đúng)
    const payload = {
      // Lưu ý: Kiểm tra lại backend của bạn cần 'MaDocGia' hay '_id'
      MaDocGia: currentUser.value._id || currentUser.value.maDocGia, 
      DanhSachSach: cartItems.value.map(book => ({
        MaSach: book.MaSach,
        TenSach: book.TenSach,
        SoLuong: Number(book.SoLuong || 1) // QUAN TRỌNG: Phải gửi kèm số lượng
      })),
      NgayHenTra: new Date(new Date().setDate(new Date().getDate() + 7)), // Mặc định +7 ngày
      TrangThai: "DangCho"
    };

    // 4. Gọi API
    await axios.post(API_URL, payload);
    
    alert("Gửi yêu cầu thành công!");
    
    // 5. Dọn dẹp sau khi thành công
    localStorage.removeItem("cart");
    cartItems.value = [];
    router.push("/"); 

  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || "Lỗi khi gửi yêu cầu!";
    alert(msg);
  }
};
</script>
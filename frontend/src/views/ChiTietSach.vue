<script setup>
import { ref, onMounted } from 'vue';
// 1. Import thêm useRouter
import { useRoute, useRouter } from 'vue-router'; 
import SachService from "@/services/sach.service";

const route = useRoute();
// 2. Khởi tạo router instance
const router = useRouter(); 

const book = ref(null); 
const quantity = ref(1); 
const isLoading = ref(true); 
const error = ref(null); 

// Hàm lấy dữ liệu từ Backend
const getBook = async () => {
    try {
        const id = route.params.id;
        const data = await SachService.get(id);

        book.value = {
            id: data._id,           
            maSach: data.MaSach,    
            tenSach: data.TenSach,
            gia: data.DonGia || 0,  
            soLuongTon: data.SoQuyen || 0,
            // Lấy tên NXB từ populate (quan trọng)
            nhaXuatBan: data.thongTinNXB ? data.thongTinNXB.tenNXB : "Nhà Xuất Bản Trẻ", 
            tacGia: data.TacGia,
            moTa: data.MoTa || "Đang cập nhật mô tả...",
            
            // --- SỬA DÒNG NÀY ---
            // Lúc nãy Backend đã lưu sẵn "/uploads/..." vào DB rồi
            // Nên ở đây chỉ cần nối domain vào thôi.
            // CŨ (Sai): .../uploads/${data.HinhAnh}
            // MỚI (Đúng): ...${data.HinhAnh}
            anhChinh: data.HinhAnh 
                ? `http://localhost:3000${data.HinhAnh}` 
                : "https://via.placeholder.com/600x800?text=No+Image",
        };

    } catch (err) {
        console.log(err);
        error.value = "Không tìm thấy sách hoặc lỗi kết nối!";
    } finally {
        isLoading.value = false;
    }
};

const increaseQty = () => quantity.value++;
const decreaseQty = () => { if(quantity.value > 1) quantity.value--; };

const addToCart = () => {
    // --- KIỂM TRA ĐĂNG NHẬP ---
    const userJson = localStorage.getItem('user');
    
    // Nếu chưa đăng nhập
    if (!userJson) {
        const confirmLogin = confirm("Bạn cần đăng nhập để mượn sách. Đi đến trang đăng nhập ngay?");
        if (confirmLogin) {
            // Chuyển hướng đến trang đăng nhập (đảm bảo path '/dangnhap' đúng với file router của bạn)
            router.push("/dangnhap"); 
        }
        return; // Dừng hàm lại
    }
    // -------------------------------

    const itemToAdd = {
        _id: book.value.id,
        MaSach: book.value.maSach,
        TenSach: book.value.tenSach,
        HinhAnh: book.value.anhChinh, 
        TacGia: book.value.tacGia,
        DonGia: book.value.gia,
        SoLuong: quantity.value       
    };

    let cart = [];
    try {
        const savedCart = localStorage.getItem('cart');
        cart = savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
        console.error("Lỗi đọc giỏ hàng", e);
        cart = [];
    }

    const existingItemIndex = cart.findIndex(item => item._id === itemToAdd._id);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].SoLuong += quantity.value;
    } else {
        cart.push(itemToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    alert(`Đã thêm ${quantity.value} quyển "${book.value.tenSach}" vào giỏ!`);
};

onMounted(() => {
    getBook();
});
</script>

<template>
    <div class="container py-5">
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Đang tải thông tin sách...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger text-center">
            {{ error }}
            <br>
            <router-link to="/sach" class="btn btn-sm btn-outline-danger mt-2">Quay lại danh sách</router-link>
        </div>

        <div v-else-if="book" class="row bg-white p-4 rounded shadow-sm">
            <nav aria-label="breadcrumb" class="col-12 mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
                    <li class="breadcrumb-item"><router-link to="/sach">Sách</router-link></li>
                    <li class="breadcrumb-item active">{{ book.tenSach }}</li>
                </ol>
            </nav>

            <div class="col-md-5 mb-4">
                <div class="border rounded overflow-hidden shadow-sm">
                    <img :src="book.anhChinh" class="d-block mx-auto" alt="Book Cover">
                </div>
            </div>

            <div class="col-md-7 ps-md-4">
                <div class="badge bg-warning text-dark mb-2">Mã: {{ book.maSach }}</div>
                <h2 class="fw-bold text-dark">{{ book.tenSach }}</h2>
                
                <div class="mt-3 text-secondary">
                    <p class="mb-1"><strong>Tác giả:</strong> {{ book.tacGia }}</p>
                    <p class="mb-1"><strong>Nhà xuất bản:</strong> {{ book.nhaXuatBan }}</p>
                    <p class="mb-1"><strong>Tình trạng:</strong> 
                        <span v-if="book.soLuongTon > 0" class="text-success fw-bold">Còn hàng ({{ book.soLuongTon }})</span>
                        <span v-else class="text-danger fw-bold">Hết hàng</span>
                    </p>
                </div>

                <div class="my-4">
                    <h3 class="text-danger fw-bold">{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.gia) }}</h3>
                </div>

                <div class="description mb-4 p-3 bg-light rounded">
                    <h6 class="fw-bold">Giới thiệu nội dung:</h6>
                    <p class="mb-0 text-muted" style="white-space: pre-line;">{{ book.moTa }}</p>
                </div>

                <div class="d-flex align-items-center gap-3">
                    <div class="input-group" style="width: 140px;">
                        <button class="btn btn-outline-secondary" @click="decreaseQty">-</button>
                        <input type="text" class="form-control text-center bg-white" :value="quantity" readonly>
                        <button class="btn btn-outline-secondary" @click="increaseQty">+</button>
                    </div>
                    <button class="btn btn-primary btn-lg flex-grow-1" @click="addToCart" :disabled="book.soLuongTon <= 0">
                        <i class="fas fa-cart-plus me-2"></i> 
                        {{ book.soLuongTon > 0 ? 'Thêm vào giỏ mượn' : 'Tạm hết hàng' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.object-fit-cover {
    object-fit: cover;
    max-height: 500px;
}
</style>
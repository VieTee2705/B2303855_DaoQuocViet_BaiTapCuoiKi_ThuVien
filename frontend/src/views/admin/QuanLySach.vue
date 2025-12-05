<script setup>
import { ref, computed, onMounted } from 'vue';
import SachService from "@/services/sach.service";
import { useRouter } from 'vue-router';

const router = useRouter();
const books = ref([]);
const searchText = ref("");
const isLoading = ref(true);

// 1. Hàm lấy danh sách sách
const retrieveBooks = async () => {
    try {
        books.value = await SachService.getAll();
    } catch (error) {
        console.error("Lỗi lấy danh sách sách:", error);
    } finally {
        isLoading.value = false;
    }
};

// 2. Computed: Lọc sách theo thanh tìm kiếm
const filteredBooks = computed(() => {
    if (!searchText.value) return books.value;
    return books.value.filter((book) => {
        const text = searchText.value.toLowerCase();
        return (
            book.TenSach.toLowerCase().includes(text) ||
            book.MaSach.toLowerCase().includes(text)
        );
    });
});

// 3. Hàm Xóa Sách
import axios from "axios"; // Nhớ import ở đầu file

const deleteBook = async (id, tenSach) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sách "${tenSach}" không?`)) {
        try {
            // --- THAY ĐỔI Ở ĐÂY ---
            // Gọi trực tiếp Axios, dùng dấu backtick (`) để truyền biến id
            await axios.delete(`http://localhost:3000/api/sach/${id}`);
            
            alert("Đã xóa sách thành công!");
            retrieveBooks(); 
        } catch (error) {
            console.error(error);
            alert("Xóa thất bại.");
        }
    }
};

// 4. Hàm chuyển hướng sang trang sửa
const xemBook = (id) => {
    // Giả sử bạn dùng route tên 'sach.edit'
    router.push(`/sach/${id}`);
};

// 5. Tiện ích: Format tiền và Ảnh
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getImageUrl = (imagePath) => {
    if (imagePath) return `http://localhost:3000${imagePath}`;
    return "https://via.placeholder.com/50x75?text=No+Img";
};

onMounted(() => {
    retrieveBooks();
});
</script>

<template>
    <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold text-primary"><i class="fas fa-cogs me-2"></i>Quản Lý Sách</h2>
            <router-link to="/sach/them" class="btn btn-success shadow-sm">
                <i class="fas fa-plus me-1"></i> Thêm Sách Mới
            </router-link>
        </div>

        <div class="card shadow border-0">
            <div class="card-header bg-white py-3">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0"><i class="fas fa-search text-muted"></i></span>
                    <input 
                        type="text" 
                        class="form-control border-start-0 ps-0" 
                        placeholder="Tìm kiếm theo tên sách hoặc mã sách..."
                        v-model="searchText"
                    >
                </div>
            </div>

            <div class="card-body p-0">
                <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light text-secondary">
                            <tr>
                                <th class="ps-4">Sách</th>
                                <th>Mã Sách</th>
                                <th>Giá bán</th>
                                <th>Kho</th>
                                <th>Năm XB</th>
                                <th class="text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="book in filteredBooks" :key="book._id">
                                <td class="ps-4">
                                    <div class="d-flex align-items-center">
                                        <img :src="getImageUrl(book.HinhAnh)" 
                                             class="rounded border me-3 object-fit-cover"
                                             width="40" height="60">
                                        <div>
                                            <div class="fw-bold text-dark">{{ book.TenSach }}</div>
                                            <small class="text-muted">{{ book.TacGia }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td><span class="badge bg-light text-dark border">{{ book.MaSach }}</span></td>
                                <td class="fw-bold text-primary">{{ formatCurrency(book.DonGia) }}</td>
                                <td>
                                    <span :class="book.SoQuyen > 0 ? 'text-success' : 'text-danger fw-bold'">
                                        {{ book.SoQuyen > 0 ? book.SoQuyen : 'Hết hàng' }}
                                    </span>
                                </td>
                                <td>{{ book.NamXuatBan }}</td>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-outline-warning me-2" @click="xemBook(book._id)" title="Xem">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteBook(book._id, book.TenSach)" title="Xóa">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="filteredBooks.length === 0">
                                <td colspan="6" class="text-center py-4 text-muted">
                                    Không tìm thấy sách nào phù hợp.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card-footer bg-white py-3 text-end">
                <small class="text-muted">Tổng cộng: <strong>{{ filteredBooks.length }}</strong> đầu sách</small>
            </div>
        </div>
    </div>
</template>

<style scoped>
.object-fit-cover {
    object-fit: cover;
}
</style>
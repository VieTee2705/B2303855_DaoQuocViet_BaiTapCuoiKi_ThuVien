<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const requests = ref([]); // Chứa danh sách phiếu mượn
const isLoading = ref(true);
const currentUser = ref(null);

// 1. Hàm định dạng tiền tệ
const formatCurrency = (value) => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// 2. Hàm định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

// 3. Hàm hiển thị trạng thái đẹp hơn
const getStatusInfo = (status) => {
    switch (status) {
        case 'DangCho': return { text: 'Đang chờ duyệt', class: 'bg-warning text-dark' };
        case 'DaDuyet': return { text: 'Đang mượn', class: 'bg-primary' };
        case 'DaTra': return { text: 'Đã trả', class: 'bg-success' };
        case 'TuChoi': return { text: 'Từ chối', class: 'bg-danger' };
        default: return { text: status, class: 'bg-secondary' };
    }
};

// 4. Hàm lấy đường dẫn ảnh (Xử lý link từ backend)
const getImageUrl = (bookDetail) => {
    // bookDetail là object bên trong mảng DanhSachSach
    // Sau khi populate, nó sẽ có field ThongTinSach chứa HinhAnh
    if (bookDetail.ThongTinSach && bookDetail.ThongTinSach.HinhAnh) {
        return `http://localhost:3000${bookDetail.ThongTinSach.HinhAnh}`;
    }
    return "https://via.placeholder.com/60x80?text=No+Img";
};

// 5. Hàm gọi API lấy dữ liệu
const fetchHistory = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        router.push("/dangnhap");
        return;
    }
    
    currentUser.value = JSON.parse(userStr);
    
    // LƯU Ý QUAN TRỌNG: 
    // Kiểm tra xem trong localStorage user lưu mã độc giả ở trường nào.
    // Dựa vào hình bạn gửi (MaDocGia: "DG..."), mình giả sử key là 'maDocGia'
    // Nếu trong user object lưu là '_id' thì sửa thành currentUser.value._id
    const maDocGia = currentUser.value.maDocGia || currentUser.value._id;

    if (!maDocGia) {
        console.error("Không tìm thấy mã độc giả");
        isLoading.value = false;
        return;
    }

    try {
        // Gọi API Controller vừa viết
        const response = await axios.get(`http://localhost:3000/api/yeucaumuonsach/history/${maDocGia}`);
        requests.value = response.data;
    } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchHistory();
});
</script>

<template>
    <div class="container py-5">
        <h2 class="mb-4 fw-bold text-primary"><i class="fas fa-history me-2"></i>Lịch sử mượn sách</h2>

        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="requests.length === 0" class="text-center py-5 bg-light rounded">
            <i class="fas fa-box-open fs-1 text-muted mb-3"></i>
            <h5>Bạn chưa có lịch sử mượn sách nào.</h5>
            <router-link to="/sach" class="btn btn-primary mt-3">Mượn sách ngay</router-link>
        </div>

        <div v-else>
            <div v-for="req in requests" :key="req._id" class="card shadow-sm mb-4 border-0">
                <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <div>
                        <div class="fw-bold text-dark">Mã phiếu: #{{ req._id.slice(-6).toUpperCase() }}</div>
                        <small class="text-muted">Ngày tạo: {{ formatDate(req.NgayYeuCau) }}</small>
                    </div>
                    <span class="badge rounded-pill px-3 py-2" :class="getStatusInfo(req.TrangThai).class">
                        {{ getStatusInfo(req.TrangThai).text }}
                    </span>
                </div>

                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table mb-0 align-middle">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4">Sách</th>
                                    <th class="text-center">Số lượng</th>
                                    <th class="text-end pe-4">Đơn giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, idx) in req.DanhSachSach" :key="idx">
                                    <td class="ps-4">
                                        <div class="d-flex align-items-center">
                                            <img :src="getImageUrl(item)" 
                                                 class="rounded border me-3 object-fit-cover"
                                                 width="50" height="70" 
                                                 alt="Book cover">
                                            
                                            <div>
                                                <div class="fw-bold text-dark">
                                                    {{ item.ThongTinSach?.TenSach || item.TenSach || 'Sách không tồn tại' }}
                                                </div>
                                                <small class="text-muted">Mã: {{ item.MaSach }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">1</td> <td class="text-end pe-4 text-primary fw-bold">
                                        {{ formatCurrency(item.ThongTinSach?.DonGia) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="card-footer bg-light text-end py-2">
                    <small class="text-muted">Tổng số lượng: <strong>{{ req.DanhSachSach.length }}</strong> quyển</small>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.object-fit-cover {
    object-fit: cover;
}
</style>
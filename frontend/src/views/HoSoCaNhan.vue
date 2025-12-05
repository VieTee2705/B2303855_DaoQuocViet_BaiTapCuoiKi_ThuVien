<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref({});

// 1. Hàm format ngày sinh (từ ISO string sang dd/mm/yyyy)
const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

// 2. Computed: Ghép Họ lót + Tên
const fullName = computed(() => {
    if (!user.value) return 'Khách';
    // Dữ liệu của bạn có trường hoLot và tenDocGia
    return `${user.value.hoLot || ''} ${user.value.tenDocGia || ''}`.trim();
});

onMounted(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        user.value = JSON.parse(userStr);
    } else {
        // Nếu không có dữ liệu user -> Chuyển về trang đăng nhập
        router.push("/dangnhap");
    }
});

const handleLogout = () => {
    if(confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // Nếu có
        // Dispatch event để Header cập nhật lại state (ẩn avatar, hiện nút đăng nhập)
        window.dispatchEvent(new Event('storage'));
        router.push("/dangnhap");
    }
};
</script>

<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-9 col-lg-7">
                <div class="card shadow-lg border-0 rounded-3">
                    <div class="card-header bg-primary text-white p-4 d-flex justify-content-between align-items-center rounded-top-3">
                        <h4 class="mb-0 fw-bold"><i class="fas fa-id-card me-2"></i>Hồ Sơ Của Tôi</h4>
                        <button @click="handleLogout" class="btn btn-light text-primary fw-bold btn-sm shadow-sm">
                            <i class="fas fa-sign-out-alt me-1"></i> Đăng xuất
                        </button>
                    </div>

                    <div class="card-body p-4">
                        <div class="text-center mb-5">
                            <div class="position-relative d-inline-block">
                                <img :src="`https://ui-avatars.com/api/?name=${fullName}&background=0D6EFD&color=fff&size=128&bold=true`" 
                                     class="rounded-circle shadow border border-4 border-white" 
                                     width="120" height="120"
                                     alt="Avatar">
                                <span class="position-absolute bottom-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle">
                                    <span class="visually-hidden">Online</span>
                                </span>
                            </div>
                            <h3 class="fw-bold mt-3 mb-1">{{ fullName }}</h3>
                            <span class="badge bg-secondary rounded-pill px-3">
                                {{ user.maDocGia }} </span>
                        </div>

                        <h6 class="text-primary fw-bold text-uppercase border-bottom pb-2 mb-3">
                            <i class="fas fa-info-circle me-1"></i> Thông tin cá nhân
                        </h6>

                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <label class="small text-muted fw-bold d-block mb-1">Email</label>
                                    <div class="fw-medium text-dark text-break">
                                        <i class="fas fa-envelope text-primary me-2"></i>
                                        {{ user.email || 'Chưa cập nhật' }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <label class="small text-muted fw-bold d-block mb-1">Số điện thoại</label>
                                    <div class="fw-medium text-dark">
                                        <i class="fas fa-phone text-primary me-2"></i>
                                        {{ user.dienThoai || 'Chưa cập nhật' }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <label class="small text-muted fw-bold d-block mb-1">Ngày sinh</label>
                                    <div class="fw-medium text-dark">
                                        <i class="fas fa-birthday-cake text-primary me-2"></i>
                                        {{ formatDate(user.ngaySinh) }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <label class="small text-muted fw-bold d-block mb-1">Giới tính</label>
                                    <div class="fw-medium text-dark">
                                        <i class="fas fa-venus-mars text-primary me-2"></i>
                                        {{ user.phai || 'Chưa cập nhật' }}
                                    </div>
                                </div>
                            </div>
                             <div class="col-12">
                                <div class="p-3 bg-light rounded-3 h-100">
                                    <label class="small text-muted fw-bold d-block mb-1">Địa chỉ</label>
                                    <div class="fw-medium text-dark">
                                        <i class="fas fa-map-marker-alt text-primary me-2"></i>
                                        {{ user.diaChi || 'Chưa cập nhật địa chỉ' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 d-flex justify-content-center gap-3">
                            <button class="btn btn-outline-primary px-4">
                                <i class="fas fa-edit me-1"></i> Cập nhật thông tin
                            </button>
                            <router-link to="/lich-su" class="btn btn-primary px-4 shadow-sm">
                                <i class="fas fa-history me-1"></i> Lịch sử mượn sách
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Hiệu ứng nhẹ cho các box thông tin */
.bg-light {
    transition: all 0.3s ease;
}
.bg-light:hover {
    background-color: #e9ecef !important;
    transform: translateY(-2px);
}
</style>
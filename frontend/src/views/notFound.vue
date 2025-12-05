<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.push({ name: 'home' }); // Đảm bảo bạn có route tên là 'home'
};
</script>

<template>
    <div class="page-404 d-flex align-items-center justify-content-center vh-100 bg-light">
        <div class="text-center">
            <div class="display-1 fw-bold text-primary">
                <i class="fas fa-ghost"></i> 404
            </div>
            
            <h2 class="fs-2 fw-bold mt-3">Oops! Trang không tìm thấy.</h2>
            <p class="lead text-muted mb-5">
                Đường dẫn bạn truy cập có thể bị hỏng hoặc trang đã bị xóa.
            </p>

            <div class="d-flex justify-content-center gap-3">
                <button @click="$router.go(-1)" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left me-2"></i> Quay lại
                </button>
                
                <button @click="goHome" class="btn btn-primary">
                    <i class="fas fa-home me-2"></i> Về trang chủ
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-404 {
    min-height: 80vh; /* Chiều cao tối thiểu */
}

/* Hiệu ứng rung nhẹ cho icon */
.fa-ghost {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}
</style>
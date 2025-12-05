<script setup>
import { ref } from 'vue';

// Dữ liệu sách nổi bật (Giữ nguyên)
const featuredBooks = ref([
    { _id: 'BK01', title: 'Tư duy phản biện', price: 150000, img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400' },
    { _id: 'BK02', title: 'Đắc Nhân Tâm', price: 89000, img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
    { _id: 'BK03', title: 'Nhà Giả Kim', price: 75000, img: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
    { _id: 'BK04', title: 'Cà phê cùng Tony', price: 110000, img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
]);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};
</script>

<template>
    <div>
        
        <div class="p-5 mb-4 bg-light rounded-3 border-bottom">
            <div class="container-fluid py-5 text-center">
                <h1 class="display-5 fw-bold text-primary">E-BookStore</h1>
                <p class="col-md-8 fs-4 mx-auto text-muted">
                    Thế giới tri thức trong tầm tay. Hơn 10.000 đầu sách đang chờ bạn khám phá.
                    Mượn sách dễ dàng, giao nhận nhanh chóng.
                </p>
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <router-link to="/sach" class="btn btn-primary btn-lg px-4 shadow-sm">
                        <i class="fas fa-shopping-cart me-2"></i>Mượn sách ngay
                    </router-link>
                    <router-link to="/sach" class="btn btn-outline-secondary btn-lg px-4">
                        Xem danh mục
                    </router-link>
                </div>
            </div>
        </div>

        <div class="container py-5">
            <div class="row g-4 py-3 row-cols-1 row-cols-lg-3">
                <div class="col">
                    <div class="d-flex align-items-center p-3 border rounded shadow-sm h-100">
                        <div class="fs-1 text-primary me-3"><i class="fas fa-truck-fast"></i></div>
                        <div>
                            <h5 class="mb-0 fw-bold">Giao nhanh 2h</h5>
                            <small class="text-muted">Nội ô Cần Thơ</small>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="d-flex align-items-center p-3 border rounded shadow-sm h-100">
                        <div class="fs-1 text-primary me-3"><i class="fas fa-shield-alt"></i></div>
                        <div>
                            <h5 class="mb-0 fw-bold">Sách chính hãng</h5>
                            <small class="text-muted">Cam kết chất lượng 100%</small>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="d-flex align-items-center p-3 border rounded shadow-sm h-100">
                        <div class="fs-1 text-primary me-3"><i class="fas fa-tags"></i></div>
                        <div>
                            <h5 class="mb-0 fw-bold">Giá thuê rẻ</h5>
                            <small class="text-muted">Chỉ từ 2.000đ/ngày</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="bg-dark text-white py-5 mt-5">
            <div class="container text-center">
                <h2 class="fw-bold">Bạn chưa tìm thấy sách ưng ý?</h2>
                <p class="lead text-white-50">Kho sách của chúng tôi còn rất nhiều điều thú vị đang chờ bạn.</p>
                <router-link to="/sach" class="btn btn-warning btn-lg fw-bold mt-3">
                    Khám phá Kho Sách Ngay
                </router-link>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* CSS TỐI GIẢN - Chỉ để xử lý ảnh và hiệu ứng hover nhẹ */

/* 1. Giúp ảnh luôn phủ kín khung mà không bị méo (Bootstrap chưa hỗ trợ class này ở mọi phiên bản) */
.object-fit-cover {
    object-fit: cover;
}

/* 2. Hiệu ứng nổi nhẹ khi di chuột vào card sách */
.hover-shadow {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-shadow:hover {
    transform: translateY(-5px);
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; /* Class shadow-lg của Bootstrap */
}
</style>
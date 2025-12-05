<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const user = ref(null);
const role = ref(null);

// State cho giỏ hàng
const cartItems = ref([]);
const isCartHover = ref(false);

// --- LOGIC GIỮ NGUYÊN NHƯ CŨ ---
const refreshUserData = () => {
    const userStr = localStorage.getItem("user");
    const roleStr = localStorage.getItem("role");

    if (userStr) {
        user.value = JSON.parse(userStr);
        role.value = roleStr;
    } else {
        user.value = null;
        role.value = null;
    }
};

const refreshLocalStorageData = () => {
    localStorage.clear();
};

const refreshCartData = () => {
    try {
        const cartStr = localStorage.getItem("cart");
        if (cartStr) {
            cartItems.value = JSON.parse(cartStr);
        } else {
            cartItems.value = [];
        }
    } catch (e) {
        console.error("Lỗi đọc giỏ hàng:", e);
        cartItems.value = [];
    }
};

onMounted(() => {
    refreshUserData();
    refreshCartData();
    window.addEventListener('cart-updated', refreshCartData);
    window.addEventListener('storage', refreshCartData);
});

onUnmounted(() => {
    window.removeEventListener('cart-updated', refreshCartData);
    window.removeEventListener('storage', refreshCartData);
});

watch(route, () => {
    refreshUserData();
    refreshCartData();
});

const handleLogout = () => {
    refreshLocalStorageData();
    user.value = null;
    role.value = null;
    router.push('/dangnhap');
};

const isAdminOrStaff = computed(() => {
    return role.value === 'admin' || role.value === 'nhanvien';
});

const displayName = computed(() => {
    if (!user.value) return '';
    return user.value.tenDocGia || user.value.HoTenNV || 'Người dùng';
});

const cartCount = computed(() => {
    // Nếu bạn muốn đếm tổng số lượng quyển (thay vì số đầu sách), sửa thành:
    // return cartItems.value.reduce((total, item) => total + (item.SoLuong || 0), 0);
    return cartItems.value.length;
});

const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sách', path: '/sach' },
    // { name: 'Lịch sử', path: '/lich-su' }, 
    // { name: 'Tin tức', path: '/tin-tuc' },
];
</script>

<template>
    <header>
        <div class="top-bar py-2 text-white bg-dark">
            <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center small">
                <div class="mb-1 mb-md-0 fw-bold">
                    <i class="fas fa-book-reader me-2"></i>Thế giới sách trong tầm tay bạn
                </div>
                
                <div class="d-flex gap-3 align-items-center">
                    <span><i class="fas fa-envelope me-1"></i> support@ebookstore.com</span>
                    <span class="d-none d-sm-inline">|</span>
                    <span><i class="fas fa-phone-alt me-1"></i> 1900 1000</span>
                </div>
            </div>
        </div>

        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div class="container">
                
                <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;">
                        <i class="fas fa-book-open fs-4"></i>
                    </div>
                    <div class="d-flex flex-column" style="line-height: 1.2;">
                        <span class="fw-bold text-primary text-uppercase" style="font-size: 1.25rem; letter-spacing: 1px;">E-BookStore</span>
                        <span class="text-secondary small fw-bold" style="font-size: 0.7rem;">Tri thức là sức mạnh</span>
                    </div>
                </router-link>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse justify-content-center" id="mainNavbar">
                    <ul class="navbar-nav mb-2 mb-lg-0 fw-500">
                        <li class="nav-item" v-for="item in menuItems" :key="item.name">
                            <router-link 
                                :to="item.path" 
                                class="nav-link px-3"
                                active-class="active-link"
                            >
                                {{ item.name }}
                            </router-link>
                        </li>
                        
                        <li class="nav-item dropdown" v-if="isAdminOrStaff">
                            <a class="nav-link dropdown-toggle text-danger fw-bold" href="#" role="button" data-bs-toggle="dropdown">
                                <i class="fas fa-cog me-1"></i>Quản trị
                            </a>
                            <ul class="dropdown-menu shadow border-0">
                                <li><router-link to="/nxb" class="dropdown-item">Quản lý Nhà Xuất Bản</router-link></li>
                                <li><router-link to="/admin/quanlysach" class="dropdown-item">Quản lý Đầu Sách</router-link></li>
                                <li><router-link to="/sach/them" class="dropdown-item">Thêm Sách Mới</router-link></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><router-link to="/admin/muonsach" class="dropdown-item">Quản Lý Mượn Trả</router-link></li>
                                <li><router-link to="/admin/docgia" class="dropdown-item">Danh Sách Độc Giả</router-link></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div class="d-flex align-items-center gap-3 action-icons">
                    <div class="d-none d-lg-block">
                        <button class="btn btn-link text-dark p-0"><i class="fas fa-search fs-5"></i></button>
                    </div>
                    
                    <div class="dropdown">
                        <button class="btn btn-link text-dark p-0 d-flex align-items-center gap-2 text-decoration-none" data-bs-toggle="dropdown">
                            <img v-if="user" :src="`https://ui-avatars.com/api/?name=${displayName}&background=0D6EFD&color=fff`" 
                                 class="rounded-circle border" width="35" height="35">
                            <div v-else class="d-flex align-items-center gap-1">
                                <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 35px; height: 35px;">
                                    <i class="fas fa-user text-secondary"></i>
                                </div>
                            </div>
                        </button>
                        
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                            <div v-if="user">
                                <li class="px-3 py-2">
                                    <div class="fw-bold text-primary">{{ displayName }}</div>
                                    <small class="text-muted">{{ role === 'admin' ? 'Quản trị viên' : 'Độc giả' }}</small>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li><router-link to="/ho-so" class="dropdown-item"><i class="fas fa-id-card me-2"></i>Hồ sơ cá nhân</router-link></li>
                                <li><router-link to="/lich-su" class="dropdown-item"><i class="fas fa-history me-2"></i>Lịch sử mượn</router-link></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a href="#" @click.prevent="handleLogout" class="dropdown-item text-danger"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
                            </div>

                            <div v-if="!user">
                                <li><router-link to="/dangnhap" class="dropdown-item">Đăng nhập</router-link></li>
                                <li><router-link to="/dangky" class="dropdown-item">Đăng ký thành viên</router-link></li>
                            </div>
                        </ul>
                    </div>

                    <div 
                        class="dropdown" 
                        @mouseenter="isCartHover = true" 
                        @mouseleave="isCartHover = false"
                    >
                        <router-link to="/gio-hang" class="btn btn-light position-relative rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                            <i class="fas fa-shopping-bag text-dark"></i>
                            <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                                {{ cartCount }}
                            </span>
                        </router-link>

                        <div class="dropdown-menu dropdown-menu-end cart-dropdown p-0 shadow-lg border-0" 
                             :class="{ 'show': isCartHover }">
                            <div class="p-3 bg-white rounded">
                                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                                    <h6 class="mb-0 fw-bold text-dark">Giỏ hàng</h6>
                                    <small class="text-muted">{{ cartCount }} sản phẩm</small>
                                </div>
                                
                                <div v-if="cartItems.length === 0" class="text-center py-4 text-muted">
                                    <i class="fas fa-shopping-basket mb-3 fs-1 text-black-50"></i>
                                    <p class="mb-0 small">Giỏ hàng đang trống</p>
                                </div>

                                <div v-else class="cart-items-list">
                                    <div v-for="(book, index) in cartItems" :key="index" class="d-flex gap-2 mb-3">
                                        <img :src="book.HinhAnh || 'https://via.placeholder.com/50'" 
                                             class="rounded border" 
                                             width="50" height="65"
                                             style="object-fit: cover;"
                                             alt="Book cover">
                                        <div class="flex-grow-1 overflow-hidden">
                                            <div class="text-truncate small fw-bold text-dark">{{ book.TenSach }}</div>
                                            <div class="text-truncate small text-muted">{{ book.TacGia }}</div>
                                            <div class="small text-primary fw-bold mt-1">{{ Number(book.DonGia).toLocaleString() }} đ x {{ book.SoLuong || 1 }}</div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="cartItems.length > 0" class="border-top pt-2 mt-2">
                                    <router-link to="/gio-hang" class="btn btn-primary btn-sm w-100 fw-bold">
                                        Xem giỏ hàng & Thanh toán
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>
/* Top Bar màu tối chuyên nghiệp */
.top-bar {
    background-color: #2c3e50; 
    font-size: 0.85rem;
}

/* Navbar Link Styling */
.navbar-nav .nav-link {
    color: #555;
    transition: all 0.3s;
    font-weight: 600;
    font-size: 0.95rem;
}

.navbar-nav .nav-link:hover {
    color: #0d6efd;
}

/* Link đang active */
.active-link {
    color: #0d6efd !important;
}

/* CSS cho Cart Dropdown */
.cart-dropdown {
    width: 320px;
    margin-top: 10px; /* Tạo khoảng cách nhẹ */
    right: 0;
    left: auto;
    animation: fadeInUp 0.3s ease-in-out;
}

/* Thanh cuộn cho giỏ hàng nhỏ */
.cart-items-list {
    max-height: 280px;
    overflow-y: auto;
}
.cart-items-list::-webkit-scrollbar {
    width: 5px;
}
.cart-items-list::-webkit-scrollbar-thumb {
    background: #ccc; 
    border-radius: 5px;
}

/* Hiệu ứng Fade In */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

.action-icons .btn {
    transition: transform 0.2s;
}
.action-icons .btn:active {
    transform: scale(0.95);
}
</style>
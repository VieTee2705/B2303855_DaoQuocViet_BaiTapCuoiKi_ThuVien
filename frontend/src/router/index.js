import { createRouter, createWebHistory } from "vue-router";

// 1. Import Component bạn vừa tạo
import SachApp from "@/views/SachApp.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/sach", // Đường dẫn gốc (Trang chủ)
    name: "sachApp",
    component: SachApp, // Render component sách
  },
  {
    path: "/sach/them", // Đường dẫn truy cập
    name: "sach-add",
    component: () => import("@/views/themSach.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/nxb",
    name: "nxb-list",
    component: () => import("@/views/nxbList.vue"),
  },
  {
    path: "/nxb/add",
    name: "nxb-add",
    component: () => import("@/views/NhaXuatBanForm.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/nxb/edit/:id", // :id là nơi chứa ID của NXB
    name: "nxb-edit",
    component: () => import("../views/NhaXuatBanForm.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
    props: true,
  },
  {
    path: "/admin/docgia",
    name: "AdminDocGia",
    component: () => import("@/views/admin/docgia.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/ho-so",
    name: "ho-so",
    component: () => import("../views/HoSoCaNhan.vue"),
  },
  {
    path: "/admin/quanlysach",
    name: "QuanLySach",
    component: () => import("@/views/admin/QuanLySach.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
  {
    path: "/lich-su",
    name: "lich-su",
    component: () => import("../views/LichSuMuon.vue"),
  },
  {
    path: "/dangky",
    name: "dangky",
    component: () => import("@/views/DangKy.vue"),
  },
  {
    path: "/dangnhap",
    name: "dangnhap",
    component: () => import("@/views/DangNhap.vue"),
  },
  {
    path: "/sach/:id",
    name: "chi-tiet-sach",
    component: () => import("@/views/ChiTietSach.vue"),
  },
  {
    // Regex: Bắt tất cả các đường dẫn không khớp với các route bên trên
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/gio-hang",
    name: "Cart",
    component: () => import("@/views/Cart.vue"),
    // meta: { requiresAuth: true, role: ["DocGia"] },
  },
  {
    path: "/muon-sach",
    name: "MuonSach",
    component: () => import("@/views/MuonSach.vue"),
    // meta: { requiresAuth: true, role: ["docgia"] },
  },
  {
    path: "/admin/muonsach",
    name: "AdminMuonSach",
    component: () => import("@/views/admin/muonsach.vue"),
    meta: { requiresAuth: true, role: ["admin", "nhanvien"] },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // Lấy user an toàn
  const userJson = localStorage.getItem("user");
  const loggedInUser = userJson ? JSON.parse(userJson) : null;

  // CHECK 1: Yêu cầu đăng nhập
  if (to.meta.requiresAuth && !loggedInUser) {
    // Nên dùng toast/notification thay vì alert
    alert("Vui lòng đăng nhập!");
    return next({ name: "login" });
  }

  if (to.meta.role && loggedInUser) {
    // console.log(loggedInUser.Chucvu);
    if (!to.meta.role.includes(loggedInUser.Chucvu)) {
      alert("Bạn không có quyền truy cập!");
      return next({ name: "home" });
    }
  }

  // Nếu vượt qua hết các ải trên -> Cho qua
  next();
});

export default router;

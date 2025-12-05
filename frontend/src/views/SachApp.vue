<template>
  <div class="container mt-3">
    <div class="row">
      <div class="col-12 mb-3">
        <h3 class="text-primary fw-bold">Thư Viện Sách</h3>
        <div class="input-group">
            <span class="input-group-text bg-white"><i class="fas fa-search"></i></span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Tìm kiếm sách theo tên..." 
              v-model="searchText"
            />
        </div>
      </div>
    </div>

    <div class="row">
      <div 
        class="col-md-3 col-sm-6 mb-4" 
        v-for="sach in filteredSachs" 
        :key="sach._id"
      >
        <div class="card h-100 shadow-sm book-card" @click="xemChiTiet(sach._id)">
          <div class="img-container">
              <img 
                :src="getImageUrl(sach.HinhAnh)" 
                class="card-img-top" 
                alt="Ảnh bìa"
                @error="handleImageError" 
              >
          </div>
          
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary text-truncate" :title="sach.TenSach">
                {{ sach.TenSach }}
            </h5>
            
            <div class="mt-auto">
                <p class="card-text mb-1">
                  <strong>Giá:</strong> <span class="text-danger fw-bold">{{ formatCurrency(sach.DonGia) }}</span>
                </p>
                <p class="card-text d-flex justify-content-between">
                  <small class="text-muted">Kho: {{ sach.SoQuyen }}</small>
                  <small class="text-muted fst-italic">{{ sach.TacGia }}</small>
                </p>
            </div>
          </div>
          
          <div class="card-footer bg-white border-top-0">
            <button class="btn btn-outline-primary w-100">
                <i class="fas fa-eye me-1"></i> Chi tiết
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredSachs.length === 0" class="col-12 text-center mt-4">
          <p class="text-muted">Không tìm thấy sách nào phù hợp.</p>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from "@/services/sach.service";

export default {
  name: "BookList",
  data() {
    return {
      sachs: [],
      searchText: "",
    };
  },
  computed: {
    filteredSachs() {
      if (!this.searchText) return this.sachs;
      return this.sachs.filter((sach) =>
        sach.TenSach.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
  },
  methods: {
    async retrieveSachs() {
      try {
        this.sachs = await SachService.getAll();
      } catch (error) {
        console.log("Lỗi lấy danh sách sách: ", error);
      }
    },

    // --- ĐÂY LÀ PHẦN ĐÃ SỬA ---
    getImageUrl(imagePath) {
        if (imagePath) {
            // Backend đã lưu "/uploads/tenfile.jpg"
            // Nên ta chỉ cần nối với cổng server là xong
            return `http://localhost:3000${imagePath}`;
        }
        // Ảnh mặc định nếu không có dữ liệu
        return "https://placehold.co/400x600?text=No+Image";
    },

    // Xử lý nếu ảnh bị lỗi (link chết) thì hiện ảnh mặc định
    handleImageError(e) {
        e.target.src = "https://placehold.co/400x600?text=Error";
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },

    xemChiTiet(bookId) {
        // Lưu ý: Bạn cần chắc chắn route 'chi-tiet-sach' đã được khai báo trong router/index.js
        this.$router.push({ name: 'chi-tiet-sach', params: { id: bookId } });
    }
  },
  mounted() {
    this.retrieveSachs();
  },
};
</script>

<style scoped>
.book-card {
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #eee;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
    border-color: #0d6efd;
}

.img-container {
    height: 250px;
    overflow: hidden;
    position: relative;
    background-color: #f8f9fa; /* Màu nền nhẹ khi ảnh chưa load */
}

.card-img-top {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Dùng contain để thấy toàn bộ bìa sách, dùng cover để lấp đầy khung */
    padding: 5px; /* Thêm chút padding cho đẹp */
    transition: transform 0.5s ease;
}

.book-card:hover .card-img-top {
    transform: scale(1.05);
}
</style>
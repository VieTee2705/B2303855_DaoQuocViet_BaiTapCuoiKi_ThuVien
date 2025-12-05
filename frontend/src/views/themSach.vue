<template>
  <div class="container mt-4">
    <div class="card shadow-sm">
      
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Thêm Sách Mới</h5>
      </div>

      <div class="card-body">
        <form @submit.prevent="submitBook" enctype="multipart/form-data">
          
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="maSach" class="form-label fw-bold">Mã Sách <span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                id="maSach" 
                v-model="book.MaSach" 
                placeholder="VD: S001" 
                required
              >
            </div>
            <div class="col-md-8">
              <label for="tenSach" class="form-label fw-bold">Tên Sách <span class="text-danger">*</span></label>
              <input 
                type="text" 
                class="form-control" 
                id="tenSach" 
                v-model="book.TenSach" 
                placeholder="Nhập tên sách" 
                required
              >
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-4">
              <label for="donGia" class="form-label fw-bold">Đơn Giá</label>
              <div class="input-group">
                <input 
                  type="number" 
                  class="form-control" 
                  id="donGia" 
                  v-model="book.DonGia" 
                  min="0"
                >
                <span class="input-group-text">VNĐ</span>
              </div>
            </div>
            <div class="col-md-4">
              <label for="soQuyen" class="form-label fw-bold">Số Quyển</label>
              <input 
                type="number" 
                class="form-control" 
                id="soQuyen" 
                v-model="book.SoQuyen" 
                min="1"
              >
            </div>
            <div class="col-md-4">
              <label for="namXB" class="form-label fw-bold">Năm Xuất Bản</label>
              <input 
                type="number" 
                class="form-control" 
                id="namXB" 
                v-model="book.NamXuatBan" 
                placeholder="2025"
              >
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
  <label for="maNXB" class="form-label fw-bold">Nhà Xuất Bản</label>
  <select class="form-select" id="maNXB" v-model="book.MaNXB">
    <option value="" disabled selected>-- Chọn Nhà Xuất Bản --</option>
    
    <option 
      v-for="nxb in publishers" 
      :key="nxb._id" 
      :value="nxb._id" 
    >
      {{ nxb.tenNXB }} 
    </option>
    
  </select>
</div>
            <div class="col-md-6">
              <label for="tacGia" class="form-label fw-bold">Tác Giả</label>
              <input 
                type="text" 
                class="form-control" 
                id="tacGia" 
                v-model="book.TacGia"
                placeholder="Nhập tên tác giả"
              >
            </div>
          </div>

          <div class="mb-4">
            <label for="hinhAnh" class="form-label fw-bold">Hình Ảnh Bìa</label>
            <input 
              type="file" 
              class="form-control" 
              id="hinhAnh" 
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*"
            >
          </div>

          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-secondary" @click="resetForm">
              Làm mới
            </button>
            <button type="submit" class="btn btn-primary">
              Lưu Sách
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Import trực tiếp axios

export default {
  name: 'BookForm',
  setup() {
    // 1. Khởi tạo dữ liệu form
    const book = ref({
      MaSach: '',
      TenSach: '',
      DonGia: 0,
      SoQuyen: 1,
      NamXuatBan: new Date().getFullYear(),
      MaNXB: '',
      TacGia: ''
    });

    // Biến lưu danh sách NXB lấy từ API
    const publishers = ref([]);
    // Biến lưu file ảnh
    const selectedFile = ref(null);
    // Tham chiếu đến input file để reset sau khi lưu
    const fileInput = ref(null);

    // --- CẤU HÌNH ĐƯỜNG DẪN API ---
    // Lưu ý: Kiểm tra lại port backend của bạn (thường là 3000 hoặc 3001)
    const API_URL_NXB = 'http://localhost:3000/api/nhaxuatban';
    const API_URL_SACH = 'http://localhost:3000/api/sach';

    // 2. Hàm lấy danh sách Nhà xuất bản (Gọi khi trang vừa load)
    const getPublishers = async () => {
      try {
        // Gọi trực tiếp API lấy NXB
        const response = await axios.get(API_URL_NXB);
        
        // Giả sử API trả về mảng object: [{_id: '...', TenNXB: '...'}, ...]
        publishers.value = response.data; 
      } catch (error) {
        console.error("Lỗi lấy danh sách NXB:", error);
        alert("Không tải được danh sách Nhà xuất bản. Kiểm tra lại backend!");
      }
    };

    // 3. Hàm bắt sự kiện khi chọn file ảnh
    const handleFileUpload = (event) => {
      selectedFile.value = event.target.files[0];
    };

    // 4. Hàm Reset Form về mặc định
    const resetForm = () => {
      book.value = {
        MaSach: '',
        TenSach: '',
        DonGia: 0,
        SoQuyen: 1,
        NamXuatBan: new Date().getFullYear(),
        MaNXB: '',
        TacGia: ''
      };
      selectedFile.value = null;
      if (fileInput.value) fileInput.value.value = "";
    };

    // 5. Hàm gửi dữ liệu về Backend
    const submitBook = async () => {
      // Validate cơ bản
      if (!book.value.MaSach || !book.value.TenSach) {
        alert("Vui lòng nhập Mã Sách và Tên Sách!");
        return;
      }

      // Tạo đối tượng FormData (Bắt buộc để gửi file qua Multer)
      const formData = new FormData();
      formData.append('MaSach', book.value.MaSach);
      formData.append('TenSach', book.value.TenSach);
      formData.append('DonGia', book.value.DonGia);
      formData.append('SoQuyen', book.value.SoQuyen);
      formData.append('NamXuatBan', book.value.NamXuatBan);
      formData.append('MaNXB', book.value.MaNXB); // Gửi ID của NXB
      formData.append('TacGia', book.value.TacGia);

      // Quan trọng: Key 'HinhAnh' phải khớp với uploadCloud.single("HinhAnh") ở backend
      if (selectedFile.value) {
        formData.append('HinhAnh', selectedFile.value);
      }

      try {
        // Gọi trực tiếp Axios POST
        await axios.post(API_URL_SACH, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        alert('Thêm sách thành công!');
        resetForm(); // Xóa trắng form sau khi lưu

      } catch (error) {
        console.error(error);
        const mess = error.response && error.response.data && error.response.data.message 
                     ? error.response.data.message 
                     : "Lỗi hệ thống hoặc kết nối server";
        alert('Thất bại: ' + mess);
      }
    };

    // Gọi hàm lấy NXB ngay khi Component được load
    onMounted(() => {
      getPublishers();
    });

    return {
      book,
      publishers,
      fileInput,
      handleFileUpload,
      submitBook,
      resetForm
    };
  }
};
</script>

<style scoped>
/* CSS bổ trợ để form đẹp hơn */
.card-header {
  font-weight: bold;
  font-size: 1.1rem;
}
.form-label {
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
}
</style>
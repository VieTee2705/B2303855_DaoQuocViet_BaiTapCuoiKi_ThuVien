<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary">📋 Danh Sách Độc Giả</h2>
      <button class="btn btn-primary" @click="goToCreatePage">
        <i class="bi bi-person-plus-fill"></i> Thêm Độc Giả
      </button>
    </div>

    <div class="input-group mb-3 shadow-sm">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Tìm kiếm theo tên độc giả..." 
        v-model="searchText"
        @keyup.enter="searchReaders"
      />
      <button class="btn btn-outline-secondary" type="button" @click="searchReaders">
        <i class="bi bi-search"></i> Tìm
      </button>
      <button class="btn btn-outline-danger" type="button" @click="resetSearch">
        <i class="bi bi-x-lg"></i> Hủy
      </button>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <table class="table table-hover table-striped mb-0 align-middle">
          <thead class="table-primary text-center">
            <tr>
              <th>Mã ĐG</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Điện Thoại</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(reader, index) in readers" :key="reader._id">
              <td class="text-center fw-bold text-secondary">{{ reader.maDocGia }}</td>
              <td>{{ reader.hoLot }} {{ reader.tenDocGia }}</td>
              <td>{{ reader.email }}</td>
              <td class="text-center">{{ reader.dienThoai || '---' }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-info text-white me-2" @click="showDetail(reader)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteReader(reader._id)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
            <tr v-if="readers.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                Không tìm thấy dữ liệu độc giả.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedReader" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">
              <i class="bi bi-person-badge"></i> Thông tin chi tiết
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedReader = null"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-3">
                <div class="avatar-placeholder rounded-circle bg-light d-inline-flex align-items-center justify-content-center text-info" style="width: 80px; height: 80px; font-size: 2rem; border: 2px solid #0dcaf0">
                    {{ selectedReader.tenDocGia.charAt(0).toUpperCase() }}
                </div>
                <h5 class="mt-2">{{ selectedReader.hoLot }} {{ selectedReader.tenDocGia }}</h5>
                <span class="badge bg-secondary">{{ selectedReader.maDocGia }}</span>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><strong>Email:</strong> {{ selectedReader.email }}</li>
              <li class="list-group-item"><strong>Điện thoại:</strong> {{ selectedReader.dienThoai || 'Chưa cập nhật' }}</li>
              <li class="list-group-item"><strong>Địa chỉ:</strong> {{ selectedReader.diaChi || 'Chưa cập nhật' }}</li>
              <li class="list-group-item"><strong>Ngày sinh:</strong> {{ formatDate(selectedReader.ngaySinh) }}</li>
              <li class="list-group-item"><strong>ID Hệ thống:</strong> <small class="text-muted">{{ selectedReader._id }}</small></li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedReader = null">Đóng</button>
            <button type="button" class="btn btn-warning" @click="goToEdit(selectedReader._id)">
                <i class="bi bi-pencil-square"></i> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const readers = ref([]);
const searchText = ref("");
const selectedReader = ref(null);
const router = useRouter();

// 1. Hàm lấy danh sách độc giả (Khớp với route GET /)
const fetchReaders = async () => {
  try {
    let url = "http://localhost:3000/api/docgia";
    
    // Nếu có tìm kiếm, thêm query param ?Ten=... như comment trong route
    if (searchText.value) {
      url += `?Ten=${searchText.value}`;
    }

    const response = await axios.get(url);
    readers.value = response.data;
  } catch (error) {
    console.error("Lỗi tải danh sách:", error);
    alert("Không thể tải danh sách độc giả.");
  }
};

// 2. Hàm tìm kiếm
const searchReaders = () => {
  fetchReaders();
};

const resetSearch = () => {
  searchText.value = "";
  fetchReaders();
};

// 3. Hàm hiển thị chi tiết
const showDetail = (reader) => {
  selectedReader.value = reader;
};

// 4. Hàm xóa độc giả (Khớp với route DELETE /:id)
const deleteReader = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa độc giả này? Hành động này không thể hoàn tác.")) {
    try {
      await axios.delete(`http://localhost:3000/api/docgia/${id}`);
      alert("Đã xóa thành công!");
      // Tải lại danh sách, giữ nguyên trạng thái tìm kiếm nếu có
      fetchReaders();
      // Nếu đang xem chi tiết người vừa xóa thì đóng modal
      if (selectedReader.value && selectedReader.value._id === id) {
        selectedReader.value = null;
      }
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại!");
    }
  }
};

// Điều hướng
const goToCreatePage = () => {
    // Giả sử bạn có route /docgia/create
    // router.push("/docgia/create"); 
    alert("Chức năng đang phát triển: Chuyển đến trang tạo mới");
};

const goToEdit = (id) => {
    // Giả sử bạn có route /docgia/edit/:id
    // router.push(`/docgia/edit/${id}`);
    alert(`Chức năng đang phát triển: Chỉnh sửa ID ${id}`);
};

// Format ngày tháng hiển thị cho đẹp
const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

// Gọi khi component được load
onMounted(() => {
  fetchReaders();
});
</script>

<style scoped>
.avatar-placeholder {
    font-weight: bold;
    user-select: none;
}
/* Hiệu ứng hover cho hàng trong bảng */
tbody tr {
    cursor: pointer;
    transition: background-color 0.2s;
}
</style>
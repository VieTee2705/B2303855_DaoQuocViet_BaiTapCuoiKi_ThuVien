<template>
  <div class="container-fluid mt-4">
    <h2 class="text-center mb-4">📋 Quản Lý Mượn Trả Sách</h2>
    
    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-bordered table-hover align-middle">
          <thead class="table-primary text-center">
            <tr>
              <th>Ngày Yêu Cầu</th>
              <th>Độc Giả</th>
              <th>Số lượng sách</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in requests" :key="req._id">
              <td class="text-center">{{ formatDate(req.NgayYeuCau) }}</td>
              <td>
                <div v-if="req.MaDocGia">
                  <strong>{{ req.MaDocGia }}</strong><br>
                  <!-- <small class="text-muted">{{ req.MaDocGia.maDocGia }}</small> -->
                </div>
                <div v-else class="text-danger">User không tồn tại</div>
              </td>
              
              <td class="text-center">
                 <button class="btn btn-sm btn-info text-white" @click="viewDetails(req)">
                    Xem {{ req.DanhSachSach.length }} cuốn
                 </button>
              </td>

              <td class="text-center">
                <span :class="getStatusBadge(req.TrangThai)">
                  {{ getStatusText(req.TrangThai) }}
                </span>
              </td>

              <td class="text-center">
                <div v-if="req.TrangThai === 'DangCho'">
                  <button class="btn btn-success btn-sm me-2" @click="updateStatus(req._id, 'DaDuyet')">
                    <i class="bi bi-check-circle"></i> Duyệt
                  </button>
                  <button class="btn btn-danger btn-sm" @click="updateStatus(req._id, 'TuChoi')">
                    <i class="bi bi-x-circle"></i> Từ chối
                  </button>
                </div>
                <div v-if="req.TrangThai === 'DaDuyet'">
                   <button class="btn btn-warning btn-sm" @click="updateStatus(req._id, 'DaTra')">
                    <i class="bi bi-arrow-return-left"></i> Xác nhận trả
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="selectedRequest" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết sách mượn</h5>
            <button type="button" class="btn-close" @click="selectedRequest = null"></button>
          </div>
          <div class="modal-body">
            <ul class="list-group">
              <li v-for="book in selectedRequest.DanhSachSach" :key="book._id" class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                   <!-- <img v-if="book.ThongTinSach?.HinhAnh" :src="book.ThongTinSach.HinhAnh"  class="img-thumbnail me-3" style="width: 50px; height: 70px; object-fit: cover"> -->
                   <div>
                     <h6 class="mb-0">{{ book.TenSach }}</h6>
                     <small class="text-muted">Mã: {{ book.MaSach }}</small>
                   </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedRequest = null">Đóng</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const requests = ref([]);
const selectedRequest = ref(null);

// Hàm lấy dữ liệu
const fetchRequests = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/yeucaumuonsach")
    requests.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách:", error);
  }
};

onMounted(() => {
  fetchRequests();
});

// Hàm cập nhật trạng thái
const updateStatus = async (id, status) => {
  if(!confirm("Bạn chắc chắn muốn đổi trạng thái?")) return;
  try {
    await axios.put(`http://localhost:3000/api/yeucaumuonsach/${id}`, { TrangThai: status });
    fetchRequests(); // Load lại bảng
  } catch (error) {
    alert("Lỗi cập nhật!");
  }
};

const viewDetails = (req) => {
  selectedRequest.value = req;
};

// Helpers hiển thị
const formatDate = (date) => {
  return new Date(date).toLocaleString("vi-VN");
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'DangCho': return 'badge bg-secondary';
    case 'DaDuyet': return 'badge bg-success';
    case 'DaTra': return 'badge bg-primary';
    case 'TuChoi': return 'badge bg-danger';
    default: return 'badge bg-light text-dark';
  }
};

const getStatusText = (status) => {
    const map = {
        'DangCho': 'Chờ duyệt',
        'DaDuyet': 'Đang mượn',
        'DaTra': 'Đã trả',
        'TuChoi': 'Từ chối'
    };
    return map[status] || status;
};
</script>
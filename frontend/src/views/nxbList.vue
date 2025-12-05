<script setup>
import { ref, computed, onMounted } from 'vue';
import NhaXuatBanService from "@/services/nhaxuatban.service";
import { useRouter } from 'vue-router';

const router = useRouter();

const nxbs = ref([]);
const searchText = ref("");
const isLoading = ref(false);

// 1. Hàm lấy danh sách NXB từ Backend
const retrieveNXBs = async () => {
    isLoading.value = true;
    try {
        nxbs.value = await NhaXuatBanService.getAll();
    } catch (error) {
        console.error(error);
        alert("Lỗi khi tải danh sách Nhà xuất bản.");
    } finally {
        isLoading.value = false;
    }
};

// 2. Computed: Lọc danh sách theo thanh tìm kiếm
const filteredNXBs = computed(() => {
    if (!searchText.value) return nxbs.value;
    return nxbs.value.filter(nxb => 
        nxb.tenNXB.toLowerCase().includes(searchText.value.toLowerCase()) ||
        nxb.maNXB.toLowerCase().includes(searchText.value.toLowerCase())
    );
});

// 3. Hàm chuyển hướng sang trang Sửa
const goToEdit = (id) => {
    router.push({ name: 'nxb-edit', params: { id: id } });
};

// 4. Hàm Xóa
const deleteNXB = async (id, tenNXB) => {
    if (confirm(`Bạn có chắc muốn xóa NXB: "${tenNXB}" không?`)) {
        try {
            await NhaXuatBanService.delete(id);
            // Sau khi xóa thành công thì tải lại danh sách
            await retrieveNXBs(); 
            alert("Đã xóa thành công!");
        } catch (error) {
            console.error(error);
            alert("Xóa thất bại! Có thể NXB này đang có sách liên kết.");
        }
    }
};

// Chạy hàm lấy dữ liệu khi trang vừa tải
onMounted(() => {
    retrieveNXBs();
});
</script>

<template>
    <div class="container mt-4">
        <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h4 class="mb-0 text-primary fw-bold">
                            <i class="fas fa-building me-2"></i> Quản Lý Nhà Xuất Bản
                        </h4>
                    </div>
                    <div class="col-md-6 text-md-end mt-3 mt-md-0">
                        <router-link to="/nxb/add" class="btn btn-success fw-bold">
                            <i class="fas fa-plus-circle me-1"></i> Thêm NXB Mới
                        </router-link>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
                            <input 
                                type="text" 
                                class="form-control" 
                                placeholder="Tìm kiếm theo Mã hoặc Tên NXB..." 
                                v-model="searchText"
                            >
                        </div>
                    </div>
                </div>

                <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-hover table-bordered align-middle">
                        <thead class="table-primary text-center">
                            <tr>
                                <th style="width: 50px;">STT</th>
                                <th style="width: 120px;">Mã NXB</th>
                                <th>Tên Nhà Xuất Bản</th>
                                <th>Địa Chỉ</th>
                                <th style="width: 150px;">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(nxb, index) in filteredNXBs" :key="nxb._id">
                                <td class="text-center fw-bold">{{ index + 1 }}</td>
                                <td class="text-center text-primary fw-bold">{{ nxb.maNXB }}</td>
                                <td>{{ nxb.tenNXB }}</td>
                                <td class="text-muted small">{{ nxb.diaChi || 'Chưa cập nhật' }}</td>
                                <td class="text-center">
                                    <button 
                                        class="btn btn-sm btn-outline-warning me-2" 
                                        @click="goToEdit(nxb._id)"
                                        title="Sửa"
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        class="btn btn-sm btn-outline-danger" 
                                        @click="deleteNXB(nxb._id, nxb.tenNXB)"
                                        title="Xóa"
                                    >
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            
                            <tr v-if="filteredNXBs.length === 0">
                                <td colspan="5" class="text-center py-4 text-muted">
                                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                                    Không tìm thấy dữ liệu nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table th {
    font-weight: 600;
    vertical-align: middle;
}
.btn-sm {
    padding: 0.25rem 0.6rem;
}
</style>
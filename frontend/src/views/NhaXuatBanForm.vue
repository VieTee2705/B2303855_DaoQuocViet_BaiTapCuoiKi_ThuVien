<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Đảm bảo đường dẫn import service đúng với dự án của bạn
import NhaXuatBanService from "@/services/nhaxuatban.service";

const route = useRoute();
const router = useRouter();

// --- STATE (Biến) ---
const isEditMode = ref(false);
const message = ref("");
const isError = ref(false);
const isLoading = ref(false);

const nxb = ref({
    maNXB: "",
    tenNXB: "",
    diaChi: ""
});

// Tiêu đề trang động
const pageTitle = computed(() => isEditMode.value ? "Cập Nhật Nhà Xuất Bản" : "Thêm NXB Mới");

// --- METHODS (Hàm) ---

// 1. Lấy dữ liệu NXB khi sửa
const getNXB = async (id) => {
    isLoading.value = true;
    try {
        const data = await NhaXuatBanService.get(id);
        if (data) {
            nxb.value = data;
            isEditMode.value = true;
        }
    } catch (error) {
        console.log("Lỗi tải NXB:", error);
        isError.value = true;
        message.value = "Không tìm thấy Nhà xuất bản này!";
    } finally {
        isLoading.value = false;
    }
};

// 2. Xử lý Submit Form
const submitForm = async () => {
    // Reset trạng thái thông báo
    message.value = "";
    isError.value = false;

    // Validate phía Client
    if (!nxb.value.maNXB || !nxb.value.tenNXB) {
        isError.value = true;
        message.value = "Vui lòng nhập Mã và Tên NXB!";
        return;
    }

    try {
        if (isEditMode.value) {
            // --- SỬA (Update) ---
            // Gọi API update với ID (_id) của MongoDB
            await NhaXuatBanService.update(nxb.value._id, nxb.value);
            message.value = "Cập nhật thành công!";
        } else {
            // --- THÊM (Create) ---
            await NhaXuatBanService.create(nxb.value);
            message.value = "Thêm mới thành công!";
            
            // Reset form để nhập tiếp
            nxb.value = { maNXB: "", tenNXB: "", diaChi: "" };
            // Reset chế độ edit về false để đảm bảo lần nhập sau vẫn là Thêm mới
            isEditMode.value = false; 
        }
    } catch (error) {
        console.error("Lỗi submit:", error);
        isError.value = true;
        // Lấy message lỗi từ backend trả về (nếu có)
        message.value = error.response?.data?.message || "Lỗi khi lưu dữ liệu!";
    }
};

// 3. Lifecycle Hook (Chạy 1 lần duy nhất khi trang tải)
onMounted(() => {
    // Nếu URL có ID (ví dụ /nxb/edit/123) -> Gọi hàm lấy dữ liệu
    if (route.params.id) {
        getNXB(route.params.id);
    }
});
</script>

<template>
    <div class="container mt-4">
        <div class="card shadow-sm" style="max-width: 700px; margin: 0 auto;">
            
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">{{ pageTitle }}</h5>
                <button @click="$router.push('/nxb')" class="btn btn-sm btn-light text-primary fw-bold">
                    <i class="fas fa-arrow-left"></i> Quay lại
                </button>
            </div>

            <div class="card-body p-4">
                
                <div v-if="isLoading" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
                </div>

                <form v-else @submit.prevent="submitForm">
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Mã NXB <span class="text-danger">*</span></label>
                        <input 
                            type="text" 
                            class="form-control" 
                            v-model="nxb.maNXB" 
                            placeholder="VD: NXB001" 
                            required 
                            :disabled="isEditMode"
                        >
                        <small v-if="isEditMode" class="text-muted">Mã NXB không thể thay đổi.</small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold">Tên Nhà Xuất Bản <span class="text-danger">*</span></label>
                        <input 
                            type="text" 
                            class="form-control" 
                            v-model="nxb.tenNXB" 
                            placeholder="VD: Nhà Xuất Bản Kim Đồng" 
                            required
                        >
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-bold">Địa Chỉ</label>
                        <textarea 
                            class="form-control" 
                            v-model="nxb.diaChi" 
                            rows="3" 
                            placeholder="Nhập địa chỉ trụ sở..."
                        ></textarea>
                    </div>

                    <div v-if="message" :class="['alert', isError ? 'alert-danger' : 'alert-success']">
                        <i :class="['fas me-2', isError ? 'fa-exclamation-triangle' : 'fa-check-circle']"></i>
                        {{ message }}
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary btn-lg fw-bold">
                            <i class="fas fa-save me-2"></i> 
                            {{ isEditMode ? 'Lưu Thay Đổi' : 'Tạo Mới' }}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>
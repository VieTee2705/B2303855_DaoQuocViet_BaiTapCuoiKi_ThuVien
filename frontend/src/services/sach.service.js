// src/services/sach.service.js
import axios from "axios";

// Đổi URL này theo port backend của bạn
const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const createApiClient = (baseURL) => {
  return axios.create({
    baseURL,
    ...commonConfig,
  });
};

class SachService {
  constructor(baseUrl = "/api/sach") {
    this.api = createApiClient(baseUrl);
  }

  // Lấy tất cả sách
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async create(data) {
    return (await this.api.post("/", data)).data;
  }
}

export default new SachService("http://localhost:3000/api/sach");


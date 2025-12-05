import createApiClient from "./api.service";

class MuonSachService {
  constructor(baseUrl = "/api/muonsach") {
    this.api = createApiClient(baseUrl);
  }

  // Gửi yêu cầu mượn sách mới
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  // Lấy lịch sử mượn của user (để dùng sau này)
  async getHistory(userId) {
    return (await this.api.get(`/user/${userId}`)).data;
  }
}

export default new MuonSachService();

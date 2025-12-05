// models/NhaXuatBan.js
import mongoose from 'mongoose';

const nhaXuatBanSchema = new mongoose.Schema({
    maNXB: { type: String, required: true, unique: true }, //    
    tenNXB: { type: String, required: true }, //    
    diaChi: { type: String }, //    
});

const NhaXuatBan = mongoose.model('NhaXuatBan', nhaXuatBanSchema);
export default NhaXuatBan;
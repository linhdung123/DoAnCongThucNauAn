const { login } = require('./controllers/authController'); // Đường dẫn tới file chứa hàm login
const NguoiDung = require('./models/NguoiDung');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Giả lập (Mock) các thư viện
jest.mock('./models/NguoiDung');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Unit Test Chức năng Đăng nhập (Login)', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    // Path 1: Thiếu input (Dòng 190)
    it('TC01: Trả về lỗi 400 nếu thiếu tên đăng nhập hoặc mật khẩu', async () => {
        req.body = { tenDangNhap: '' };
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    // Path 2: Sai user (Dòng 199)
    it('TC02: Trả về lỗi 401 nếu không tìm thấy người dùng', async () => {
        req.body = { tenDangNhap: 'sai_user', matKhau: '123' };
        NguoiDung.findOne.mockResolvedValue(null);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    // Path 3: User bị khóa (Dòng 207)
    it('TC03: Trả về lỗi 401 nếu tài khoản không ở trạng thái active', async () => {
        req.body = { tenDangNhap: 'locked', matKhau: '123' };
        NguoiDung.findOne.mockResolvedValue({ trangThai: 'locked' });
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    // Path 4: Sai mật khẩu (Dòng 217)
    it('TC04: Trả về lỗi 401 nếu mật khẩu không khớp', async () => {
        req.body = { tenDangNhap: 'dung', matKhau: 'sai_pass' };
        NguoiDung.findOne.mockResolvedValue({ trangThai: 'active', matKhau: 'hashed_pass' });
        bcrypt.compare.mockResolvedValue(false);
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    // Path 5: Thành công (Dòng 225)
    it('TC05: Đăng nhập thành công và trả về token', async () => {
        const mockUser = { _id: '123', tenDangNhap: 'dung', trangThai: 'active', matKhau: 'hash', toObject: jest.fn().mockReturnValue({tenDangNhap: 'dung'}) };
        req.body = { tenDangNhap: 'dung', matKhau: 'dung_pass' };
        NguoiDung.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mock_token');

        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: 'mock_token' }));
    });

    // Path 6: Lỗi hệ thống (Dòng 240)
    it('TC06: Trả về lỗi 500 khi có Exception (Catch block)', async () => {
        req.body = { tenDangNhap: 'dung', matKhau: '123' };
        NguoiDung.findOne.mockRejectedValue(new Error('DB Error'));
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
# Hệ thống Khảo sát

Ứng dụng web kết nối với Google Sheet để quản lý và thực hiện khảo sát.

## Tính năng

- Dashboard hiển thị tổng quan số liệu khảo sát
- Form khảo sát với các thông tin chi tiết
- Kết nối trực tiếp với Google Sheet để lưu trữ dữ liệu
- Giao diện responsive, thân thiện với người dùng

## Cài đặt

1. Clone repository này về máy local của bạn
2. Tạo một Google Sheet mới với tên "DT_KHAO_SAT" và cấu trúc cột như sau:
   - ID
   - Thoi_Gian_Tao
   - Thoi_Gian_Cap_Nhat
   - Nguoi_Tao
   - Nguoi_Cap_Nhat
   - Trang_Thai
   - Ho_Ten
   - Dien_Thoai
   - Vi_Tri
   - Dia_Chi
   - Nguoi_Lon
   - Tre_Em
   - Tong_Thanh_Vien
   - Loai_Nha_O
   - Chi_Phi_Nha_O
   - Gao
   - Thit
   - Ca
   - Rau_Cu
   - Sua
   - Gia_Vi
   - Hoc_Phi
   - Sach_Vo
   - Dong_Phuc
   - Khac_Giao_Duc
   - Dien_Nuoc
   - Internet
   - Rac
   - Tong_Chi_Phi
   - Thu_Nhap_Chinh
   - Thu_Nhap_Phu
   - Tong_Thu_Nhap
   - Ghi_Chu

3. Tạo Google Cloud Project và bật Google Sheets API
4. Tạo API key và thay thế `YOUR_API_KEY` trong file `js/app.js`
5. Lấy ID của Google Sheet và thay thế `YOUR_SHEET_ID` trong file `js/app.js`

## Sử dụng

1. Mở file `index.html` trong trình duyệt để xem dashboard
2. Truy cập `khaosat.html` để thực hiện khảo sát mới
3. Dữ liệu sẽ được tự động lưu vào Google Sheet

## Deploy lên GitHub Pages

1. Cài đặt Git từ https://git-scm.com/downloads
2. Khởi tạo Git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Tạo repository mới trên GitHub
4. Thêm remote và push code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   git push -u origin main
   ```
5. Cấu hình GitHub Pages:
   - Vào Settings > Pages
   - Chọn branch main
   - Click Save
6. Website sẽ được deploy tại: https://YOUR_USERNAME.github.io/REPO_NAME

## Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Google Sheets API

## Lưu ý

- Đảm bảo có kết nối internet để sử dụng Google Sheets API
- Cần cấu hình đúng API key và Sheet ID để ứng dụng hoạt động
- Dữ liệu được lưu trữ trong Google Sheet nên có thể truy cập và chỉnh sửa trực tiếp 
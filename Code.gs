// Hàm xử lý khi form được submit
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DT_KHAO_SAT');
    const data = e.parameter;
    
    // Tạo ID từ timestamp
    const timestamp = new Date();
    const id = timestamp.getFullYear() + 
               String(timestamp.getMonth() + 1).padStart(2, '0') + 
               String(timestamp.getDate()).padStart(2, '0') + 
               String(timestamp.getHours()).padStart(2, '0') + 
               String(timestamp.getMinutes()).padStart(2, '0') + 
               String(timestamp.getSeconds()).padStart(2, '0');

    // Tính toán tổng chi phí
    const tongChiPhi = parseInt(data.chiPhiNhaO || 0) + 
                      parseInt(data.gao || 0) + 
                      parseInt(data.thit || 0) + 
                      parseInt(data.ca || 0) + 
                      parseInt(data.rauCu || 0) + 
                      parseInt(data.sua || 0) + 
                      parseInt(data.giaVi || 0) + 
                      parseInt(data.hocPhi || 0) + 
                      parseInt(data.sachVo || 0) + 
                      parseInt(data.dongPhuc || 0) + 
                      parseInt(data.khacGiaoDuc || 0) + 
                      parseInt(data.dien || 0) + 
                      parseInt(data.nuoc || 0) + 
                      parseInt(data.internet || 0) + 
                      parseInt(data.rac || 0);

    // Tính toán tổng thu nhập
    const tongThuNhap = parseInt(data.thuNhapChinh || 0) + parseInt(data.thuNhapPhu || 0);

    // Thêm dòng mới vào sheet
    sheet.appendRow([
      id,                                    // A: ID
      timestamp,                             // B: Thoi_Gian_Tao
      timestamp,                             // C: Thoi_Gian_Cap_Nhat
      Session.getActiveUser().getEmail(),    // D: Nguoi_Tao
      Session.getActiveUser().getEmail(),    // E: Nguoi_Cap_Nhat
      'Mới tạo',                            // F: Trang_Thai
      data.hoTen,                           // G: Ho_Ten
      data.dienThoai,                       // H: Dien_Thoai
      data.viTri,                           // I: Vi_Tri
      data.diaChi,                          // J: Dia_Chi
      data.nguoiLon,                        // K: Nguoi_Lon
      data.treEm,                           // L: Tre_Em
      parseInt(data.nguoiLon || 0) + parseInt(data.treEm || 0), // M: Tong_Thanh_Vien
      data.loaiNhaO,                        // N: Loai_Nha_O
      data.chiPhiNhaO || 0,                 // O: Chi_Phi_Nha_O
      data.gao || 0,                        // P: Gao
      data.thit || 0,                       // Q: Thit
      data.ca || 0,                         // R: Ca
      data.rauCu || 0,                      // S: Rau_Cu
      data.sua || 0,                        // T: Sua
      data.giaVi || 0,                      // U: Gia_Vi
      data.hocPhi || 0,                     // V: Hoc_Phi
      data.sachVo || 0,                     // W: Sach_Vo
      data.dongPhuc || 0,                   // X: Dong_Phuc
      data.khacGiaoDuc || 0,                // Y: Khac_Giao_Duc
      data.dien || 0,                       // Z: Dien
      data.nuoc || 0,                       // AA: Nuoc
      data.internet || 0,                   // AB: Internet
      data.rac || 0,                        // AC: Rac
      tongChiPhi,                           // AD: Tong_Chi_Phi
      data.thuNhapChinh || 0,               // AE: Thu_Nhap_Chinh
      data.thuNhapPhu || 0,                 // AF: Thu_Nhap_Phu
      tongThuNhap,                          // AG: Tong_Thu_Nhap
      data.ghiChu || ''                     // AH: Ghi_Chu
    ]);

    return ContentService.createTextOutput("OK");
  } catch (error) {
    console.error('Lỗi:', error);
    return ContentService.createTextOutput("ERROR: " + error);
  }
}

// Xử lý preflight request (OPTIONS)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}

// Hàm lấy dữ liệu cho dashboard
function doGet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DT_KHAO_SAT');
    const data = sheet.getDataRange().getValues();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm cập nhật dữ liệu (macro)
function updateData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DT_KHAO_SAT');
  const data = sheet.getDataRange().getValues();
  
  // Cập nhật thời gian và người cập nhật cho tất cả các dòng
  for (let i = 1; i < data.length; i++) {
    sheet.getRange(i + 1, 2).setValue(new Date()); // Cập nhật thời gian
    sheet.getRange(i + 1, 4).setValue(Session.getActiveUser().getEmail()); // Cập nhật người cập nhật
  }
  
  SpreadsheetApp.getUi().alert('Dữ liệu đã được cập nhật thành công!');
}

// Hàm lấy dữ liệu danh mục từ sheet DANH_MUC
function getDanhMuc() {
  try {
    // Lấy sheet DANH_MUC
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('DANH_MUC');
    
    // Kiểm tra sheet có tồn tại không
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error', 
        message: 'Không tìm thấy sheet DANH_MUC'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Lấy toàn bộ dữ liệu từ sheet
    const data = sheet.getDataRange().getValues();
    const headers = data[0]; // Dòng đầu tiên là header
    const rows = data.slice(1); // Các dòng còn lại là dữ liệu
    
    // Khởi tạo object chứa danh mục
    const danhMuc = {};

    // Lọc các mục có Trang_Thai = 1 (đang hoạt động)
    const activeRows = rows.filter(row => String(row[headers.indexOf('Trang_Thai')]).trim() === '1');

    // Gom nhóm dữ liệu theo ID
    activeRows.forEach(row => {
      const id = String(row[headers.indexOf('ID')]).trim();
      const ten = String(row[headers.indexOf('Ten')]).trim();
      const giaTri = String(row[headers.indexOf('Gia_Tri')]).trim();

      // Thêm vào object danh mục
      if (!danhMuc[id]) danhMuc[id] = [];
      danhMuc[id].push(giaTri);
    });

    // Trả về kết quả dạng JSON
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: danhMuc
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Xử lý lỗi nếu có
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 
// Hàm xử lý khi form được submit
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DT_KHAO_SAT');
    const data = JSON.parse(e.postData.contents);
    
    // Thêm dữ liệu mới vào sheet
    sheet.appendRow([
      new Date(), // Thời gian tạo
      new Date(), // Thời gian cập nhật
      Session.getActiveUser().getEmail(), // Người tạo
      Session.getActiveUser().getEmail(), // Người cập nhật
      'Mới tạo', // Trạng thái
      data.hoTen,
      data.dienThoai,
      data.viTri,
      data.diaChi,
      data.nguoiLon,
      data.treEm,
      parseInt(data.nguoiLon) + parseInt(data.treEm), // Tổng thành viên
      data.loaiNhaO,
      data.chiPhiNhaO,
      data.gao,
      data.thit,
      data.ca,
      data.rauCu,
      data.sua,
      data.giaVi,
      data.hocPhi,
      data.sachVo,
      data.dongPhuc,
      data.khacGiaoDuc,
      data.dienNuoc,
      data.internet,
      data.rac,
      // Tính tổng chi phí
      parseInt(data.chiPhiNhaO) + parseInt(data.gao) + parseInt(data.thit) + 
      parseInt(data.ca) + parseInt(data.rauCu) + parseInt(data.sua) + 
      parseInt(data.giaVi) + parseInt(data.hocPhi) + parseInt(data.sachVo) + 
      parseInt(data.dongPhuc) + parseInt(data.khacGiaoDuc) + parseInt(data.dienNuoc) + 
      parseInt(data.internet) + parseInt(data.rac),
      data.thuNhapChinh,
      data.thuNhapPhu,
      parseInt(data.thuNhapChinh) + parseInt(data.thuNhapPhu), // Tổng thu nhập
      data.ghiChu
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Dữ liệu đã được lưu thành công'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
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
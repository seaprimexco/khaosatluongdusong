// Hàm xử lý khi form được submit
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DT_KHAO_SAT');
    // Lấy dữ liệu từ e.parameter (dạng form)
    const data = e.parameter;
    sheet.appendRow([
      new Date(),
      new Date(),
      Session.getActiveUser().getEmail(),
      Session.getActiveUser().getEmail(),
      'Mới tạo',
      data.hoTen,
      data.dienThoai,
      data.viTri,
      data.diaChi,
      data.nguoiLon,
      data.treEm,
      parseInt(data.nguoiLon) + parseInt(data.treEm),
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
      // Tổng chi phí
      parseInt(data.chiPhiNhaO) + parseInt(data.gao) + parseInt(data.thit) +
      parseInt(data.ca) + parseInt(data.rauCu) + parseInt(data.sua) +
      parseInt(data.giaVi) + parseInt(data.hocPhi) + parseInt(data.sachVo) +
      parseInt(data.dongPhuc) + parseInt(data.khacGiaoDuc) + parseInt(data.dienNuoc) +
      parseInt(data.internet) + parseInt(data.rac),
      data.thuNhapChinh,
      data.thuNhapPhu,
      parseInt(data.thuNhapChinh) + parseInt(data.thuNhapPhu),
      data.ghiChu
    ]);
    return ContentService.createTextOutput("OK");
  } catch (error) {
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

function getDanhMuc() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('DANH_MUC');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Không tìm thấy sheet DANH_MUC'})).setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    const danhMuc = {};
    // Lọc các mục có Trang_Thai = 1
    const activeRows = rows.filter(row => String(row[headers.indexOf('Trang_Thai')]).trim() === '1');
    // Gom nhóm
    activeRows.forEach(row => {
      const id = String(row[headers.indexOf('ID')]).trim();
      const ten = String(row[headers.indexOf('Ten')]).trim();
      const giaTri = String(row[headers.indexOf('Gia_Tri')]).trim();
      // Gom nhóm đơn giản
      if (!danhMuc[id]) danhMuc[id] = [];
      danhMuc[id].push(giaTri);
    });
    return ContentService.createTextOutput(JSON.stringify({status: 'success', data: danhMuc})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
} 
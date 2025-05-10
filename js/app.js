// Cấu hình Google Sheet
const SHEET_ID = '1ZOYjsFRC-6GSidh079--svkoPKumaFN7Q6FdoXVp13w'; // Thay thế bằng ID của Google Sheet của bạn
const SHEET_NAME = 'DT_KHAO_SAT';

// Biến để kiểm tra trạng thái khởi tạo
let isGoogleApiInitialized = false;

// Hàm khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo Google Sheets API
    gapi.load('client', function() {
        initClient().then(() => {
            isGoogleApiInitialized = true;
            
            // Xử lý form khảo sát
            const khaoSatForm = document.getElementById('khaoSatForm');
            if (khaoSatForm) {
                khaoSatForm.addEventListener('submit', handleFormSubmit);
            }
            
            // Cập nhật dashboard nếu đang ở trang chủ
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                updateDashboard();
            }
        }).catch(error => {
            console.error('Lỗi khởi tạo:', error);
            alert('Có lỗi xảy ra khi khởi tạo ứng dụng. Vui lòng kiểm tra console để biết thêm chi tiết.');
        });
    });
});

// Khởi tạo Google Sheets API client
async function initClient() {
    try {
        await gapi.client.init({
            apiKey: 'AIzaSyDEHHOQZUMGWAvBRF9WtFMkwK1Ys9ytfl4', // Thay thế bằng API key của bạn
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        });
        console.log('Google Sheets API đã được khởi tạo');
    } catch (error) {
        console.error('Lỗi khởi tạo Google Sheets API:', error);
        throw error;
    }
}

// Kiểm tra và đợi Google API được khởi tạo
async function waitForGoogleApi() {
    while (!isGoogleApiInitialized) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Xử lý submit form
async function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        await waitForGoogleApi();
        
        // Lấy dữ liệu từ form
        const formData = {
            hoTen: document.getElementById('hoTen').value,
            dienThoai: document.getElementById('dienThoai').value,
            viTri: document.getElementById('viTri').value,
            diaChi: document.getElementById('diaChi').value,
            nguoiLon: document.getElementById('nguoiLon').value,
            treEm: document.getElementById('treEm').value,
            loaiNhaO: document.getElementById('loaiNhaO').value,
            chiPhiNhaO: document.getElementById('chiPhiNhaO').value,
            gao: document.getElementById('gao').value,
            thit: document.getElementById('thit').value,
            ca: document.getElementById('ca').value,
            rauCu: document.getElementById('rauCu').value,
            sua: document.getElementById('sua').value,
            giaVi: document.getElementById('giaVi').value,
            hocPhi: document.getElementById('hocPhi').value,
            sachVo: document.getElementById('sachVo').value,
            dongPhuc: document.getElementById('dongPhuc').value,
            khacGiaoDuc: document.getElementById('khacGiaoDuc').value,
            dienNuoc: document.getElementById('dienNuoc').value,
            internet: document.getElementById('internet').value,
            rac: document.getElementById('rac').value,
            thuNhapChinh: document.getElementById('thuNhapChinh').value,
            thuNhapPhu: document.getElementById('thuNhapPhu').value,
            ghiChu: document.getElementById('ghiChu').value
        };

        // Thêm dữ liệu vào Google Sheet
        await appendToSheet(formData);
        alert('Gửi khảo sát thành công!');
        event.target.reset();
    } catch (error) {
        console.error('Lỗi khi gửi khảo sát:', error);
        if (error.status === 403) {
            alert('Không có quyền truy cập vào Google Sheet. Vui lòng kiểm tra lại cấu hình quyền truy cập.');
        } else {
            alert('Có lỗi xảy ra khi gửi khảo sát. Vui lòng thử lại sau.');
        }
    }
}

// Thêm dữ liệu vào Google Sheet
async function appendToSheet(data) {
    const values = [
        [
            new Date().toISOString(), // Thời gian tạo
            new Date().toISOString(), // Thời gian cập nhật
            'huuduy.duy@gmail.com', // Người tạo
            'huuduy.duy@gmail.com', // Người cập nhật
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
        ]
    ];

    const body = {
        values: values
    };

    try {
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: SHEET_NAME,
            valueInputOption: 'USER_ENTERED',
            resource: body
        });
        return response;
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu vào sheet:', error);
        throw error;
    }
}

// Cập nhật dashboard
async function updateDashboard() {
    try {
        await waitForGoogleApi();
        
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: SHEET_NAME
        });

        const values = response.result.values;
        if (!values || values.length === 0) {
            console.log('Không có dữ liệu');
            return;
        }

        // Tính toán các chỉ số
        const tongKhaoSat = values.length - 1; // Trừ đi header
        let tongThanhVien = 0;
        let tongChiPhi = 0;
        let tongThuNhap = 0;

        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            tongThanhVien += parseInt(row[11] || 0); // Cột Tổng thành viên
            tongChiPhi += parseInt(row[27] || 0); // Cột Tổng chi phí
            tongThuNhap += parseInt(row[30] || 0); // Cột Tổng thu nhập
        }

        // Cập nhật UI
        document.getElementById('tongKhaoSat').textContent = tongKhaoSat.toLocaleString();
        document.getElementById('tongThanhVien').textContent = tongThanhVien.toLocaleString();
        document.getElementById('tongChiPhi').textContent = tongChiPhi.toLocaleString() + ' VNĐ';
        document.getElementById('tongThuNhap').textContent = tongThuNhap.toLocaleString() + ' VNĐ';

    } catch (error) {
        console.error('Lỗi khi cập nhật dashboard:', error);
        if (error.status === 403) {
            alert('Không có quyền truy cập vào Google Sheet. Vui lòng kiểm tra lại cấu hình quyền truy cập.');
        } else {
            alert('Có lỗi xảy ra khi cập nhật dashboard. Vui lòng thử lại sau.');
        }
    }
} 

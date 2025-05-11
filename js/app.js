// Hàm xử lý dữ liệu
function xuLyDuLieu(data) {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('Dữ liệu không hợp lệ');
      return {
        chartData: [],
        tongKhaoSat: 0,
        tongThanhVien: 0,
        tongChiPhi: 0,
        tongThuNhap: 0,
        chiPhiTB: 0,
        thuNhapTB: 0,
        namChiPhiMax: 'N/A',
        namChiPhiMin: 'N/A',
        namThuNhapMax: 'N/A',
        namThuNhapMin: 'N/A',
        chiPhiTheoLoai: {
          nhaO: 0, gao: 0, thit: 0, ca: 0, rauCu: 0,
          sua: 0, giaVi: 0, giaoDuc: 0, tienIch: 0
        },
        luongDuSong: {
          2019: 5000000,
          2020: 5500000,
          2021: 6000000,
          2022: 6500000,
          2023: 7000000
        },
        latestYear: null
      };
    }

    // Lấy danh sách năm từ cột thời gian tạo
    const years = data.slice(1).map(row => {
      const date = new Date(row[1]);
      return date.getFullYear();
    });
    const latestYear = Math.max(...years);

    // Lọc chỉ lấy các dòng của năm lớn nhất
    const filtered = data.slice(1).filter(row => {
      const date = new Date(row[1]);
      return date.getFullYear() === latestYear;
    });

    // Chuẩn bị dữ liệu 5 năm gần nhất cho biểu đồ
    let yearStats = {};
    years.forEach(y => { yearStats[y] = { thuNhap: 0, chiPhi: 0, count: 0 }; });
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[1]) continue;
      const date = new Date(row[1]);
      if (isNaN(date.getTime())) continue;
      const year = date.getFullYear();
      if (!yearStats[year]) yearStats[year] = { thuNhap: 0, chiPhi: 0, count: 0 };
      const thuNhap = parseInt((row[32] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0;
      const chiPhi = parseInt((row[29] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0;
      yearStats[year].thuNhap += thuNhap;
      yearStats[year].chiPhi += chiPhi;
      yearStats[year].count += 1;
    }
    const chartYears = Object.keys(yearStats).sort((a, b) => a - b).slice(-5);
    const chartData = chartYears.map(year => ({
      year: year,
      thuNhap: yearStats[year].thuNhap || 0,
      chiPhi: yearStats[year].chiPhi || 0,
      count: yearStats[year].count || 0
    }));

    // Tính các chỉ số tổng quan chỉ cho năm lớn nhất
    const tongKhaoSat = filtered.length;
    const tongThanhVien = filtered.reduce((sum, row) => sum + (parseInt((row[11] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0);
    const tongChiPhi = filtered.reduce((sum, row) => sum + (parseInt((row[29] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0);
    const tongThuNhap = filtered.reduce((sum, row) => sum + (parseInt((row[32] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0);
    const chiPhiTB = tongKhaoSat > 0 ? Math.round(tongChiPhi / tongKhaoSat) : 0;
    const thuNhapTB = tongKhaoSat > 0 ? Math.round(tongThuNhap / tongKhaoSat) : 0;

    // Tính tổng chi phí theo từng loại chỉ cho năm lớn nhất
    const chiPhiTheoLoai = {
      nhaO: filtered.reduce((sum, row) => sum + (parseInt((row[13] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      gao: filtered.reduce((sum, row) => sum + (parseInt((row[14] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      thit: filtered.reduce((sum, row) => sum + (parseInt((row[15] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      ca: filtered.reduce((sum, row) => sum + (parseInt((row[16] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      rauCu: filtered.reduce((sum, row) => sum + (parseInt((row[17] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      sua: filtered.reduce((sum, row) => sum + (parseInt((row[18] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      giaVi: filtered.reduce((sum, row) => sum + (parseInt((row[19] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      giaoDuc: filtered.reduce((sum, row) =>
        sum + (parseInt((row[20] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0)
        + (parseInt((row[21] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0)
        + (parseInt((row[22] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0)
        + (parseInt((row[23] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0),
      tienIch: filtered.reduce((sum, row) =>
        sum + (parseInt((row[24] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0)
        + (parseInt((row[25] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0)
        + (parseInt((row[26] || '0').toString().replace(/\./g, '').replace(',', '.')) || 0), 0)
    };

    // Mức lương đủ sống theo Anker (giữ nguyên)
    const luongDuSong = {
      2019: 5000000,
      2020: 5500000,
      2021: 6000000,
      2022: 6500000,
      2023: 7000000
    };

    // Tìm năm có chi phí/thu nhập cao nhất/thấp nhất (giữ nguyên logic cũ)
    let namChiPhiMax = 'N/A', namChiPhiMin = 'N/A', namThuNhapMax = 'N/A', namThuNhapMin = 'N/A';
    let maxChiPhi = -Infinity, minChiPhi = Infinity, maxThuNhap = -Infinity, minThuNhap = Infinity;
    Object.keys(yearStats).forEach(year => {
      const stats = yearStats[year];
      if (stats.chiPhi > maxChiPhi) {
        maxChiPhi = stats.chiPhi;
        namChiPhiMax = year;
      }
      if (stats.chiPhi < minChiPhi && stats.chiPhi > 0) {
        minChiPhi = stats.chiPhi;
        namChiPhiMin = year;
      }
      if (stats.thuNhap > maxThuNhap) {
        maxThuNhap = stats.thuNhap;
        namThuNhapMax = year;
      }
      if (stats.thuNhap < minThuNhap && stats.thuNhap > 0) {
        minThuNhap = stats.thuNhap;
        namThuNhapMin = year;
      }
    });

    return {
      chartData,
      tongKhaoSat,
      tongThanhVien,
      tongChiPhi,
      tongThuNhap,
      chiPhiTB,
      thuNhapTB,
      namChiPhiMax,
      namChiPhiMin,
      namThuNhapMax,
      namThuNhapMin,
      chiPhiTheoLoai,
      luongDuSong,
      latestYear
    };
  } catch (error) {
    console.error('Lỗi xử lý dữ liệu:', error);
    return null;
  }
}

// Hàm hiển thị dữ liệu
function hienThiDuLieu(data) {
  try {
    if (!data) {
      console.error('Không có dữ liệu để hiển thị');
      return;
    }

    // Cập nhật các chỉ số tổng quan
    const elements = {
      tongKhaoSat: document.getElementById('tongKhaoSat'),
      tongThanhVien: document.getElementById('tongThanhVien'),
      tongChiPhi: document.getElementById('tongChiPhi'),
      tongThuNhap: document.getElementById('tongThuNhap'),
      chiPhiTB: document.getElementById('chiPhiTB'),
      thuNhapTB: document.getElementById('thuNhapTB'),
      namChiPhiMax: document.getElementById('namChiPhiMax'),
      namThuNhapMax: document.getElementById('namThuNhapMax')
    };

    // Cập nhật chú thích năm
    if (document.getElementById('yearKhaoSat')) document.getElementById('yearKhaoSat').textContent = `Năm ${data.latestYear}`;
    if (document.getElementById('yearThanhVien')) document.getElementById('yearThanhVien').textContent = `Năm ${data.latestYear}`;
    if (document.getElementById('yearChiPhi')) document.getElementById('yearChiPhi').textContent = `Năm ${data.latestYear}`;
    if (document.getElementById('yearThuNhap')) document.getElementById('yearThuNhap').textContent = `Năm ${data.latestYear}`;
    if (document.getElementById('yearChiPhiTB')) document.getElementById('yearChiPhiTB').textContent = `Năm ${data.latestYear}`;
    if (document.getElementById('yearThuNhapTB')) document.getElementById('yearThuNhapTB').textContent = `Năm ${data.latestYear}`;
    if (document.getElementById('yearChiPhiPie')) document.getElementById('yearChiPhiPie').textContent = data.latestYear;

    // Kiểm tra và cập nhật từng phần tử
    if (elements.tongKhaoSat) elements.tongKhaoSat.textContent = data.tongKhaoSat || 0;
    if (elements.tongThanhVien) elements.tongThanhVien.textContent = data.tongThanhVien || 0;
    if (elements.tongChiPhi) elements.tongChiPhi.textContent = (data.tongChiPhi || 0).toLocaleString() + ' VNĐ';
    if (elements.tongThuNhap) elements.tongThuNhap.textContent = (data.tongThuNhap || 0).toLocaleString() + ' VNĐ';
    if (elements.chiPhiTB) elements.chiPhiTB.textContent = (data.chiPhiTB || 0).toLocaleString() + ' VNĐ';
    if (elements.thuNhapTB) elements.thuNhapTB.textContent = (data.thuNhapTB || 0).toLocaleString() + ' VNĐ';
    if (elements.namChiPhiMax) elements.namChiPhiMax.textContent = data.namChiPhiMax || 'N/A';
    if (elements.namThuNhapMax) elements.namThuNhapMax.textContent = data.namThuNhapMax || 'N/A';

    // Vẽ biểu đồ thu nhập & chi phí
    const ctx = document.getElementById('chartThuNhapChiPhi');
    if (ctx) {
      if (window.comparisonChart) {
        window.comparisonChart.destroy();
      }
      window.comparisonChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: data.chartData.map(d => d.year),
          datasets: [
            {
              label: 'Thu nhập',
              data: data.chartData.map(d => d.thuNhap || 0),
              backgroundColor: 'rgba(54, 162, 235, 0.85)',
              borderRadius: 8,
              borderSkipped: false
            },
            {
              label: 'Chi phí',
              data: data.chartData.map(d => d.chiPhi || 0),
              backgroundColor: 'rgba(255, 99, 132, 0.85)',
              borderRadius: 8,
              borderSkipped: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { font: { size: 16 } }
            },
            title: {
              display: true,
              text: 'So sánh thu nhập & chi phí 5 năm gần nhất',
              font: { size: 20 }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + (context.parsed.y || 0).toLocaleString() + ' VNĐ';
                }
              },
              bodyFont: { size: 16 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value.toLocaleString() + ' VNĐ';
                },
                font: { size: 14 }
              },
              title: {
                display: true,
                text: 'VNĐ',
                font: { size: 16 }
              }
            },
            x: {
              ticks: { font: { size: 14 } }
            }
          },
          animation: {
            duration: 1200,
            easing: 'easeOutBounce'
          }
        }
      });
    }

    // Vẽ biểu đồ chi phí theo loại
    const chiPhiPieCtx = document.getElementById('chiPhiPieChart');
    if (chiPhiPieCtx) {
      if (window.chiPhiPieChart && typeof window.chiPhiPieChart.destroy === 'function') {
        window.chiPhiPieChart.destroy();
      }
      window.chiPhiPieChart = new Chart(chiPhiPieCtx.getContext('2d'), {
        type: 'pie',
        data: {
          labels: [
            'Nhà ở', 'Gạo', 'Thịt', 'Cá', 'Rau củ', 
            'Sữa', 'Gia vị', 'Giáo dục', 'Tiện ích'
          ],
          datasets: [{
            data: [
              data.chiPhiTheoLoai.nhaO || 0,
              data.chiPhiTheoLoai.gao || 0,
              data.chiPhiTheoLoai.thit || 0,
              data.chiPhiTheoLoai.ca || 0,
              data.chiPhiTheoLoai.rauCu || 0,
              data.chiPhiTheoLoai.sua || 0,
              data.chiPhiTheoLoai.giaVi || 0,
              data.chiPhiTheoLoai.giaoDuc || 0,
              data.chiPhiTheoLoai.tienIch || 0
            ],
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            },
            title: {
              display: true,
              text: 'Tỷ trọng chi phí theo loại'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => (a || 0) + (b || 0), 0);
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${context.label}: ${value.toLocaleString()} VNĐ (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Vẽ biểu đồ xu hướng mức lương đủ sống
    const luongDuSongCtx = document.getElementById('luongDuSongChart');
    if (luongDuSongCtx) {
      new Chart(luongDuSongCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: Object.keys(data.luongDuSong),
          datasets: [{
            label: 'Mức lương đủ sống (VND)',
            data: Object.values(data.luongDuSong),
            borderColor: '#4BC0C0',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Xu hướng mức lương đủ sống theo Anker'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + (context.parsed.y || 0).toLocaleString() + ' VNĐ';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value.toLocaleString('vi-VN') + ' VND';
                }
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Lỗi hiển thị dữ liệu:', error);
    alert('Có lỗi xảy ra khi hiển thị dữ liệu. Vui lòng thử lại sau.');
  }
}

// Gọi API và xử lý dữ liệu
document.addEventListener('DOMContentLoaded', function() {
  fetch('https://script.google.com/macros/s/AKfycbyIfABkyH2K8RnIB4_aOl-AUXmauvPcq-uKtoGSRUFfdkvRPa8jWAf1TDT6UcXTtUl_qQ/exec')
    .then(res => res.json())
    .then(result => {
      if (result && result.status === 'success' && result.data) {
        const processedData = xuLyDuLieu(result.data);
        if (processedData) {
          hienThiDuLieu(processedData);
        } else {
          alert('Không thể xử lý dữ liệu. Vui lòng kiểm tra lại dữ liệu đầu vào.');
        }
      } else {
        alert('Lỗi: ' + (result?.message || 'Không thể tải dữ liệu'));
      }
    })
    .catch(error => {
      console.error('Lỗi khi tải dữ liệu:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    });
});

function processData(apiData) {
    // Bỏ qua hàng đầu tiên (header)
    const data = apiData.data.slice(1);
    
    // Hàm helper để xử lý số
    const parseNumber = (value) => {
        try {
            // Kiểm tra và log giá trị đầu vào
            console.log('Giá trị đầu vào:', value, 'Kiểu dữ liệu:', typeof value);
            
            if (value === undefined || value === null) return 0;
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
                // Kiểm tra nếu chuỗi rỗng
                if (value.trim() === '') return 0;
                // Thử chuyển đổi trực tiếp
                const num = parseFloat(value);
                if (!isNaN(num)) return num;
                // Nếu không được, thử xử lý định dạng số Việt Nam
                return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
            }
            return 0;
        } catch (error) {
            console.error('Lỗi khi xử lý số:', error, 'Giá trị:', value);
            return 0;
        }
    };

    // Chuyển đổi dữ liệu thành định dạng dễ xử lý
    return data.map((row, index) => {
        try {
            // Log dữ liệu của mỗi hàng để debug
            console.log(`Xử lý hàng ${index}:`, row);
            
            const date = new Date(row[1]); // Thoi_Gian_Tao
            
            return {
                year: date.getFullYear(),
                tongThanhVien: parseInt(row[12]) || 0, // Tong_Thanh_Vien
                tongChiPhi: parseNumber(row[29]), // Tong_Chi_Phi
                tongThuNhap: parseNumber(row[32]), // Tong_Thu_Nhap
                chiPhiTheoLoai: {
                    nhaO: parseNumber(row[13]),
                    gao: parseNumber(row[14]),
                    thit: parseNumber(row[15]),
                    ca: parseNumber(row[16]),
                    rauCu: parseNumber(row[17]),
                    sua: parseNumber(row[18]),
                    giaVi: parseNumber(row[19]),
                    hocPhi: parseNumber(row[20]),
                    sachVo: parseNumber(row[21]),
                    dongPhuc: parseNumber(row[22]),
                    khacGiaoDuc: parseNumber(row[23]),
                    dien: parseNumber(row[24]),
                    nuoc: parseNumber(row[25]),
                    internet: parseNumber(row[26]),
                    rac: parseNumber(row[27])
                }
            };
        } catch (error) {
            console.error(`Lỗi khi xử lý hàng ${index}:`, error);
            // Trả về object mặc định nếu có lỗi
            return {
                year: new Date().getFullYear(),
                tongThanhVien: 0,
                tongChiPhi: 0,
                tongThuNhap: 0,
                chiPhiTheoLoai: {
                    nhaO: 0, gao: 0, thit: 0, ca: 0, rauCu: 0,
                    sua: 0, giaVi: 0, hocPhi: 0, sachVo: 0,
                    dongPhuc: 0, khacGiaoDuc: 0, dien: 0,
                    nuoc: 0, internet: 0, rac: 0
                }
            };
        }
    });
}

function updateComparisonChart(comparisonData) {
    const ctx = document.getElementById('chartThuNhapChiPhi').getContext('2d');
    // Xóa chart cũ nếu có
    if (window.comparisonChart) {
        window.comparisonChart.destroy();
    }
    window.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: comparisonData.map(item => item.year),
            datasets: [
                {
                    label: 'Chi phí',
                    backgroundColor: '#0dcaf0',
                    data: comparisonData.map(item => item.chiPhi)
                },
                {
                    label: 'Thu nhập',
                    backgroundColor: '#ffc107',
                    data: comparisonData.map(item => item.thuNhap)
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

function updatePieChart(chiPhiTheoLoai) {
    const ctx = document.getElementById('chiPhiPieChart').getContext('2d');
    // Xóa chart cũ nếu có
    if (window.chiPhiPieChart && typeof window.chiPhiPieChart.destroy === 'function') {
        window.chiPhiPieChart.destroy();
    }
    window.chiPhiPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Nhà ở', 'Gạo', 'Thịt', 'Cá', 'Rau củ', 'Sữa', 'Gia vị', 'Học phí', 'Sách vở', 'Đồng phục', 'Khác GD', 'Điện', 'Nước', 'Internet', 'Rác'
            ],
            datasets: [{
                data: [
                    chiPhiTheoLoai.nhaO || 0,
                    chiPhiTheoLoai.gao || 0,
                    chiPhiTheoLoai.thit || 0,
                    chiPhiTheoLoai.ca || 0,
                    chiPhiTheoLoai.rauCu || 0,
                    chiPhiTheoLoai.sua || 0,
                    chiPhiTheoLoai.giaVi || 0,
                    chiPhiTheoLoai.hocPhi || 0,
                    chiPhiTheoLoai.sachVo || 0,
                    chiPhiTheoLoai.dongPhuc || 0,
                    chiPhiTheoLoai.khacGiaoDuc || 0,
                    chiPhiTheoLoai.dien || 0,
                    chiPhiTheoLoai.nuoc || 0,
                    chiPhiTheoLoai.internet || 0,
                    chiPhiTheoLoai.rac || 0
                ],
                backgroundColor: [
                    '#0d6efd', '#198754', '#dc3545', '#ffc107', '#0dcaf0',
                    '#6f42c1', '#fd7e14', '#20c997', '#6610f2', '#e83e8c',
                    '#6c757d', '#343a40', '#adb5bd', '#f8f9fa', '#212529'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
} 

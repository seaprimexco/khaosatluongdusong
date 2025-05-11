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
        }
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Chuẩn bị dữ liệu 5 năm gần nhất
    let yearStats = {};
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      yearStats[year] = { thuNhap: 0, chiPhi: 0, count: 0 };
    }

    // Duyệt qua từng dòng dữ liệu (bỏ qua header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[1]) continue; // Bỏ qua dòng không hợp lệ
      
      try {
        const date = new Date(row[1]); // Cột B: Thời gian tạo
        if (isNaN(date.getTime())) continue; // Bỏ qua nếu ngày không hợp lệ
        
        const year = date.getFullYear();
        if (yearStats[year] !== undefined) {
          const thuNhap = parseInt(row[32] || 0) || 0;
          const chiPhi = parseInt(row[29] || 0) || 0;
          yearStats[year].thuNhap += thuNhap;
          yearStats[year].chiPhi += chiPhi;
          yearStats[year].count += 1;
        }
      } catch (error) {
        console.error('Lỗi xử lý dòng dữ liệu:', error);
        continue;
      }
    }

    // Chuyển dữ liệu sang mảng cho biểu đồ
    const years = Object.keys(yearStats).sort();
    const chartData = years.map(year => ({
      year: year,
      thuNhap: yearStats[year].thuNhap || 0,
      chiPhi: yearStats[year].chiPhi || 0,
      count: yearStats[year].count || 0
    }));

    // Tính các chỉ số tổng quan
    const tongKhaoSat = Math.max(0, data.length - 1);
    const tongThanhVien = data.slice(1).reduce((sum, row) => sum + (parseInt(row[11] || 0) || 0), 0);
    const tongChiPhi = data.slice(1).reduce((sum, row) => sum + (parseInt(row[29] || 0) || 0), 0);
    const tongThuNhap = data.slice(1).reduce((sum, row) => sum + (parseInt(row[32] || 0) || 0), 0);
    const chiPhiTB = tongKhaoSat > 0 ? Math.round(tongChiPhi / tongKhaoSat) : 0;
    const thuNhapTB = tongKhaoSat > 0 ? Math.round(tongThuNhap / tongKhaoSat) : 0;

    // Tính tổng chi phí theo từng loại
    const chiPhiTheoLoai = {
      nhaO: data.slice(1).reduce((sum, row) => sum + (parseInt(row[13] || 0) || 0), 0),
      gao: data.slice(1).reduce((sum, row) => sum + (parseInt(row[14] || 0) || 0), 0),
      thit: data.slice(1).reduce((sum, row) => sum + (parseInt(row[15] || 0) || 0), 0),
      ca: data.slice(1).reduce((sum, row) => sum + (parseInt(row[16] || 0) || 0), 0),
      rauCu: data.slice(1).reduce((sum, row) => sum + (parseInt(row[17] || 0) || 0), 0),
      sua: data.slice(1).reduce((sum, row) => sum + (parseInt(row[18] || 0) || 0), 0),
      giaVi: data.slice(1).reduce((sum, row) => sum + (parseInt(row[19] || 0) || 0), 0),
      giaoDuc: data.slice(1).reduce((sum, row) => 
        sum + (parseInt(row[20] || 0) || 0) + (parseInt(row[21] || 0) || 0) + 
        (parseInt(row[22] || 0) || 0) + (parseInt(row[23] || 0) || 0), 0),
      tienIch: data.slice(1).reduce((sum, row) => 
        sum + (parseInt(row[24] || 0) || 0) + (parseInt(row[25] || 0) || 0) + 
        (parseInt(row[26] || 0) || 0), 0)
    };

    // Mức lương đủ sống theo Anker
    const luongDuSong = {
      2019: 5000000,
      2020: 5500000,
      2021: 6000000,
      2022: 6500000,
      2023: 7000000
    };

    // Tìm năm có chi phí/thu nhập cao nhất/thấp nhất
    let namChiPhiMax = 'N/A', namChiPhiMin = 'N/A', namThuNhapMax = 'N/A', namThuNhapMin = 'N/A';
    let maxChiPhi = -Infinity, minChiPhi = Infinity, maxThuNhap = -Infinity, minThuNhap = Infinity;
    
    years.forEach(year => {
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
      luongDuSong
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
      new Chart(ctx.getContext('2d'), {
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
      new Chart(chiPhiPieCtx.getContext('2d'), {
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

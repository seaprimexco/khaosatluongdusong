// Hàm xử lý dữ liệu
function xuLyDuLieu(data) {
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
    const date = new Date(row[1]); // Cột B: Thời gian tạo
    const year = date.getFullYear();
    if (yearStats[year] !== undefined) {
      yearStats[year].thuNhap += parseInt(row[32] || 0); // Tổng thu nhập
      yearStats[year].chiPhi += parseInt(row[29] || 0);  // Tổng chi phí
      yearStats[year].count += 1;
    }
  }

  // Chuyển dữ liệu sang mảng cho biểu đồ
  const years = Object.keys(yearStats).sort();
  const chartData = years.map(year => ({
    year: year,
    thuNhap: yearStats[year].thuNhap,
    chiPhi: yearStats[year].chiPhi,
    count: yearStats[year].count
  }));

  // Tính các chỉ số tổng quan
  const tongKhaoSat = data.length - 1;
  const tongThanhVien = data.slice(1).reduce((sum, row) => sum + parseInt(row[11] || 0), 0);
  const tongChiPhi = data.slice(1).reduce((sum, row) => sum + parseInt(row[29] || 0), 0);
  const tongThuNhap = data.slice(1).reduce((sum, row) => sum + parseInt(row[32] || 0), 0);
  const chiPhiTB = tongKhaoSat > 0 ? Math.round(tongChiPhi / tongKhaoSat) : 0;
  const thuNhapTB = tongKhaoSat > 0 ? Math.round(tongThuNhap / tongKhaoSat) : 0;

  // Tính tổng chi phí theo từng loại
  const chiPhiTheoLoai = {
    nhaO: data.slice(1).reduce((sum, row) => sum + parseInt(row[13] || 0), 0),
    gao: data.slice(1).reduce((sum, row) => sum + parseInt(row[14] || 0), 0),
    thit: data.slice(1).reduce((sum, row) => sum + parseInt(row[15] || 0), 0),
    ca: data.slice(1).reduce((sum, row) => sum + parseInt(row[16] || 0), 0),
    rauCu: data.slice(1).reduce((sum, row) => sum + parseInt(row[17] || 0), 0),
    sua: data.slice(1).reduce((sum, row) => sum + parseInt(row[18] || 0), 0),
    giaVi: data.slice(1).reduce((sum, row) => sum + parseInt(row[19] || 0), 0),
    giaoDuc: data.slice(1).reduce((sum, row) => 
      sum + parseInt(row[20] || 0) + parseInt(row[21] || 0) + 
      parseInt(row[22] || 0) + parseInt(row[23] || 0), 0),
    tienIch: data.slice(1).reduce((sum, row) => 
      sum + parseInt(row[24] || 0) + parseInt(row[25] || 0) + 
      parseInt(row[26] || 0), 0)
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
  let namChiPhiMax = '', namChiPhiMin = '', namThuNhapMax = '', namThuNhapMin = '';
  let maxChiPhi = -Infinity, minChiPhi = Infinity, maxThuNhap = -Infinity, minThuNhap = Infinity;
  years.forEach(year => {
    if (yearStats[year].chiPhi > maxChiPhi) {
      maxChiPhi = yearStats[year].chiPhi;
      namChiPhiMax = year;
    }
    if (yearStats[year].chiPhi < minChiPhi) {
      minChiPhi = yearStats[year].chiPhi;
      namChiPhiMin = year;
    }
    if (yearStats[year].thuNhap > maxThuNhap) {
      maxThuNhap = yearStats[year].thuNhap;
      namThuNhapMax = year;
    }
    if (yearStats[year].thuNhap < minThuNhap) {
      minThuNhap = yearStats[year].thuNhap;
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
}

// Hàm hiển thị dữ liệu
function hienThiDuLieu(data) {
  // Cập nhật các chỉ số tổng quan
  document.getElementById('tongKhaoSat').textContent = data.tongKhaoSat;
  document.getElementById('tongThanhVien').textContent = data.tongThanhVien;
  document.getElementById('tongChiPhi').textContent = data.tongChiPhi.toLocaleString() + ' VNĐ';
  document.getElementById('tongThuNhap').textContent = data.tongThuNhap.toLocaleString() + ' VNĐ';
  document.getElementById('chiPhiTB').textContent = data.chiPhiTB.toLocaleString() + ' VNĐ';
  document.getElementById('thuNhapTB').textContent = data.thuNhapTB.toLocaleString() + ' VNĐ';
  document.getElementById('namChiPhiMax').textContent = data.namChiPhiMax;
  document.getElementById('namThuNhapMax').textContent = data.namThuNhapMax;

  // Vẽ biểu đồ thu nhập & chi phí
  const ctx = document.getElementById('chartThuNhapChiPhi').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.chartData.map(d => d.year),
      datasets: [
        {
          label: 'Thu nhập',
          data: data.chartData.map(d => d.thuNhap),
          backgroundColor: 'rgba(54, 162, 235, 0.85)',
          borderRadius: 8,
          borderSkipped: false
        },
        {
          label: 'Chi phí',
          data: data.chartData.map(d => d.chiPhi),
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
              return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' VNĐ';
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

  // Vẽ biểu đồ chi phí theo loại
  const chiPhiPieCtx = document.getElementById('chiPhiPieChart').getContext('2d');
  new Chart(chiPhiPieCtx, {
    type: 'pie',
    data: {
      labels: [
        'Nhà ở', 'Gạo', 'Thịt', 'Cá', 'Rau củ', 
        'Sữa', 'Gia vị', 'Giáo dục', 'Tiện ích'
      ],
      datasets: [{
        data: [
          data.chiPhiTheoLoai.nhaO,
          data.chiPhiTheoLoai.gao,
          data.chiPhiTheoLoai.thit,
          data.chiPhiTheoLoai.ca,
          data.chiPhiTheoLoai.rauCu,
          data.chiPhiTheoLoai.sua,
          data.chiPhiTheoLoai.giaVi,
          data.chiPhiTheoLoai.giaoDuc,
          data.chiPhiTheoLoai.tienIch
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
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${context.label}: ${value.toLocaleString()} VNĐ (${percentage}%)`;
            }
          }
        }
      }
    }
  });

  // Vẽ biểu đồ xu hướng mức lương đủ sống
  const luongDuSongCtx = document.getElementById('luongDuSongChart').getContext('2d');
  new Chart(luongDuSongCtx, {
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
              return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' VNĐ';
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

// Gọi API và xử lý dữ liệu
document.addEventListener('DOMContentLoaded', function() {
  fetch('https://script.google.com/macros/s/AKfycbyIfABkyH2K8RnIB4_aOl-AUXmauvPcq-uKtoGSRUFfdkvRPa8jWAf1TDT6UcXTtUl_qQ/exec')
    .then(res => res.json())
    .then(result => {
      if (result.status === 'success') {
        const processedData = xuLyDuLieu(result.data);
        hienThiDuLieu(processedData);
      } else {
        alert('Lỗi: ' + result.message);
      }
    })
    .catch(error => {
      console.error('Lỗi khi tải dữ liệu:', error);
      alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    });
}); 

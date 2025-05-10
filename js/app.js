fetch('https://script.google.com/macros/s/AKfycbyIfABkyH2K8RnIB4_aOl-AUXmauvPcq-uKtoGSRUFfdkvRPa8jWAf1TDT6UcXTtUl_qQ/exec')
  .then(res => res.json())
  .then(result => {
    if (result.status === 'success') {
      document.getElementById('tongKhaoSat').textContent = result.data.tongKhaoSat;
      document.getElementById('tongThanhVien').textContent = result.data.tongThanhVien;
      document.getElementById('tongChiPhi').textContent = result.data.tongChiPhi.toLocaleString() + ' VNĐ';
      document.getElementById('tongThuNhap').textContent = result.data.tongThuNhap.toLocaleString() + ' VNĐ';
      document.getElementById('chiPhiTB').textContent = (result.data.chiPhiTB || 0).toLocaleString() + ' VNĐ';
      document.getElementById('thuNhapTB').textContent = (result.data.thuNhapTB || 0).toLocaleString() + ' VNĐ';
      document.getElementById('namChiPhiMax').textContent = result.data.namChiPhiMax || '';
      document.getElementById('namThuNhapMax').textContent = result.data.namThuNhapMax || '';

      const chartData = result.data.chartData;
      const ctx = document.getElementById('chartThuNhapChiPhi').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.map(d => d.year),
          datasets: [
            {
              label: 'Thu nhập',
              data: chartData.map(d => d.thuNhap),
              backgroundColor: 'rgba(54, 162, 235, 0.85)',
              borderRadius: 8,
              borderSkipped: false
            },
            {
              label: 'Chi phí',
              data: chartData.map(d => d.chiPhi),
              backgroundColor: 'rgba(255, 99, 132, 0.85)',
              borderRadius: 8,
              borderSkipped: false
            }
          ]
        },
        options: {
          responsive: true,
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
    } else {
      alert('Lỗi: ' + result.message);
    }
  }); 

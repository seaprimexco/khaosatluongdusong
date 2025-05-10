fetch('https://script.google.com/macros/s/AKfycbyIfABkyH2K8RnIB4_aOl-AUXmauvPcq-uKtoGSRUFfdkvRPa8jWAf1TDT6UcXTtUl_qQ/exec')
  .then(res => res.json())
  .then(result => {
    if (result.status === 'success') {
      document.getElementById('tongKhaoSat').textContent = result.data.tongKhaoSat;
      document.getElementById('tongThanhVien').textContent = result.data.tongThanhVien;
      document.getElementById('tongChiPhi').textContent = result.data.tongChiPhi.toLocaleString() + ' VNĐ';
      document.getElementById('tongThuNhap').textContent = result.data.tongThuNhap.toLocaleString() + ' VNĐ';

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
              backgroundColor: 'rgba(54, 162, 235, 0.7)'
            },
            {
              label: 'Chi phí',
              data: chartData.map(d => d.chiPhi),
              backgroundColor: 'rgba(255, 99, 132, 0.7)'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'So sánh thu nhập & chi phí 5 năm gần nhất' }
          }
        }
      });
    } else {
      alert('Lỗi: ' + result.message);
    }
  }); 

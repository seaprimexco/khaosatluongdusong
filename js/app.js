fetch('https://script.google.com/macros/s/AKfycbyIfABkyH2K8RnIB4_aOl-AUXmauvPcq-uKtoGSRUFfdkvRPa8jWAf1TDT6UcXTtUl_qQ/exec')
  .then(res => res.json())
  .then(result => {
    if (result.status === 'success') {
      document.getElementById('tongKhaoSat').textContent = result.data.tongKhaoSat;
      document.getElementById('tongThanhVien').textContent = result.data.tongThanhVien;
      document.getElementById('tongChiPhi').textContent = result.data.tongChiPhi.toLocaleString() + ' VNĐ';
      document.getElementById('tongThuNhap').textContent = result.data.tongThuNhap.toLocaleString() + ' VNĐ';
    } else {
      alert('Lỗi: ' + result.message);
    }
  }); 

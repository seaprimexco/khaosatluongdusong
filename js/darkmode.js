// Dark mode toggle dùng chung cho toàn bộ hệ thống
function setDarkMode(on) {
    if(on) {
        document.body.classList.add('ks-darkmode');
        localStorage.setItem('ks_darkmode', '1');
    } else {
        document.body.classList.remove('ks-darkmode');
        localStorage.setItem('ks_darkmode', '0');
    }
}
// Áp dụng dark mode khi load trang nếu đã lưu
window.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem('ks_darkmode') === '1') {
        document.body.classList.add('ks-darkmode');
    }
    var darkBtn = document.getElementById('darkModeToggle');
    if(darkBtn) {
        darkBtn.onclick = function() {
            const isDark = document.body.classList.contains('ks-darkmode');
            setDarkMode(!isDark);
        };
    }
}); 
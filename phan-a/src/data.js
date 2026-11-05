export const cacLoai = ['Ăn uống', 'Đi lại', 'Học tập', 'Giải trí'];

export function ngayHomNay() {
  const ngay = new Date();
  const thang = String(ngay.getMonth() + 1).padStart(2, '0');
  const ngayTrongThang = String(ngay.getDate()).padStart(2, '0');
  return ngay.getFullYear() + '-' + thang + '-' + ngayTrongThang;
}

export function hienTien(tien) {
  return Number(tien).toLocaleString('vi-VN') + ' đ';
}

export function tinhTong(danhSach) {
  let tong = 0;
  for (let i = 0; i < danhSach.length; i++) {
    tong = tong + Number(danhSach[i].soTien);
  }
  return tong;
}


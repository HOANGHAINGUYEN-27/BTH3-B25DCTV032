import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cacLoai, hienTien, tinhTong, ngayHomNay } from './data';
import useFetch from './useFetch';
import useClock from './useClock';

const ThemeContext = createContext();

function NutDoiMau() {
  const { toi, setToi } = useContext(ThemeContext);
  return <button onClick={() => setToi(!toi)}>{toi ? 'Chế độ sáng' : 'Chế độ tối'}</button>;
}

function Header() {
  const gio = useClock();
  return (
    <header>
      <h1>Sổ chi tiêu cá nhân</h1>
      <p>Phần B - Function Component + Hooks</p>
      <p>Bây giờ: {gio.toLocaleTimeString('vi-VN')}</p>
    </header>
  );
}

function FormThem({ onThem, dangBan }) {
  const [noiDung, setNoiDung] = useState('');
  const [soTien, setSoTien] = useState('');
  const [loai, setLoai] = useState('Ăn uống');
  const [ngay, setNgay] = useState(ngayHomNay());
  const oNoiDung = useRef(null);

  async function them(event) {
    event.preventDefault();
    if (noiDung.trim() === '') {
      alert('Chưa nhập nội dung');
      return;
    }
    if (!Number.isFinite(Number(soTien)) || Number(soTien) <= 0) {
      alert('Nhập số tiền lớn hơn 0');
      return;
    }
    if (ngay === '') {
      alert('Chưa chọn ngày');
      return;
    }

    const khoanChi = {
      noiDung: noiDung.trim(),
      soTien: Number(soTien),
      loai: loai,
      ngay: ngay
    };
    const thanhCong = await onThem(khoanChi);
    if (thanhCong) {
      setNoiDung('');
      setSoTien('');
      if (oNoiDung.current) {
        oNoiDung.current.focus();
      }
    }
  }

  return (
    <form onSubmit={them} noValidate>
      <h2>Thêm khoản chi</h2>
      <label>Nội dung
        <input ref={oNoiDung} value={noiDung} onChange={e => setNoiDung(e.target.value)} />
      </label>
      <label>Số tiền (đồng)
        <input type="number" min="1" step="any" value={soTien} onChange={e => setSoTien(e.target.value)} />
      </label>
      <label>Loại
        <select value={loai} onChange={e => setLoai(e.target.value)}>
          {cacLoai.map(item => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>Ngày chi
        <input type="date" value={ngay} onChange={e => setNgay(e.target.value)} />
      </label>
      <button type="submit" disabled={dangBan}>{dangBan ? 'Đang xử lý...' : 'Thêm'}</button>
    </form>
  );
}

function DanhSach({ danhSach, onXoa, dangBan }) {
  return (
    <section>
      <h2>Danh sách khoản chi</h2>
      {danhSach.length === 0 && <p>Không có khoản chi nào.</p>}
      <ul>
        {danhSach.map(item => (
          <li key={item.id}>
            <div>
              <strong>{item.noiDung}</strong>
              <p>{item.loai} | {item.ngay}</p>
            </div>
            <span>{hienTien(item.soTien)}</span>
            <button className="xoa" disabled={dangBan} onClick={() => onXoa(item.id)}>Xóa</button>
          </li>
        ))}
      </ul>
      <p className="tong">Tổng tiền đang hiển thị: {hienTien(tinhTong(danhSach))}</p>
    </section>
  );
}

export default function App() {
  const { danhSach, dangTai, dangLuu, daTai, loi, them, xoa, taiLai } = useFetch();
  const [loaiLoc, setLoaiLoc] = useState('Tất cả');
  const [tuKhoa, setTuKhoa] = useState('');
  const [tuKhoaCham, setTuKhoaCham] = useState('');
  const [toi, setToi] = useState(false);
  const [hienDongHo, setHienDongHo] = useState(true);

  useEffect(() => {
    const henGio = setTimeout(() => setTuKhoaCham(tuKhoa), 400);
    return () => clearTimeout(henGio);
  }, [tuKhoa]);

  useEffect(() => {
    document.title = 'Tổng chi: ' + hienTien(tinhTong(danhSach));
  }, [danhSach]);

  function xoaCoHoi(id) {
    if (window.confirm('Bạn có chắc muốn xóa khoản chi này?')) {
      xoa(id);
    }
  }

  let danhSachLoc = danhSach;
  if (loaiLoc !== 'Tất cả') {
    danhSachLoc = danhSachLoc.filter(item => item.loai === loaiLoc);
  }
  if (tuKhoaCham.trim() !== '') {
    danhSachLoc = danhSachLoc.filter(item =>
      item.noiDung.toLowerCase().includes(tuKhoaCham.trim().toLowerCase())
    );
  }

  const thongKe = [];
  for (let i = 0; i < cacLoai.length; i++) {
    let tong = 0;
    for (let j = 0; j < danhSach.length; j++) {
      if (danhSach[j].loai === cacLoai[i]) {
        tong = tong + Number(danhSach[j].soTien);
      }
    }
    thongKe.push({ loai: cacLoai[i], tong: tong });
  }

  return (
    <ThemeContext.Provider value={{ toi, setToi }}>
      <div className={toi ? 'ung-dung toi' : 'ung-dung'}>
        {hienDongHo && <Header />}
        <div className="hang-nut">
          <button onClick={() => setHienDongHo(!hienDongHo)}>
            {hienDongHo ? 'Ẩn đồng hồ' : 'Hiện đồng hồ'}
          </button>
          <NutDoiMau />
        </div>
        {dangTai && <p role="status">Đang tải dữ liệu...</p>}
        {dangLuu && <p role="status">Đang lưu thay đổi...</p>}
        {loi && <p className="loi" role="alert">{loi}</p>}
        <button disabled={dangTai || dangLuu} onClick={taiLai}>Tải lại dữ liệu</button>
        <FormThem onThem={them} dangBan={dangTai || dangLuu || !daTai} />
        <section>
          <label>Lọc theo loại
            <select value={loaiLoc} onChange={e => setLoaiLoc(e.target.value)}>
              <option>Tất cả</option>
              {cacLoai.map(loai => <option key={loai}>{loai}</option>)}
            </select>
          </label>
          <label>Tìm nội dung
            <input value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
          </label>
        </section>
        {!dangTai && <DanhSach danhSach={danhSachLoc} onXoa={xoaCoHoi} dangBan={dangLuu} />}
        <section>
          <h2>Thống kê theo loại</h2>
          {thongKe.map(item => (
            <p key={item.loai}>{item.loai}: {hienTien(item.tong)}</p>
          ))}
        </section>
      </div>
    </ThemeContext.Provider>
  );
}

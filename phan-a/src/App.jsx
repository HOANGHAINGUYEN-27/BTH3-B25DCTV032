import { Component } from 'react';
import { cacLoai, hienTien, tinhTong, ngayHomNay } from './data';

const duLieuMau = [
  { id: '1', noiDung: 'Ăn sáng', soTien: 25000, loai: 'Ăn uống', ngay: ngayHomNay() },
  { id: '2', noiDung: 'Đổ xăng', soTien: 50000, loai: 'Đi lại', ngay: ngayHomNay() },
  { id: '3', noiDung: 'Mua vở', soTien: 20000, loai: 'Học tập', ngay: ngayHomNay() }
];

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { gio: new Date() };
  }

  componentDidMount() {
    this.dongHo = setInterval(() => {
      this.setState({ gio: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.dongHo);
  }

  render() {
    return (
      <header>
        <h1>Sổ chi tiêu cá nhân</h1>
        <p>Phần A - Class Component</p>
        <p>Bây giờ: {this.state.gio.toLocaleTimeString('vi-VN')}</p>
      </header>
    );
  }
}

class FormThem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noiDung: '',
      soTien: '',
      loai: 'Ăn uống',
      ngay: ngayHomNay()
    };
  }

  them = (event) => {
    event.preventDefault();
    if (this.state.noiDung.trim() === '') {
      alert('Chưa nhập nội dung');
      return;
    }
    if (!Number.isFinite(Number(this.state.soTien)) || Number(this.state.soTien) <= 0) {
      alert('Nhập số tiền lớn hơn 0');
      return;
    }
    if (this.state.ngay === '') {
      alert('Chưa chọn ngày');
      return;
    }

    this.props.onThem({
      noiDung: this.state.noiDung.trim(),
      soTien: Number(this.state.soTien),
      loai: this.state.loai,
      ngay: this.state.ngay
    });
    this.setState({ noiDung: '', soTien: '' });
  };

  render() {
    return (
      <form onSubmit={this.them} noValidate>
        <h2>Thêm khoản chi</h2>
        <label>Nội dung
          <input value={this.state.noiDung} onChange={e => this.setState({ noiDung: e.target.value })} />
        </label>
        <label>Số tiền (đồng)
          <input type="number" min="1" step="any" value={this.state.soTien} onChange={e => this.setState({ soTien: e.target.value })} />
        </label>
        <label>Loại
          <select value={this.state.loai} onChange={e => this.setState({ loai: e.target.value })}>
            {cacLoai.map(loai => <option key={loai}>{loai}</option>)}
          </select>
        </label>
        <label>Ngày chi
          <input type="date" value={this.state.ngay} onChange={e => this.setState({ ngay: e.target.value })} />
        </label>
        <button type="submit">Thêm</button>
      </form>
    );
  }
}

class DanhSach extends Component {
  render() {
    const { danhSach, onXoa } = this.props;
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
              <button className="xoa" onClick={() => onXoa(item.id)}>Xóa</button>
            </li>
          ))}
        </ul>
        <p className="tong">Tổng tiền đang hiển thị: {hienTien(tinhTong(danhSach))}</p>
      </section>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      danhSach: duLieuMau,
      loaiLoc: 'Tất cả',
      hienDongHo: true
    };
    this.idTiepTheo = 4;
  }

  componentDidMount() {
    document.title = 'Tổng chi: ' + hienTien(tinhTong(this.state.danhSach));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.danhSach !== this.state.danhSach) {
      document.title = 'Tổng chi: ' + hienTien(tinhTong(this.state.danhSach));
    }
  }

  them = (khoanChi) => {
    const moi = { ...khoanChi, id: String(this.idTiepTheo++) };
    this.setState(prev => ({ danhSach: [...prev.danhSach, moi] }));
  };

  xoa = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khoản chi này?')) {
      this.setState(prev => ({ danhSach: prev.danhSach.filter(item => item.id !== id) }));
    }
  };

  render() {
    const { danhSach, loaiLoc, hienDongHo } = this.state;
    let danhSachLoc = danhSach;
    if (loaiLoc !== 'Tất cả') {
      danhSachLoc = danhSach.filter(item => item.loai === loaiLoc);
    }

    return (
      <div className="ung-dung">
        {hienDongHo && <Header />}
        <button onClick={() => this.setState({ hienDongHo: !hienDongHo })}>
          {hienDongHo ? 'Ẩn đồng hồ' : 'Hiện đồng hồ'}
        </button>
        <FormThem onThem={this.them} />
        <section>
          <label>Lọc theo loại
            <select value={loaiLoc} onChange={e => this.setState({ loaiLoc: e.target.value })}>
              <option>Tất cả</option>
              {cacLoai.map(loai => <option key={loai}>{loai}</option>)}
            </select>
          </label>
        </section>
        <DanhSach danhSach={danhSachLoc} onXoa={this.xoa} />
      </div>
    );
  }
}

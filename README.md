# Sổ chi tiêu cá nhân

Họ tên:Nguyễn Hoàng Hải

Mã sinh viên: B25DCTV032

## Cách chạy

Cài Node.js rồi mở Terminal trong thư mục này.

Phần A - Class Component:

```bash
cd phan-a
npm install
npm run dev
```

Phần B - Function Component + Hooks: mở một Terminal khác trong thư mục này rồi chạy:

```bash
cd phan-b
npm install
npm run dev
```

Mở đường dẫn hiện trong từng Terminal để xem chương trình.

Nhấn Ctrl + C trong Terminal để dừng chương trình.
## Hooks so với Class

useState thay cho this.state và this.setState.

useEffect quản lý đồng hồ và dọn interval trong cùng một chỗ, thay cho componentDidMount và componentWillUnmount. useEffect theo dõi danhSach để cập nhật tiêu đề thay cho componentDidUpdate.

useFetch và useClock tách logic để sử dụng lại. useRef giữ ô nhập để focus sau khi thêm. useContext truyền chế độ sáng/tối qua các component.

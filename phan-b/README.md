# Sổ chi tiêu cá nhân - Phần B

Họ tên: ........................................

Mã sinh viên: ..................................

## Cách chạy

Cài Node.js, mở thư mục `phan-b` trong VS Code, mở Terminal và chạy:

```bash
npm install
npm run dev
```

Mở đường dẫn hiện trong Terminal, thường là http://127.0.0.1:5174.

URL MockAPI đã được cấu hình trong file `.env`.

Nhấn Ctrl + C trong Terminal để dừng chương trình.

## Hooks so với Class

useState thay cho this.state và this.setState.

useEffect quản lý đồng hồ và dọn interval trong cùng một chỗ, thay cho componentDidMount và componentWillUnmount. useEffect theo dõi danhSach để cập nhật tiêu đề thay cho componentDidUpdate.

useFetch và useClock tách logic để sử dụng lại. useRef giữ ô nhập để focus sau khi thêm. useContext truyền chế độ sáng/tối qua các component.

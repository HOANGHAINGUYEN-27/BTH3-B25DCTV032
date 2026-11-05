import { useEffect, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');

export default function useFetch() {
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState('');
  const [lanTai, setLanTai] = useState(0);
  const [daTai, setDaTai] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function layDuLieu() {
      setDangTai(true);
      setLoi('');
      try {
        if (API_URL === '') throw new Error('Chưa có URL MockAPI.io trong .env.local.');
        const response = await fetch(API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Không lấy được danh sách.');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('API phải trả về một danh sách.');
        setDanhSach(data);
        setDaTai(true);
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoi('Lấy dữ liệu thất bại: ' + error.message);
      } finally {
        if (!controller.signal.aborted) setDangTai(false);
      }
    }

    layDuLieu();
    return () => controller.abort();
  }, [lanTai]);

  async function them(khoanChi) {
    setDangLuu(true);
    setLoi('');
    try {
      if (API_URL === '') throw new Error('Chưa có URL MockAPI.io trong .env.local.');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(khoanChi)
      });
      if (!response.ok) throw new Error('Không thêm được khoản chi.');
      const moi = await response.json();
      setDanhSach(cu => [...cu, moi]);
      return true;
    } catch (error) {
      setLoi('Thêm thất bại: ' + error.message);
      return false;
    } finally {
      setDangLuu(false);
    }
  }

  async function xoa(id) {
    setDangLuu(true);
    setLoi('');
    try {
      if (API_URL === '') throw new Error('Chưa có URL MockAPI.io trong .env.local.');
      const response = await fetch(API_URL + '/' + encodeURIComponent(id), { method: 'DELETE' });
      if (!response.ok) throw new Error('Không xóa được khoản chi.');
      setDanhSach(cu => cu.filter(item => item.id !== id));
    } catch (error) {
      setLoi('Xóa thất bại: ' + error.message);
    } finally {
      setDangLuu(false);
    }
  }

  function taiLai() {
    setLanTai(cu => cu + 1);
  }

  return { danhSach, dangTai, dangLuu, daTai, loi, them, xoa, taiLai };
}

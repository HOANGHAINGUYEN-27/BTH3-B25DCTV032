import { useEffect, useState } from 'react';

export default function useClock() {
  const [gio, setGio] = useState(new Date());

  useEffect(() => {
    const dongHo = setInterval(() => setGio(new Date()), 1000);
    return () => clearInterval(dongHo);
  }, []);

  return gio;
}

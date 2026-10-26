import { useEffect, useState } from 'react';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function OfflineBar() {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { business } = useBusiness();

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="bg-amber-100 border-b border-amber-300 text-amber-950 text-sm px-4 py-2 text-center">
      You are offline. Call {business.phones?.[0]} or WhatsApp us to book catering.
    </div>
  );
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { BUSINESS as BUSINESS_FALLBACK } from '../utils/constants.js';

const BusinessContext = createContext({
  business: BUSINESS_FALLBACK,
  loading: true,
  error: null,
  reload: () => {},
});

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(BUSINESS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);

    api.getBusinessInfo()
      .then((res) => {
        if (res?.data) {
          setBusiness({ ...BUSINESS_FALLBACK, ...res.data });
        }
      })
      .catch((err) => {
        setError(err.message);
        setBusiness(BUSINESS_FALLBACK);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo(() => ({ business, loading, error, reload }), [business, loading, error, reload]);

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}

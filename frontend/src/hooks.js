import { useEffect, useState } from 'react';
import { api } from './api';

// Loads data from the API once when the component mounts.
export function useFetch(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get(path)
      .then((d) => { setData(d); setError(''); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, [path]); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, setData, error, loading, reload: load };
}

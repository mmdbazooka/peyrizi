import { useEffect, useState } from 'react';
export type Navigate = (path: string) => void;
export function useRoute(): [string, Navigate] {
  const get = () => location.hash.slice(1) || 'dashboard';
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const cb = () => {
      setRoute(get());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', cb);
    return () => window.removeEventListener('hashchange', cb);
  }, []);
  return [
    route,
    (path) => {
      location.hash = path;
    },
  ];
}

import { useEffect } from 'react';
import { history, Outlet, useLocation } from 'umi';

import { publicRoutes } from '@/defaults';
import useSession from '@/hooks/useSession';

import './index.less';

const Container = () => {
  const location = useLocation();

  const allowed = publicRoutes.includes(location.pathname);

  const { session } = useSession();

  useEffect(() => {
    if (!session && !allowed) {
      history.push('/login');
    } else if (session && allowed) {
      history.push('/');
    }
  }, []);

  return Boolean(session) ? <Outlet context={{ session }} /> : <Outlet />;
};

export default Container;

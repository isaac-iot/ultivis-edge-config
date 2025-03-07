import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';

import {
  Layout,
  HeaderDivider,
  SidebarItem,
  SidebarAccordionItem,
  GroupAccordion,
  AppSwitcher,
  UserMenu,
  useTranslation,
  useAuth,
  useApi,
  useRoutingContext,
  useDeviceTree,
  useRoleStore,
  HomeIcon,
  NetworkIcon,
  TimeSyncIcon,
} from '@ultivis/library';

const Main = () => {
  const [authApp, setAuthApp] = useState([]);
  const { applications } = useAuth();
  const { t } = useTranslation();

  const { manageRole, getInventory, putInventory } = useApi();
  const { dashboardId, sourceId } = useRoutingContext();

  const isMounted = useRef(false);
  const { pathname } = useLocation();

  const depth = 0;

  const { initRoles, roles, setAccess, checkRole, addAccessedDashboardId, hasAccessedDashboardId } = useRoleStore();

  const { data } = useSuspenseQuery({
    queryKey: ['device', sourceId],
    staleTime: Infinity,
    queryFn: () => getInventory(sourceId),
  });

  const { usePrefetchDeviceTree } = useDeviceTree({
    managedObject: null,
    onlyGroup: true,
  });
  const { prefetch } = usePrefetchDeviceTree({
    managedObject: null,
    onlyGroup: true,
  });

  useEffect(() => {
    if (applications) {
      const filteredApps = applications.data
        .filter((app) => app.type !== 'MICROSERVICE' && app.manifest?.noAppSwitcher !== true)
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      setAuthApp(filteredApps);
    }
  }, [applications]);

  // 페이지 제목
  const pageTitle = () => {
    switch (pathname) {
      case '/':
        return t('home');
      case '/network':
        return t('Network');
      case '/timesync':
        return t('Time Synchronization');
      default:
        return t('home');
    }
  };

  // 선언된 사이드바 아이템들을 가져와서 표시하는 기능
  useEffect(() => {
    prefetch();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!isMounted.current) {
        isMounted.current = true;
        const roles = await manageRole();
        initRoles(roles);
      }
    };

    const manageAccess = async (id) => {
      if (!hasAccessedDashboardId(id) && pathname.includes('/dashboard/')) {
        try {
          await putInventory({ id });

          setAccess(true);
        } catch (error) {
          if (error.response && error.response.status === 403) {
            setAccess(false);
          }
        } finally {
          addAccessedDashboardId(id); // dashboardId 또는 sourceId를 Set에 추가
        }
      }
    };
    init();

    if (!checkRole('ROLE_INVENTORY_ADMIN') || !checkRole('ROLE_INVENTORY_CREATE')) {
      if (dashboardId) {
        manageAccess(dashboardId);
      } else {
        manageAccess(sourceId);
      }
    } else {
      setAccess(true);
    }
  }, [dashboardId, roles]);

  return (
    <Layout
      pageTitle={pageTitle}
      headerItems={
        <>
          <AppSwitcher applications={authApp} />
          <HeaderDivider />
          <UserMenu />
        </>
      }
      sidebarItems={
        <>
          <SidebarItem icon={HomeIcon} label={t('Home')} to="/" className="p-3 dark:text-dark-grayscale-100" />

          <SidebarAccordionItem label={t('Groups')} asChild={<GroupAccordion onlyGroup={true} depth={depth + 1} />} depth={depth} className="dark:text-dark-grayscale-100" />
          <SidebarItem icon={NetworkIcon} label={t('Network')} to="/network" className="p-3 dark:text-dark-grayscale-100" />
          <SidebarItem icon={TimeSyncIcon} label={t('Time Sync')} to="/timesync" className="p-3 dark:text-dark-grayscale-100" />
        </>
      }
    />
  );
};

export default Main;

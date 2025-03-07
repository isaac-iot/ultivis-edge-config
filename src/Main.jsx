import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Layout,
  HeaderDivider,
  SidebarItem,
  SidebarAccordionItem,
  AppSwitcher,
  UserMenu,
  useTranslation,
  useAuth,
  HomeIcon,
  SettingIcon,
} from "@ultivis/library";
import SettingsAccordion from "./components/SettingsAccordion";

const Main = () => {
  const [authApp, setAuthApp] = useState([]);
  const { applications } = useAuth();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    if (applications) {
      const filteredApps = applications.data
        .filter(
          (app) =>
            app.type !== "MICROSERVICE" && app.manifest?.noAppSwitcher !== true
        )
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
      setAuthApp(filteredApps);
    }
  }, [applications]);

  // 페이지 제목
  const pageTitle = () => {
    switch (pathname) {
      case "/":
        return t("home");
      case "/config":
        return t("Configuration");
      case "/network":
        return t("Network");
      case "/timesync":
        return t("Time Synchronization");
      default:
        return t("home");
    }
  };

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
          <SidebarItem
            icon={HomeIcon}
            label={t("Home")}
            to="/"
            className="p-3 dark:text-dark-grayscale-100"
          />

          <SidebarAccordionItem
            icon={SettingIcon}
            label={t("configuration")}
            asChild={<SettingsAccordion />}
            onlyGroup={false}
            className="dark:text-dark-grayscale-100"
          />
        </>
      }
    />
  );
};

export default Main;

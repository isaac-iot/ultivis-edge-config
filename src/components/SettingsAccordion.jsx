import {
  SidebarItem,
  NetworkIcon,
  TimeSyncIcon,
  useTranslation,
  VideoIcon,
} from "@ultivis/library";
import React from "react";

const SettingsAccordion = () => {
  const { t } = useTranslation();

  return (
    <>
      <SidebarItem
        icon={NetworkIcon}
        label={t("Network")}
        to="/network"
        className="p-3 dark:text-dark-grayscale-100"
      />
      <SidebarItem
        icon={VideoIcon}
        label={t("camera config")}
        to="/config"
        className="p-3 dark:text-dark-grayscale-100"
      />

      <SidebarItem
        icon={TimeSyncIcon}
        label={t("Time Sync")}
        to="/timesync"
        className="p-3 dark:text-dark-grayscale-100"
      />
    </>
  );
};

export default SettingsAccordion;

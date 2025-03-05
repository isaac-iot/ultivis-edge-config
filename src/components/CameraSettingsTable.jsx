import React from "react";
import CustomDataItem from "./CustomDataItem";
import { useTranslation } from "@ultivis/library";

const CameraSettingsTable = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div className="border rounded-lg p-2 shadow-md">
      {data && Object.entries(data).length > 0 ? (
        Object.entries(data).map(([cameraId, cameraData]) => (
          <CustomDataItem key={cameraId} id={cameraId} data={cameraData} />
        ))
      ) : (
        <p className="text-center text-gray-500">
          {t(`No cameras available.`)}
        </p>
      )}
    </div>
  );
};

export default CameraSettingsTable;

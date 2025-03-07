import React from "react";
import CustomDataItem from "./CustomDataItem";
import { useTranslation } from "@ultivis/library";

const CameraSettings = ({ data }) => {
  const { t } = useTranslation();
  return (
    <>
      {data && Object.entries(data).length > 0 ? (
        Object.entries(data).map(([cameraId, cameraData]) => (
          <CustomDataItem key={cameraId} id={cameraId} data={cameraData} />
        ))
      ) : (
        <p className="text-center text-gray-500">{t(`no cameras available`)}</p>
      )}
    </>
  );
};

export default CameraSettings;

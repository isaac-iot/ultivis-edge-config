import React, { useState, useCallback } from "react";
import CustomDataItem from "./CustomDataItem";

const CameraSettingsTable = ({ name, data }) => {
  console.log("CameraSettingsTable - Received Data:", data); // 확인용

  // 데이터 리스트를 상태로 관리
  const [cameraList, setCameraList] = useState(
    Object.entries(data || {}).map(([key, value]) => ({
      id: key,
      ...(value ?? {
        label: "",
        protocol: "",
        url: "",
        roi: { enable: false, type: "", points: [] },
      }),
    }))
  );

  // 특정 카메라 데이터를 업데이트하는 함수
  const updateCameraData = useCallback((index, updatedData) => {
    setCameraList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updatedData } : item))
    );
    console.log("업데이트된 cameraList:", cameraList);
  }, []);

  return (
    <div className="border rounded-lg p-2 shadow-md">
      {cameraList.length === 0 ? (
        <p className="text-center text-gray-500">No cameras available.</p>
      ) : (
        cameraList.map((camera, index) => (
          <CustomDataItem
            key={camera.id}
            data={camera}
            index={index}
            onUpdate={updateCameraData}
          />
        ))
      )}
    </div>
  );
};

export default CameraSettingsTable;

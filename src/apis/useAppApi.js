import { useMemo } from "react";

const appProxyTarget = import.meta.env.VITE_APP_PROXY
  ? `http://${import.meta.env.VITE_APP_PROXY}/api`
  : "http://localhost:8000/api"; // 기본값 설정

// fast-api 백엔드 API
export const useAppApi = () => {
  const prefix = "/api"; // fast api 공통 prefix

  const apiMethods = useMemo(
    () => ({
      getCameraSettings: async () => {
        try {
          const response = await fetch(`${appProxyTarget}/config/cameras`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          throw error;
        }
      },
      getROIImage: async (streamId) => {
        try {
          const response = await fetch(
            `${appProxyTarget}/config/roi?camera_id=${streamId}`
          );
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

          const blob = await response.blob();
          return URL.createObjectURL(blob); // 이미지 URL 반환
        } catch (error) {
          console.error("Failed to load ROI image:", error);
          return null;
        }
      },
      getStream: async (cameraId, url, protocol) => {
        try {
          const requestData = {
            [cameraId]: {
              url: url,
              protocol: protocol,
            },
          };

          const response = await fetch(`${appProxyTarget}/config/get_stream`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error("Error fetching stream:", error);
          throw error;
        }
      },

      closeStream: async () => {
        try {
          const response = await fetch(
            `${appProxyTarget}/config/close_stream`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error("Error closing stream:", error);
          throw error;
        }
      },

      updateCamera: async (cameraId, requestData) => {
        try {
          const response = await fetch(
            `${appProxyTarget}/config/cameras/${cameraId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error("Error closing stream:", error);
          throw error;
        }
      },
    }),
    []
  );

  return apiMethods;
};

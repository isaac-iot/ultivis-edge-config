import { useMemo } from 'react';

const appProxyTarget = import.meta.env.VITE_APP_PROXY ? `http://${import.meta.env.VITE_APP_PROXY}/api` : 'http://localhost:8000/api'; // 기본값 설정

// fast-api 백엔드 API
export const useAppApi = () => {
  const prefix = '/api'; // fast api 공통 prefix

  const apiMethods = useMemo(
    () => ({
      getModelList: async () => {
        try {
          const response = await fetch(`${appProxyTarget}/config/service`, {
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
      updateModels: async (selectedList) => {
        try {
          const requestData = {
            selected: selectedList,
          };

          const response = await fetch(
            `${appProxyTarget}/config/service/update`,
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
          console.error("Error fetching stream:", error);
          throw error;
        }
      },
      getCameraSettings: async () => {
        try {
          const response = await fetch(`${appProxyTarget}/config/cameras`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
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
      getROIImage: async (cameraId, url, refresh = false) => {
        try {
          const requestData = {
            camera_id: cameraId,
            url: url,
            refresh: refresh,
          };

          const response = await fetch(`${appProxyTarget}/hls/roi`, {
            method: "POST",

            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          const blob = await response.blob();
          return URL.createObjectURL(blob); // 이미지 URL 반환
        } catch (error) {
          console.error('Failed to load ROI image:', error);
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
          const response = await fetch(`${appProxyTarget}/hls/get_stream`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error('Error fetching stream:', error);
          throw error;
        }
      },

      closeStream: async () => {
        try {
          const response = await fetch(`${appProxyTarget}/hls/close_stream`, {
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
          console.error('Error closing stream:', error);
          throw error;
        }
      },

      updateCamera: async (cameraId, requestData) => {
        try {
          const response = await fetch(`${appProxyTarget}/config/cameras/${cameraId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error('Error closing stream:', error);
          throw error;
        }
      },

      // 네트워크 설정 가져오기
      getNetworkConfig: async () => {
        try {
          const response = await fetch(`${appProxyTarget}/network`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
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

      // 네트워크 설정 업데이트
      updateNetworkConfig: async (data) => {
        try {
          const response = await fetch(`${appProxyTarget}/network`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          throw error;
        }
      },

      // 시간 동기화 설정 가져오기
      getTimeSyncConfig: async () => {
        try {
          const response = await fetch(`${appProxyTarget}/time-sync`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
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

      // 시간 동기화 설정 업데이트
      updateTimeSyncConfig: async (data) => {
        try {
          const response = await fetch(`${appProxyTarget}/time-sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          throw error;
        }
      },

      // 즉시 시간 동기화
      syncTimeNow: async () => {
        try {
          const response = await fetch(`${appProxyTarget}/time-sync/sync-now`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
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
    }),
    []
  );

  return apiMethods;
};

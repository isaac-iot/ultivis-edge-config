import { useMemo } from 'react';

const appProxyTarget = import.meta.env.VITE_APP_PROXY ? `http://${import.meta.env.VITE_APP_PROXY}/api` : 'http://localhost:8000/api';

export const useAppApi = () => {
  const apiMethods = useMemo(
    () => ({
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

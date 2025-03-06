import { useMemo } from 'react';

const appProxyTarget = import.meta.env.VITE_APP_PROXY ? `http://${import.meta.env.VITE_APP_PROXY}/api` : 'http://localhost:8000/api';

export const useAppApi = () => {
  const apiMethods = useMemo(
    () => ({
      // Network 관련 API
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

      // TimeSync 관련 API
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

import { z } from 'zod';

export const useTimeSyncSchema = () => {
  return z.object({
    timeSync: z.object({
      enabled: z.boolean().optional(),
      ntpServers: z.string().min(1, { message: 'NTP server is required' }),
      timezone: z.string().min(1, { message: 'Timezone is required' }),
      syncInterval: z.number().min(60, { message: 'Minimum sync interval is 60 seconds' }),
    }),
  });
};

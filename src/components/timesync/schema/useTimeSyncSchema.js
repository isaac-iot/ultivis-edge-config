import { z } from 'zod';

export const useTimeSyncSchema = () => {
  return z.object({
    timeSync: z.object({
      enabled: z.boolean(),
      ntpServers: z.array(z.string().min(1, { message: 'NTP server is required' })).min(1, { message: 'At least one NTP server is required' }),
      timezone: z.string().min(1, { message: 'Timezone is required' }),
    }),
  });
};

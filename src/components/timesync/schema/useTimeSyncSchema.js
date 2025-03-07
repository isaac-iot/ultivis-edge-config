import { z } from 'zod';

export const useTimeSyncSchema = () => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  return z.object({
    timeSync: z.object({
      enabled: z.boolean(),
      servers: z
        .array(
          z
            .string()
            .min(1, { message: 'NTP server is required' })
            .refine((value) => ipv4Regex.test(value) || domainRegex.test(value), {
              message: 'Invalid format. Please enter a valid IPv4 address (ex: 000.000.000.000) or domain name (ex: ntp.ubuntu.com)',
            })
        )
        .min(1, { message: 'At least one NTP server is required' }),
    }),
  });
};

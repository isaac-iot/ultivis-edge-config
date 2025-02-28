import { z } from 'zod';
import { useTranslation } from '@ultivis/library';

export const useConfigurationSchema = () => {
  const { t } = useTranslation();

  // IP 주소 유효성 검사용 정규식
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // Zod를 통한 IPv4 유효성 검사 함수
  const ipSchema = () =>
    z.string().refine((val) => ipv4Regex.test(val), {
      message: t('Invalid IPv4 address'),
    });

  const subnetMaskSchema = () =>
    z.string().refine(
      (val) => {
        if (!val) return false;
        const num = Number(val);
        return !isNaN(num) && num >= 1 && num <= 32;
      },
      {
        message: t('Subnet mask must be numeric number between 1 and 32'),
      }
    );

  const configurationSchema = z.object({
    network: z.object({
      ipaddr: ipSchema(),
      subnet_mask: subnetMaskSchema(),
      gateway: ipSchema(),
      dns: ipSchema(),
    }),
  });

  return configurationSchema;
};

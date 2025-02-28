import { z } from "zod";
import { useTranslation } from "react-i18next";

export const useConfigurationSchema = () => {
  const { t } = useTranslation();

  // IP 주소 유효성 검사용 정규식
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // Zod를 통한 IPv4 유효성 검사 함수
  const ipSchema = () =>
    z.string().refine((val) => ipv4Regex.test(val), {
      message: t("Invalid IPv4 address"),
    });

  // URL 유효성 검사
  const urlSchema = () => z.string().url({ message: t("Invalid URL format") });

  // IPv4, RTSP, 또는 URL 중 하나일 수 있음
  const ipOrUrl = () => z.union([ipSchema(), urlSchema()]);

  const numericStringSchema = () =>
    z.string().refine((val) => !isNaN(Number(val)), {
      message: t("Must be a numeric string"), // 오류 메시지
    });

  const configurationSchema = z.object({
    cameras: z.any(), // 어떤 값도 허용
  });

  return configurationSchema;
};

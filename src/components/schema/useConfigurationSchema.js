// useConfigurationSchema.js
import { useTranslation } from "@ultivis/library";
import { z } from "zod";

export const useConfigurationSchema = () => {
  const { t } = useTranslation();

  const configurationSchema = z
    .object({
      label: z.string().optional(),
      protocol: z.enum(["", "hls", "rtsp"]),
      url: z.string().optional(),
      active: z.boolean(),
      roi: z.object({
        enable: z.boolean(),
        type: z.string().optional(),
        points: z.array(z.array(z.number())).optional(),
      }),
    })
    .superRefine(({ url, protocol, roi }, ctx) => {
      // URL validation (already existing logic)
      if (protocol === "" && url !== "") {
        ctx.addIssue({
          path: ["url"],
          message: "URL must be empty when protocol is empty",
          code: z.ZodIssueCode.custom,
        });
      }

      if (protocol === "hls" && !/^https?:\/\//.test(url || "")) {
        ctx.addIssue({
          path: ["url"],
          message: "URL must be a valid HTTP/HTTPS URL",
          code: z.ZodIssueCode.custom,
        });
      }

      if (protocol === "rtsp" && !/^rtsp:\/\//.test(url || "")) {
        ctx.addIssue({
          path: ["url"],
          message: "URL must be a valid RTSP URL",
          code: z.ZodIssueCode.custom,
        });
      }

      // ROI validation: enable이 true일 때만 validate
      if (roi?.enable) {
        // type이 없거나 points가 빈 배열일 때 에러 발생
        if (!roi?.type || (roi?.points && roi?.points.length === 0)) {
          ctx.addIssue({
            path: ["roi"], // 에러 메시지를 'type' 필드에 추가
            message: "ROI type and area must be specified",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    });

  return configurationSchema; // Return schema
};

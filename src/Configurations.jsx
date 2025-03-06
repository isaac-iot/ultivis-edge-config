import { useSuspenseQuery } from "@tanstack/react-query";
import { StaticDashboard, useTranslation } from "@ultivis/library";
import { useAppApi } from "./apis/useAppApi";
import CameraSettingsTable from "./components/CameraSettingsTable";

const Configurations = () => {
  const { t } = useTranslation();
  const { getCameraSettings } = useAppApi();

  // API에서 데이터 가져오기
  const { data: config } = useSuspenseQuery({
    queryKey: ["config", "cameras"],
    queryFn: async () => {
      const response = await getCameraSettings();
      console.log("API 응답 데이터:", response); // 응답 데이터 확인
      return response;
    },
  });

  // 데이터가 없을 경우 기본값 설정
  const cameras = config || {}; // ✅ "config"를 사용하여 올바른 데이터 할당
  console.log("Configurations - Cameras Data:", cameras); // 확인용

  const widgets = [
    {
      title: t("Cameras"),
      content: <CameraSettingsTable name="cameras" data={cameras} />,
      i: "a",
      x: 0,
      y: 0,
      w: 20,
      h: 20,
    },
  ];

  return <StaticDashboard widgets={widgets} />;
};

export default Configurations;

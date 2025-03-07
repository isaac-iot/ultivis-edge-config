import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  useTranslation,
} from "@ultivis/library";
import { useAppApi } from "./apis/useAppApi";
import ModelSettings from "./components/model/ModelSettings";
import CameraSettings from "./components/camera/CameraSettings";

//모델 선택카메라 선택
const CameraConfig = () => {
  const { t } = useTranslation();
  const { getCameraSettings, getModelList } = useAppApi();

  // API에서 데이터 가져오기
  const { data: config } = useSuspenseQuery({
    queryKey: ["config", "cameras"],
    queryFn: async () => {
      const response = await getCameraSettings();
      console.log("📡 Camera API 응답 데이터:", response);
      return response;
    },
  });

  const { data: models = { service_list: [] } } = useSuspenseQuery({
    queryKey: ["service_list"],
    queryFn: async () => {
      const response = await getModelList();
      console.log("Model API 응답 데이터:", response);
      return response;
    },
  });

  const cameras = config || {}; // "config"를 사용하여 올바른 데이터 할당

  return (
    <Accordion
      type="multiple"
      className="flex flex-col rounded-xl  text-grayscale-100 shadow-sm  dark:text-dark-grayscale-100 react-grid-item react-resizable space-y-3"
    >
      <AccordionItem
        value="model-settings"
        className="border bg-grayscale-1000 font-bold dark:bg-dark-bg-333 dark:border-dark-grayscale-500  border-grayscale-700 rounded-lg"
      >
        <AccordionTrigger className="p-6 text-lg font-bold">
          {t("model selection")}
        </AccordionTrigger>

        <AccordionContent className="">
          <ModelSettings data={models} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="camera-settings"
        className="border bg-grayscale-1000 font-bold dark:bg-dark-bg-333 dark:border-dark-grayscale-500  border-grayscale-700 rounded-lg"
      >
        <AccordionTrigger className="p-6 text-lg font-bold">
          {t("camera settings")}
        </AccordionTrigger>

        <AccordionContent>
          <CameraSettings name="cameras" data={cameras} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CameraConfig;

import { useState } from "react";
import {
  Input,
  Label,
  Button,
  Switch,
  ArrowDownIcon,
  useTranslation,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  Form,
  useToast,
} from "@ultivis/library";
import { useAppApi } from "../apis/useAppApi";
import CustomDialog from "./CustomDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import VideoModal from "./VideoModal";
import { useConfigurationSchema } from "./schema/useConfigurationSchema";

const protocolOptions = [
  { name: "HLS", value: "hls" },
  { name: "RTSP", value: "rtsp" },
  { name: "None", value: "none" },
];

const CustomDataItem = ({ id, data }) => {
  const { t } = useTranslation();
  const { updateCamera } = useAppApi();

  const configSchema = useConfigurationSchema();
  const { toast } = useToast();

  const [isCollapse, setIsCollapse] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  //  데이터가 null일 경우 최초 입력 시 기본값 적용
  const defaultData = data ?? {
    label: "",
    protocol: "",
    url: "",
    active: false,
    roi: { enable: false, type: "", points: [] },
  };

  //  react-hook-form 적용
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(configSchema),
    defaultValues: defaultData,
    mode: "onBlur",
  });

  const protocol = watch("protocol");
  const url = watch("url");
  const roi = watch("roi"); // Watch roi object

  const onSubmit = async (formData) => {
    if (!formData) {
      toast({
        title: t(`Error! No data to save.`),
        duration: 3000,
        variant: "destructive",
      });
    }
    try {
      const response = await updateCamera(id, formData); // Use updateCamera function to submit data
      toast({
        title: t(`Settings updated successfully!`),
        duration: 3000,
        variant: "success",
      });
      setIsCollapse(false);
    } catch (error) {
      toast({
        title: t(`Error updating settings`),
        duration: 3000,
        variant: "destructive",
      });
      console.error("Error updating settings:", error);
    }
  };

  // 필드 변경 시 상태 업데이트
  // ROI 값 업데이트 방식 수정
  const updateROIField = (updatedROI) => {
    setValue("roi", updatedROI); // ⬅ "roi" 키 없이 전체 객체 업데이트
  };
  return (
    <Form>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 box-border flex items-center justify-between rounded-lg border border-grayscale-600 px-4 py-2.5 dark:border-dark-grayscale-400">
          <div className="flex h-9 w-full items-center">
            <Switch
              {...register("active")}
              checked={watch("active")}
              onCheckedChange={(checked) => setValue("active", checked)}
            />

            <p className="w-full mx-2 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-grayscale-100 dark:text-dark-grayscale-100">
              {id}
            </p>
            <Button
              title={t("expand")}
              size="icon"
              type="button"
              variant="ghost"
              className={`mx-1 h-9 text-grayscale-300 transition duration-300 ease-in-out ${
                isCollapse ? "rotate-180" : "rotate-0"
              }`}
              onClick={() => setIsCollapse(!isCollapse)}
            >
              <ArrowDownIcon className="dark:text-dark-grayscale-200" />
            </Button>
          </div>
        </div>
        {/* ---------------------------- DataDetail ---------------------------- */}
        {isCollapse && (
          <>
            <div className="mx-2 mt-[5px] bg-[#fbfbfc] text-xs dark:bg-dark-bg-333">
              <fieldset className="mb-4 border p-4 text-sm dark:border-dark-grayscale-500">
                <div className="mb-4">
                  <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                    {t("label")}
                  </Label>
                  <Input {...register("label")} className="w-full p-2" />
                </div>
                <div className="flex items-start justify-between gap-x-4">
                  {/* Protocol 필드 */}
                  <div
                    className="flex flex-col justify-between h-[80px]"
                    style={{ flex: 2 }}
                  >
                    <Label className="mb-2 flex max-w-fit items-center font-semibold leading-2">
                      {t("protocol")}
                    </Label>
                    <Select
                      value={protocol || "none"}
                      onValueChange={(value) => {
                        setValue("protocol", value === "none" ? "" : value);
                        setValue("url", "");

                        if (errors.url) {
                          clearErrors("url");
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select Protocol")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {protocolOptions.map(({ name, value }) => (
                            <SelectItem key={value} value={value}>
                              {t(name)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* URL 필드 */}
                  <div
                    className="flex flex-col justify-between h-[80px]"
                    style={{ flex: 7 }}
                  >
                    <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                      {t("url")}
                    </Label>
                    <Input
                      {...register("url")}
                      disabled={protocol === ""}
                      className="w-full p-2"
                    />
                    <p className="text-red-500 text-sm min-h-[20px]">
                      {errors.url?.message || " "}
                    </p>{" "}
                    {/* 에러가 없을 때도 공간을 차지하게 만듦 */}
                  </div>

                  {/* Test 버튼 */}
                  <div className="flex flex-col justify-between h-[80px] mt-9">
                    <Button
                      type="button"
                      disabled={protocol === "" || url === "" || !!errors.url}
                      onClick={() => setIsVideoOpen(true)}
                    >
                      {t("check")}
                    </Button>
                    <VideoModal
                      id={id}
                      isOpen={isVideoOpen}
                      onClose={() => setIsVideoOpen(false)}
                      protocol={protocol}
                      url={url}
                    />
                  </div>
                </div>

                <fieldset
                  className="mt-1 border text-sm dark:border-dark-grayscale-500"
                  style={{ padding: "1rem 1rem 0.5rem 1rem" }}
                >
                  <legend className="text-gray-500 ">{t("ROI")}</legend>
                  <div className="flex h-9 w-full items-center">
                    <Switch
                      {...register("roi.enable")}
                      checked={watch("roi.enable")}
                      onCheckedChange={async (checked) => {
                        if (checked) {
                          if (
                            !roi?.type ||
                            (roi?.points && roi?.points.length === 0)
                          ) {
                            await trigger("roi");
                            setError("roi", {
                              type: "manual",
                              message: t(`ROI type and area must be specified`),
                            });

                            setTimeout(() => {
                              clearErrors("roi");
                            }, 3000);

                            return;
                          }
                        }
                        setValue("roi.enable", checked);
                      }}
                    />

                    <p className="w-full mx-2 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-grayscale-100 dark:text-dark-grayscale-100">
                      {t("roi")}
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsDialogOpen(true)}
                      disabled={protocol === "" || url === ""}
                    >
                      {t("configuration")}
                    </Button>

                    <CustomDialog
                      id={id}
                      isOpen={isDialogOpen}
                      onClose={() => setIsDialogOpen(false)}
                      data={watch("roi")}
                      url={url}
                      onUpdate={updateROIField}
                    />
                  </div>
                  <p className="text-red-500 text-sm min-h-[20px]">
                    {errors.roi?.message || " "}
                  </p>
                </fieldset>

                <div className="flex flex-row justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => reset(defaultData)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button variant="destructive" type="submit">
                    {t("save")}
                  </Button>
                </div>
              </fieldset>
            </div>
            {/* DataItem */}
          </>
        )}
      </form>
    </Form>
  );
};

export default CustomDataItem;

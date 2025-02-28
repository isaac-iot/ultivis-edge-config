import { useState } from "react";
import {
  Input,
  Label,
  Button,
  Switch,
  ArrowDownIcon,
  useDatapointActions,
  useTranslation,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@ultivis/library";
import CustomDialog from "./CustomDialog";

const CustomDataItem = ({ data, index, onUpdate }) => {
  const { t } = useTranslation();
  const [currentData, setCurrentData] = useState(data); // 개별 상태 관리
  const [isCollapse, setIsCollapse] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 취소 버튼을 누르면 원래 값으로 복원
  const handleCancel = () => {
    setCurrentData(data); // 초기 데이터로 복원
  };

  // 저장 버튼을 누르면 부모 컴포넌트에 변경 내용 전달
  const handleSave = () => {
    onUpdate(index, currentData);
  };

  // 필드 변경 시 상태 업데이트
  const onChangeField = (key, value) => {
    setCurrentData((prev) => ({
      ...prev,
      [key]: value,
    }));

    console.log(key, value);
  };

  console.log(currentData); // 변경된 데이터를 확인하기 위한 console.log

  // protocol 옵션
  const displayOptions = [
    { name: "HLS", value: "hls" },
    { name: "RTSP", value: "rtsp" },
    { name: "None", value: "none" },
  ];

  return (
    <>
      <div className="mb-2 box-border flex items-center justify-between rounded-lg border border-grayscale-600 px-4 py-2.5 dark:border-dark-grayscale-400">
        <div className="flex h-9 w-full items-center">
          <Switch
            checked={currentData.__active === true}
            onCheckedChange={(checked) => {
              onChangeField("__active", checked);
            }}
          />

          <p className="w-full mx-2 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-grayscale-100 dark:text-dark-grayscale-100">
            {currentData.id}
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
                <Input
                  className="w-full p-2"
                  type="text"
                  value={currentData.label ?? ""} // currentData를 참조
                  onChange={(e) => onChangeField("label", e.target.value)} // 값 변경 시 currentData 업데이트
                />
              </div>
              <div className="flex items-center justify-between gap-x-4">
                <div
                  className="flex flex-col justify-between"
                  style={{ flex: 2 }}
                >
                  <Label className="mb-2 flex max-w-fit items-center font-semibold leading-2">
                    {t("protocol")}
                  </Label>
                  <Select
                    value={currentData.protocol || "none"} // currentData를 참조
                    onValueChange={(value) =>
                      onChangeField("protocol", value === "none" ? "" : value)
                    } // 값 변경 시 currentData 업데이트
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select Protocol")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {displayOptions.map(({ name, value }) => (
                          <SelectItem key={value} value={value}>
                            {t(name)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div
                  className="flex flex-col justify-between"
                  style={{ flex: 7 }}
                >
                  <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                    {t("url")}
                  </Label>
                  <Input
                    type="text"
                    value={currentData.url ?? ""} // currentData를 참조
                    placeholder={t("")} // TODO: protocol에 따라 placeholder 변경 가능
                    onChange={(e) => onChangeField("url", e.target.value)} // 값 변경 시 currentData 업데이트
                  />
                </div>

                <div className="flex flex-col justify-between mt-6">
                  <Button type="button" onClick={() => setIsDialogOpen(true)}>
                    {t("test")}
                  </Button>
                </div>
              </div>

              <fieldset className="mt-4 border p-4 text-sm dark:border-dark-grayscale-500">
                <legend className="text-gray-500 ">{t("ROI")}</legend>

                <div className="flex h-9 w-full items-center">
                  <Switch
                    checked={currentData.roi.enable === true}
                    onCheckedChange={(checked) => {
                      onChangeField("roi", {
                        ...currentData.roi,
                        enable: checked,
                      });
                    }}
                  />

                  <p className="w-full mx-2 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-grayscale-100 dark:text-dark-grayscale-100">
                    {t("roi")}
                  </p>
                  <Button type="button" onClick={() => setIsDialogOpen(true)}>
                    {t("configuration")}
                  </Button>

                  <CustomDialog
                    id={currentData.id}
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    data={currentData.roi} // roi 데이터를 전달
                    onUpdate={onChangeField} // ROI 업데이트 처리
                  />
                </div>
              </fieldset>
              <div className="flex flex-row justify-end space-x-4 pt-6">
                <Button variant="destructive" onClick={handleCancel}>
                  {t("cancel")}
                </Button>
                <Button variant="destructive" onClick={handleSave}>
                  {t("save")}
                </Button>
              </div>
            </fieldset>
          </div>
          {/* DataItem */}
        </>
      )}
    </>
  );
};

export default CustomDataItem;

import React, { useState, useEffect } from "react";
import {
  useTranslation,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  Loading,
} from "@ultivis/library";
import { useAppApi } from "../apis/useAppApi";
import ImageEditor from "./ImageEditor";

const CustomDialog = ({ id, isOpen, onClose, data, url, onUpdate }) => {
  const { t } = useTranslation();
  const { getROIImage } = useAppApi();
  const [imageSrc, setImageSrc] = useState(null);
  const [currentData, setCurrentData] = useState(data); // 상태 관리, 초기값은 data
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // 다이얼로그가 열릴 때만 ROI 이미지를 로드
    if (isOpen && url) {
      setLoading(true);
      getROIImage(id, url, refresh)
        .then((src) => {
          setImageSrc(src);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      setCurrentData(data);
    }
  }, [isOpen, id, url, data, refresh]);

  // protocol 옵션
  const displayOptions = [
    { name: "line", value: "line" },
    { name: "rectangle", value: "rectangle" },
    { name: "polygon", value: "polygon" },
    { name: "None", value: "none" },
  ];

  // 취소 버튼 클릭 시 원래 데이터로 복원
  const handleCancel = () => {
    setCurrentData(data);
    onClose();
  };

  // 저장 버튼 클릭 시 업데이트
  const handleSave = () => {
    onUpdate(currentData);
    onClose();
  };

  // 새로 고침 버튼 클릭 시
  const handleRefresh = () => {
    setImageSrc(null); // 이미지 초기화
    setRefresh(!refresh); // refresh 필드를 true로 설정
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[45rem]">
        <DialogHeader>
          <DialogTitle>{t(`ROI Configuration`)} </DialogTitle>
          <div className="px-4">
            <p className="text-gray-500 text-m italic">
              {t(`please click the refresh button`)}
            </p>{" "}
            <div className="flex justify-end w-full">
              <Button type="button" onClick={handleRefresh}>
                {t("refresh")}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* ROI Form */}
        <div className=" w-full overflow-hidden min-h-[20em]">
          {loading ? (
            <Loading />
          ) : imageSrc ? (
            <div className="p-4 flex flex-col space-y-4 relative">
              {/* ROI Type 선택 */}
              <div className="flex flex-col space-y-2 z-10">
                <div className="flex flex-1 flex-col justify-between">
                  <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                    {t("type")}
                  </Label>
                  <Select
                    value={currentData.type || "none"}
                    onValueChange={(e) => {
                      setCurrentData((prev) => ({
                        ...prev,
                        type: e === "none" ? "" : e,
                        points: e !== prev.type ? [] : prev.points,
                      }));
                    }}
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

                {/* ROI Points */}
                <div className="mt-4 hidden">
                  <Label>{t("points")}</Label>
                  <Input
                    type="text"
                    value={JSON.stringify(currentData.points)}
                  />
                </div>
              </div>
              {/* ROI 이미지 편집기 */}
              <ImageEditor
                imageSrc={imageSrc}
                data={currentData}
                onUpdate={setCurrentData}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500 text-m">
              {t(`no ROI image available`)}
            </p>
          )}
        </div>

        {/* Footer 버튼 */}
        <DialogFooter>
          <Button variant="destructive" type="button" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button variant="primary" type="button" onClick={handleSave}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;

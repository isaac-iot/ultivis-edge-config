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
} from "@ultivis/library";
import { useAppApi } from "../apis/useAppApi";
import ImageEditor from "./ImageEditor";

const CustomDialog = ({ id, isOpen, onClose, data, onUpdate }) => {
  const { t } = useTranslation();
  const { getROIImage } = useAppApi();
  const [imageSrc, setImageSrc] = useState(null);
  const [currentData, setCurrentData] = useState(data); // 상태 관리, 초기값은 data

  useEffect(() => {
    // 다이얼로그가 열릴 때만 ROI 이미지를 로드
    if (isOpen) {
      getROIImage(id).then((src) => setImageSrc(src));
      setCurrentData(data);
    }
  }, [isOpen, id, data]); // data가 변경되면 currentData를 갱신

  // protocol 옵션
  const displayOptions = [
    { name: "line", value: "line" },
    { name: "rectangle", value: "rectangle" },
    { name: "polygon", value: "polygon" },
    { name: "None", value: "none" },
  ];

  // ROI type 변경 처리
  const handleTypeChange = (value) => {
    setCurrentData({
      ...currentData,
      type: value === "none" ? "" : value,
    });
  };

  // Points 값 변경 처리
  const handlePointsChange = (value) => {
    try {
      debugger;
      const parsedPoints = JSON.parse(value);
      setCurrentData({
        ...currentData,
        points: parsedPoints,
      });
    } catch (error) {
      console.error("Invalid JSON format for Points");
    }
  };

  // 취소 버튼 클릭 시 원래 데이터로 복원
  const handleCancel = () => {
    setCurrentData(data); // 원본 data로 상태 복원
    onClose(); // 다이얼로그 닫기
  };

  // 저장 버튼 클릭 시 업데이트
  const handleSave = () => {
    onUpdate("roi", currentData); // 수정된 currentData를 부모에게 전달
    onClose(); // 다이얼로그 닫기
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[45rem]">
        <DialogHeader>
          <DialogTitle>ROI Configuration</DialogTitle>
        </DialogHeader>

        {/* ROI Form */}
        <div className="p-4 flex flex-col space-y-4 relative">
          {/* ROI 이미지 */}
          {imageSrc ? (
            <ImageEditor
              imageSrc={imageSrc}
              data={currentData}
              onUpdate={setCurrentData}
            />
          ) : (
            <p className="text-gray-500">No ROI image available.</p>
          )}

          {/* ROI Type */}
          <div className="flex flex-col space-y-2 z-10">
            <div className="flex flex-1 flex-col justify-between">
              <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                {t("type")}
              </Label>
              <Select
                value={currentData.type || "none"} // currentData 사용
                onValueChange={(e) => {
                  setCurrentData((prev) => ({
                    ...prev,
                    type: e === "none" ? "" : e,
                    points: e !== prev.type ? [] : prev.points,
                  }));
                }} // 값 변경 시 currentData 업데이트
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
            <div className="mt-4">
              <Label>{t("points")}</Label>
              <Input
                type="text"
                value={JSON.stringify(currentData.points)} // currentData 사용
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="destructive" onClick={handleCancel}>
            {t("cancel")}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;

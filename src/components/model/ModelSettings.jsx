import React, { useState, useEffect } from "react";
import {
  useTranslation,
  RadioGroup,
  RadioGroupItem,
  Button,
  useToast,
} from "@ultivis/library";
import { useAppApi } from "../../apis/useAppApi";

const ModelSettings = ({ data }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedList, setSelectedList] = useState([]);

  const { updateModels } = useAppApi();

  // 초기 선택 값 설정 (is_active가 true인 항목 선택)
  useEffect(() => {
    const activeServices = data.service_list
      .filter((service) => service.is_active)
      .map((service) => service.name);

    if (activeServices.length > 0) {
      setSelectedList([activeServices[0]]); // 현재는 단일 선택만 유지
    }
  }, [data]);

  // 선택 변경
  const handleSelect = (newValue) => {
    setSelectedList([newValue]); // 단일 선택
  };

  // 저장
  const handleSave = async () => {
    // todo
    if (selectedList.length === 0) {
      toast({
        title: t(`no model selected`),
        duration: 3000,
        variant: "",
      });
      return;
    }

    try {
      await updateModels(selectedList); // 리스트 형태로 전달
      toast({
        title: t(`updated successfully`),
        duration: 3000,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t(`failed to save`),
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  // 취소 (선택 초기화)
  const handleCancel = () => {
    setSelectedList([]);
  };

  return (
    <div>
      <RadioGroup
        className="flex flex-col rounded px-4 py-2.5"
        value={selectedList[0] || ""} // 현재는 단일 선택
        onValueChange={handleSelect}
      >
        {data.service_list.map((service) => (
          <div
            key={service.name}
            className="flex items-center space-x-3 border p-4 text-m rounded border-grayscale-700 dark:border-dark-grayscale-500"
          >
            <RadioGroupItem value={service.name} id={service.name} />
            <label htmlFor={service.name} className="cursor-pointer">
              {t(service.name)}
            </label>
          </div>
        ))}
      </RadioGroup>
      <div className="flex flex-row justify-end space-x-4 p-4">
        <Button type="button" variant="destructive" onClick={handleCancel}>
          {t("cancel")}
        </Button>
        <Button type="button" variant="primary" onClick={handleSave}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default ModelSettings;

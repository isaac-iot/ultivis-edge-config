import React, { useState } from "react";
import {
  useTranslation,
  RadioGroup,
  RadioGroupItem,
  Button,
} from "@ultivis/library";
import { useAppApi } from "../../apis/useAppApi";

const ModelSettings = ({ data }) => {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState("");
  console.log(data);

  const { updateModels } = useAppApi();
  const handleSave = async () => {
    if (!selectedService) {
      console.warn("No model selected!");
      return;
    }

    try {
      await updateModels([selectedService]); // 리스트 형태로 전달
      console.log("✅ Model updated successfully:", selectedService);
    } catch (error) {
      console.error("❌ Error updating model:", error);
    }
  };

  return (
    <div className="rounded-lg p-4">
      <RadioGroup value={selectedService} onValueChange={setSelectedService}>
        {data.service_list.map((service) => (
          <div key={service.name} className="flex items-center space-x-2 p-2">
            <RadioGroupItem value={service.name} id={service.name} />
            <label htmlFor={service.name} className="cursor-pointer">
              {t(service.name)}
            </label>
          </div>
        ))}
      </RadioGroup>
      <div className="flex flex-row justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="destructive"
          onClick={() => setSelectedService("")}
        >
          {t("cancel")}
        </Button>
        <Button type="button" variant="destructive" onClick={handleSave}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default ModelSettings;

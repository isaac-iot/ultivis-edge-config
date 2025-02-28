import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  QuestionTooltip,
} from "@components";
import { useTranslation } from "@hooks";
import {
  chartDisplayOptions,
  chartTypeOptions,
  // yAxisPositionOptions,
} from "@data";
/**
 * A component for displaying and editing the details of various data types (e.g., datapoints, alarms).
 * Provides input fields, range settings, and chart configuration options depending on the data type.
 *
 * @param {Object} props - The component props.
 * @param {'datapoints'|'alarms'|'events'|'links'} props.dataType - The type of data to display and configure.
 * @param {Object} props.data - The data object containing information and configurations.
 * @param {boolean} props.isChart - Determines if chart-related settings should be displayed.
 * @param {function} props.onChangeField - Callback function triggered when a field value is changed.
 * @param {function} props.onSaveDefault - Callback function to save the current settings as default.
 *
 * @returns {JSX.Element} A detailed editor for the specified data type.
 *
 * @example
 * <DataDetail
 *   dataType="datapoints"
 *   data={dataPoint}
 *   isChart={true}
 *   onChangeField={(field, value) => console.log(field, value)}
 *   onSaveDefault={() => console.log('Save as default')}
 * />
 */
const DataDetail = ({
  dataType,
  data,
  isChart,
  onChangeField,
  onSaveDefault,
}) => {
  const { t } = useTranslation();
  const getNameByValue = (options, value) => {
    const option = options.find((option) => option.value === value);
    return option?.name ?? options[0].name;
  };
  if (dataType !== "datapoints") {
    return (
      <>
        <div className="mx-2 mt-[5px] bg-[#fbfbfc] text-xs dark:bg-dark-bg-333">
          <div className="data-point-details plt">
            <ul className="mb-4">
              <li className="mx-2 flex items-center justify-between">
                <Label className="text-gray-500 font-semibold">
                  {t("source")}
                </Label>
                <span>{data.__original.name}</span>
              </li>
              <li className="mx-2 flex items-center justify-between pb-1 pt-1">
                <Label className="text-gray-500 font-semibold">
                  {t("type")}
                </Label>
                <span>{data.__original.type}</span>
              </li>
              {/* NOTE 애플리케이션 탭의 알람 config의 경우 해당 옵션 추가 */}
              {/* {true && (
                  <fieldset className="mb-4 border p-4 text-sm dark:border-dark-grayscale-500">
                    <legend className="text-gray-500 ">
                      {t('alarm detail')}
                    </legend>
                    <div className="mb-4 flex gap-x-4">
                      <div className="w-full">
                        <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                          {t('title')}
                        </Label>
                        <Input
                          className="w-full p-2"
                          type="text"
                          value={data.title ?? ''}
                          onChange={(e) => onChangeField('title', e.target.value)}
                        />
                      </div>
                      <div className="w-full">
                        <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                          {t('description')}
                        </Label>
                        <Textarea
                          className="w-full p-2"
                          type="text"
                          value={data.description ?? ''}
                          onChange={(e) =>
                            onChangeField('description', e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-4 flex gap-x-4">
                      <div className="w-full">
                        <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                          {t('evacuationLocation')}
                        </Label>
                        <Input
                          className="w-full p-2"
                          type="text"
                          value={data.evacuationLocation ?? ''}
                          onChange={(e) =>
                            onChangeField('evacuationLocation', e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full">
                        <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                          {t('contactNumber')}
                        </Label>
                        <Input
                          className="w-full p-2"
                          type="text"
                          value={data.contactNumber ?? ''}
                          onChange={(e) =>
                            onChangeField('contactNumber', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </fieldset>
                )} */}
            </ul>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className={`mt-[5px] rounded-lg bg-[#fbfbfc] px-2 py-2 text-xs dark:bg-dark-bg-333`}
        >
          <div className="data-point-details plt">
            <ul className="mb-4">
              <li className="mx-2 flex items-center justify-between">
                <Label className="text-gray-500 font-semibold">
                  {t("source")}
                </Label>
                <span>{data.__original.name}</span>
              </li>
              <li className="mx-2 flex items-center justify-between pb-1 pt-1">
                <Label className="text-gray-500 font-semibold">
                  {t("fragment")} &gt; {t("series")}
                </Label>
                <span>
                  {data.__original.fragment} &gt; {data.series}
                </span>
              </li>
            </ul>
          </div>
          <fieldset className="mb-4 border p-4 text-sm dark:border-dark-grayscale-500">
            <legend className="text-gray-500 ">{t("data point")}</legend>
            <div className="mb-4">
              <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                {t("label")}
              </Label>
              <Input
                className="w-full p-2"
                type="text"
                value={data.label ?? ""}
                onChange={(e) => onChangeField("label", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-x-4">
              <div className="flex flex-1 flex-col justify-between">
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("default unit")}
                </Label>
                <Input
                  type="text"
                  value={data.unit ?? ""}
                  onChange={(e) => onChangeField("unit", e.target.value)}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("target value")}
                  <QuestionTooltip
                    className="text-blue-500"
                    description={t("expected target value for data point")}
                  />
                </Label>
                <Input
                  type="number"
                  value={data.target ?? ""}
                  placeholder={t("e.g. 50")}
                  onChange={(e) => onChangeField("target", e.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="mb-4 border p-4 text-sm dark:border-dark-grayscale-500">
            <legend className="text-gray-500 ">{t("range")}</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("min")}
                </Label>
                <Input
                  className="max-w-[100%] "
                  type="number"
                  value={data.min ?? ""}
                  placeholder={t("e.g. 0")}
                  onChange={(e) => onChangeField("min", e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("max")}
                </Label>
                <Input
                  className="max-w-[100%]"
                  type="number"
                  value={data.max ?? ""}
                  placeholder={t("e.g. 100")}
                  onChange={(e) => onChangeField("max", e.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="mb-4 border p-4 text-sm dark:border-dark-grayscale-500">
            <legend className="text-gray-500 ">{t("yellow range")}</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("min")}
                </Label>
                <Input
                  className="max-w-[100%]"
                  type="number"
                  value={data.yellowRangeMin ?? ""}
                  placeholder={t("e.g. 25")}
                  onChange={(e) =>
                    onChangeField("yellowRangeMin", e.target.value)
                  }
                />
              </div>
              <div>
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("max")}
                </Label>
                <Input
                  className="max-w-[100%]"
                  type="number"
                  value={data.yellowRangeMax ?? ""}
                  placeholder={t("e.g. 50")}
                  onChange={(e) =>
                    onChangeField("yellowRangeMax", e.target.value)
                  }
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="mb-4 border p-4 text-sm dark:border-dark-grayscale-500">
            <legend className="text-gray-500 ">{t("red range")}</legend>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("min")}
                </Label>
                <Input
                  className="max-w-[100%]"
                  type="number"
                  value={data.redRangeMin ?? ""}
                  placeholder={t("e.g. 50")}
                  onChange={(e) => onChangeField("redRangeMin", e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                  {t("max")}
                </Label>
                <Input
                  className="max-w-[100%]"
                  type="number"
                  value={data.redRangeMax ?? ""}
                  placeholder={t("e.g. 75")}
                  onChange={(e) => onChangeField("redRangeMax", e.target.value)}
                />
              </div>
            </div>
          </fieldset>
          {isChart && (
            <fieldset className="mb-4 border p-4 text-sm dark:border-dark-grayscale-500">
              <legend className="text-gray-500 ">{t("range")}</legend>
              <div className={`grid grid-cols-2 gap-4`}>
                <div>
                  <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                    {t("display")}
                    <QuestionTooltip
                      className="text-blue-500"
                      description={t("value displayed when data is aggregated")}
                    />
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      onChangeField("renderType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          getNameByValue(chartDisplayOptions, data.renderType)
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {chartDisplayOptions.map(({ name, value }) => (
                          <SelectItem key={value} value={value}>
                            {t(name)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                    {t("chart type")}
                  </Label>
                  <Select
                    value={data.lineType ?? "line"}
                    onValueChange={(value) => onChangeField("lineType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.keys(chartTypeOptions).map((option) => (
                          <SelectItem
                            key={chartTypeOptions[option]}
                            value={chartTypeOptions[option]}
                          >
                            {t(chartTypeOptions[option])}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {/*
                    <div>
                      <Label className="mb-2 flex max-w-fit items-center font-semibold leading-5">
                        {t('y axis')}
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          onChangeField('yAxisType', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              getNameByValue(yAxisPositionOptions, data.yAxisType)
                            )}
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {yAxisPositionOptions.map(({ name, value }) => (
                              <SelectItem key={value} value={value}>
                                {t(name)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div> */}
              </div>
            </fieldset>
          )}
          <div className="my-4 pt-2">
            <Button
              title={t("use settings as default")}
              className="dlt-c8y-icon-save h-5 rounded-full"
              variant="outline"
              type="button"
              onClick={onSaveDefault}
            >
              <span className="ml-1 text-xs">{t("save as default")}</span>
            </Button>
            <QuestionTooltip
              className="text-blue-500"
              description={t(
                "if you select the current settings as default, these values will be used whenever this data point is added to a data explorer or in existing threshold smart rules which refer to this data point"
              )}
            />
          </div>
        </div>
      </>
    );
  }
};
export default DataDetail;

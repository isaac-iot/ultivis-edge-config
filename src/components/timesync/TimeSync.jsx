import { useForm } from 'react-hook-form';
import { Button, Form, FormInputField, FormSelectField, useCustomMutation, useTranslation } from '@ultivis/library';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTimeSyncSchema } from './schema/useTimeSyncSchema';
import { timezones } from './timezones';
const TimeSync = () => {
  const { t } = useTranslation();
  const timeSyncSchema = useTimeSyncSchema();

  // Form
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      timeSync: {
        enabled: false,
        ntpServers: '',
        timezone: 'Asia/Seoul',
        syncInterval: 1,
      },
    },
    resolver: zodResolver(timeSyncSchema),
  });

  const { control } = methods;

  // API
  const postTimeSyncConfiguration = async (config) => {
    const result = await axios
      .post('/api/time-sync', { ...config })
      .then((res) => res)
      .catch((err) => err);
    return result;
  };

  const mutate = useCustomMutation({
    mutationFn: (data) => postTimeSyncConfiguration(data),
    queryKey: ['configuration', 'timeSync'],
    successMessage: () => `Success to save the configuration`,
    errorMessage: () => `Failed to save the configuration`,
  });

  // Handle save Submit
  const handleSubmit = (data) => {
    const isConfirmed = window.confirm(t('Changing the time settings will affect system operations. Do you want to continue?'));
    if (isConfirmed) {
      mutate(data);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="pl-3 pr-5 w-full h-full pb-10 relative tablet:pb-15">
          <div className="p-4 bg-grayscale-1000 rounded-xl dark:bg-dark-bg-333 space-y-2">
            {/* NTP Server */}
            <FormInputField label={t('NTP Server')} placeholder="ntp.example.com" type="text" control={control} name="timeSync.ntpServers" />
            {/* Timezone */}
            <FormSelectField label={t('Timezone')} control={control} name="timeSync.timezone" options={timezones} />
            {/* Sync Interval */}
            <FormInputField label={t('Sync Interval (minute)')} placeholder="3600" type="number" control={control} name="timeSync.syncInterval" min={1} />
            {/* Save button */}
            <div className="flex justify-end">
              <Button type="submit" className="mt-6">
                {t('Save')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TimeSync;

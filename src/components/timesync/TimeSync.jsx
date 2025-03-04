import { useForm } from 'react-hook-form';
import { Button, Form, FormInputField, useCustomMutation, useTranslation } from '@ultivis/library';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTimeSyncSchema } from './schema/useTimeSyncSchema';
import { useEffect } from 'react';

const TimeSync = () => {
  const { t } = useTranslation();
  const timeSyncSchema = useTimeSyncSchema();

  // Form 기본 설정
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      timeSync: {
        enabled: true,
        ntpServers: [],
        timezone: 'Asia/Seoul',
      },
    },
    resolver: zodResolver(timeSyncSchema),
  });

  const { control } = methods;

  // 시간 동기화 설정 가져오기
  const { data, isError, error, isSuccess } = useQuery({
    queryKey: ['configuration', 'timeSync'],
    queryFn: async () => {
      const result = await axios.get('/api/configuration/time-sync');
      return result.data;
    },
    retry: false,
  });

  // 시간 동기화 설정 저장
  // TODO : 시간 동기화 api 구현 후 주소 설정
  const postTimeSyncConfig = useCustomMutation({
    queryKey: ['configuration', 'timeSync'],
    mutationFn: async (data) => {
      const result = await axios.post('/api/configuration/time-sync', { ...data });
      return result.data;
    },
    successMessage: () => 'Success to save configuration',
    errorMessage: () => 'Failed to save configuration',
  });

  // 저장 버튼으로 시간 동기화 설정 저장
  const handleSubmit = (data) => {
    const isConfirmed = window.confirm(t('Changing the time settings will affect system operations. Do you want to continue?'));
    if (isConfirmed) {
      postTimeSyncConfig(data);
    }
  };

  useEffect(() => {
    if (data) {
      methods.reset({ timeSync: data });
    }
  }, [data, methods]);

  // NTP 서버 추가
  const handleAddServer = () => {
    const currentServers = methods.getValues('timeSync.ntpServers') || [];
    methods.setValue('timeSync.ntpServers', [...currentServers, '']);
  };

  // NTP 서버 삭제
  const handleRemoveServer = (index) => {
    const currentServers = methods.getValues('timeSync.ntpServers') || [];
    methods.setValue(
      'timeSync.ntpServers',
      currentServers.filter((_, i) => i !== index)
    );
  };

  const disableAddButton = methods.watch('timeSync.ntpServers').length <= 1;

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="pl-3 pr-5 w-full h-full pb-10 relative tablet:pb-15">
          <div className="p-4 bg-grayscale-1000 rounded-xl dark:bg-dark-bg-333 space-y-2">
            {/* NTP 서버 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('NTP Servers')}</label>

              {/* 서버 입력 필드들 */}
              {methods.watch('timeSync.ntpServers')?.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <div className="w-full">
                    <FormInputField clearable={true} control={control} name={`timeSync.ntpServers.${index}`} placeholder="ntp.example.com" type="text" className="w-full h-10" />
                  </div>
                  <Button disabled={disableAddButton} type="button" className="shrink-0" variant="secondary" onClick={() => handleRemoveServer(index)}>
                    {t('Remove')}
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              {/* 서버 추가 버튼 */}
              <Button type="button" variant="secondary" onClick={handleAddServer} disabled={methods.watch('timeSync.ntpServers')?.some((server) => !server)}>
                {t('Add NTP Server')}
              </Button>
              {/* 저장 버튼*/}
              <Button type="submit">{t('Save')}</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TimeSync;

import { useForm } from 'react-hook-form';
import { Button, Form, FormInputField, useCustomMutation, useTranslation } from '@ultivis/library';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTimeSyncSchema } from './schema/useTimeSyncSchema';
import { useEffect, useState } from 'react';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { useAppApi } from '../../apis/useAppApi';

const TimeSync = () => {
  const { t } = useTranslation();
  const timeSyncSchema = useTimeSyncSchema();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const { getTimeSyncConfig, updateTimeSyncConfig, syncTimeNow } = useAppApi();

  // Form 기본 설정
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      timeSync: {
        enabled: true,
        servers: ['ntp.ubuntu.com'],
      },
    },
    resolver: zodResolver(timeSyncSchema),
  });

  const { control } = methods;
  const servers = methods.watch('timeSync.servers');

  // 시간 동기화 설정 가져오기
  const { data: getTimeSyncData } = useQuery({
    queryKey: ['configuration', 'timeSync'],
    queryFn: getTimeSyncConfig,
    retry: false,
    onSuccess: (data) => {
      const formattedDate = formatDistanceToNow(parseISO(data.lastUpdated), { addSuffix: false });
      setLastSyncTime(formattedDate);
    },
  });

  const canSync = getTimeSyncData?.servers?.length > 0;

  // 시간 동기화 설정 저장
  const postTimeSyncConfig = useCustomMutation({
    queryKey: ['configuration', 'timeSync'],
    mutationFn: updateTimeSyncConfig,
    successMessage: () => 'Success to save configuration',
    errorMessage: () => 'Failed to save configuration',
  });

  // 저장 버튼으로 시간 동기화 설정 저장
  const handleSubmit = (data) => {
    const isConfirmed = window.confirm(t('Changing the settings will affect system operations. Do you want to continue?'));
    if (isConfirmed) {
      postTimeSyncConfig(data);
    }
  };

  // 즉시 동기화 버튼 클릭 시
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const result = await syncTimeNow();
      const formattedDate = formatDistanceToNow(parseISO(result.lastUpdated), { addSuffix: false });
      setLastSyncTime(formattedDate);
    } catch (error) {
      setLastSyncTime('Failed to sync time');
    }
    setIsSyncing(false);
  };

  // NTP 서버 추가
  const handleAddServer = () => {
    const currentServers = methods.getValues('timeSync.servers') || [];
    methods.setValue('timeSync.servers', [...currentServers, '']);
  };

  // NTP 서버 삭제
  const handleRemoveServer = (index) => {
    const currentServers = methods.getValues('timeSync.servers') || [];
    methods.setValue(
      'timeSync.servers',
      currentServers.filter((_, i) => i !== index)
    );
  };

  // NTP 서버 입력 폼이 1개일 때 삭제 버튼 비활성화
  const disableButton = methods.getValues('timeSync.servers').length <= 1;

  useEffect(() => {
    if (getTimeSyncData) {
      methods.reset({ timeSync: getTimeSyncData });
    }
  }, [getTimeSyncData, methods]);

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="pl-3 pr-5 w-full h-full pb-10 relative tablet:pb-15">
          <div className="p-4 bg-grayscale-1000 rounded-xl dark:bg-dark-bg-333 space-y-10">
            {/* 동기화 상태 및 제어 섹션 */}
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('Synchronization Status')}</p>
                <p className="text-grayscale-300 dark:text-dark-grayscale-300">
                  {!canSync
                    ? t('Please configure NTP servers first')
                    : t('Last manual sync: {{time}}', {
                        time: lastSyncTime || t('Not synced yet'),
                      })}
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="secondary" onClick={handleSyncNow} disabled={isSyncing || !canSync}>
                  {isSyncing ? t('Syncing...') : t('Sync Now')}
                </Button>
              </div>
            </div>

            {/* NTP 서버 입력 필드 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('NTP Servers')}</label>
              {servers.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-grow">
                    <FormInputField clearable={true} control={control} name={`timeSync.servers.${index}`} placeholder="ntp.ubuntu.com" type="text" className="w-full" />
                  </div>
                  <Button type="button" disabled={disableButton} className="shrink-0 h-14" variant="secondary" onClick={() => handleRemoveServer(index)}>
                    {t('Remove')}
                  </Button>
                </div>
              ))}
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end gap-x-2">
              {/* NTP 서버 추가 버튼 */}
              <Button type="button" variant="secondary" onClick={handleAddServer}>
                {t('Add NTP Server')}
              </Button>
              <Button type="submit">{t('Save')}</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TimeSync;

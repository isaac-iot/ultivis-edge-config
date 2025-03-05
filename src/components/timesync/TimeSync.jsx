import { useForm } from 'react-hook-form';
import { Button, Form, FormInputField, FormSelectField, Toast, useCustomMutation, useTranslation } from '@ultivis/library';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useTimeSyncSchema } from './schema/useTimeSyncSchema';
import { useEffect, useState } from 'react';
import { TIME_SYNC_INTERVALS } from './constants';
import { parseISO, formatDistanceToNow } from 'date-fns';

const TimeSync = () => {
  const { t } = useTranslation();
  const timeSyncSchema = useTimeSyncSchema();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Form 기본 설정
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      timeSync: {
        enabled: true,
        interval: TIME_SYNC_INTERVALS['1024 seconds'],
        servers: [''],
      },
    },
    resolver: zodResolver(timeSyncSchema),
  });

  const { control } = methods;
  const servers = methods.watch('timeSync.servers');

  // 시간 동기화 설정 가져오기
  const { data: getTimeSyncConfig } = useQuery({
    queryKey: ['configuration', 'timeSync'],
    queryFn: async () => {
      const result = await axios.get('/api/time-sync');
      return result.data;
    },
    retry: false,
    onSuccess: (data) => {
      const formattedDate = formatDistanceToNow(parseISO(data.lastUpdated), { addSuffix: false });
      setLastSyncTime(formattedDate); // 마지막 동기화 시간
    },
  });

  const canSync = getTimeSyncConfig?.servers?.length > 0;

  // 시간 동기화 설정 저장
  const postTimeSyncConfig = useCustomMutation({
    queryKey: ['configuration', 'timeSync'],
    mutationFn: async (data) => {
      const result = await axios.post('/api/time-sync', { ...data });
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

  // 즉시 동기화 버튼 클릭 시
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const result = await axios.post('/api/time-sync/sync-now');
      if (result.status === 200) {
        const formattedDate = formatDistanceToNow(parseISO(result.data.lastUpdated), { addSuffix: false });
        setLastSyncTime(formattedDate);
      }
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
    if (getTimeSyncConfig) {
      methods.reset({ timeSync: getTimeSyncConfig });
    }
  }, [getTimeSyncConfig, methods]);

  // 시간 포맷 변환
  const formatLastSync = (isoDate) => {
    if (!isoDate) return t('Never');

    try {
      return t('{{time}} ago', {
        time: formatDistanceToNow(parseISO(isoDate), { addSuffix: false }),
      });
    } catch (error) {
      return t('Failed to sync time');
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="pl-3 pr-5 w-full h-full pb-10 relative tablet:pb-15">
          <div className="p-4 bg-grayscale-1000 rounded-xl dark:bg-dark-bg-333 space-y-3">
            {/* 동기화 상태 및 제어 섹션 */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('Synchronization Status')}</p>
                <p className="text-grayscale-300 dark:text-dark-grayscale-300">
                  {t('Last synced')}: {formatLastSync(lastSyncTime)}
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="secondary" onClick={handleSyncNow} disabled={isSyncing}>
                  {isSyncing ? t('Syncing...') : t('Sync Now')}
                </Button>
              </div>
            </div>

            {/* NTP 서버 입력 필드 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('NTP Servers')}</label>
              {servers.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-grow">
                    <FormInputField clearable={true} control={control} name={`timeSync.servers.${index}`} placeholder="ntp.example.com" type="text" className="w-full" />
                  </div>
                  <Button type="button" disabled={disableButton} className="shrink-0 h-14" variant="secondary" onClick={() => handleRemoveServer(index)}>
                    {t('Remove')}
                  </Button>
                </div>
              ))}
              {/* NTP 서버 추가 버튼 */}
              <div className="flex justify-end">
                <Button type="button" variant="secondary" onClick={handleAddServer}>
                  {t('Add NTP Server')}
                </Button>
              </div>
            </div>

            {/* 인터벌 설정 (2의 거듭제곱 2^n 이며 n만 설정) */}
            <FormSelectField control={control} name="timeSync.interval" label={t('Time Sync Interval')} options={TIME_SYNC_INTERVALS} />

            {/* 저장 버튼 */}
            <div className="flex justify-end">
              <Button type="submit">{t('Save')}</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TimeSync;

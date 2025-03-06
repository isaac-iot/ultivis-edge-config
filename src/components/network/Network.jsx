import { useForm } from 'react-hook-form';
import { Button, Form, FormInputField, useCustomMutation, useTranslation } from '@ultivis/library';
import { useQuery } from '@tanstack/react-query';
import { useConfigurationSchema } from './schema/useConfigurationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useApi } from '../../apis/useAppApi';

const Network = () => {
  const { t } = useTranslation();
  const configurationSchema = useConfigurationSchema();
  const { getNetworkConfig, updateNetworkConfig } = useApi();

  // Form 기본 설정
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      network: {
        ipaddr: '',
        subnet_mask: '',
        gateway: '',
        dns: '',
      },
    },
    resolver: zodResolver(configurationSchema),
  });

  const { control } = methods;

  // 네트워크 설정 가져오기
  const { data, isError, error, isSuccess } = useQuery({
    queryKey: ['configuration', 'network'],
    queryFn: getNetworkConfig,
    retry: false,
  });

  // 네트워크 설정 가져오기 결과 메시지 표시
  const getMessage = () => {
    if (isSuccess) return t('Success to get network configuration');
    if (isError && error?.response) {
      const status = error.response.status;

      if (status === 404) return t('Network configuration not found');
      if (status === 500) return t('Interval server error');
    }
  };

  // 네트워크 설정 저장
  const postNetworkConfig = useCustomMutation({
    queryKey: ['configuration', 'network'],
    mutationFn: updateNetworkConfig,
    successMessage: () => `Success to save configuration`,
    errorMessage: () => `Failed to save configuration`,
  });

  // 저장 버튼으로 네트워크 설정 저장
  const handleSubmit = (data) => {
    const isConfirmed = window.confirm(t('Changing the settings will restart the device. Do you want to continue?'));
    if (isConfirmed) {
      postNetworkConfig(data);
    }
  };

  useEffect(() => {
    if (data) {
      methods.reset({ network: data });
    }
  }, [data, methods]);

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="pl-3 pr-5 w-full h-full pb-10 relative tablet:pb-15">
          <div className="p-4 bg-grayscale-1000 rounded-xl dark:bg-dark-bg-333 space-y-2">
            {/* 네트워크 설정 인풋 */}
            {<p className={isSuccess ? 'text-green-500' : `text-red-500`}>{getMessage()}</p>}
            <FormInputField label={t('IP Address')} placeholder="192.168.0.111" type="text" control={control} name="network.ipaddr" />
            <FormInputField label={t('Subnet mask')} placeholder="24" type="text" control={control} name="network.subnet_mask" />
            <FormInputField label={t('Gateway')} placeholder="192.168.0.1" type="text" control={control} name="network.gateway" />
            <FormInputField label={t('DNS')} placeholder="8.8.8.8" type="text" control={control} name="network.dns" />
            {/* 저장 버튼 */}
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

export default Network;

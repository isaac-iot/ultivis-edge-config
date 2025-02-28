import { useForm } from 'react-hook-form';
import { Button, Form, FormInputField, useCustomMutation, useTranslation } from '@ultivis/library';
import { useConfigurationSchema } from './schema/useConfigurationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const Network = () => {
  const { t } = useTranslation();
  const configurationSchema = useConfigurationSchema();

  // Form
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

  // API
  const postNetworkConfiguration = async (config) => {
    const result = await axios
      .post('/api/network', { ...config })
      .then((res) => res)
      .catch((err) => err);
    return result;
  };

  const mutate = useCustomMutation({
    mutationFn: (data) => postNetworkConfiguration(data),
    queryKey: ['configuration', 'network'],
    successMessage: () => `Success to save configuration`,
    errorMessage: () => `Failed to save configuration`,
  });

  // Handle save Submit
  const handleSubmit = (data) => {
    const isConfirmed = window.confirm(t('Changing the settings will restart the device. Do you want to continue?'));
    if (isConfirmed) {
      mutate(data);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="pl-3 pr-5 w-full h-full pb-10 relative tablet:pb-15">
          <div className="p-4 bg-grayscale-1000 rounded-xl dark:bg-dark-bg-333 space-y-2">
            {/* INPUT */}
            <FormInputField label={t('IP Address')} placeholder="192.168.0.111" type="text" control={control} name="network.ipaddr" />
            <FormInputField label={t('Subnet mask')} placeholder="24" type="text" control={control} name="network.subnet_mask" />
            <FormInputField label={t('Gateway')} placeholder="192.168.0.1" type="text" control={control} name="network.gateway" />
            <FormInputField label={t('DNS')} placeholder="8.8.8.8" type="text" control={control} name="network.dns" />
            {/* SAVE BUTTON */}
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

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation, useToast, Button } from '@ultivis/library';

const TedgeConfig = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [configTypes, setConfigTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [configContent, setConfigContent] = useState('');

  // 렌더링 시 설정 타입 목록 가져오기
  useEffect(() => {
    const getConfigTypes = async () => {
      try {
        const response = await axios.get('/api/tedge/configuration');
        setConfigTypes(response.data);
        if (response.data.length > 0) {
          setSelectedType(response.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getConfigTypes();
  }, []);

  // 설정 스냅샷 요청
  const handleConfigSnapshot = async () => {
    try {
      const response = await axios.post('/api/tedge/cmd', {
        cmdType: 'config_snapshot',
        requestID: Date.now().toString(),
        payload: {
          status: 'init',
          type: selectedType,
        },
      });

      if (response.data.tedgeUrl) {
        const contentResponse = await axios.get(response.data.tedgeUrl);
        setConfigContent(contentResponse.data);
      }
    } catch (error) {
      console.error('설정 스냅샷을 가져오는데 실패했습니다:', error);
    }
  };

  // 설정 업데이트
  const handleConfigUpdate = async () => {
    try {
      await axios.post('/api/tedge/cmd', {
        cmdType: 'config_update',
        requestID: Date.now().toString(),
        payload: {
          status: 'init',
          type: selectedType,
          configContent: configContent,
        },
      });
    } catch (error) {
      console.error('설정 업데이트에 실패했습니다:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{t('Tedge Configuration')}</h1>

      <div className="mb-4">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="border p-2 rounded">
          {configTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Config Content */}
      <textarea value={configContent} onChange={(e) => setConfigContent(e.target.value)} className="w-full h-64 border p-2 rounded text-black" />

      {/* Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={handleConfigSnapshot} className="bg-green-500 text-grayscale-1000 px-4 py-2 rounded">
          {t('Request Config Snapshot')}
        </Button>
        <Button onClick={handleConfigUpdate} className="bg-primary text-grayscale-1000 px-4 py-2 rounded">
          {t('Update Config')}
        </Button>
      </div>
    </div>
  );
};

export default TedgeConfig;

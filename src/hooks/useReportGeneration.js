import { useState } from 'react';
import { ReportApi } from '../api/reportApi.js';
import { FileService } from '../services/fileService.js';

export const useReportGeneration = () => {
  const [status, setStatus] = useState('idle');

  const generateReport = async (customParams = {}) => {
    setStatus('loading');

    try {
      const blob = await ReportApi.generateReport(customParams);
      FileService.downloadBlob(blob);
      setStatus('success');
    } catch (error) {
      console.error('Ошибка при генерации отчёта:', error);
      setStatus('error');
    }
  };

  const reset = () => setStatus('idle');

  return {
    status,
    generateReport,
    reset,
  };
};

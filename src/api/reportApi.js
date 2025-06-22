import { createApiUrl } from './config.js';
import { getReportParams, getFileParams } from '../config/generationConfig.js';

export class ReportApi {
  static async generateReport(customParams = {}) {
    const defaultParams = getReportParams();
    const params = { ...defaultParams, ...customParams };
    const fileParams = getFileParams();

    const url = createApiUrl(
      `/report?size=${params.size}&withErrors=${params.withErrors}&maxSpend=${params.maxSpend}`,
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'text/csv, application/csv, */*',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Ответ не содержит данных');
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'text/csv' });

    if (blob.size === 0) {
      throw new Error('Получен пустой файл от сервера');
    }

    return blob;
  }
}

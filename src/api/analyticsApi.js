import { createApiUrl } from './config.js';
import { getAnalyticsParams } from '../config/generationConfig.js';

export class AnalyticsApi {
  static async uploadFile(file, customRows = null) {
    const defaultParams = getAnalyticsParams();
    const rows = customRows || defaultParams.rows;

    const url = createApiUrl(`/aggregate?rows=${rows}`);

    const form = new FormData();
    form.append('file_name', file);

    const response = await fetch(url, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  static async processStreamingResponse(response, onProgress) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalStats = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      lines.forEach((line) => {
        try {
          const partial = JSON.parse(line);
          onProgress(partial);
          finalStats = partial;
        } catch {
          // ignore
        }
      });
    }

    if (buffer.trim()) {
      try {
        const finalData = JSON.parse(buffer);
        onProgress(finalData);
        finalStats = finalData;
      } catch {
        // ignore
      }
    }

    return finalStats;
  }
}

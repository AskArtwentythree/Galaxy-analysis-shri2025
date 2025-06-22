import { getFileParams } from '../config/generationConfig.js';

export class FileService {
  static downloadBlob(blob, filename = null) {
    const fileParams = getFileParams();
    const finalFilename = filename || fileParams.defaultReportName;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static validateCsvFile(file) {
    const fileParams = getFileParams();

    if (!file) {
      throw new Error('Файл не выбран');
    }

    const isValidType = fileParams.acceptedTypes.some((type) =>
      file.name.toLowerCase().endsWith(type),
    );

    if (!isValidType) {
      throw new Error(
        `Пожалуйста, выберите файл с расширением: ${fileParams.acceptedTypes.join(', ')}`,
      );
    }

    return true;
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

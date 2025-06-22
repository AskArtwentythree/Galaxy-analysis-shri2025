import { useState, useCallback } from 'react';
import { FileService } from '../services/fileService.js';

export const useFileUpload = (onFileSelect, onFileError) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) {
      setIsHovering(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsHovering(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsHovering(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        try {
          FileService.validateCsvFile(file);
          onFileSelect(file);
        } catch (error) {
          console.error('Ошибка валидации файла:', error);
          if (onFileError) {
            onFileError(file);
          }
        }
      }
    },
    [onFileSelect, onFileError],
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          FileService.validateCsvFile(file);
          onFileSelect(file);
        } catch (error) {
          console.error('Ошибка валидации файла:', error);
          if (onFileError) {
            onFileError(file);
          }
        }
      }
    },
    [onFileSelect, onFileError],
  );

  return {
    isHovering,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
  };
};

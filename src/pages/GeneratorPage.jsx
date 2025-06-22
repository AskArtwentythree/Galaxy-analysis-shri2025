import React from 'react';

import { useState } from 'react';
import styles from './GeneratorPage.module.css';

export default function GeneratorPage() {
  const [status, setStatus] = useState('idle');

  const handleGenerate = async () => {
    setStatus('loading');
    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      const url = `${apiBase}/report?size=0.1&withErrors=off&maxSpend=1000`;

      // console.log('API Base:', apiBase);
      // console.log('Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'text/csv, application/csv, */*',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      // console.log('Response status:', response.status);
      // console.log('Response ok:', response.ok);
      // console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      // console.log('Content-Type:', contentType);

      if (!response.body) {
        throw new Error('Ответ не содержит данных');
      }

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'text/csv' });

      // console.log('Blob size:', blob.size);
      // console.log('Blob type:', blob.type);

      if (blob.size === 0) {
        throw new Error('Получен пустой файл от сервера');
      }

      const url_download = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url_download;
      a.download = 'report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url_download);

      setStatus('success');
    } catch (err) {
      console.error('Ошибка при генерации отчёта:', err);
      setStatus('error');
    }
  };

  const reset = () => setStatus('idle');

  return (
    <div className={styles.container}>
      {status === 'idle' && (
        <section className={styles.content}>
          <p className={styles.text}>
            Сгенерируйте готовый csv-файл нажатием одной кнопки
          </p>
          <button className={styles.button} onClick={handleGenerate}>
            Начать генерацию
          </button>
        </section>
      )}

      {status === 'loading' && (
        <section className={`${styles.content} ${styles.loading}`}>
          <p className={styles.text}>Идёт процесс генерации...</p>
          <div className={styles.buttonPurple}>
            <img
              className={styles.spinner}
              src="/icons/loader.svg"
              alt="Загрузка"
            />
          </div>
        </section>
      )}

      {status === 'success' && (
        <section className={`${styles.content} ${styles.done}`}>
          <p className={styles.text}>Файл сгенерирован!</p>
          <div className={styles.buttons}>
            <button className={styles.buttonDone}>Done!</button>
            <button className={styles.buttonCancel} onClick={reset}>
              ✕
            </button>
          </div>
        </section>
      )}

      {status === 'error' && (
        <section className={`${styles.content} ${styles.error}`}>
          <p className={styles.text}>Упс, что-то пошло не так...</p>
          <div className={styles.buttons}>
            <button className={styles.buttonError}>Ошибка</button>
            <button className={styles.buttonCancel} onClick={reset}>
              ✕
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

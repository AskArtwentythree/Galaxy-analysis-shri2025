import React from 'react';
import { useReportGeneration } from '../hooks/useReportGeneration.js';
import styles from './GeneratorPage.module.css';

export default function GeneratorPage() {
  const { status, generateReport, reset } = useReportGeneration();

  const handleGenerate = () => {
    generateReport();
  };

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
          <p className={styles.text}>
            Сгенерируйте готовый csv-файл нажатием одной кнопки
          </p>
          <button className={styles.buttonPurple}>
            <img
              className={styles.loader}
              src="/icons/loader.svg"
              alt="loading"
            />
          </button>
          <p className={styles.text}>идёт процесс генерации</p>
        </section>
      )}

      {status === 'success' && (
        <section className={`${styles.content} ${styles.done}`}>
          <p className={styles.text}>
            Сгенерируйте готовый csv-файл нажатием одной кнопки
          </p>
          <div className={styles.buttons}>
            <button className={styles.buttonDone}>Done!</button>
            <button className={styles.buttonCancel} onClick={reset}>
              <img
                className={styles.icon}
                src="/icons/cancel.svg"
                alt="cancel"
              />
            </button>
          </div>
          <p className={styles.text}>файл сгенерирован!</p>
        </section>
      )}

      {status === 'error' && (
        <section className={`${styles.content} ${styles.error}`}>
          <p className={styles.text}>
            Сгенерируйте готовый csv-файл нажатием одной кнопки
          </p>
          <div className={styles.buttons}>
            <button className={styles.buttonError}>Ошибка</button>
            <button className={styles.buttonCancel} onClick={reset}>
              <img
                className={styles.icon}
                src="/icons/cancel.svg"
                alt="cancel"
              />
            </button>
          </div>
          <p className={styles.textError}>упс, не то...</p>
        </section>
      )}
    </div>
  );
}

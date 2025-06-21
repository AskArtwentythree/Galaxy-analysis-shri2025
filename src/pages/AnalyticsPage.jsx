import React, { useCallback, useState } from 'react';
import { useAnalyticsStore } from '../store/AnalyticsStore';
import styles from './AnalyticsPage.module.css';

export default function AnalyticsPage() {
  const {
    file,
    status,
    stats,
    setFile,
    reset,
    setLoading,
    setError,
    setStats,
    updateStats,
  } = useAnalyticsStore();

  const [isHovering, setIsHovering] = useState(false);

  const onFileChange = useCallback(
    (e) => {
      const f = e.target.files[0];
      if (f && f.name.endsWith('.csv')) {
        setFile(f);
      } else if (f) {
        setFile(f);
        setError();
      }
    },
    [setFile, setError],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsHovering(false);
      const f = e.dataTransfer.files[0];
      if (f?.name.endsWith('.csv')) {
        setFile(f);
      } else if (f) {
        setFile(f);
        setError();
      }
    },
    [setFile, setError],
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) {
      setIsHovering(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsHovering(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleUpload = useCallback(async () => {
    setLoading();
    const form = new FormData();
    form.append('file_name', file);
    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      const response = await fetch(`${apiBase}/aggregate?rows=10000`, {
        method: 'POST',
        body: form,
      });
      if (!response.ok) throw new Error(response.statusText);

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
            updateStats(partial);
            finalStats = partial;
          } catch {}
        });
      }

      if (buffer.trim()) {
        try {
          const finalData = JSON.parse(buffer);
          updateStats(finalData);
          finalStats = finalData;
        } catch {}
      }

      setStats(finalStats);

      const historyEntry = {
        id: Date.now(),
        fileName: file.name,
        uploadDate: new Date().toLocaleDateString('ru-RU'),
        status: 'success',
        stats: finalStats,
      };

      const existingHistory = JSON.parse(
        localStorage.getItem('uploadHistory') || '[]',
      );
      existingHistory.unshift(historyEntry);
      localStorage.setItem('uploadHistory', JSON.stringify(existingHistory));
    } catch (err) {
      console.error(err);
      setError();

      const historyEntry = {
        id: Date.now(),
        fileName: file.name,
        uploadDate: new Date().toLocaleDateString('ru-RU'),
        status: 'error',
      };

      const existingHistory = JSON.parse(
        localStorage.getItem('uploadHistory') || '[]',
      );
      existingHistory.unshift(historyEntry);
      localStorage.setItem('uploadHistory', JSON.stringify(existingHistory));
    }
  }, [file, setLoading, setError, setStats, updateStats]);

  const formatDayOfYear = useCallback((dayNumber) => {
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let remainingDays = dayNumber;
    let month = 0;

    while (remainingDays > daysInMonth[month]) {
      remainingDays -= daysInMonth[month];
      month++;
    }

    return `${remainingDays} ${months[month]}`;
  }, []);

  const getDisplayValue = useCallback(
    (key, value) => {
      if (key === 'less_spent_value' && stats?.less_spent_civ) {
        return stats.less_spent_civ;
      }

      if (key === 'less_spent_at' || key === 'big_spent_at') {
        return formatDayOfYear(parseInt(value));
      }

      return value;
    },
    [stats, formatDayOfYear],
  );

  const getFieldDescription = useCallback((key) => {
    const descriptions = {
      total_spend_galactic: 'общие расходы в галактических кредитах',
      rows_affected: 'количество обработанных записей',
      less_spent_at: 'день года с минимальными расходами',
      big_spent_civ: 'цивилизация с максимальными расходами',
      less_spent_civ: 'цивилизация с минимальными расходами',
      big_spent_at: 'день года с максимальными расходами',
      big_spent_value: 'максимальная сумма расходов за день',
      average_spend_galactic: 'средние расходы в галактических кредитах',
    };
    return descriptions[key] || key;
  }, []);

  const getFirstColumnData = useCallback(() => {
    if (!stats) return [];

    return [
      {
        key: 'total_spend_galactic',
        value: Math.round(stats.total_spend_galactic).toLocaleString(),
      },
      {
        key: 'rows_affected',
        value: Math.round(stats.rows_affected).toLocaleString(),
      },
      { key: 'less_spent_at', value: stats.less_spent_at },
      { key: 'big_spent_civ', value: stats.big_spent_civ },
    ];
  }, [stats]);

  const getSecondColumnData = useCallback(() => {
    if (!stats) return [];

    return [
      { key: 'less_spent_civ', value: stats.less_spent_civ },
      { key: 'big_spent_at', value: stats.big_spent_at },
      {
        key: 'big_spent_value',
        value: Math.round(stats.big_spent_value).toLocaleString(),
      },
      {
        key: 'average_spend_galactic',
        value: Math.round(stats.average_spend_galactic).toLocaleString(),
      },
    ];
  }, [stats]);

  const dropZoneStyle = {
    backgroundColor: isHovering
      ? 'rgba(212, 250, 230, 1)'
      : 'rgba(234, 205, 255, 1)',
    transition: 'background-color 0.2s ease',
  };

  const containerStyle = {
    minHeight: '100vh',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div
      className={styles.container}
      style={containerStyle}
      onDrop={onDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      {status === 'idle' && (
        <>
          <p style={{ marginBottom: '20px' }}>
            Загрузите csv файл и получите полную информацию о нём за сверхнизкое
            время
          </p>
          <section className={styles.uploadZone} style={dropZoneStyle}>
            <div className={styles.formUpload}>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={onFileChange}
                  className={styles.formUploadInput}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className={styles.fileInputLabel}>
                  Загрузить файл
                </label>
              </div>
              <p style={{ marginTop: '20px' }}>Или перетащите сюда</p>
            </div>
          </section>
        </>
      )}

      {status === 'ready' && (
        <>
          <p style={{ marginBottom: '20px' }}>
            Загрузите csv файл и получите полную информацию о нём за сверхнизкое
            время
          </p>
          <section className={styles.uploadReady}>
            <div className={styles.buttons}>
              <div
                className={
                  styles.contentButton + ' ' + styles.contentButtonPurple
                }
              >
                {file.name}
              </div>
              <div
                className={
                  styles.contentButton +
                  ' ' +
                  styles.contentButtonDark +
                  ' ' +
                  styles.contentButtonSmall
                }
                onClick={reset}
                style={{ cursor: 'pointer' }}
              >
                <img
                  className={styles.contentIcon}
                  src="/icons/cancel.svg"
                  alt="Отмена"
                />
              </div>
            </div>
            <p>Файл загружен!</p>
          </section>
          <button
            onClick={handleUpload}
            className={
              styles.formUploadSubmit + ' ' + styles.formUploadSubmitGreen
            }
          >
            Отправить
          </button>
        </>
      )}

      {status === 'loading' && (
        <>
          <p style={{ marginBottom: '20px' }}>
            Загрузите csv файл и получите полную информацию о нём за сверхнизкое
            время
          </p>
          <section className={styles.uploadLoading}>
            <div
              className={
                styles.contentButton + ' ' + styles.contentButtonPurple
              }
            >
              <img
                className={styles.spinner}
                src="/icons/loader.svg"
                alt="Загрузка"
              />
            </div>
            <p>Идёт парсинг файла</p>
          </section>
          {stats && (
            <section className={styles.statisticsWithData}>
              <div className={styles.statisticsCards}>
                {getFirstColumnData().map(({ key, value }) => (
                  <div
                    key={key}
                    className={
                      styles.statisticsCard + ' ' + styles.statisticsCardWhite
                    }
                  >
                    <p className={styles.statisticsNumber}>
                      {String(getDisplayValue(key, value))}
                    </p>
                    <p className={styles.statisticsDescription}>
                      {getFieldDescription(key)}
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.statisticsCards}>
                {getSecondColumnData().map(({ key, value }) => (
                  <div
                    key={key}
                    className={
                      styles.statisticsCard + ' ' + styles.statisticsCardWhite
                    }
                  >
                    <p className={styles.statisticsNumber}>
                      {String(getDisplayValue(key, value))}
                    </p>
                    <p className={styles.statisticsDescription}>
                      {getFieldDescription(key)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {status === 'done' && stats && (
        <>
          <p style={{ marginBottom: '20px' }}>
            Загрузите csv файл и получите полную информацию о нём за сверхнизкое
            время
          </p>
          <section className={styles.uploadDone}>
            <div className={styles.buttons}>
              <div
                className={
                  styles.contentButton + ' ' + styles.contentButtonGreenLight
                }
              >
                {file.name}
              </div>
              <div
                className={
                  styles.contentButton +
                  ' ' +
                  styles.contentButtonDark +
                  ' ' +
                  styles.contentButtonSmall
                }
                onClick={reset}
                style={{ cursor: 'pointer' }}
              >
                <img
                  className={styles.contentIcon}
                  src="/icons/cancel.svg"
                  alt="Отмена"
                />
              </div>
            </div>
            <p>Готово!</p>
          </section>

          <section className={styles.statisticsWithData}>
            <div className={styles.statisticsCards}>
              {getFirstColumnData().map(({ key, value }) => (
                <div
                  key={key}
                  className={
                    styles.statisticsCard + ' ' + styles.statisticsCardWhite
                  }
                >
                  <p className={styles.statisticsNumber}>
                    {String(getDisplayValue(key, value))}
                  </p>
                  <p className={styles.statisticsDescription}>
                    {getFieldDescription(key)}
                  </p>
                </div>
              ))}
            </div>
            <div className={styles.statisticsCards}>
              {getSecondColumnData().map(({ key, value }) => (
                <div
                  key={key}
                  className={
                    styles.statisticsCard + ' ' + styles.statisticsCardWhite
                  }
                >
                  <p className={styles.statisticsNumber}>
                    {String(getDisplayValue(key, value))}
                  </p>
                  <p className={styles.statisticsDescription}>
                    {getFieldDescription(key)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {status === 'error' && (
        <>
          <p style={{ marginBottom: '20px' }}>
            Загрузите csv файл и получите полную информацию о нём за сверхнизкое
            время
          </p>
          <section className={styles.uploadError}>
            <div className={styles.buttons}>
              <div
                className={
                  styles.contentButton + ' ' + styles.contentButtonOrange
                }
              >
                {file.name}
              </div>
              <div
                className={
                  styles.contentButton +
                  ' ' +
                  styles.contentButtonDark +
                  ' ' +
                  styles.contentButtonSmall
                }
                onClick={reset}
                style={{ cursor: 'pointer' }}
              >
                <img
                  className={styles.contentIcon}
                  src="/icons/cancel.svg"
                  alt="Отмена"
                />
              </div>
            </div>
            <p>упс, не то...</p>
          </section>
          <section className={styles.statistics}>
            <p className={styles.statisticsText}>Здесь появятся хайлайты</p>
          </section>
        </>
      )}

      {status === 'idle' && (
        <section className={styles.statistics}>
          <p className={styles.statisticsText}>Здесь появятся хайлайты</p>
        </section>
      )}
    </div>
  );
}

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useHistoryStore } from '../store/historyStore';
import styles from './HistoryPage.module.css';

function Modal({ stats, onClose }) {
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

  const getAllData = useCallback(() => {
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          ✕
        </button>
        <section className={styles.statistics}>
          <div className={styles.statistics__cards}>
            {getAllData().map(({ key, value }) => (
              <div
                key={key}
                className={
                  styles.statistics__card +
                  ' ' +
                  styles['statistics__card--purple']
                }
              >
                <p className={styles.statistics__number}>
                  {String(getDisplayValue(key, value))}
                </p>
                <p className={styles.statistics__description}>
                  {getFieldDescription(key)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, removeEntry, clearAll } = useHistoryStore();
  const [modalStats, setModalStats] = useState(null);

  const handleGenerateMore = () => {
    navigate('/generator');
  };

  const handleItemClick = (entry) => {
    if (entry.status === 'success' && entry.stats) {
      setModalStats(entry.stats);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    removeEntry(id);
  };

  return (
    <div className={styles.container}>
      <section className={styles.content}>
        <div className={styles.content__cards}>
          {history.length === 0 ? (
            <button
              onClick={handleGenerateMore}
              className={
                styles.content__button + ' ' + styles['content__button--green']
              }
            >
              Сгенерировать больше
            </button>
          ) : (
            <>
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className={`${styles.content__option} ${entry.status === 'error' ? styles.error : ''}`}
                  onClick={() => handleItemClick(entry)}
                >
                  <div className={styles.content__card}>
                    <div className={styles.content__item}>
                      <img
                        className={styles.content__icon}
                        src="/icons/file.svg"
                        alt="file"
                      />
                      <p>{entry.fileName}</p>
                    </div>
                    <time>{entry.uploadDate}</time>
                    <div
                      className={`${styles.content__item} ${entry.status === 'error' ? styles['content__item-notactive'] : ''}`}
                    >
                      <p>Обработан успешно</p>
                      <svg
                        width="33"
                        height="33"
                        viewBox="0 0 33 33"
                        fill="currentColor"
                      >
                        <path d="M16.3468 0.411621C13.1329 0.411621 9.99109 1.36467 7.31879 3.15024C4.64649 4.93581 2.56369 7.47372 1.33377 10.443C0.103843 13.4123 -0.217962 16.6796 0.409048 19.8318C1.03606 22.984 2.58372 25.8795 4.85632 28.1521C7.12893 30.4247 10.0244 31.9724 13.1766 32.5994C16.3288 33.2264 19.5961 32.9046 22.5654 31.6747C25.5347 30.4447 28.0726 28.3619 29.8582 25.6896C31.6438 23.0173 32.5968 19.8756 32.5968 16.6616C32.5923 12.3532 30.8787 8.22264 27.8323 5.17616C24.7858 2.12968 20.6552 0.416171 16.3468 0.411621ZM16.3468 30.4116C13.6273 30.4116 10.9689 29.6052 8.70772 28.0943C6.44654 26.5835 4.68417 24.436 3.64347 21.9235C2.60276 19.411 2.33046 16.6464 2.86101 13.9791C3.39156 11.3119 4.70112 8.86187 6.62409 6.9389C8.54706 5.01593 10.9971 3.70637 13.6643 3.17582C16.3316 2.64528 19.0962 2.91757 21.6087 3.95828C24.1212 4.99898 26.2686 6.76135 27.7795 9.02253C29.2904 11.2837 30.0968 13.9421 30.0968 16.6616C30.0927 20.3071 28.6427 23.802 26.065 26.3798C23.4872 28.9575 19.9923 30.4075 16.3468 30.4116ZM8.84681 13.5366C8.84681 13.1658 8.95677 12.8033 9.1628 12.4949C9.36883 12.1866 9.66167 11.9463 10.0043 11.8043C10.3469 11.6624 10.7239 11.6253 11.0876 11.6976C11.4513 11.77 11.7854 11.9486 12.0476 12.2108C12.3099 12.473 12.4884 12.8071 12.5608 13.1708C12.6331 13.5345 12.596 13.9115 12.4541 14.2542C12.3122 14.5968 12.0718 14.8896 11.7635 15.0956C11.4552 15.3017 11.0926 15.4116 10.7218 15.4116C10.2245 15.4116 9.74761 15.2141 9.39598 14.8624C9.04435 14.5108 8.84681 14.0339 8.84681 13.5366ZM23.8468 13.5366C23.8468 13.9075 23.7368 14.27 23.5308 14.5783C23.3248 14.8867 23.0319 15.127 22.6893 15.2689C22.3467 15.4108 21.9697 15.4479 21.606 15.3756C21.2423 15.3032 20.9082 15.1247 20.646 14.8624C20.3838 14.6002 20.2052 14.2661 20.1328 13.9024C20.0605 13.5387 20.0976 13.1617 20.2395 12.8191C20.3815 12.4765 20.6218 12.1836 20.9301 11.9776C21.2385 11.7716 21.601 11.6616 21.9718 11.6616C22.4691 11.6616 22.946 11.8592 23.2976 12.2108C23.6493 12.5624 23.8468 13.0393 23.8468 13.5366Z" />
                        <path d="M23.1704 19.5296C23.8423 19.7798 24.1924 20.5339 23.8435 21.1602C23.206 22.3042 22.3112 23.2918 21.2229 24.0409C19.7764 25.0366 18.0584 25.5626 16.3025 25.5475C14.5465 25.5325 12.8378 24.977 11.4086 23.9566C10.3334 23.189 9.45562 22.1862 8.83791 21.0314C8.49974 20.3992 8.86277 19.6512 9.53884 19.4126C10.2149 19.1739 10.9454 19.5396 11.3246 20.148C11.7366 20.8089 12.2766 21.3862 12.9172 21.8436C13.9123 22.5541 15.1021 22.9408 16.3248 22.9513C17.5474 22.9618 18.7436 22.5955 19.7508 21.9023C20.3992 21.4559 20.949 20.888 21.3723 20.2343C21.7619 19.6325 22.4985 19.2794 23.1704 19.5296Z" />
                      </svg>
                    </div>
                    <div
                      className={`${styles.content__item} ${entry.status === 'success' ? styles['content__item-notactive'] : ''}`}
                    >
                      <p>Не удалось обработать</p>
                      <svg
                        width="34"
                        height="33"
                        viewBox="0 0 34 33"
                        fill="currentColor"
                      >
                        <path d="M17 0.25C13.7861 0.25 10.6443 1.20305 7.97199 2.98862C5.29969 4.77419 3.21689 7.31209 1.98696 10.2814C0.757041 13.2507 0.435237 16.518 1.06225 19.6702C1.68926 22.8224 3.23692 25.7179 5.50952 27.9905C7.78213 30.2631 10.6776 31.8107 13.8298 32.4378C16.982 33.0648 20.2493 32.743 23.2186 31.513C26.1879 30.2831 28.7258 28.2003 30.5114 25.528C32.297 22.8557 33.25 19.7139 33.25 16.5C33.2455 12.1916 31.5319 8.06102 28.4855 5.01454C25.439 1.96806 21.3084 0.25455 17 0.25ZM17 30.25C14.2805 30.25 11.6221 29.4436 9.36092 27.9327C7.09974 26.4218 5.33737 24.2744 4.29666 21.7619C3.25596 19.2494 2.98366 16.4847 3.51421 13.8175C4.04476 11.1503 5.35432 8.70025 7.27729 6.77728C9.20026 4.85431 11.6503 3.54475 14.3175 3.0142C16.9848 2.48366 19.7494 2.75595 22.2619 3.79666C24.7744 4.83736 26.9218 6.59973 28.4327 8.86091C29.9436 11.1221 30.75 13.7805 30.75 16.5C30.7459 20.1455 29.2959 23.6404 26.7182 26.2182C24.1404 28.7959 20.6455 30.2459 17 30.25ZM9.50001 13.375C9.50001 13.0042 9.60997 12.6416 9.816 12.3333C10.022 12.025 10.3149 11.7846 10.6575 11.6427C11.0001 11.5008 11.3771 11.4637 11.7408 11.536C12.1045 11.6084 12.4386 11.787 12.7008 12.0492C12.9631 12.3114 13.1416 12.6455 13.214 13.0092C13.2863 13.3729 13.2492 13.7499 13.1073 14.0925C12.9654 14.4351 12.725 14.728 12.4167 14.934C12.1084 15.14 11.7458 15.25 11.375 15.25C10.8777 15.25 10.4008 15.0525 10.0492 14.7008C9.69755 14.3492 9.50001 13.8723 9.50001 13.375ZM24.5 13.375C24.5 13.7458 24.39 14.1084 24.184 14.4167C23.978 14.725 23.6851 14.9654 23.3425 15.1073C22.9999 15.2492 22.6229 15.2863 22.2592 15.214C21.8955 15.1416 21.5614 14.963 21.2992 14.7008C21.037 14.4386 20.8584 14.1045 20.786 13.7408C20.7137 13.3771 20.7508 13.0001 20.8927 12.6575C21.0346 12.3149 21.275 12.022 21.5833 11.816C21.8917 11.61 22.2542 11.5 22.625 11.5C23.1223 11.5 23.5992 11.6975 23.9508 12.0492C24.3025 12.4008 24.5 12.8777 24.5 13.375ZM24.3313 23.375C24.4217 23.5173 24.4824 23.6764 24.5098 23.8427C24.5372 24.0091 24.5306 24.1792 24.4905 24.343C24.4504 24.5067 24.3775 24.6607 24.2764 24.7955C24.1753 24.9304 24.0479 25.0434 23.9019 25.1278C23.756 25.2122 23.5944 25.2661 23.4271 25.2865C23.2597 25.3068 23.09 25.2931 22.9281 25.2461C22.7662 25.1991 22.6154 25.1199 22.4849 25.0131C22.3545 24.9064 22.2469 24.7744 22.1688 24.625C21.0016 22.6078 19.1672 21.5 17 21.5C14.8328 21.5 12.9984 22.6094 11.8313 24.625C11.7531 24.7744 11.6456 24.9064 11.5151 25.0131C11.3846 25.1199 11.2338 25.1991 11.0719 25.2461C10.91 25.2931 10.7403 25.3068 10.5729 25.2865C10.4056 25.2661 10.2441 25.2122 10.0981 25.1278C9.95214 25.0434 9.82476 24.9304 9.72361 24.7955C9.62247 24.6607 9.54965 24.5067 9.50954 24.343C9.46944 24.1792 9.46286 24.0091 9.49022 23.8427C9.51759 23.6764 9.57831 23.5173 9.66876 23.375C11.2766 20.5953 13.9484 19 17 19C20.0516 19 22.7234 20.5938 24.3313 23.375Z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    className={
                      styles.content__button +
                      ' ' +
                      styles['content__button--small'] +
                      ' ' +
                      styles['content__button--white']
                    }
                    onClick={(e) => handleDelete(e, entry.id)}
                  >
                    <img
                      className={styles.content__icon}
                      src="/icons/trashbag.svg"
                      alt="delete"
                    />
                  </button>
                </div>
              ))}

              <div
                className={styles.buttons}
                style={{ justifyContent: 'center' }}
              >
                <button
                  onClick={handleGenerateMore}
                  className={
                    styles.content__button +
                    ' ' +
                    styles['content__button--green']
                  }
                >
                  Сгенерировать больше
                </button>
                <button
                  onClick={clearAll}
                  className={
                    styles.content__button +
                    ' ' +
                    styles['content__button--dark']
                  }
                >
                  Очистить всё
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {modalStats &&
        createPortal(
          <Modal stats={modalStats} onClose={() => setModalStats(null)} />,
          document.body,
        )}
    </div>
  );
}

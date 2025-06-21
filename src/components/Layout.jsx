import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logos}>
          <img
            className={styles.logo}
            src="/images/logo_summer_yandex.svg"
            alt="Логотип"
          />
          <div className={styles.tag}>
            <p className={styles.text}>Межгалактическая аналитика</p>
          </div>
        </div>
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
              >
                <img
                  className={styles.icon}
                  src="/icons/image_upload.svg"
                  alt="CSV аналитика"
                />
                CSV аналитика
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/generator"
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
              >
                <img
                  className={styles.icon}
                  src="/icons/generator.svg"
                  alt="CSV Генератор"
                />
                CSV Генератор
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
              >
                <img
                  className={styles.icon}
                  src="/icons/history.svg"
                  alt="История"
                />
                История
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}

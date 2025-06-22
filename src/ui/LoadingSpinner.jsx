import React from 'react';
import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const spinnerClass = `${styles.spinner} ${styles[size]} ${className}`;

  return (
    <div className={styles.container}>
      <img className={spinnerClass} src="/icons/loader.svg" alt="Загрузка" />
    </div>
  );
};

import React from 'react';
import styles from './Button.module.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styles from './Button.module.scss';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;
export default function Button({ children, className = '', ...props }: ButtonProps) {
  return <button className={`${styles.button} ${className}`} {...props}>{children}</button>;
}

import type { PropsWithChildren } from 'react';
import styles from './Container.module.scss';

export default function Container({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}

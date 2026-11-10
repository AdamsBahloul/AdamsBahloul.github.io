import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './CustomCursor.module.scss';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!cursor || !finePointer.matches) return;

    document.documentElement.classList.add('has-custom-cursor');
    let overStack = false;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add(styles.visible);

      const target = event.target;
      const nextOverStack = target instanceof Element && Boolean(target.closest('[data-home-stack]'));
      if (nextOverStack !== overStack) {
        overStack = nextOverStack;
        cursor.classList.toggle(styles.overStack, overStack);
      }
    };
    const leaveWindow = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      cursor.classList.remove(styles.visible, styles.overStack);
      overStack = false;
    };

    document.addEventListener('pointermove', move);
    document.addEventListener('pointerout', leaveWindow);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerout', leaveWindow);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
    <ArrowUpRight className={styles.arrow} size={22} strokeWidth={2} />
  </div>;
}

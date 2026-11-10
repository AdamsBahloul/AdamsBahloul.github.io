import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './LoadingScreen.module.scss';

const MINIMUM_DISPLAY_MS = 650;
const FINAL_ROLL_MS = 560;

function waitForPageContent() {
  const main = document.getElementById('main-content');
  if (!main || main.childElementCount > 0) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (main.childElementCount > 0) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(main, { childList: true, subtree: true });
  });
}

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
}

function waitForImage(image: HTMLImageElement) {
  if (image.complete) return image.decode?.().catch(() => undefined) ?? Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => { void (image.decode?.().catch(() => undefined) ?? Promise.resolve()).then(() => resolve()); };
    image.addEventListener('load', done, { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const targetRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    let alive = true;
    let allReady = false;
    let isLeaving = false;
    let hiddenTimer = 0;
    targetRef.current = 6;
    const startedAt = performance.now();

    const progressTimer = window.setInterval(() => {
      if (!alive) return;
      const current = progressRef.current;
      const next = current >= targetRef.current
        ? current
        : Math.min(targetRef.current, current + Math.max(1, Math.ceil((targetRef.current - current) * 0.16)));
      progressRef.current = next;
      setProgress(next);
      if (next >= 100 && allReady && !isLeaving) {
        isLeaving = true;
        window.clearInterval(progressTimer);
        hiddenTimer = window.setTimeout(() => {
          if (!alive) return;
          setLeaving(true);
          hiddenTimer = window.setTimeout(() => {
            if (!alive) return;
            document.documentElement.dataset.loadingComplete = 'true';
            setVisible(false);
            window.dispatchEvent(new Event('portfolio:loading-complete'));
          }, 360);
        }, FINAL_ROLL_MS);
      }
    }, 26);

    const loadEverything = async () => {
      await waitForPageContent();
      if (!alive) return;
      targetRef.current = 18;

      const images = Array.from(document.images).filter((image) => {
        if (image.loading !== 'lazy') return true;
        const rect = image.getBoundingClientRect();
        return rect.bottom > -window.innerHeight && rect.top < window.innerHeight * 1.35;
      });
      const tasks = [
        Promise.resolve(document.fonts?.ready),
        waitForWindowLoad(),
        ...images.map(waitForImage),
      ];
      let finished = 0;
      const track = (task: Promise<unknown>) => task.catch(() => undefined).then(() => {
        if (!alive || allReady) return;
        finished += 1;
        targetRef.current = 18 + Math.floor((finished / tasks.length) * 78);
      });
      await Promise.all(tasks.map(track));
      if (!alive) return;
      allReady = true;
      targetRef.current = 98;
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      const remaining = Math.max(0, MINIMUM_DISPLAY_MS - (performance.now() - startedAt));
      await new Promise<void>((resolve) => window.setTimeout(resolve, remaining));
      if (alive) targetRef.current = 100;
    };

    void loadEverything();
    return () => {
      alive = false;
      window.clearInterval(progressTimer);
      window.clearTimeout(hiddenTimer);
    };
  }, []);

  if (!visible) return null;
  const currentDigits = String(progress).padStart(2, '0');
  const previousDigits = String(Math.max(0, progress - 1)).padStart(currentDigits.length, '0');
  return <div className={`${styles.loader} ${leaving ? styles.leaving : ''}`} role="status" aria-live="polite" aria-label={`Loading portfolio ${progress}%`}>
    <div className={styles.readout} aria-hidden="true">
      {Array.from(currentDigits, (digit, index) => {
        const previous = previousDigits[index];
        if (digit === previous) return <span className={styles.staticDigit} key={`static-${index}`}>{digit}</span>;
        return <span className={styles.numberWindow} key={`rolling-${progress}-${index}`}>
          <span className={styles.numberTrack} style={{ '--digit-index': index } as CSSProperties}>
            <span>{previous}</span><span>{digit}</span>
          </span>
        </span>;
      })}
      <small>%</small>
    </div>
    <div className={styles.track} aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
  </div>;
}

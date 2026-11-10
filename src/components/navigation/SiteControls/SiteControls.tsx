import { useEffect, useState } from 'react';
import { ArrowUp, AudioLines, Circle, Moon, Palette, Sun } from 'lucide-react';
import GestureControls from '../Header/GestureControls';
import { playUiSound, setUiSoundEnabled } from '../../../utils/uiSound';
import { useLenis } from '../../../hooks/useLenis';
import styles from './SiteControls.module.scss';

type Theme = 'light' | 'dark' | 'red';
const themeNames: Record<Theme, string> = { light: 'Light', dark: 'Dark', red: 'Reddish' };

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'red' || saved === 'light') return saved;
  } catch { /* Keep the default when storage is unavailable. */ }
  return 'light';
}

function readSoundSetting() {
  try { return localStorage.getItem('portfolio-sound') !== 'off'; }
  catch { return true; }
}

export default function SiteControls() {
  const lenis = useLenis();
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(readSoundSetting);

  const backToTop = () => {
    if (document.querySelector('.work-canvas')) {
      window.dispatchEvent(new Event('portfolio:work-reset'));
    } else if (lenis) {
      lenis.scrollTo(0, { duration: 1.1, easing: (progress) => 1 - (1 - progress) ** 4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Theme still applies for this visit. */ }
  }, [theme]);

  useEffect(() => {
    setUiSoundEnabled(soundOn);
    try { localStorage.setItem('portfolio-sound', soundOn ? 'on' : 'off'); } catch { /* Sound still applies for this visit. */ }
  }, [soundOn]);

  useEffect(() => {
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const item = target.closest('[data-ui-sound]');
      if (!item) return;
      const previous = event.relatedTarget;
      if (previous instanceof Node && item.contains(previous)) return;
      playUiSound();
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-ui-sound]')) playUiSound();
    };
    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, []);

  return <aside className={styles.controls} aria-label="Display and interaction controls">
    <div className={styles.themeControl}>
      <button className={styles.themeToggle} type="button" aria-label={`Color theme: ${theme}. Choose theme`} title={`Color theme: ${theme}`} aria-haspopup="true" aria-expanded={themeMenuOpen}
        onClick={() => setThemeMenuOpen((open) => !open)}>
        <Palette size={22} strokeWidth={1.8} aria-hidden="true" />
        <span className={`${styles.themeDot} ${styles[`themeDot_${theme}`]}`} aria-hidden="true" />
        <span>{themeNames[theme]}</span>
      </button>
      <div className={`${styles.themeMenu} ${themeMenuOpen ? styles.themeMenuOpen : ''}`} role="group" aria-label="Choose color scheme" aria-hidden={!themeMenuOpen} inert={!themeMenuOpen}>
        <button type="button" tabIndex={themeMenuOpen ? 0 : -1} className={styles.themeOption} aria-pressed={theme === 'light'} onClick={() => { setTheme('light'); setThemeMenuOpen(false); }}>
          <Sun size={17} aria-hidden="true" /><span>Light</span>{theme === 'light' && <Circle size={7} fill="currentColor" aria-hidden="true" />}
        </button>
        <button type="button" tabIndex={themeMenuOpen ? 0 : -1} className={styles.themeOption} aria-pressed={theme === 'dark'} onClick={() => { setTheme('dark'); setThemeMenuOpen(false); }}>
          <Moon size={17} aria-hidden="true" /><span>Dark</span>{theme === 'dark' && <Circle size={7} fill="currentColor" aria-hidden="true" />}
        </button>
        <button type="button" tabIndex={themeMenuOpen ? 0 : -1} className={styles.themeOption} aria-pressed={theme === 'red'} onClick={() => { setTheme('red'); setThemeMenuOpen(false); }}>
          <span className={styles.redSwatch} aria-hidden="true" /><span>Reddish</span>{theme === 'red' && <Circle size={7} fill="currentColor" aria-hidden="true" />}
        </button>
      </div>
    </div>

    <div className={styles.middleControls}>
      <GestureControls className={styles.gestureButton} />
      <button className={`${styles.soundButton} ${soundOn ? styles.soundOn : ''}`} type="button"
        aria-label={soundOn ? 'Turn interaction sounds off' : 'Turn interaction sounds on'} aria-pressed={soundOn}
        title={soundOn ? 'Turn interaction sounds off' : 'Turn interaction sounds on'}
        onClick={() => setSoundOn((enabled) => !enabled)}>
        <AudioLines size={25} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>

    <button className={styles.backTop} type="button" aria-label="Back to top" title="Back to top" onClick={backToTop}>
      <ArrowUp size={22} strokeWidth={1.8} aria-hidden="true" />
      <span>Back to top</span>
    </button>
  </aside>;
}

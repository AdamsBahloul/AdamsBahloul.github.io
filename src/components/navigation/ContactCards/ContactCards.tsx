import { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { gsap, useGSAP } from '../../../animations/gsapConfig';
import { useLenis } from '../../../hooks/useLenis';
import styles from './ContactCards.module.scss';

const contactEmail = 'adamsbahloul@gmail.com';

export default function ContactCards({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const entranceRef = useRef<gsap.core.Tween | undefined>(undefined);
  const lenis = useLenis();

  const closeCards = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose();
      return;
    }
    entranceRef.current?.kill();
    const overlay = overlayRef.current;
    const cards = overlay ? Array.from(overlay.querySelectorAll<HTMLElement>('[data-contact-motion]')).reverse() : [];
    if (!overlay || !cards.length) {
      onClose();
      return;
    }
    gsap.timeline({ onComplete: onClose })
      .to(cards, {
        y: () => -window.innerHeight,
        autoAlpha: 0,
        duration: 0.64,
        stagger: 0.055,
        ease: 'power3.inOut',
      }, 0)
      .to(overlay, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
  }, [onClose]);

  useGSAP(() => {
    const overlay = overlayRef.current;
    if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(overlay.querySelectorAll<HTMLElement>('[data-contact-motion]'));
    gsap.set(cards, { y: window.innerHeight });
    entranceRef.current = gsap.to(cards, {
      y: 0,
      duration: 0.64,
      stagger: 0.055,
      ease: 'power3.inOut',
    });
    return () => entranceRef.current?.kill();
  }, { scope: overlayRef, dependencies: [] });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeCards();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      document.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [closeCards, lenis]);

  return <div ref={overlayRef} className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) closeCards(); }}>
    <div className={styles.stage}>
      <div className={styles.motionCard} data-contact-motion>
      <article className={styles.backCard} aria-label="Internship focus">
        <p className={styles.backEyebrow}>CURRENT FOCUS</p>
        <h2>Curious by nature.<br />Ready to contribute.</h2>
        <div className={styles.focusList}>
          <span>Embedded systems</span><span>Software engineering</span><span>AI &amp; robotics</span><span>Product-minded design</span>
        </div>
        <p className={styles.base}>TUNIS, TN <span>•</span> OPEN TO INTERNSHIPS</p>
      </article>
      </div>

      <div className={styles.motionCard} data-contact-motion>
      <section ref={dialogRef} className={styles.contactCard} role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <div className={styles.cardHeader}>
          <div><p className={styles.eyebrow}>ADAM BAHLOUL® / CONTACT</p><h1 id="contact-title">COME SAY HI</h1></div>
          <button ref={closeRef} className={styles.close} type="button" onClick={closeCards} aria-label="Close contact card">
            <span>Close</span><X size={22} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.details}>
          <div className={styles.detail}><p>Email me about an opportunity</p><a href={`mailto:${contactEmail}`}>{contactEmail}<span aria-hidden="true">↗</span></a></div>
          <div className={styles.detail}><p>Connect professionally</p><a href="https://www.linkedin.com/in/bahloul-adam/" target="_blank" rel="noreferrer">LinkedIn<span aria-hidden="true">↗</span></a></div>
          <div className={styles.detail}><p>Download my CV</p><a href="/images/adelabbes.pdf" download="Adam-Bahloul-CV.pdf">View résumé<span aria-hidden="true">↓</span></a></div>
          <div className={styles.detail}><p>What I’m looking for</p><span className={styles.detailValue}>An internship where I can build, learn, and make a useful contribution.</span></div>
        </div>
      </section>
      </div>
    </div>
  </div>;
}

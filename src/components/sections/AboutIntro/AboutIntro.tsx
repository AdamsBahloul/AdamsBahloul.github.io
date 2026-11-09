import { Fragment, useRef } from 'react';
import { gsap, useGSAP } from '../../../animations/gsapConfig';
import styles from './AboutIntro.module.scss';

const statement = 'I build thoughtful systems across embedded software, electronics and AI, turning complex ideas into useful tools and intuitive digital experiences.';
const words = statement.split(' ');

export default function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animatedWords = Array.from(section.querySelectorAll<HTMLElement>('[data-about-word]'));
    const media = gsap.matchMedia(section);

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const assembly = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      assembly.fromTo(animatedWords, {
        x: (index) => index % 5 === 0
          ? (index % 10 === 0 ? -1 : 1) * window.innerWidth * 1.28
          : Math.cos(index * 2.399) * window.innerWidth * 0.62,
        y: (index) => index % 8 === 3
          ? window.innerHeight * 1.16
          : Math.abs(Math.sin(index * 2.399)) * window.innerHeight * 0.58,
        rotation: (index) => Math.sin(index * 4.17) * 24,
      }, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1,
        stagger: { amount: 0.24, from: 'random' },
        ease: 'none',
      });

      return () => {
        assembly.scrollTrigger?.kill();
        assembly.kill();
      };
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(animatedWords, { clearProps: 'transform' });
    });

    return () => media.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className={styles.section} aria-label="About my approach">
      <div className={styles.stage}>
        <p className={styles.statement} aria-label={statement}>
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span data-about-word>{word}</span>{index < words.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </p>
        <p className={styles.supportingCopy}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

        </p>
        <p className={styles.supportingCopy}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

        </p>
      </div>
    </section>
  );
}

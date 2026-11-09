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
      const compact = window.matchMedia('(max-width: 62rem)').matches;
      const phone = window.matchMedia('(max-width: 42rem)').matches;
      const words = animatedWords;
      if (phone) {
        const assembly = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=85%',
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        assembly.fromTo(words, { y: 22, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: { amount: 0.24, from: 'random' },
          ease: 'none',
        });

        return () => {
          assembly.scrollTrigger?.kill();
          assembly.kill();
        };
      }

      const horizontalTravel = window.innerWidth * (phone ? 0.16 : compact ? 0.28 : 0.62);
      const verticalTravel = window.innerHeight * (phone ? 0.13 : compact ? 0.24 : 0.58);
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
          ? (index % 10 === 0 ? -1 : 1) * horizontalTravel * (compact ? 1 : 2.05)
          : Math.cos(index * 2.399) * horizontalTravel,
        y: (index) => index % 8 === 3
          ? verticalTravel * (compact ? 1.25 : 2)
          : Math.abs(Math.sin(index * 2.399)) * verticalTravel,
        rotation: (index) => Math.sin(index * 4.17) * (compact ? 10 : 24),
      }, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 1,
        stagger: { amount: compact ? 0.16 : 0.24, from: 'random' },
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
    <section ref={sectionRef} className={styles.section} id="about" aria-label="About my approach">
      <div className={styles.stage}>
        <p className={styles.statement} aria-label={statement}>
          {words.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span data-about-word>{word}</span>{index < words.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </p>
        <p className={styles.supportingCopy}>
          From early sketches to working prototypes, I like connecting software, electronics and design. I’m drawn to the moments when a complex idea becomes clear, useful and enjoyable to interact with.
        </p>
        <p className={styles.supportingCopy}>
          I’m currently looking for an internship where I can contribute to a thoughtful team while growing my skills in embedded systems, AI and computer vision.
        </p>
      </div>
    </section>
  );
}

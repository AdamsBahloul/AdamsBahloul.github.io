import { useRef } from 'react';
import { gsap, useGSAP } from '../../../animations/gsapConfig';
import styles from './SkillsShowcase.module.scss';

const skills = [
  { mark: 'Ps', name: 'Photoshop', tone: 'blue' },
  { mark: 'Ai', name: 'Illustrator', tone: 'orange' },
  { mark: 'F', name: 'Figma', tone: 'figma' },
  { mark: 'Ae', name: 'After Effects', tone: 'purple' },
  { mark: 'Pr', name: 'Premiere Pro', tone: 'violet' },
  { mark: 'Bl', name: 'Blender', tone: 'blender' },
  { mark: 'R', name: 'React', tone: 'cyan' },
  { mark: 'TS', name: 'TypeScript', tone: 'blue' },
  { mark: 'Py', name: 'Python', tone: 'python' },
  { mark: 'GH', name: 'GitHub', tone: 'ink' },
  { mark: 'Ar', name: 'Arduino', tone: 'teal' },
  { mark: '3D', name: '3D & Motion', tone: 'coral' },
];

export default function SkillsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    const title = section.querySelector<HTMLElement>('[data-skills-title]');
    const logos = Array.from(section.querySelectorAll<HTMLElement>('[data-skill-logo]'));
    const media = gsap.matchMedia(section);

    media.add('(prefers-reduced-motion: no-preference)', () => {
      let titleSequence: gsap.core.Timeline | undefined;
      if (title) {
        titleSequence = gsap.timeline({
          scrollTrigger: {
            trigger: section.querySelector('[data-skills-intro]'),
            start: 'top top',
            end: '+=70%',
            scrub: true,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          },
        });
        titleSequence.to(title, { autoAlpha: 0, ease: 'none', duration: 0.55 }, 0.45);
      }

      const compact = window.matchMedia('(max-width: 62rem)').matches;
      const phone = window.matchMedia('(max-width: 42rem)').matches;
      const assembly = gsap.fromTo(logos, {
        x: (index) => Math.cos(index * 2.399) * window.innerWidth * (phone ? 0.1 : compact ? 0.18 : 0.72),
        y: (index) => (index % 3 === 0 ? 1 : -1) * window.innerHeight * (phone ? 0.12 : compact ? 0.18 : 0.7 + (index % 4) * 0.12),
        rotation: (index) => Math.sin(index * 3.7) * (phone ? 8 : compact ? 12 : 32),
        scale: phone ? 0.96 : compact ? 0.92 : 0.82,
        autoAlpha: 0.25,
      }, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        autoAlpha: 1,
        ease: 'none',
        stagger: { amount: phone ? 0.24 : compact ? 0.32 : 0.55, from: 'random' },
        scrollTrigger: {
          trigger: section.querySelector('[data-skills-grid]'),
          start: 'top 88%',
          end: 'center 55%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        titleSequence?.scrollTrigger?.kill();
        titleSequence?.kill();
        assembly.scrollTrigger?.kill();
        assembly.kill();
      };
    });

    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(logos, { clearProps: 'all' });
    });

    return () => media.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className={styles.section} id="skills" aria-labelledby="skills-title">
      <div className={styles.titleStage} data-skills-intro>

        <h2 className={styles.title} id="skills-title" data-skills-title>Skills</h2>
      </div>
      <div className={styles.grid} data-skills-grid>
        {skills.map((skill, index) => (
          <div className={styles.skill} key={skill.name} data-skill-logo style={{ '--skill-index': index } as React.CSSProperties}>
            <span className={`${styles.mark} ${styles[skill.tone]}`} aria-hidden="true">{skill.mark}</span>
            <span className={styles.name}>{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../../../animations/gsapConfig';
import { projects } from '../../../data/projects';
import styles from './ProjectShowcase.module.scss';

function RollingTitle({ title }: { title: string }) {
  return (
    <span className={styles.title} aria-hidden="true">
      {title.split('').map((character, index) => (
        <span className={styles.letterWindow} key={`${character}-${index}`}>
          <span className={styles.letterTrack} style={{ '--letter-index': index } as React.CSSProperties}>
            <span className={styles.letter}>{character === ' ' ? '\u00a0' : character}</span>
            <span className={styles.letter}>{character === ' ' ? '\u00a0' : character}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const title = section?.querySelector<HTMLElement>('[data-work-title]');
    if (!section || !title) return;
    const media = gsap.matchMedia(section);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = section.querySelector('[data-work-intro]');
      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: 'top top',
          end: '+=70%',
          scrub: true,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });
      sequence.to(title, { autoAlpha: 0, ease: 'none', duration: 0.55 }, 0.45);
      return () => { sequence.scrollTrigger?.kill(); sequence.kill(); };
    });
    return () => media.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className={styles.section} id="work" aria-labelledby="selected-work-title">
      <div className={styles.inner}>
        <header className={styles.titleStage} data-work-intro>
          <h2 className={styles.heading} id="selected-work-title" data-work-title>Selected work</h2>
        </header>

        <ol className={styles.list}>
          {projects.map((project, index) => {
            const nextProject = projects[(index + 1) % projects.length];
            return (
              <li className={styles.item} key={project.slug}>
                <Link className={styles.row} to="/work" aria-label={`${project.title}, ${project.category}`} data-ui-sound>
                  <span className={styles.number}>[{String(index + 1).padStart(2, '0')}]</span>
                  <RollingTitle title={project.title} />
                  <span className={styles.category}>[{project.category}]</span>
                  <span className={styles.previews} aria-hidden="true">
                    {[project, nextProject].map((preview, previewIndex) => (
                      <span className={styles.preview} key={`${preview.slug}-${previewIndex}`}>
                        <img src={preview.coverImage} alt="" loading="lazy" />
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

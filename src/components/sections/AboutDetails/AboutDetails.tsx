import { Link } from 'react-router-dom';
import { projects } from '../../../data/projects';
import styles from './AboutDetails.module.scss';

const focusAreas = [
  { number: '01', title: 'Embedded systems', copy: 'Connecting software with electronics and the physical world.' },
  { number: '02', title: 'Software engineering', copy: 'Building clear, useful interfaces and dependable digital experiences.' },
  { number: '03', title: 'AI & computer vision', copy: 'Exploring how intelligent systems can help people understand and interact with their surroundings.' },
  { number: '04', title: 'Creative technology', copy: 'Bringing visual thinking and thoughtful interaction into technical work.' },
];

const selectedProjects = ['blue-orbit', 'interface-studies', 'form-kit']
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project) => project !== undefined);

export default function AboutDetails() {
  return <div className={styles.details}>
    <section className={styles.focus} aria-labelledby="about-focus-title">
      <div className={styles.sectionHeading}>
        <span>01 / FOCUS</span>
        <h2 id="about-focus-title">What I’m exploring</h2>
      </div>
      <div className={styles.focusList}>
        {focusAreas.map((area) => <article className={styles.focusItem} key={area.number}>
          <span className={styles.number}>{area.number}</span>
          <div><h3>{area.title}</h3><p>{area.copy}</p></div>
        </article>)}
      </div>
    </section>

    <section className={styles.work} aria-labelledby="about-work-title">
      <div className={styles.sectionHeading}>
        <span>02 / SELECTED WORK</span>
        <h2 id="about-work-title">A few things I’ve made</h2>
      </div>
      <div className={styles.projectGrid}>
        {selectedProjects.map((project, index) => <Link className={styles.project} to={`/work/${project.slug}`} key={project.slug}>
          <span className={styles.projectImage}><img src={project.coverImage} alt={project.coverAlt} loading="lazy" decoding="async" /></span>
          <span className={styles.projectMeta}><span><span className={styles.projectNumber}>0{index + 1}</span> {project.category}</span><span aria-hidden="true">↗</span></span>
          <span className={styles.projectTitle}>{project.title}</span>
        </Link>)}
      </div>
    </section>

    <section className={styles.availability} aria-labelledby="about-availability-title">
      <div className={styles.sectionHeading}>
        <span>03 / NEXT</span>
        <h2 id="about-availability-title">Looking for an internship</h2>
      </div>
      <div className={styles.nextContent}>
        <p>I’m ready to contribute to a thoughtful team, take on real problems, and keep growing across software, embedded systems, and applied AI.</p>
        <div className={styles.nextLinks}>
          <a href="/contact" data-contact-modal="true">Let’s talk <span aria-hidden="true">↗</span></a>
          <a href="/images/adelabbes.pdf" download="Adam-Bahloul-CV.pdf">Download CV <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  </div>;
}

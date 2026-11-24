import { Link } from 'react-router-dom';
import { projects } from '../../../data/projects';
import styles from './AboutDetails.module.scss';

const focusAreas = [
  { title: 'Education', copy: 'Third-year Embedded Systems Engineering student at the Higher Institute of Computer Science (ISI), Tunisia. Licence in Embedded Systems / Connected and Intelligent Systems, expected June 2027.' },
  { title: 'Embedded systems', copy: 'Low-level C/C++ programming, Embedded Linux, connected devices, and IoT architecture.' },
  { title: 'Robotics & intelligent systems', copy: 'Exploring robotics, machine learning, computer vision, and biomedical signal processing.' },
  { title: 'Design & interaction', copy: 'Using visual communication, UI/UX, and interactive experiences to make technical systems clearer to use.' },
];

const experience = [
  {
    title: 'Digital Communications & Web Manager',
    copy: 'Higher Institute of Computer Science (ISI), Tunisia · April–November 2026 · Part-time, hybrid · Ariana. Led a visual rebrand and identity system, managed the WordPress website, improved its structure and user experience, and coordinated social channels and digital campaigns.',
  },
  {
    title: 'Research Intern',
    copy: 'Arabs in Neuroscience (AiN) · July–August 2026 · Remote. Collaborated with the Angular Djoyezi group on exploratory fMRI decoding using machine learning, MVPA, and regularized logistic regression. The group reported 100% decoding accuracy in V2 for repeated-image perception in one experiment.',
  },
  {
    title: 'Automation & Test Engineering Intern',
    copy: 'SAMM Test & Automation · July–August 2025 · On-site · Tunis. Supported automated test benches, sensor integration, signal conditioning, PLC troubleshooting in Siemens TIA Portal, debugging, data logging, and test-specification checks for electronic and industrial systems.',
  },
];

const selectedProjects = ['blue-orbit', 'interface-studies', 'form-kit']
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project) => project !== undefined);

export default function AboutDetails() {
  return <div className={styles.details}>
    <section className={styles.focus} aria-labelledby="about-focus-title">
      <div className={styles.sectionHeading}>
        <h2 id="about-focus-title">Education &amp; focus</h2>
      </div>
      <div className={styles.focusList}>
        {focusAreas.map((area) => <article className={styles.focusItem} key={area.title}>
          <h3>{area.title}</h3><p>{area.copy}</p>
        </article>)}
      </div>
    </section>

    <section className={styles.experience} aria-labelledby="about-experience-title">
      <div className={styles.sectionHeading}>
        <h2 id="about-experience-title">Experience</h2>
      </div>
      <div className={styles.experienceList}>
        {experience.map((item) => <article className={styles.experienceItem} key={item.title}>
          <div className={styles.experienceBody}>
            <h3>{item.title}</h3>
            <p className={styles.experienceCopy}>{item.copy}</p>
          </div>
        </article>)}
      </div>
    </section>

    <section className={styles.credentials} aria-labelledby="about-credentials-title">
      <div className={styles.sectionHeading}>
        <h2 id="about-credentials-title">Certificates &amp; recognition</h2>
      </div>
      <p className={styles.draftNote}>Completed certifications are listed separately from program participation and individual courses.</p>
      <div className={styles.credentialGroups}>
        <div className={styles.credentialGroup}>
          <h3>Certificates</h3>
          <article className={styles.credentialItem}>
            <h4>CAD201EN: Introduction to Cloud Native, DevOps, Agile, and NoSQL</h4>
            <p>IBM · May 2024</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>Introduction to DevOps &amp; Site Reliability Engineering</h4>
            <p>edX Verified Certificate · May 2024</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>ENES608.3: Product Design, Prototyping, and Testing</h4>
            <p>University System of Maryland · May 2024</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>Essential Technologies for Business Professional Certificate</h4>
            <p>IBM · May 2024</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>CAD101EN: Introduction to Web Development with HTML5, CSS3, and JavaScript</h4>
            <p>IBM · April 2024</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>CC0101EN: Introduction to Cloud Computing</h4>
            <p>IBM · April 2024</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>Data Visualization</h4>
            <p>freeCodeCamp · April 2024</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>Foundations: Data, Data, Everywhere</h4>
            <p>Google · April 2024</p>
          </article>
        </div>
        <div className={styles.credentialGroup}>
          <h3>Programs &amp; courses</h3>
          <article className={styles.credentialItem}>
            <h4>Introduction to Computational Neuroscience 2026</h4>
            <p>Arabs in Neuroscience (AiN) · Program participation</p>
          </article>
          <article className={styles.credentialItem}>
            <h4>What Is Generative AI?</h4>
            <p>LinkedIn Learning · Course</p>
          </article>
        </div>
      </div>
    </section>

    <section className={styles.work} aria-labelledby="about-work-title">
      <div className={styles.sectionHeading}>
        <h2 id="about-work-title">A few things I’ve made</h2>
      </div>
      <div className={styles.projectGrid}>
        {selectedProjects.map((project) => <Link className={styles.project} to={`/work/${project.slug}`} key={project.slug}>
          <span className={styles.projectImage}><img src={project.coverImage} alt={project.coverAlt} loading="lazy" decoding="async" /></span>
          <span className={styles.projectMeta}><span>{project.category}</span><span aria-hidden="true">↗</span></span>
          <span className={styles.projectTitle}>{project.title}</span>
        </Link>)}
      </div>
    </section>

    <section className={styles.availability} aria-labelledby="about-availability-title">
      <div className={styles.sectionHeading}>
        <h2 id="about-availability-title">Looking for an internship</h2>
      </div>
      <div className={styles.nextContent}>
        <p>Currently seeking a local or international internship in Embedded Systems Engineering, Embedded Software, Embedded Linux, IoT, or Robotics. I’m ready to contribute to engineering teams and keep growing through practical work.</p>
        <div className={styles.nextLinks}>
          <a href="/contact" data-contact-modal="true">Let’s talk <span aria-hidden="true">↗</span></a>
          <a href="/images/adelabbes.pdf" download="Adam-Bahloul-CV.pdf">Download CV <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  </div>;
}

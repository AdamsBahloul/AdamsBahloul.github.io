import styles from './AboutFeature.module.scss';

export default function AboutFeature({ id = 'about-page' }: { id?: string }) {
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <h1 id={`${id}-title`} className={styles.visuallyHidden}>About Adam Bahloul</h1>
      <div className={styles.layout}>
        <figure className={styles.portrait}>
          <img
            src="/images/headshot.webp"
            alt="Portrait of Adam Bahloul, Embedded Systems Engineering student"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className={styles.copy}>
          <p>I’m a third-year Embedded Systems Engineering student at the Higher Institute of Computer Science (ISI), Tunisia, pursuing a Licence in Embedded Systems / Connected and Intelligent Systems, with expected graduation in June 2027. I’m interested in low-level programming, connected devices, embedded AI, and robotics.</p>
          <p>My experience spans industrial test automation, collaborative computational neuroscience research, and digital communications. I also bring a visual design background to technical work, and I’m seeking a local or international internship in embedded systems, embedded software, Embedded Linux, IoT, or robotics.</p>
        </div>
      </div>
    </section>
  );
}

import styles from './AboutFeature.module.scss';

export default function AboutFeature({ id = 'about-page' }: { id?: string }) {
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-title`}>
      <h1 id={`${id}-title`} className={styles.visuallyHidden}>About Adam Bahloul</h1>
      <div className={styles.layout}>
        <figure className={styles.portrait}>
          <img
            src="/images/wide2.avif"
            alt="Editorial portrait of a man in profile against a soft floral background"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className={styles.copy}>
          <p>I’m an embedded systems and software engineering student who enjoys bringing software and hardware together. I’m especially interested in AI, robotics, and turning complex ideas into clear, useful experiences.</p>
          <p>I like experimenting with AI, robotics, and intuitive interfaces, while paying attention to the small details that make technology feel simple and useful. I enjoy taking an idea from first sketch to working prototype.</p>
        </div>
      </div>
    </section>
  );
}

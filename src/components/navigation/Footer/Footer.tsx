import { useRef, type FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { gsap, useGSAP } from '../../../animations/gsapConfig';
import Container from '../../common/Container/Container';
import styles from './Footer.module.scss';

const contactEmail = 'adamsbahloul@gmail.com';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const elements = Array.from(footer.querySelectorAll<HTMLElement>('[data-footer-reveal]'));
    const media = gsap.matchMedia(footer);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reveal = gsap.fromTo(elements, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 88%', once: true },
      });
      return () => { reveal.scrollTrigger?.kill(); reveal.kill(); };
    });
    return () => media.revert();
  }, { scope: footerRef, dependencies: [] });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim();
    const subject = encodeURIComponent('Internship opportunity');
    const body = encodeURIComponent(`Hi Adam,\n\nI’d love to connect about an internship opportunity. You can reach me at ${email}.`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <footer ref={footerRef} className={styles.footer} id="contact">
      <Container className={styles.inner}>
        <div className={styles.brandLine} data-footer-reveal>
          <NavLink className={styles.brand} to="/" aria-label="Adam Bahloul — home">
            <img src="/images/biglogo.png" alt="Adam Bahloul" loading="lazy" decoding="async" />
          </NavLink>
          <p className={styles.copyrightMark}>© {new Date().getFullYear()}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.invitation} data-footer-reveal>
            <p className={styles.intro}>Open to internship opportunities in design, technology, and creative development. Let’s make something useful together.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.visuallyHidden} htmlFor="footer-email">Your email address</label>
              <input id="footer-email" name="email" type="email" autoComplete="email" placeholder="YOUR EMAIL ADDRESS" required />
              <button type="submit" aria-label="Start an email conversation"><span aria-hidden="true">→</span></button>
            </form>
            <p className={styles.formNote}>Opens a prefilled email draft.</p>
          </div>

          <nav className={styles.index} aria-label="Page index" data-footer-reveal>
            <h2>Index</h2>
            <a href="/#home">Home</a>
            <a href="/#about">About</a>
            <a href="/#work">Selected work</a>
            <a href="/#skills">Skills</a>
            <a href="/#contact">Contact</a>
            <NavLink to="/playground">Playground</NavLink>
          </nav>

          <div className={styles.connect} data-footer-reveal>
            <h2>Connect</h2>
            <a href="https://www.linkedin.com/in/bahloul-adam/" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href={`mailto:${contactEmail}`}>Email <span aria-hidden="true">↗</span></a>
            <a href="/images/adelabbes.pdf" download="Adam-Bahloul-CV.pdf">Download CV <span aria-hidden="true">↓</span></a>
          </div>
        </div>

      </Container>
    </footer>
  );
}

import Container from '../../components/common/Container/Container';
import '../Work/Work.scss';

export default function Contact() {
  return (
    <section className="page-section contact-page" aria-labelledby="contact-page-title">
      <Container>
        <p className="eyebrow">Open to internship opportunities</p>
        <h1 id="contact-page-title">Let’s talk.</h1>
        <p className="contact-page__copy">If you’re building something thoughtful and looking for an engaged intern, I’d love to hear from you.</p>
        <div className="contact-page__links">
          <a href="mailto:adamsbahloul@gmail.com">adamsbahloul@gmail.com <span aria-hidden="true">↗</span></a>
          <a href="https://www.linkedin.com/in/bahloul-adam/" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          <a href="/images/adelabbes.pdf" download="Adam-Bahloul-CV.pdf">Download CV <span aria-hidden="true">↓</span></a>
        </div>
      </Container>
    </section>
  );
}

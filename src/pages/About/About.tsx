import Container from '../../components/common/Container/Container';
import './About.scss';

const focusAreas = ['Embedded systems', 'Artificial intelligence', 'Computer vision', 'Interface design'];

export default function About() {
  return (
    <section className="page-section about-page" aria-labelledby="about-page-title">
      <Container>
        <p className="eyebrow">A little context</p>
        <h1 id="about-page-title">About</h1>
        <div className="about-page__grid">
          <p className="about-page__lead">I’m an embedded systems and software engineering student interested in how thoughtful design can make complex technology feel simple.</p>
          <div className="about-page__details">
            <p>I like moving between code, electronics and visual design—from exploring an idea to making a prototype people can understand and use.</p>
            <p>I’m currently looking for an internship where I can contribute to a curious, collaborative team and keep growing as an engineer and designer.</p>
            <h2>Areas I’m exploring</h2>
            <ul>{focusAreas.map((area) => <li key={area}>{area}</li>)}</ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

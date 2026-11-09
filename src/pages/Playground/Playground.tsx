import Container from '../../components/common/Container/Container';
import './Playground.scss';
export default function Playground() {
  return (
    <section className="page-section playground-page" aria-labelledby="playground-title">
      <Container>
        <p className="eyebrow">Curiosity, in progress</p>
        <h1 id="playground-title">Playground</h1>
        <p className="playground-page__copy">A space for small experiments in interfaces, interactive visuals and prototypes—ideas I’m exploring before they become part of a larger project.</p>
      </Container>
    </section>
  );
}

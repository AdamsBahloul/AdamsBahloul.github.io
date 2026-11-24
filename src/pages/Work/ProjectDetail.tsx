import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '../../data/projects';
import './ProjectDetail.scss';

const githubRepository = 'https://github.com/AdamsBahloul/AdamsBahloul.github.io';

const details = [
  { image: '/images/wide1.avif', alt: 'Wide visual study from the portfolio' },
  { image: '/images/wide2.avif', alt: 'Second wide visual study from the portfolio' },
  { image: '/images/wide3.avif', alt: 'Third wide visual study from the portfolio' },
];

export default function ProjectDetail() {
  const { slug } = useParams();
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) return <Navigate to="/work" replace />;
  const next = projects[(index + 1) % projects.length];

  return <article className="case-study">
    <header className="case-study__hero">
      <div className="case-study__hero-image"><img src={project.coverImage} alt={project.coverAlt} /></div>
      <div className="case-study__hero-copy">
        <p className="case-study__eyebrow">Selected work <span>/{String(index + 1).padStart(2, '0')}</span></p>
        <h1>{project.title}</h1>
        <p className="case-study__summary">{project.summary}</p>
        <dl className="case-study__meta">
          <div><dt>Discipline</dt><dd>{project.category}</dd></div>
          <div><dt>Services</dt><dd>{project.services.join(', ')}</dd></div>
          <div><dt>Year</dt><dd>{project.year}</dd></div>
        </dl>
      </div>
      <span className="case-study__year-mark">{String(project.year).slice(-2)}</span>
    </header>

    <section className="case-study__chapter case-study__chapter--intro">
      <p className="case-study__chapter-note">Project overview<br />{project.category}.</p>
      <span className="case-study__chapter-number">/1</span>
      <h2>{project.context}</h2>
    </section>

    <section className="case-study__chapter case-study__chapter--approach">
      <p className="case-study__chapter-note">A process shaped by<br />{project.services.join(' · ')}.</p>
      <span className="case-study__chapter-number">/2</span>
      <div className="case-study__approach-copy">
        <h2>Approach</h2>
        <p>{project.approach}</p>
        <h3>Tools &amp; technologies</h3>
        <ul className="case-study__technology-list">
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </div>
      <div className="case-study__image-grid">
        <figure className="case-study__image case-study__image--small"><img src={details[0].image} alt={details[0].alt} loading="lazy" /></figure>
        <figure className="case-study__image case-study__image--large"><img src={project.coverImage} alt={project.coverAlt} loading="lazy" /></figure>
        <figure className="case-study__image case-study__image--wide"><img src={details[1].image} alt={details[1].alt} loading="lazy" /></figure>
        <figure className="case-study__image case-study__image--small"><img src={details[2].image} alt={details[2].alt} loading="lazy" /></figure>
      </div>
    </section>

    <section className="case-study__chapter case-study__chapter--closing">
      <p className="case-study__chapter-note">Project outcome<br />{project.year}.</p>
      <span className="case-study__chapter-number">/3</span>
      <div className="case-study__closing-copy"><p className="case-study__eyebrow">Project details</p><h2>{project.title}</h2><p>{project.deliverable}</p><div className="case-study__closing-links"><Link className="case-study__back" to="/work">Back to all work <span>↗</span></Link><a className="case-study__github" href={githubRepository} target="_blank" rel="noreferrer">View GitHub repository <span aria-hidden="true">↗</span></a></div></div>
    </section>

    <Link className="case-study__next" to={`/work/${next.slug}`} aria-label={`Next project: ${next.title}`}>
      <span className="case-study__next-label">Next project</span>
      <span className="case-study__next-title">{next.title}</span>
      <span className="case-study__next-image"><img src={next.coverImage} alt="" loading="lazy" /></span>
      <span className="case-study__next-arrow">↗</span>
    </Link>
  </article>;
}

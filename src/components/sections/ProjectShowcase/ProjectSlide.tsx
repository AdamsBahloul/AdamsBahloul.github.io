import type { ProjectSlideProps } from './projectShowcase.types';
import ProjectImage from './ProjectImage';
import styles from './ProjectShowcase.module.scss';

export default function ProjectSlide({ project, index, total }: ProjectSlideProps) {
  return (
    <article
      className={styles.slide}
      data-project-slide
      aria-label={`${project.title}: ${project.summary}`}
      style={{ zIndex: index + 1 }}
    >
      <ProjectImage
        src={project.coverImage}
        alt={project.coverAlt}
        priority={index < 2}
        index={index}
      />
      <div className={styles.metadata} data-project-metadata>
        <div className={styles.projectIdentity}>
          <h2 className={styles.projectTitle}>{project.title}</h2>
          <p className={styles.projectCategory}>{project.category}</p>
        </div>
        <div className={styles.projectDetails}>
          <span>{project.year}</span>
          <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        </div>
      </div>
    </article>
  );
}

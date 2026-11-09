import type { ProjectImageProps } from './projectShowcase.types';
import styles from './ProjectShowcase.module.scss';

export default function ProjectImage({ src, alt, priority, index }: ProjectImageProps) {
  const videoSrc = `/videos/wide${(index % 3) + 1}.mp4`;

  return (
    <div className={styles.imageLayer}>
      <img
        className={styles.image}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        data-project-image
      />
      <img
        className={styles.glitchImage}
        src={src}
        alt=""
        aria-hidden="true"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        data-project-glitch
      />
      <div className={styles.videoPanels} aria-hidden="true">
        <div className={styles.videoPanel} data-project-panel="left">
          <video src={videoSrc} muted playsInline preload="metadata" data-project-video />
        </div>
        <div className={`${styles.videoPanel} ${styles.videoPanelRight}`} data-project-panel="right">
          <video src={videoSrc} muted playsInline preload="metadata" data-project-video />
        </div>
      </div>
    </div>
  );
}

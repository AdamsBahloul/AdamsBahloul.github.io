import { useRef } from 'react';
import { gsap, useGSAP } from '../../../animations/gsapConfig';
import { projects } from '../../../data/projects';
import ProjectSlide from './ProjectSlide';
import styles from './ProjectShowcase.module.scss';

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || projects.length < 2) return;

    const slides = Array.from(section.querySelectorAll<HTMLElement>('[data-project-slide]'));
    const metadata = slides.map((slide) => slide.querySelector<HTMLElement>('[data-project-metadata]'));
    const images = slides.map((slide) => slide.querySelector<HTMLElement>('[data-project-image]'));
    const glitches = slides.map((slide) => slide.querySelector<HTMLElement>('[data-project-glitch]'));
    const panels = slides.map((slide) => Array.from(slide.querySelectorAll<HTMLElement>('[data-project-panel]')));
    const videos = slides.map((slide) => Array.from(slide.querySelectorAll<HTMLVideoElement>('[data-project-video]')));
    const segmentCount = projects.length - 1;
    const media = gsap.matchMedia(section);

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(panels.flat(), {
        xPercent: (_, element) => element.getAttribute('data-project-panel') === 'left' ? -100 : 100,
        autoAlpha: 0,
      });
      gsap.set(images.filter((image): image is HTMLElement => Boolean(image)), { filter: 'invert(0) contrast(1) saturate(1)' });
      gsap.set(images.slice(1).filter((image): image is HTMLElement => Boolean(image)), { autoAlpha: 0 });
      gsap.set(glitches.filter((image): image is HTMLElement => Boolean(image)), { autoAlpha: 0 });
      gsap.set(videos.flat(), { filter: 'invert(0) contrast(1) saturate(1)' });
      gsap.set(metadata.filter((item): item is HTMLElement => Boolean(item)), { autoAlpha: 0, y: 14 });
      if (metadata[0]) gsap.set(metadata[0], { autoAlpha: 1, y: 0 });

      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * segmentCount}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      slides.slice(0, -1).forEach((slide, index) => {
        const outgoingImage = images[index];
        const incomingImage = images[index + 1];
        const incomingPanels = panels[index + 1];
        const incomingGlitch = glitches[index + 1];
        const incomingVideos = videos[index + 1];
        if (!outgoingImage || !incomingImage || !incomingGlitch || !incomingPanels || incomingPanels.length !== 2 || !incomingVideos?.length) return;

        // The incoming project's video forms both moving panels. Its negative
        // and glitch treatment stays on this top layer as it closes inward.
        sequence.set(incomingPanels, { autoAlpha: 1 }, index);
        sequence.fromTo(incomingPanels, {
          xPercent: (panelIndex) => panelIndex === 0 ? -100 : 100,
        }, {
          xPercent: 0,
          duration: 0.9,
          stagger: 0.04,
          ease: 'power2.inOut',
          onStart: () => incomingVideos.forEach((video) => {
            video.currentTime = 0;
            void video.play().catch(() => undefined);
          }),
          onReverseStart: () => incomingVideos.forEach((video) => void video.play().catch(() => undefined)),
          onComplete: () => incomingVideos.forEach((video) => video.pause()),
          onReverseComplete: () => incomingVideos.forEach((video) => {
            video.pause();
            video.currentTime = 0;
          }),
          immediateRender: false,
        }, index);
        sequence.to(incomingVideos, {
          filter: 'invert(1) contrast(1.5) saturate(1.7)',
          duration: 0.9,
          ease: 'none',
        }, index);
        sequence.to(incomingGlitch, { autoAlpha: 0.82, duration: 0.82, ease: 'none' }, index + 0.04);

        // The panels meet to form the complete incoming image; the base image
        // takes over invisibly once both halves are aligned.
        sequence.set(slide, { autoAlpha: 0 }, index + 0.94);
        sequence.set(outgoingImage, { filter: 'invert(0) contrast(1) saturate(1)' }, index + 0.94);
        sequence.set(incomingGlitch, { autoAlpha: 0 }, index + 0.94);
        sequence.set(incomingVideos, { filter: 'invert(0) contrast(1) saturate(1)' }, index + 0.94);
        sequence.set(incomingImage, { autoAlpha: 1 }, index + 0.94);
        sequence.set(incomingPanels, { autoAlpha: 0 }, index + 0.94);

        if (metadata[index]) sequence.to(metadata[index], { autoAlpha: 0, y: -10, duration: 0.2, ease: 'none' }, index + 0.74);
        if (metadata[index + 1]) sequence.to(metadata[index + 1], { autoAlpha: 1, y: 0, duration: 0.2, ease: 'none' }, index + 0.76);
      });

      return () => {
        videos.flat().forEach((video) => video.pause());
        sequence.scrollTrigger?.kill();
        sequence.kill();
      };
    });

    return () => media.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Selected projects">
      {projects.map((project, index) => (
        <ProjectSlide key={project.slug} project={project} index={index} total={projects.length} />
      ))}
      <p className={styles.scrollHint} aria-hidden="true">SCROLL TO EXPLORE</p>
    </section>
  );
}

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '../../../animations/gsapConfig';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import styles from './IntroBio.module.scss';

const introduction = ' — an embedded systems & software engineering student exploring AI, robotics and computer vision. I work across software, electronics and design, turning complex ideas into clear, functional experiences.';

type Line = { clip: HTMLSpanElement; content: HTMLSpanElement; animated: HTMLSpanElement[] };

function splitIntoRenderedLines(paragraph: HTMLParagraphElement): Line[] {
  const nodes = Array.from(paragraph.childNodes);

  nodes.forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent) return;
    const fragment = document.createDocumentFragment();
    const pieces = node.textContent.match(/\S+\s*|\s+/g) ?? [];
    pieces.forEach((piece) => {
      const token = document.createElement('span');
      token.className = styles.token;
      token.textContent = piece;
      token.dataset.bioToken = 'true';
      fragment.append(token);
    });
    node.replaceWith(fragment);
  });

  const children = Array.from(paragraph.childNodes).filter((node) => node.nodeType === Node.ELEMENT_NODE) as HTMLElement[];
  const groups: HTMLElement[][] = [];
  let currentTop = Number.NaN;

  children.forEach((child) => {
    const rect = child.getBoundingClientRect();
    const top = Math.round(rect.top * 10) / 10;
    if (!groups.length || Math.abs(top - currentTop) > 1) {
      groups.push([]);
      currentTop = top;
    }
    groups[groups.length - 1].push(child);
  });

  paragraph.style.textIndent = '0';

  return groups.map((group) => {
    const clip = document.createElement('span');
    const content = document.createElement('span');
    clip.className = styles.lineClip;
    content.className = styles.lineContent;
    const rects = group.map((node) => node.getBoundingClientRect());
    const visualLineHeight = Math.max(...rects.map((rect) => rect.bottom)) - Math.min(...rects.map((rect) => rect.top));
    const lineHeight = Number.parseFloat(getComputedStyle(paragraph).lineHeight);
    clip.style.height = `${Math.max(visualLineHeight, lineHeight)}px`;
    const animated: HTMLSpanElement[] = [];

    group.forEach((node) => {
      const text = document.createElement('span');
      text.className = styles.lineText;
      text.append(node);
      content.append(text);
      animated.push(text);
    });

    clip.append(content);
    paragraph.append(clip);
    return { clip, content, animated };
  });
}

function restoreParagraph(paragraph: HTMLParagraphElement, original: DocumentFragment) {
  paragraph.style.textIndent = '';
  paragraph.replaceChildren(original.cloneNode(true));
}

export default function IntroBio({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, (section) => {
    if (!ready) return;
    const paragraph = section.querySelector('p');
    if (!paragraph) return;

    const original = document.createDocumentFragment();
    Array.from(paragraph.childNodes).forEach((node) => original.append(node.cloneNode(true)));

    const media = gsap.matchMedia(section);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let lines: Line[] = [];
      let entrance: gsap.core.Timeline | undefined;
      let fadeTrigger: ReturnType<typeof ScrollTrigger.create> | undefined;
      let fadeTween: gsap.core.Tween | undefined;
      let topReplay: ReturnType<typeof ScrollTrigger.create> | undefined;
      let entranceComplete = false;
      let hasScrolledAway = false;
      let resizeFrame = 0;

      const build = (playEntrance: boolean) => {
        entrance?.kill();
        fadeTrigger?.kill();
        fadeTrigger = undefined;
        fadeTween?.kill();
        fadeTween = undefined;
        restoreParagraph(paragraph, original);
        lines = splitIntoRenderedLines(paragraph);

        if (!playEntrance) {
          gsap.set(lines.flatMap((line) => line.animated), {
            yPercent: hasScrolledAway ? -25 : 0,
            autoAlpha: hasScrolledAway ? 0 : 1,
          });
          attachScrollFade();
          return;
        }

        const animated = lines.flatMap((line) => line.animated);
        gsap.set(animated, { autoAlpha: 0 });
        entrance = gsap.timeline({
          defaults: { duration: 0.46, ease: 'power3.out' },
          onComplete: () => {
            entranceComplete = true;
            attachScrollFade();
          },
        });
        lines.forEach((line, index) => {
          // Indent the first animated row to leave room for the independent header logo.
          if (index === 0) line.clip.style.marginLeft = '4.1em';
          entrance?.fromTo(line.content, { yPercent: 105 }, { yPercent: 0, duration: 0.46 }, index * 0.055);
          if (line.animated.length) entrance?.to(line.animated, { autoAlpha: 1, duration: 0.38 }, index * 0.055);
        });
      };

      const attachScrollFade = () => {
        if (!fadeTrigger) {
          fadeTrigger = ScrollTrigger.create({
            start: 1,
            once: true,
            onEnter: () => {
              hasScrolledAway = true;
              fadeTween = gsap.to(lines.flatMap((line) => line.animated), {
                autoAlpha: 0,
                y: -25,
                duration: 0.24,
                ease: 'power2.out',
                overwrite: true,
              });
            },
          });
        }

        if (!topReplay) {
          topReplay = ScrollTrigger.create({
            start: 0,
            end: 1,
            onLeaveBack: () => {
              hasScrolledAway = false;
              if (!entranceComplete) return;
              entranceComplete = false;
              build(true);
            },
          });
        }
      };

      build(true);
      let measuredWidth = paragraph.clientWidth;
      const observer = new ResizeObserver(([entry]) => {
        if (!entry || Math.abs(entry.contentRect.width - measuredWidth) < 1) return;
        measuredWidth = entry.contentRect.width;
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => build(!entranceComplete && !hasScrolledAway));
      });
      observer.observe(paragraph);

      return () => {
        observer.disconnect();
        cancelAnimationFrame(resizeFrame);
        entrance?.kill();
        fadeTrigger?.kill();
        fadeTween?.kill();
        topReplay?.kill();
        restoreParagraph(paragraph, original);
      };
    });

    return () => media.revert();
  }, [ready]);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Introduction" data-ready={ready}>
      <p className={styles.paragraph}>
        {introduction}
      </p>
    </section>
  );
}

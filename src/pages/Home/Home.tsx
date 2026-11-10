import { useRef, type CSSProperties } from 'react';
import { NavLink } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP } from '../../animations/gsapConfig';
import AboutIntro from '../../components/sections/AboutIntro/AboutIntro';
import AboutFeature from '../../components/sections/AboutFeature/AboutFeature';
import ProjectShowcase from '../../components/sections/ProjectShowcase/ProjectShowcase';
import SkillsShowcase from '../../components/sections/SkillsShowcase/SkillsShowcase';
import './Home.scss';

const images = [
  {
    src: './images/project2.webp',
    alt: 'Geometric facade in black and white',
    x: -22, y: -5, rotation: -12,
    spreadX: -105, spreadY: -38, spreadRotation: -17,
  },
  {
    src: './images/project11.webp',
    alt: 'Sculptural concrete architecture',
    x: -8, y: -18, rotation: -7,
    spreadX: -15, spreadY: -45, spreadRotation: -5,
  },
  {
    src: './images/project10.avif',
    alt: 'Symmetrical abstract architecture',
    x: 22, y: 14, rotation: 10,
    spreadX: 15, spreadY: 38, spreadRotation: 7,
  },
  {
    src: './images/project9.avif',
    alt: 'Art deco building in New York',
    x: 22, y: -14, rotation: -6,
    spreadX: 50, spreadY: -35, spreadRotation: 13,
  },
  {
    src: './images/project8.avif',
    alt: 'Studio portrait against a vivid orange background',
    x: 12, y: 4, rotation: 2,
    spreadX: 5, spreadY: 30, spreadRotation: 6,
  },
];

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    if (!section || !stack) return;

    const media = gsap.matchMedia(section);
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const wordmark = section.querySelector('[data-home-wordmark]');
      const creditLine = section.querySelector('[data-home-credit-line]');
      const cards = Array.from(stack.querySelectorAll<HTMLElement>('[data-home-card]'));
      if (!wordmark || !creditLine || !cards.length) return;

      gsap.set(wordmark, { scale: 1.24, opacity: 0, transformOrigin: 'center center' });
      gsap.set(creditLine, { yPercent: 105, autoAlpha: 0 });
      gsap.set(cards, { css: { '--entrance-y': '100vh', '--scroll-y': '0px' } });

      let stackExit: gsap.core.Timeline | undefined;
      let stackReturn: gsap.core.Tween | undefined;
      let stackEntrance: gsap.core.Tween | undefined;
      let revealFallback = 0;
      let headerMotionStarted = false;
      let headerMotionComplete = false;
      let cardsRequested = false;
      let cardsStarted = false;
      let creditStarted = false;
      const revealCards = () => {
        if (!cardsRequested || !headerMotionComplete || cardsStarted) return;
        cardsStarted = true;
        stackEntrance = gsap.to(cards, {
          css: { '--entrance-y': '0px' },
          duration: 0.64,
          stagger: 0.055,
          ease: 'power3.inOut',
        });
      };
      const startHeaderMotion = () => {
        if (headerMotionStarted) return;
        headerMotionStarted = true;
        gsap.timeline({ onComplete: () => {
          headerMotionComplete = true;
          revealCards();
        } })
          .to(wordmark, { scale: 1, opacity: 1, duration: 0.62, ease: 'power3.out' }, 0);
      };
      const startCards = () => {
        cardsRequested = true;
        revealCards();
      };

      const startCredit = () => {
        if (creditStarted) return;
        creditStarted = true;
        gsap.to(creditLine, { yPercent: 0, autoAlpha: 1, duration: 0.46, ease: 'power3.out' });
      };

      const onHeaderEntranceStart = () => startHeaderMotion();
      const onHeaderEntranceComplete = () => { startCards(); startCredit(); };
      window.addEventListener('portfolio:header-entrance-start', onHeaderEntranceStart);
      window.addEventListener('portfolio:header-entrance-complete', onHeaderEntranceComplete);
      revealFallback = window.setTimeout(() => {
        startHeaderMotion();
        startCards();
        startCredit();
      }, 1800);
      if (document.documentElement.dataset.headerEntranceComplete === 'true') {
        startHeaderMotion();
        startCards();
        startCredit();
        window.clearTimeout(revealFallback);
      }

      const scrollExit = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=320',
        invalidateOnRefresh: true,
        onEnter: () => {
          stackReturn?.kill();
          stackExit?.kill();
          stackExit = gsap.timeline();
          [...cards].reverse().forEach((card, index) => {
            stackExit?.to(card, {
              css: { '--scroll-y': () => `${-window.innerHeight}px` },
              autoAlpha: 0,
              duration: 0.64,
              ease: 'power3.inOut',
            }, index * 0.055);
          });
        },
        onLeaveBack: () => {
          stackExit?.kill();
          gsap.set(cards, { css: { '--entrance-y': '0px', '--scroll-y': '100vh' }, autoAlpha: 0 });
          stackReturn = gsap.to(cards, {
            css: { '--scroll-y': '0px' },
            autoAlpha: 1,
            duration: 0.64,
            stagger: 0.055,
            ease: 'power3.inOut',
            overwrite: true,
          });
        },
      });

      const scatterCards = (expanded: boolean) => {
        cards.forEach((card, index) => {
          const image = images[index];
          gsap.to(card, {
            duration: expanded ? 0.58 : 0.68,
            ease: expanded ? 'power3.out' : 'power3.inOut',
            overwrite: 'auto',
            css: {
              '--card-x': `${expanded ? image.spreadX : image.x}px`,
              '--card-y': `${expanded ? image.spreadY : image.y}px`,
              '--card-rotation': `${expanded ? image.spreadRotation : image.rotation}deg`,
            },
          });
        });
      };

      const onPointerEnter = () => scatterCards(true);
      const onPointerLeave = () => scatterCards(false);
      const onFocusOut = (event: Event) => {
        const relatedTarget = (event as globalThis.FocusEvent).relatedTarget;
        if (!(relatedTarget instanceof Node) || !stack.contains(relatedTarget)) {
          scatterCards(false);
        }
      };

      const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (supportsHover) {
        stack.addEventListener('pointerenter', onPointerEnter);
        stack.addEventListener('pointerleave', onPointerLeave);
      }
      stack.addEventListener('focusin', onPointerEnter);
      stack.addEventListener('focusout', onFocusOut);

      return () => {
        window.removeEventListener('portfolio:header-entrance-start', onHeaderEntranceStart);
        window.removeEventListener('portfolio:header-entrance-complete', onHeaderEntranceComplete);
        window.clearTimeout(revealFallback);
        if (supportsHover) {
          stack.removeEventListener('pointerenter', onPointerEnter);
          stack.removeEventListener('pointerleave', onPointerLeave);
        }
        stack.removeEventListener('focusin', onPointerEnter);
        stack.removeEventListener('focusout', onFocusOut);
        stackEntrance?.kill();
        scrollExit.kill();
        stackExit?.kill();
        stackReturn?.kill();
      };
    });

    return () => media.revert();
  }, { scope: sectionRef, dependencies: [] });

  return <>
    <section ref={sectionRef} className="home-page" id="home" aria-label="Portfolio introduction">
      <NavLink
        ref={stackRef}
        className="home-page__stack"
        to="/work"
        aria-label="Explore selected work"
        data-home-stack
        data-ui-sound
      >
        {images.map((image, index) => (
          <span
            className="home-page__card"
            key={image.src}
            data-home-card
            style={{
              '--card-x': `${image.x}px`,
              '--card-y': `${image.y}px`,
              '--card-rotation': `${image.rotation}deg`,
              zIndex: index + 1,
            } as CSSProperties}
          >
            <img src={image.src} alt="" loading="eager" decoding="async" />
          </span>
        ))}
      </NavLink>

      <img
        className="home-page__wordmark"
        src="/images/biglogo.png"
        alt="Adam Bahloul"
        width="4749"
        height="1080"
        loading="eager"
        fetchPriority="high"
        data-home-wordmark
      />
      <p className="home-page__credit"><span className="home-page__credit-clip"><span className="home-page__credit-line" data-home-credit-line>© 2024-26</span></span></p>

    </section>
    <div className="home-page__section-gap" aria-hidden="true" />
    <AboutIntro />
    <ProjectShowcase />
    <AboutFeature id="about-profile" />
    <SkillsShowcase />
  </>;
}

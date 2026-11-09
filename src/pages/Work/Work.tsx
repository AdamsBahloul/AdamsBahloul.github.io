import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import './Work.scss';

const CARD = { width: 430, height: 573 };
const ROW_STEP = 720;
const WORLD = { width: 2160, height: ROW_STEP * 3 };
// Three staggered columns: each successive column drops by half a card height.
const layouts = projects.map((_, index) => ({
  x: 80 + (index % 3) * 720,
  y: 100 + Math.floor(index / 3) * ROW_STEP + (index % 3) * (CARD.height / 2),
}));

export default function Work() {
  const stageRef = useRef<HTMLElement>(null);
  const camera = useRef({ x: WORLD.width / 2, y: WORLD.height / 2 });
  const target = useRef({ x: WORLD.width / 2, y: WORLD.height / 2 });
  const velocity = useRef({ x: 0, y: 0 });
  const axis = useRef<'x' | 'y' | 'diagonal'>('x');
  const nextAxis = useRef<'x' | 'y'>('x');
  const wheelDistance = useRef(0);
  const drag = useRef<{ x: number; y: number; cameraX: number; cameraY: number } | null>(null);
  const [view, setView] = useState({ x: WORLD.width / 2, y: WORLD.height / 2 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  const moveCamera = useCallback((x: number, y: number) => {
    target.current = { x, y };
  }, []);

  useEffect(() => {
    let frame = 0;
    let previous = 0;
    const tick = (time: number) => {
      if (previous) {
        const step = Math.min((time - previous) / 16.67, 3);
        target.current.x += velocity.current.x * step;
        target.current.y += velocity.current.y * step;
        const friction = 0.91 ** step;
        velocity.current.x *= friction;
        velocity.current.y *= friction;
        if (Math.abs(velocity.current.x) < 0.03) velocity.current.x = 0;
        if (Math.abs(velocity.current.y) < 0.03) velocity.current.y = 0;
        camera.current.x += (target.current.x - camera.current.x) * Math.min(0.2 * step, 1);
        camera.current.y += (target.current.y - camera.current.y) * Math.min(0.2 * step, 1);
        setView((current) => Math.abs(camera.current.x - current.x) > 0.25 || Math.abs(camera.current.y - current.y) > 0.25
          ? { x: camera.current.x, y: camera.current.y }
          : current);
      }
      previous = time;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const onGestureDrag = (event: Event) => {
      const { deltaX, deltaY } = (event as CustomEvent<{ deltaX: number; deltaY: number }>).detail;
      velocity.current = { x: 0, y: 0 };
      moveCamera(target.current.x - deltaX, target.current.y - deltaY);
    };
    const resetWorkCanvas = () => {
      velocity.current = { x: 0, y: 0 };
      wheelDistance.current = 0;
      nextAxis.current = 'x';
      axis.current = 'x';
      moveCamera(WORLD.width / 2, WORLD.height / 2);
    };
    const onGestureScroll = (event: Event) => {
      const { deltaY } = (event as CustomEvent<{ deltaY: number }>).detail;
      velocity.current.x = 0;
      velocity.current.y = Math.max(-42, Math.min(42, velocity.current.y + deltaY * 0.3));
    };
    window.addEventListener('portfolio:gesture-drag', onGestureDrag);
    window.addEventListener('portfolio:gesture-scroll', onGestureScroll);
    window.addEventListener('portfolio:work-reset', resetWorkCanvas);
    return () => {
      window.removeEventListener('portfolio:gesture-drag', onGestureDrag);
      window.removeEventListener('portfolio:gesture-scroll', onGestureScroll);
      window.removeEventListener('portfolio:work-reset', resetWorkCanvas);
    };
  }, [moveCamera]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const amount = Math.max(-100, Math.min(100, event.deltaY || event.deltaX));
      wheelDistance.current += Math.abs(amount);
      if (wheelDistance.current >= 170) {
        wheelDistance.current %= 170;
        if (Math.random() < 0.24) {
          axis.current = 'diagonal';
        } else {
          axis.current = nextAxis.current;
          nextAxis.current = nextAxis.current === 'x' ? 'y' : 'x';
        }
      }
      const amountX = axis.current === 'x' ? 1 : axis.current === 'diagonal' ? Math.SQRT1_2 : 0;
      const amountY = axis.current === 'y' ? 1 : axis.current === 'diagonal' ? Math.SQRT1_2 : 0;
      velocity.current.x = Math.max(-32, Math.min(32, velocity.current.x + amount * 0.3 * amountX));
      velocity.current.y = Math.max(-32, Math.min(32, velocity.current.y + amount * 0.3 * amountY));
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [moveCamera]);

  const startDrag = (event: React.PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('a')) return;
    drag.current = { x: event.clientX, y: event.clientY, cameraX: target.current.x, cameraY: target.current.y };
    velocity.current = { x: 0, y: 0 };
    stageRef.current?.setPointerCapture(event.pointerId);
    stageRef.current?.classList.add('is-dragging');
  };
  const dragMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    moveCamera(drag.current.cameraX - dx, drag.current.cameraY - dy);
  };
  const stopDrag = () => { drag.current = null; stageRef.current?.classList.remove('is-dragging'); };

  const copies = [-1, 0, 1];
  return <section ref={stageRef} className="work-canvas" aria-label="Selected work. Scroll or drag to explore projects."
    onPointerDown={startDrag} onPointerMove={dragMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
    <div className="work-canvas__word" aria-hidden="true">Work</div>
    <p className="work-canvas__hint">scroll / drag</p>
    <div className="work-canvas__items">
      {projects.map((project, index) => {
        const layout = layouts[index];
        const nearestTileX = Math.round((view.x - layout.x) / WORLD.width);
        const nearestTileY = Math.round((view.y - layout.y) / WORLD.height);
        return copies.flatMap((tileX) => copies.map((tileY) => {
          const repeatX = nearestTileX + tileX;
          const repeatY = nearestTileY + tileY;
          const x = layout.x + repeatX * WORLD.width - view.x + viewport.width / 2;
          const y = layout.y + repeatY * WORLD.height - view.y + viewport.height / 2;
          const visible = x > -CARD.width - 20 && x < viewport.width + 20 && y > -CARD.height - 20 && y < viewport.height + 20;
          if (!visible) return null;
          const key = `${project.slug}-${repeatX}-${repeatY}`;
          return <Link to={`/work/${project.slug}`} className={`work-tile ${hovered === key ? 'is-hovered' : ''}`} key={key}
            style={{ left: x, top: y, width: CARD.width, height: CARD.height, '--tile-index': index } as React.CSSProperties}
            onMouseEnter={() => setHovered(key)} onMouseLeave={() => setHovered(null)} aria-label={`View ${project.title}`} data-ui-sound>
            <span className="work-tile__image"><img src={project.coverImage} alt={project.coverAlt} draggable="false" /></span>
            <span className="work-tile__caption"><span className="work-tile__title">{Array.from(project.title).map((letter, i) => <span className="work-tile__letter" key={`${letter}-${i}`}><span>{letter}</span><span>{letter}</span></span>)}</span><span className="work-tile__number">{String(index + 1).padStart(2, '0')}</span></span>
          </Link>;
        }));
      })}
    </div>
  </section>;
}

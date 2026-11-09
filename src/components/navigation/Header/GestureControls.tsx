import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Hand, MousePointer2, X } from 'lucide-react';
import type { GestureRecognizer, GestureRecognizerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { useLenis } from '../../../hooks/useLenis';
import styles from './Header.module.scss';

type ControlStatus = 'off' | 'loading' | 'active' | 'error';
type Point = { x: number; y: number };
type PinchInteraction = { origin: Point; last: Point; dragging: boolean };

const wasmUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm';
const modelUrl = 'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task';
const handBones = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

export default function GestureControls({ className }: { className?: string }) {
  const lenis = useLenis();
  const videoRef = useRef<HTMLVideoElement>(null);
  const skeletonRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const sessionRef = useRef(0);
  const frameRef = useRef(0);
  const activeRef = useRef(false);
  const lastFrameRef = useRef(0);
  const gestureRef = useRef({ name: '', since: 0, fired: false });
  const pinchRef = useRef<PinchInteraction | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ControlStatus>('off');
  const [message, setMessage] = useState('Camera video is processed on this device.');
  const [cursor, setCursor] = useState<Point | null>(null);

  const drawSkeleton = useCallback((landmarks?: NormalizedLandmark[]) => {
    const canvas = skeletonRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!landmarks?.length) return;
    context.lineWidth = 2.5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#ff624c';
    context.shadowColor = 'rgb(0 0 0 / 55%)';
    context.shadowBlur = 4;
    handBones.forEach(([from, to]) => {
      context.beginPath();
      context.moveTo(landmarks[from].x * canvas.width, landmarks[from].y * canvas.height);
      context.lineTo(landmarks[to].x * canvas.width, landmarks[to].y * canvas.height);
      context.stroke();
    });
    context.shadowBlur = 2;
    context.fillStyle = '#fff';
    landmarks.forEach((point) => {
      context.beginPath();
      context.arc(point.x * canvas.width, point.y * canvas.height, 3.1, 0, Math.PI * 2);
      context.fill();
    });
    context.shadowBlur = 0;
  }, []);

  const stopCamera = useCallback(() => {
    sessionRef.current += 1;
    activeRef.current = false;
    cancelAnimationFrame(frameRef.current);
    pinchRef.current = null;
    gestureRef.current = { name: '', since: 0, fired: false };
    recognizerRef.current?.close();
    recognizerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    drawSkeleton();
    setCursor(null);
    setStatus('off');
  }, [drawSkeleton]);

  const scrollByGesture = useCallback((deltaY: number) => {
    if (Math.abs(deltaY) < 1) return;
    const workCanvas = document.querySelector<HTMLElement>('.work-canvas');
    if (workCanvas) {
      window.dispatchEvent(new CustomEvent('portfolio:gesture-scroll', { detail: { deltaY } }));
      return;
    }
    const destination = Math.max(0, window.scrollY + deltaY);
    if (lenis) lenis.scrollTo(destination, { immediate: true, force: true });
    else window.scrollTo(0, destination);
  }, [lenis]);

  const panByGesture = useCallback((deltaX: number, deltaY: number) => {
    const workCanvas = document.querySelector<HTMLElement>('.work-canvas');
    if (workCanvas) {
      window.dispatchEvent(new CustomEvent('portfolio:gesture-drag', { detail: { deltaX, deltaY } }));
      return;
    }
    const destination = Math.max(0, window.scrollY - deltaY);
    if (lenis) lenis.scrollTo(destination, { immediate: true, force: true });
    else window.scrollTo(0, destination);
  }, [lenis]);

  const clickAt = useCallback((point: Point) => {
    const target = document.elementFromPoint(point.x, point.y);
    if (!(target instanceof HTMLElement) || panelRef.current?.contains(target)) return;
    target.closest<HTMLElement>('a,button,[role="button"],input,select,textarea,[tabindex]')?.click();
  }, []);

  const handleResult = useCallback((result: GestureRecognizerResult, now: number) => {
    const landmarks = result.landmarks[0];
    if (!landmarks?.[8]) {
      drawSkeleton();
      setCursor(null);
      pinchRef.current = null;
      gestureRef.current = { name: '', since: 0, fired: false };
      return;
    }

    drawSkeleton(landmarks);
    const point = { x: (1 - landmarks[8].x) * window.innerWidth, y: landmarks[8].y * window.innerHeight };
    setCursor(point);
    const category = result.gestures[0]?.[0]?.categoryName ?? 'None';
    const pinched = category !== 'Closed_Fist'
      && Math.hypot(landmarks[4].x - landmarks[8].x, landmarks[4].y - landmarks[8].y) < 0.055;

    if (pinched) {
      const pinch = pinchRef.current;
      if (!pinch) {
        pinchRef.current = { origin: point, last: point, dragging: false };
      } else {
        const moved = Math.hypot(point.x - pinch.origin.x, point.y - pinch.origin.y);
        if (moved > 14 && !pinch.dragging) {
          pinch.dragging = true;
          panByGesture(point.x - pinch.origin.x, point.y - pinch.origin.y);
        } else if (pinch.dragging) {
          panByGesture(point.x - pinch.last.x, point.y - pinch.last.y);
        }
        pinch.last = point;
      }
      gestureRef.current = { name: 'Pinch', since: now, fired: true };
      return;
    }

    if (pinchRef.current) {
      const pinch = pinchRef.current;
      if (!pinch.dragging) clickAt(pinch.last);
      pinchRef.current = null;
    }

    if (category === 'Open_Palm') {
      const handHeight = point.y / window.innerHeight;
      if (handHeight < 0.43) scrollByGesture(-Math.min(76, 14 + (0.43 - handHeight) * 180));
      else if (handHeight > 0.57) scrollByGesture(Math.min(76, 14 + (handHeight - 0.57) * 180));
    }

    if (gestureRef.current.name !== category) {
      gestureRef.current = { name: category, since: now, fired: false };
      return;
    }
    const heldFor = now - gestureRef.current.since;
    if (category === 'Closed_Fist' && heldFor > 800 && !gestureRef.current.fired) {
      gestureRef.current.fired = true;
      stopCamera();
    }
  }, [clickAt, drawSkeleton, panByGesture, scrollByGesture, stopCamera]);

  const startCamera = useCallback(async () => {
    const session = ++sessionRef.current;
    setStatus('loading');
    setMessage('Waiting for camera access…');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access requires a secure browser connection.');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (sessionRef.current !== session) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const video = videoRef.current;
      if (!video) throw new Error('Camera preview could not be initialized.');
      video.srcObject = stream;
      await video.play();

      setMessage('Loading gesture controls…');
      const { FilesetResolver, GestureRecognizer: GestureRecognizerTask } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks(wasmUrl);
      const baseOptions = {
        runningMode: 'VIDEO' as const,
        numHands: 1,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      };
      let recognizer: GestureRecognizer;
      try {
        recognizer = await GestureRecognizerTask.createFromOptions(vision, {
          ...baseOptions,
          baseOptions: { modelAssetPath: modelUrl, delegate: 'GPU' },
        });
      } catch {
        recognizer = await GestureRecognizerTask.createFromOptions(vision, {
          ...baseOptions,
          baseOptions: { modelAssetPath: modelUrl, delegate: 'CPU' },
        });
      }
      if (sessionRef.current !== session) {
        recognizer.close();
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      recognizerRef.current = recognizer;
      activeRef.current = true;
      setStatus('active');
      setMessage('Show one hand in the camera preview.');

      const analyze = (time: number) => {
        if (!activeRef.current || sessionRef.current !== session) return;
        if (time - lastFrameRef.current > 60 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          lastFrameRef.current = time;
          const result = recognizer.recognizeForVideo(video, time);
          handleResult(result, time);
        }
        if (activeRef.current && sessionRef.current === session) frameRef.current = requestAnimationFrame(analyze);
      };
      frameRef.current = requestAnimationFrame(analyze);
    } catch (error) {
      if (sessionRef.current !== session) return;
      activeRef.current = false;
      recognizerRef.current?.close();
      recognizerRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      drawSkeleton();
      setCursor(null);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not start the hand controls.');
    }
  }, [drawSkeleton, handleResult]);

  useEffect(() => () => {
    activeRef.current = false;
    cancelAnimationFrame(frameRef.current);
    recognizerRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    if (status === 'off') return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') stopCamera(); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [status, stopCamera]);

  const toggleCamera = () => {
    if (status === 'off' || status === 'error') void startCamera();
    else stopCamera();
  };

  return <>
    <button className={className ?? styles.gestureToggle} type="button" onClick={toggleCamera}
      aria-label={status === 'active' ? 'Turn off hand controls' : 'Enable hand controls'} aria-pressed={status === 'active'}>
      <Hand size={19} strokeWidth={1.8} aria-hidden="true" />
    </button>
    {typeof document !== 'undefined' && createPortal(<>
      <section ref={panelRef} className={styles.gesturePanel} hidden={status === 'off'} aria-label="Hand gesture controls">
        <div className={styles.gesturePanelHead}>
          <div><p className={styles.gesturePanelEyebrow}>Camera controls</p><h2>{status === 'active' ? 'Hands free' : status === 'loading' ? 'Starting camera' : 'Camera unavailable'}</h2></div>
          <button className={styles.gestureClose} type="button" onClick={stopCamera} aria-label="Close camera controls"><X size={18} /></button>
        </div>
        <div className={styles.gesturePanelBody}>
          <div className={styles.gesturePreview}>
            <video ref={videoRef} muted playsInline aria-label="Mirrored local camera preview" />
            <canvas ref={skeletonRef} width="320" height="240" aria-hidden="true" />
          </div>
          <div className={styles.gestureInfo}>
            <p className={styles.gestureMessage} aria-live="polite">{message}</p>
            <ul>
              <li><span>Open palm up/down</span> Scroll</li>
              <li><span>Pinch briefly</span> Click</li>
              <li><span>Pinch and move</span> Drag</li>
              <li><span>Closed fist</span> Turn off</li>
            </ul>
          </div>
        </div>
        {status !== 'error' && <button className={styles.gestureStop} type="button" onClick={stopCamera}>Turn off camera</button>}
        {status === 'error' && <button className={styles.gestureStop} type="button" onClick={() => void startCamera()}>Try again</button>}
      </section>
      {cursor && status === 'active' && <span className={styles.gestureCursor} style={{ left: cursor.x, top: cursor.y }} aria-hidden="true"><MousePointer2 size={26} fill="white" /></span>}
    </>, document.body)}
  </>;
}

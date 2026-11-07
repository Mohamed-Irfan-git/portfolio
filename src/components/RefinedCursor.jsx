import { useEffect, useRef } from 'react';

const interactive = 'a, button, [role="button"]';

export default function RefinedCursor({ disabled = false }) {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || disabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const move = event => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add('is-visible');
    };
    const over = event => {
      if (event.target instanceof Element && event.target.closest(interactive)) cursor.classList.add('is-over-link');
    };
    const out = event => {
      if (!event.relatedTarget) cursor.classList.remove('is-visible', 'is-over-link');
      if (event.relatedTarget instanceof Element && event.relatedTarget.closest(interactive)) return;
      cursor.classList.remove('is-over-link');
    };
    document.body.classList.add('has-refined-cursor');
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerout', out, { passive: true });
    return () => {
      document.body.classList.remove('has-refined-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerout', out);
    };
  }, [disabled]);

  return <span ref={cursorRef} className="refined-cursor" aria-hidden="true"/>;
}

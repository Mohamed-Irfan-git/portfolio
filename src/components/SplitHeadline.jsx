import { Children, isValidElement, useEffect, useRef } from 'react';

function plainText(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainText).join('');
  if (isValidElement(node)) return node.type === 'br' ? ' ' : plainText(node.props.children);
  return '';
}

function splitLines(children) {
  const lines = [[]];
  Children.forEach(children, child => {
    if (isValidElement(child) && child.type === 'br') lines.push([]);
    else lines[lines.length - 1].push(child);
  });
  return lines;
}

export default function SplitHeadline({ as: Heading = 'h2', className = '', children, ...props }) {
  const headingRef = useRef(null);
  const lines = splitLines(children);
  const label = plainText(children).replace(/\s+/g, ' ').trim();

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return undefined;
    if (!('IntersectionObserver' in window)) {
      heading.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        heading.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  return (
    <Heading ref={headingRef} className={`split-headline ${className}`.trim()} aria-label={props['aria-label'] || label} {...props}>
      {lines.map((line, index) => (
        <span className="split-headline-line" key={`line-${index}`}>
          <span className="split-headline-content" style={{ '--split-delay': `${Math.min(index * 100, 300)}ms` }}>{line}</span>
        </span>
      ))}
    </Heading>
  );
}

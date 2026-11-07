import { useEffect, useRef, useState } from 'react';
import { useMedia } from '../hooks/useMedia';

const tiers = [
  ['daily', 'Daily use'],
  ['project', 'Project experience'],
  ['learning', 'Learning'],
];

const iconPaths = {
  code: 'M8 5 3 10l5 5M16 5l5 5-5 5M14 3l-4 14',
  database: 'M4 6c0-2 4-3 8-3s8 1 8 3-4 3-8 3-8-1-8-3Zm0 0v6c0 2 4 3 8 3s8-1 8-3V6m-16 6v6c0 2 4 3 8 3s8-1 8-3v-6',
  cloud: 'M7 18a5 5 0 0 1-.5-10A7 7 0 0 1 20 10a4 4 0 0 1 0 8H7Z',
  spark: 'm12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Zm7 12 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z',
};

function initials(name) {
  return name.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function SkillIcon({ item }) {
  const path = iconPaths[item.icon];
  return (
    <svg className="skill-chip-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {path ? <path d={path} /> : <><rect x="1" y="1" width="22" height="22" rx="5" /><text x="12" y="15.5" textAnchor="middle">{initials(item.name)}</text></>}
    </svg>
  );
}

function CategoryVisual({ visual }) {
  const root = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={root} className={`skill-visual skill-visual--${visual}${inView ? ' is-in-view' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 280 172" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="skill-visual-grid" d="M16 28H264M16 86H264M16 144H264M52 12V160M140 12V160M228 12V160" />
        {visual === 'flow' && <g className="skill-diagram">
          <path className="skill-visual-line" d="M82 86h26m38 0h26" />
          <path className="skill-visual-line skill-visual-arrow" d="m103 80 6 6-6 6m63-12 6 6-6 6" />
          <rect className="skill-visual-box" x="26" y="62" width="56" height="48" rx="3" />
          <rect className="skill-visual-box skill-visual-box--active" x="108" y="62" width="56" height="48" rx="3" />
          <rect className="skill-visual-box" x="190" y="62" width="56" height="48" rx="3" />
          <circle className="skill-visual-pulse" cx="136" cy="86" r="4" />
        </g>}
        {visual === 'tables' && <g className="skill-diagram">
          <rect className="skill-visual-box" x="67" y="26" width="146" height="118" rx="3" />
          <path className="skill-visual-line" d="M67 52h146M67 82h146M67 112h146M116 52v92M164 52v92" />
          <path className="skill-visual-line skill-visual-line--accent" d="M78 40h33m14 0h33m14 0h30" />
          <circle className="skill-visual-pulse" cx="91" cy="67" r="3" />
          <circle className="skill-visual-pulse" cx="139" cy="97" r="3" />
          <circle className="skill-visual-pulse" cx="187" cy="127" r="3" />
        </g>}
        {visual === 'layers' && <g className="skill-diagram">
          <path className="skill-visual-box" d="m140 29 76 38-76 38-76-38 76-38Z" />
          <path className="skill-visual-box skill-visual-box--active" d="m64 80 76 38 76-38m-152 17 76 38 76-38" />
          <path className="skill-visual-line" d="M64 67v30m152-30v30m-76 8v30" />
          <circle className="skill-visual-pulse" cx="140" cy="67" r="4" />
        </g>}
        {visual === 'graph' && <g className="skill-diagram">
          <path className="skill-visual-line" d="m62 56 56 30m0 0 50-41m-50 41 65 43M118 86l-47 45m97-86 15 82m-15-82 54 37" />
          <circle className="skill-visual-node" cx="62" cy="56" r="7" />
          <circle className="skill-visual-node skill-visual-node--active" cx="118" cy="86" r="9" />
          <circle className="skill-visual-node" cx="168" cy="45" r="6" />
          <circle className="skill-visual-node" cx="183" cy="129" r="7" />
          <circle className="skill-visual-node" cx="71" cy="131" r="6" />
          <circle className="skill-visual-node" cx="222" cy="82" r="6" />
        </g>}
        {visual === 'ring' && <g className="skill-diagram">
          <circle className="skill-visual-ring" cx="140" cy="86" r="54" />
          <circle className="skill-visual-ring skill-visual-ring--inner" cx="140" cy="86" r="35" />
          <path className="skill-visual-ring skill-visual-ring--accent" d="M140 32a54 54 0 0 1 46.8 27" />
          <circle className="skill-visual-node skill-visual-node--active" cx="187" cy="59" r="5" />
          <circle className="skill-visual-node" cx="110" cy="47" r="4" />
          <circle className="skill-visual-node" cx="113" cy="119" r="4" />
          <circle className="skill-visual-core" cx="140" cy="86" r="12" />
        </g>}
        {visual === 'ui' && <g className="skill-diagram">
          <rect className="skill-visual-box" x="50" y="26" width="180" height="120" rx="4" />
          <path className="skill-visual-line" d="M50 48h180" />
          <circle className="skill-visual-node" cx="63" cy="37" r="2.5" />
          <circle className="skill-visual-node" cx="73" cy="37" r="2.5" />
          <rect className="skill-visual-box skill-visual-box--active" x="65" y="62" width="69" height="66" rx="2" />
          <rect className="skill-visual-box" x="147" y="62" width="67" height="26" rx="2" />
          <rect className="skill-visual-box" x="147" y="97" width="67" height="31" rx="2" />
          <path className="skill-visual-line skill-visual-line--accent" d="M76 115h26m55-40h35" />
        </g>}
        {visual === 'arch' && <g className="skill-diagram">
          <path className="skill-visual-line" d="M78 55v34m62-34v34m62-34v34M78 109v20m62-20v20m62-20v20M78 72h124M78 119h124" />
          <rect className="skill-visual-box" x="52" y="32" width="52" height="24" rx="2" />
          <rect className="skill-visual-box skill-visual-box--active" x="114" y="32" width="52" height="24" rx="2" />
          <rect className="skill-visual-box" x="176" y="32" width="52" height="24" rx="2" />
          <rect className="skill-visual-box" x="52" y="88" width="52" height="22" rx="2" />
          <rect className="skill-visual-box" x="114" y="88" width="52" height="22" rx="2" />
          <rect className="skill-visual-box" x="176" y="88" width="52" height="22" rx="2" />
          <circle className="skill-visual-pulse" cx="140" cy="72" r="3" />
        </g>}
      </svg>
    </figure>
  );
}

function SkillPanel({ group, index, groups, projects, onProjectSelect, panelId, labelledBy, panelRole = 'tabpanel', hidden = false }) {
  const validTiers = new Set(tiers.map(([id]) => id));
  const unclassified = group.items.filter((item) => !validTiers.has(item.level));
  let chipIndex = 0;

  function renderItems(items) {
    return items.map((item) => {
      const order = chipIndex++;
      return (
        <article className="skill-item" key={item.name} style={{ '--chip-delay': `${order * 40}ms` }}>
          <span className="skill-chip"><SkillIcon item={item} />{item.name}</span>
          {item.usedIn?.length > 0 && <div className="skill-used-in">
            <span>Used in:</span>
            {item.usedIn.map((name) => {
              const project = projects.find((entry) => entry.name === name);
              return <a key={name} href={project ? '#projects' : '#projects'} onClick={project ? (event) => { event.preventDefault(); onProjectSelect(project); } : undefined}>{name.replaceAll('_', ' ')} <span aria-hidden="true">↗</span></a>;
            })}
          </div>}
        </article>
      );
    });
  }

  return (
    <article className="skill-panel" id={panelId} role={panelRole} aria-labelledby={labelledBy} tabIndex={0} hidden={hidden}>
      <header className="skill-panel-head">
        <span className="eyebrow">CONNECTED CAPABILITIES <b>{String(index + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}</b></span>
        <h3>{group.title}</h3>
        {group.tagline && <p className="skill-tagline">{group.tagline}</p>}
      </header>
      <CategoryVisual visual={group.visual} />
      <div className="skill-details">
        {unclassified.length > 0 && <div className="skill-item-grid" aria-label="Items with experience level to be confirmed">{renderItems(unclassified)}</div>}
        {tiers.map(([tier, label]) => {
          const items = group.items.filter((item) => item.level === tier);
          if (!items.length) return null;
          return <section className="skill-tier" key={tier}>
            <h4>{label}</h4>
            <div className="skill-item-grid">{renderItems(items)}</div>
          </section>;
        })}
      </div>
    </article>
  );
}

export default function SkillsSection({ groups, selectedId, onSelect, projects, onProjectSelect }) {
  const mobile = useMedia('(max-width: 767px)');
  const tabRefs = useRef([]);
  const active = groups.find((group) => group.id === selectedId) || groups[0];

  function onKeyDown(event, index) {
    const { key } = event;
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) {
      if (!mobile && key === 'Enter') onSelect(groups[index].id);
      return;
    }
    event.preventDefault();
    const direction = key === 'ArrowDown' || key === 'ArrowRight' ? 1 : -1;
    const next = key === 'Home' ? 0 : key === 'End' ? groups.length - 1 : (index + direction + groups.length) % groups.length;
    tabRefs.current[next]?.focus();
    if (!mobile) onSelect(groups[next].id);
  }

  return (
    <div className={`skills-layout${mobile ? ' is-accordion' : ''}`}>
      <div className="skill-list" role={mobile ? 'list' : 'tablist'} aria-label="Skill disciplines" aria-orientation={mobile ? undefined : 'vertical'}>
        {groups.map((group, index) => {
          const selected = active.id === group.id;
          const expanded = selectedId === group.id;
          const panelId = mobile ? `skill-panel-${group.id}` : 'skill-panel';
          const labelledBy = `skill-tab-${group.id}`;
          return <div className={`skill-entry${mobile && expanded ? ' is-open' : ''}`} key={group.id} role={mobile ? 'listitem' : undefined}>
            <button
              ref={(node) => { tabRefs.current[index] = node; }}
              id={labelledBy}
              type="button"
              role={mobile ? undefined : 'tab'}
              aria-selected={mobile ? undefined : selected}
              aria-expanded={mobile ? expanded : undefined}
              aria-controls={panelId}
              tabIndex={mobile || selected ? 0 : -1}
              onClick={() => onSelect(mobile && expanded ? null : group.id)}
              onMouseEnter={() => { if (!mobile) onSelect(group.id); }}
              onKeyDown={(event) => onKeyDown(event, index)}
              className="skill-category-button"
            >
              <span className="skill-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="skill-category-title">{group.title}</span>
              <span className="skill-arrow" aria-hidden="true">{mobile ? (expanded ? '−' : '+') : '↗'}</span>
            </button>
            {mobile && <SkillPanel key={`${group.id}-${expanded}`} group={group} index={index} groups={groups} projects={projects} onProjectSelect={onProjectSelect} panelId={panelId} labelledBy={labelledBy} panelRole="region" hidden={!expanded} />}
          </div>;
        })}
      </div>
      {!mobile && <SkillPanel key={active.id} group={active} index={groups.indexOf(active)} groups={groups} projects={projects} onProjectSelect={onProjectSelect} panelId="skill-panel" labelledBy={`skill-tab-${active.id}`} />}
    </div>
  );
}

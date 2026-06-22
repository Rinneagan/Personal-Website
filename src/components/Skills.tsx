'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS = {
  Languages: ['TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS', 'SQL'],
  Frontend: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Radix UI'],
  Backend: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'WebSockets'],
  Databases: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'SQLite'],
  Tools: ['Git', 'GitHub Actions', 'Docker', 'Vercel', 'Linux', 'Figma'],
};

type SkillGroup = keyof typeof SKILLS;

interface SkillDetail {
  name: string;
  prof: number; // Proficiency (0-100)
  exp: string;  // Experience
  useCase: string; // Primary use case
  description: string;
  // Footprint: [Architecture, Frontend, Backend, Data Systems, DevOps, Performance]
  footprint: [number, number, number, number, number, number];
}

const CATEGORY_TELEMETRY: Record<SkillGroup, SkillDetail> = {
  Languages: {
    name: 'Languages Core',
    prof: 90,
    exp: '4+ Years',
    useCase: 'Polyglot programming & algorithm implementation',
    description: 'Expertise in modern language runtimes, type systems, asynchronous computing, and structured scripting.',
    footprint: [85, 90, 80, 75, 50, 88],
  },
  Frontend: {
    name: 'Frontend Core',
    prof: 92,
    exp: '3+ Years',
    useCase: 'Modern client architectures & responsive user flows',
    description: 'Specialization in declarative frameworks, modular styling systems, design tokens, accessibility, and smooth animations.',
    footprint: [88, 98, 50, 30, 45, 85],
  },
  Backend: {
    name: 'Backend Core',
    prof: 86,
    exp: '3+ Years',
    useCase: 'Server-side API engines & real-time messaging runtimes',
    description: 'Deep knowledge of event-driven request routing, stateless microservices, relational structures, and live duplex communication channels.',
    footprint: [88, 30, 96, 80, 60, 88],
  },
  Databases: {
    name: 'Databases Core',
    prof: 84,
    exp: '3 Years',
    useCase: 'Transactional data stores & memory structures',
    description: 'Experience handling ACID constraints, relational index plans, document indexing, key-value layers, and automated query mapping.',
    footprint: [80, 10, 82, 98, 50, 90],
  },
  Tools: {
    name: 'DevOps & Tools Core',
    prof: 85,
    exp: '3 Years',
    useCase: 'CI/CD automation pipelines & staging runtimes',
    description: 'Workflow automations, containerization scripts, secure server shell administration, and cloud deployment pipelines.',
    footprint: [75, 30, 65, 55, 95, 88],
  },
};

const SKILL_TELEMETRY: Record<string, SkillDetail> = {
  // Languages
  TypeScript: {
    name: 'TypeScript',
    prof: 95,
    exp: '3+ Years',
    useCase: 'Strictly typed application architecture and design systems',
    description: 'Advanced programming model to compile clean JavaScript, ensuring safety across API boundaries and client states.',
    footprint: [92, 85, 80, 50, 40, 95],
  },
  JavaScript: {
    name: 'JavaScript',
    prof: 92,
    exp: '4+ Years',
    useCase: 'Web interactivity and event-driven runtime configurations',
    description: 'Deep knowledge of ESNext features, prototype chains, closures, asynchronous event loops, and DOM engines.',
    footprint: [80, 92, 75, 50, 40, 85],
  },
  Python: {
    name: 'Python',
    prof: 85,
    exp: '3 Years',
    useCase: 'Automation scripts, backend hooks, and AI inference runtimes',
    description: 'Dynamic scripting, mathematical processing, numerical modeling, and backend integration pipelines.',
    footprint: [78, 30, 85, 75, 60, 80],
  },
  HTML: {
    name: 'HTML5',
    prof: 90,
    exp: '4+ Years',
    useCase: 'Semantic web layouts and document structures',
    description: 'HTML5 standards, accessibility compliance (WCAG), responsive structuring, and browser SEO optimization.',
    footprint: [40, 95, 10, 10, 20, 70],
  },
  CSS: {
    name: 'CSS3',
    prof: 88,
    exp: '4+ Years',
    useCase: 'Sleek visual layouts and hardware-accelerated animations',
    description: 'Modern styling mechanisms, including flexbox/grid, custom animations, transitions, and theme tokens.',
    footprint: [50, 95, 10, 10, 20, 85],
  },
  SQL: {
    name: 'SQL',
    prof: 82,
    exp: '3+ Years',
    useCase: 'Relational data queries and database schema design',
    description: 'Structured query formulation, database triggers, index optimizations, and relational mapping paradigms.',
    footprint: [70, 10, 80, 95, 40, 85],
  },
  // Frontend
  React: {
    name: 'React',
    prof: 92,
    exp: '3+ Years',
    useCase: 'Component-driven user interface architectures',
    description: 'Declarative component building, custom hook abstractions, state coordination, and virtual DOM diffing.',
    footprint: [85, 95, 45, 30, 40, 80],
  },
  'Next.js': {
    name: 'Next.js',
    prof: 90,
    exp: '2+ Years',
    useCase: 'Server-side rendering and static site generation routing',
    description: 'Full-stack framework implementation leveraging SSR, ISR, dynamic routing, and API request handling.',
    footprint: [92, 90, 75, 60, 70, 92],
  },
  'Tailwind CSS': {
    name: 'Tailwind CSS',
    prof: 95,
    exp: '3 Years',
    useCase: 'Utility-first rapid interface layout styling',
    description: 'Rapid responsive layouts using theme utility classes, custom extensions, and minimal stylesheet size footprint.',
    footprint: [45, 95, 10, 10, 25, 88],
  },
  'Framer Motion': {
    name: 'Framer Motion',
    prof: 88,
    exp: '2 Years',
    useCase: 'Dynamic physics-based user experience micro-animations',
    description: 'State-driven animations, exit/entry transitions, custom keyframes, and scroll-bound animations.',
    footprint: [50, 95, 10, 10, 15, 80],
  },
  'Radix UI': {
    name: 'Radix UI',
    prof: 85,
    exp: '2 Years',
    useCase: 'Accessible component primitives and headless UI frameworks',
    description: 'Unstyled, accessible building blocks facilitating custom styling and compliance with screen reader specs.',
    footprint: [60, 90, 10, 10, 15, 85],
  },
  // Backend
  'Node.js': {
    name: 'Node.js',
    prof: 88,
    exp: '3+ Years',
    useCase: 'Server-side JavaScript execution and build packaging',
    description: 'Asynchronous event-driven backend systems, middleware orchestration, and file I/O operations.',
    footprint: [85, 30, 95, 75, 60, 85],
  },
  Express: {
    name: 'Express',
    prof: 85,
    exp: '3 Years',
    useCase: 'HTTP request handling routing architectures',
    description: 'Minimalist RESTful backend web server structures, route handling, and request lifecycle management.',
    footprint: [80, 20, 95, 70, 50, 82],
  },
  'REST APIs': {
    name: 'REST APIs',
    prof: 90,
    exp: '4 Years',
    useCase: 'Secure and scalable stateless inter-service client communication',
    description: 'Stateless endpoints, secure token auth (JWT), standard HTTP codes, CORS configurations, and API testing.',
    footprint: [85, 50, 90, 80, 55, 88],
  },
  GraphQL: {
    name: 'GraphQL',
    prof: 78,
    exp: '2 Years',
    useCase: 'Efficient typed single-endpoint data querying systems',
    description: 'Flexible client query structures, custom resolver schemas, and query response payloads.',
    footprint: [85, 60, 90, 85, 50, 82],
  },
  WebSockets: {
    name: 'WebSockets',
    prof: 80,
    exp: '2 Years',
    useCase: 'Bi-directional live messaging and telemetry events',
    description: 'Real-time duplex socket transport layers, event triggers, and connections keep-alive.',
    footprint: [80, 50, 90, 65, 50, 92],
  },
  // Databases
  PostgreSQL: {
    name: 'PostgreSQL',
    prof: 85,
    exp: '3+ Years',
    useCase: 'ACID-compliant storage of core transactional records',
    description: 'Advanced relational tables, data partitioning, indexing parameters, and complex query join logic.',
    footprint: [80, 10, 85, 98, 60, 90],
  },
  MongoDB: {
    name: 'MongoDB',
    prof: 82,
    exp: '3 Years',
    useCase: 'Document-oriented flexible schema data catalogs',
    description: 'Unstructured document aggregation pipelines, dynamic database indexing, and clustered scaling.',
    footprint: [75, 10, 80, 95, 55, 85],
  },
  Redis: {
    name: 'Redis',
    prof: 75,
    exp: '2 Years',
    useCase: 'High-speed session caching and memory-stored structures',
    description: 'Key-value database caching layer, puberty lists, sorted sets, and server pub-sub hooks.',
    footprint: [80, 10, 85, 95, 65, 98],
  },
  Prisma: {
    name: 'Prisma',
    prof: 88,
    exp: '2+ Years',
    useCase: 'Type-safe SQL querying and schema migrations ORM',
    description: 'Typed schema structures, database relationship mapping, auto-generated TypeScript queries, and migrations.',
    footprint: [85, 30, 85, 90, 45, 88],
  },
  SQLite: {
    name: 'SQLite',
    prof: 80,
    exp: '3 Years',
    useCase: 'Lightweight local database storage for tests and devices',
    description: 'Serverless embedded databases, zero-config relational file backings, and test harnesses.',
    footprint: [65, 10, 75, 90, 40, 85],
  },
  // Tools
  Git: {
    name: 'Git',
    prof: 90,
    exp: '4+ Years',
    useCase: 'Distributed team version tracking code control',
    description: 'Branch management workflows (Gitflow), conflict resolutions, rebasing, and source history integrity.',
    footprint: [80, 20, 60, 50, 85, 88],
  },
  'GitHub Actions': {
    name: 'GitHub Actions',
    prof: 82,
    exp: '2 Years',
    useCase: 'Automated continuous integration and build cycles scripts',
    description: 'Deployment workflows, unit testing pipelines, security auditing, and automated container pushes.',
    footprint: [80, 20, 60, 50, 95, 85],
  },
  Docker: {
    name: 'Docker',
    prof: 75,
    exp: '2 Years',
    useCase: 'Isolated sandbox container deployment runtimes',
    description: 'Custom Dockerfile scripts, multi-container compose networks, and production staging isolations.',
    footprint: [75, 15, 75, 70, 95, 85],
  },
  Vercel: {
    name: 'Vercel',
    prof: 88,
    exp: '3 Years',
    useCase: 'Global cloud edge network deployment optimization',
    description: 'Seamless static asset hosting, serverless function routing, global edge caching, and build analytics.',
    footprint: [60, 45, 60, 40, 95, 92],
  },
  Linux: {
    name: 'Linux',
    prof: 80,
    exp: '3 Years',
    useCase: 'Secure shell deployment servers automation environment',
    description: 'Terminal command automations, server administration, user permissions, and cron scheduling.',
    footprint: [75, 10, 80, 70, 90, 88],
  },
  Figma: {
    name: 'Figma',
    prof: 70,
    exp: '2+ Years',
    useCase: 'Vector-based user interface screen mockups',
    description: 'High-fidelity wireframes, interactive user flows, design systems, and developer asset handoffs.',
    footprint: [30, 90, 10, 10, 15, 70],
  },
};

const cx = 160;
const cy = 160;
const r = 95;

const getCoords = (index: number, val: number) => {
  const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2;
  const x = cx + r * (val / 100) * Math.cos(angle);
  const y = cy + r * (val / 100) * Math.sin(angle);
  return { x, y };
};

const RADAR_AXES = [
  { label: 'Architecture', key: 'arch' },
  { label: 'Frontend', key: 'front' },
  { label: 'Backend', key: 'back' },
  { label: 'Data Systems', key: 'data' },
  { label: 'DevOps', key: 'dev' },
  { label: 'Performance', key: 'perf' },
];

const referenceLevels = [25, 50, 75, 100];

export function Skills() {
  const [activeGroup, setActiveGroup] = useState<SkillGroup>('Languages');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Active detail corresponds to the hovered skill telemetry, or falls back to active category core
  const activeDetail: SkillDetail = hoveredSkill && SKILL_TELEMETRY[hoveredSkill]
    ? SKILL_TELEMETRY[hoveredSkill]
    : CATEGORY_TELEMETRY[activeGroup];

  // Helper to compile dynamic morphing path strings
  const getPathString = (footprint: [number, number, number, number, number, number]) => {
    return footprint.map((val, i) => {
      const { x, y } = getCoords(i, val);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  const activePathString = getPathString(activeDetail.footprint);

  return (
    <section id="skills" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow">Expertise</div>
          <h2 className="section-title">Skills & Radar</h2>
        </motion.div>

        {/* Dynamic Capability Dashboard Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          
          {/* Column 1: Skills Navigation and Grid Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="skills-nav" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.25rem' }}>
              {(Object.keys(SKILLS) as SkillGroup[]).map((group) => {
                const isActive = activeGroup === group;
                return (
                  <button
                    key={group}
                    className={`skills-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveGroup(group);
                      setHoveredSkill(null);
                    }}
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-skill-bg"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          zIndex: -1,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {group}
                  </button>
                );
              })}
            </div>

            {/* Interactive Grid Chips */}
            <div 
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem',
                minHeight: '140px',
                alignContent: 'flex-start',
              }}
            >
              <AnimatePresence mode="popLayout">
                {SKILLS[activeGroup].map((tag) => {
                  const isHovered = hoveredSkill === tag;
                  return (
                    <motion.button
                      key={tag}
                      onMouseEnter={() => setHoveredSkill(tag)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="skill-chip"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        borderColor: isHovered ? 'var(--blue)' : 'var(--border)',
                        color: isHovered ? 'var(--blue)' : 'var(--text-1)',
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'default',
                        outline: 'none',
                        transition: 'border-color 0.2s, color 0.2s',
                      }}
                      layout
                    >
                      {tag}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Column 2: SVG Radar and Live Telemetry Cards */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '2rem',
              width: '100%',
            }}
          >
            {/* Visualizer Frame */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
              }}
            >
              {/* SVG Radar Visualizer */}
              <div
                style={{
                  width: '260px',
                  height: '260px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  userSelect: 'none',
                  position: 'relative',
                }}
              >
                <svg
                  viewBox="0 0 320 320"
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                  }}
                >
                  {/* Reference Grid Hexagons */}
                  {referenceLevels.map((level) => {
                    const points = RADAR_AXES.map((_, i) => {
                      const { x, y } = getCoords(i, level);
                      return `${x},${y}`;
                    }).join(' ');
                    return (
                      <g key={level}>
                        <polygon
                          points={points}
                          fill="none"
                          stroke="var(--border)"
                          strokeWidth="1"
                          strokeDasharray={level === 100 ? 'none' : '3 3'}
                          style={{ opacity: 0.8 }}
                        />
                        <text
                          x={cx + 4}
                          y={cy - (r * level) / 100 + 3}
                          fill="var(--text-3)"
                          fontSize="7.5px"
                          fontFamily="var(--font-mono)"
                          style={{ pointerEvents: 'none' }}
                        >
                          {level}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis Spokes & Labels */}
                  {RADAR_AXES.map((axis, i) => {
                    const outer = getCoords(i, 100);
                    const labelPos = getCoords(i, 114);
                    return (
                      <g key={axis.key}>
                        <line
                          x1={cx}
                          y1={cy}
                          x2={outer.x}
                          y2={outer.y}
                          stroke="var(--border)"
                          strokeWidth="1"
                        />
                        <circle
                          cx={outer.x}
                          cy={outer.y}
                          r="2"
                          fill="var(--border)"
                        />
                        <text
                          x={labelPos.x}
                          y={labelPos.y + 3}
                          textAnchor="middle"
                          fill="var(--text-3)"
                          fontSize="9px"
                          fontWeight="500"
                          style={{
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          {axis.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Smooth Morphing Dynamic Data Path */}
                  <motion.path
                    d={activePathString}
                    fill="rgba(37, 99, 235, 0.07)"
                    stroke="var(--blue)"
                    strokeWidth="2.5"
                    animate={{ d: activePathString }}
                    transition={{
                      type: 'spring',
                      stiffness: 90,
                      damping: 14,
                    }}
                    style={{
                      filter: 'drop-shadow(0 4px 16px rgba(37, 99, 235, 0.22))',
                    }}
                  />

                  {/* Active Anchor Pins */}
                  {activeDetail.footprint.map((val, i) => {
                    const { x, y } = getCoords(i, val);
                    return (
                      <motion.circle
                        key={`pin-${i}`}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="var(--blue)"
                        stroke="var(--surface)"
                        strokeWidth="1.5"
                        animate={{ cx: x, cy: y }}
                        transition={{
                          type: 'spring',
                          stiffness: 90,
                          damping: 14,
                        }}
                        style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))' }}
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Glassmorphic Live Telemetry Card */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-md)',
                  width: '100%',
                  maxWidth: '300px',
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'left',
                }}
              >
                {/* Glowing status stripe */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'var(--blue)',
                }} />

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Telemetry Node
                    </span>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontWeight: 600 }}>
                      {activeDetail.exp}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-1)', letterSpacing: '-0.015em' }}>
                    {activeDetail.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: '1.45', marginBottom: '1rem' }}>
                    {activeDetail.description}
                  </p>
                  
                  {hoveredSkill && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <span style={{ display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Primary Application
                      </span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-1)', fontWeight: 500, lineHeight: 1.3 }}>
                        {activeDetail.useCase}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.3rem' }}>
                    <span>Relative Weight</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontWeight: 650 }}>
                      {activeDetail.prof}%
                    </span>
                  </div>
                  {/* Progress bar line */}
                  <div style={{ height: '5px', background: 'var(--bg-subtle)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeDetail.prof}%` }}
                      transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                      style={{ height: '100%', background: 'var(--blue)', borderRadius: '99px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  );
}

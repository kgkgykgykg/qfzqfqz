import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ─── Animated section wrapper ─── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealLeft({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealRight({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealScale({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Icons ─── */
const icons: Record<string, React.ReactNode> = {
  'Email Generator': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  'SMS Generator': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
  'Script Writer': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />,
  'Ad Copy': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />,
  'Image Prompts': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  'Video Scripts': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  'Hook Generator': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  'Profit Margin': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  'ROAS Calculator': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  'ROI Calculator': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  'Customer LTV': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
  'Ecom Profit': <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></>,
};

function ToolIcon({ name }: { name: string }) {
  const icon = icons[name];
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon || <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />}</svg>
  );
}

function AnimatedNumber({ to, duration = 1.8 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / (duration * 1000));
      const val = Math.floor(start + (to - start) * progress);
      el.textContent = val.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <span ref={ref}>0</span>;
}

/* ─── Data ─── */
const tools = [
  { name: 'Email Generator', category: 'AI', desc: 'High-converting email campaigns' },
  { name: 'SMS Generator', category: 'AI', desc: 'Punchy SMS marketing messages' },
  { name: 'Script Writer', category: 'AI', desc: 'Sales scripts and pitches' },
  { name: 'Ad Copy', category: 'AI', desc: 'Social media and ad copy' },
  { name: 'Image Prompts', category: 'AI', desc: 'AI image generation prompts' },
  { name: 'Video Scripts', category: 'AI', desc: 'Video content and storyboards' },
  { name: 'Hook Generator', category: 'AI', desc: 'Viral hooks for content' },
  { name: 'Product Descriptions', category: 'AI', desc: 'SEO-ready product pages' },
  { name: 'Strategy Chat', category: 'Ops', desc: 'Multi-model business assistant' },
  { name: 'Profit Margin', category: 'Calc', desc: 'Analyze product profitability' },
  { name: 'ROAS Calculator', category: 'Calc', desc: 'Break-even ad spend analysis' },
  { name: 'ROI Calculator', category: 'Calc', desc: 'Investment return metrics' },
  { name: 'Customer LTV', category: 'Calc', desc: 'Lifetime value estimation' },
  { name: 'Ecom Profit', category: 'Calc', desc: 'Monthly profit analysis' },
];

const aiLogos = [
  { name: 'Claude', url: 'https://www.google.com/s2/favicons?sz=64&domain=claude.ai' },
  { name: 'ChatGPT', url: 'https://www.google.com/s2/favicons?sz=64&domain=chat.openai.com' },
  { name: 'Gemini', url: 'https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com' },
  { name: 'Qwen', url: 'https://www.google.com/s2/favicons?sz=64&domain=qwen.ai' },
  { name: 'Mistral', url: 'https://www.google.com/s2/favicons?sz=64&domain=mistral.ai' },
  { name: 'Llama', url: 'https://www.google.com/s2/favicons?sz=64&domain=ai.meta.com' },
  { name: 'DeepSeek', url: 'https://www.google.com/s2/favicons?sz=64&domain=deepseek.com' },
  { name: 'Command-R', url: 'https://www.google.com/s2/favicons?sz=64&domain=cohere.com' },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

/* ─── Page ─── */
export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const d = theme === 'dark';

  return (
    <div className={d ? 'bg-bg text-text' : 'text-text-light'}>
      {/* ── Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${d ? 'bg-white/7 border border-white/18 text-text' : 'bg-white/16 border border-white/40 text-text-light'} backdrop-blur-2xl`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" style={{ backdropFilter: 'blur(18px)' }}>

          <Link to="/" className="font-display text-xl font-semibold">
            EcomBoost<span className="text-accent">.</span>ai
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {['Features', 'Tools', 'Pricing'].map(s => (
              <button
                key={s}
                onClick={() => scrollTo(s.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${d ? 'text-text-muted hover:text-text hover:bg-bg-subtle' : 'text-text-muted-light hover:text-text-light hover:bg-bg-subtle-light'}`}
              >
                {s}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-2.5 rounded-lg transition-all ${d ? 'btn-ghost' : 'btn-ghost-light'}`} aria-label="Toggle theme">
              {d ? (
                <svg className="w-[18px] h-[18px] theme-icon" style={{ transform: 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-[18px] h-[18px] theme-icon" style={{ transform: 'rotate(180deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <Link to="/dashboard" className="btn-primary px-5 py-2.5 rounded-lg text-sm font-medium">
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className={`pt-36 pb-28 px-6 relative overflow-hidden ${d ? 'bg-gradient-hero' : 'bg-gradient-hero-light'}`}>
        {/* Top gradient strip */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${d ? 'bg-gradient-to-r from-transparent via-accent/40 to-transparent' : 'bg-gradient-to-r from-transparent via-accent/30 to-transparent'}`} />
        {/* Glow blobs */}
        <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px] pointer-events-none ${d ? 'bg-accent/10' : 'bg-accent/[0.10]'}`} />
        <div className={`absolute top-40 -right-20 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${d ? 'bg-[#4f46e5]/8' : 'bg-[#4f46e5]/[0.07]'}`} />
        <div className={`absolute bottom-10 -left-20 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none ${d ? 'bg-success/6' : 'bg-success/[0.07]'}`} />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { label: 'Businesses helped', value: 12450 },
                { label: 'Revenue enabled', value: 8920000, prefix: '$' },
                { label: 'Time saved', value: 72, suffix: '%' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`${d ? 'bg-white/8 border border-white/18 text-text' : 'bg-white/14 border border-white/35 text-text-light'} backdrop-blur-3xl shadow-subtle rounded-lg px-3.5 py-2.5 flex flex-col items-center text-[10px] leading-tight`}
                  style={{ minWidth: '150px' }}
                >
                  <div className="text-[9px] uppercase tracking-wide mb-1 opacity-70">{stat.label}</div>
                  <div className="font-display text-lg font-semibold flex items-baseline gap-1">
                    {stat.prefix && <span className={d ? 'text-accent-light' : 'text-accent'}>{stat.prefix}</span>}
                    <span className={d ? 'text-accent-light' : 'text-accent'}><AnimatedNumber to={stat.value} /></span>
                    {stat.suffix && <span className={d ? 'text-accent-light' : 'text-accent'}>{stat.suffix}</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-[72px] font-semibold leading-[1.08] tracking-tight mb-6"
          >
            The toolkit for
            <br />
            <span className={d ? 'text-gradient' : 'text-gradient-light'}>e&#8209;commerce growth</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${d ? 'text-text-muted' : 'text-text-muted-light'}`}
          >
            AI&#8209;powered content generation and profit analytics.
            Built for serious e&#8209;commerce operators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <Link to="/dashboard" className="btn-primary px-8 py-3.5 rounded-xl font-medium text-base flex items-center gap-2">
              Start Building
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <button onClick={() => scrollTo('features')} className={`px-8 py-3.5 rounded-xl font-medium text-base transition-all ${d ? 'btn-secondary' : 'btn-secondary-light'}`}>
              Learn More
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className={`w-6 h-6 mx-auto ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </motion.div>
        </div>
      </section>

      {/* AI Logos Marquee */}
      <section className={`${d ? 'bg-gradient-section' : 'bg-gradient-section-light'} border-y ${d ? 'border-border' : 'border-border-light'} py-6`}>
        <div className="max-w-6xl mx-auto px-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${d ? 'bg-bg-subtle text-text' : 'bg-white text-text-light border border-[rgba(0,0,0,0.08)]'}`}>
              Multi-model
            </span>
            <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>Select your AI model of choice</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="marquee-track" style={{ animationDuration: '32s' }}>
              {[...aiLogos, ...aiLogos].map((logo, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 text-[13px] md:text-[14px] font-semibold px-2 py-3.5 rounded-lg border shadow-subtle ${
                    d ? 'border-border text-text bg-bg-elevated/80 backdrop-blur-xl' : 'border-border-light text-text-light bg-white/78 backdrop-blur-xl'
                  }`}
                  style={{ minWidth: '138px' }}
                >
                  <img src={logo.url} alt={logo.name} className="w-6 h-6 rounded-sm ml-1" loading="lazy" />
                  <span className={`truncate text-left ml-2 ${logo.name === 'Command-R' ? 'text-[12px]' : ''}`}>{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className={`py-28 ${d ? 'bg-gradient-section' : 'bg-gradient-section-light'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Everything you need to scale</h2>
            <p className={`text-lg max-w-xl mx-auto ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              A complete suite of tools designed to streamline your operations.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                title: 'AI Content Generation',
                desc: 'Generate high-converting emails, SMS, scripts, and ad copy in seconds using advanced AI models.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: 'Profit Analytics',
                desc: 'Calculate margins, ROAS break-even, ROI, and customer lifetime value with precision.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />,
                title: 'Multi-language',
                desc: 'Translate your generated marketing content into 12+ languages instantly with one click.',
              },
            ].map((f, i) => (
              <RevealScale key={f.title} delay={i * 0.12}>
                <div className={`${d ? 'card' : 'card-light'} p-8 rounded-2xl h-full`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${d ? 'bg-accent-soft text-accent-light' : 'bg-accent-softer text-accent'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className={`text-sm leading-relaxed ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{f.desc}</p>
                </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools Grid ── */}
      <section id="tools" className={`py-28 ${d ? 'bg-gradient-alt' : 'bg-gradient-alt-light'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Powerful tools, zero complexity</h2>
            <p className={`text-lg max-w-xl mx-auto ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              From content creation to financial analysis.
            </p>
          </Reveal>

          {/* AI Tools */}
          <RevealLeft className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d ? 'bg-accent-soft text-accent-light' : 'bg-accent-softer text-accent'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-display text-lg font-semibold">AI Content Tools</h3>
            </div>
          </RevealLeft>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
            {tools.filter(t => t.category === 'AI').map((tool, i) => (
              <Reveal key={tool.name} delay={i * 0.06}>
                <Link to="/dashboard" className={`${d ? 'card card-interactive' : 'card-light card-interactive'} p-5 rounded-xl block group h-full`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${d ? 'bg-accent-soft text-accent-light' : 'bg-accent-softer text-accent'}`}>
                      <ToolIcon name={tool.name} />
                    </div>
                    <svg className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{tool.name}</h4>
                  <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{tool.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Ops / Strategy */}
          <RevealRight className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d ? 'bg-bg-subtle text-text' : 'bg-white text-text-light border border-[rgba(0,0,0,0.08)]'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 13.042 3 11.574 3 10c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="font-display text-lg font-semibold">Ops & Strategy</h3>
            </div>
          </RevealRight>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {tools.filter(t => t.category === 'Ops').map((tool, i) => (
              <Reveal key={tool.name} delay={i * 0.06}>
                <Link to="/dashboard" className={`${d ? 'card card-interactive' : 'card-light card-interactive'} p-5 rounded-xl block group h-full`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${d ? 'bg-bg-subtle text-text' : 'bg-white text-text-light border border-[rgba(0,0,0,0.08)]'}`}>
                      <ToolIcon name={tool.name} />
                    </div>
                    <svg className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{tool.name}</h4>
                  <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{tool.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Calculators */}
          <RevealRight className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d ? 'bg-success-soft text-success' : 'bg-success/8 text-success'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-display text-lg font-semibold">Calculators</h3>
            </div>
          </RevealRight>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {tools.filter(t => t.category === 'Calc').map((tool, i) => (
              <Reveal key={tool.name} delay={i * 0.06}>
                <Link to="/dashboard" className={`${d ? 'card card-interactive' : 'card-light card-interactive'} p-5 rounded-xl block group h-full`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${d ? 'bg-success-soft text-success' : 'bg-success/8 text-success'}`}>
                      <ToolIcon name={tool.name} />
                    </div>
                    <svg className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{tool.name}</h4>
                  <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{tool.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing / CTA ── */}
      <section id="pricing" className={`py-28 ${d ? 'bg-gradient-cta' : 'bg-gradient-cta-light'}`}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">Ready to scale?</h2>
            <p className={`text-lg mb-10 ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              Join thousands of e-commerce operators using EcomBoost.ai
            </p>
          </Reveal>

          <RevealScale delay={0.15}>
            <div className={`p-10 rounded-2xl border ${d ? 'bg-bg border-border' : 'bg-white border-border-light shadow-subtle'}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${d ? 'bg-success/10 text-success' : 'bg-success/10 text-success'}`}>
                Free Plan
              </div>
              <div className="mb-2">
                <span className="font-display text-6xl font-bold">$0</span>
                <span className={`ml-2 ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>/forever</span>
              </div>
              <p className={`text-sm mb-8 ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>You only pay for AI tokens via OpenRouter</p>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-8 text-left">
                {['All AI tools', 'All calculators', 'Multi-language', 'Real-time streaming', 'No signup needed', 'Dark & light theme'].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-xl font-medium text-base">
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealScale>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={`py-20 ${d ? 'bg-gradient-section' : 'bg-gradient-section-light'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-10">
            <h2 className="font-display text-3xl font-semibold mb-3">FAQ</h2>
            <p className={`${d ? 'text-text-muted' : 'text-text-muted-light'}`}>Questions fréquentes sur EcomBoost.ai</p>
          </Reveal>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <FAQItem key={item.q} item={item} dark={d} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={`py-8 border-t ${d ? 'bg-bg border-border' : 'bg-bg-elevated-light border-border-light'}`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-lg font-semibold">EcomBoost<span className="text-accent">.</span>ai</div>
          <div className={`text-sm ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>© 2024 EcomBoost.ai. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

const faqItems = [
  { q: 'How does it work?', a: 'Pick your AI model, write a prompt, and generate content or insights instantly. No signup needed.' },
  { q: 'What will I gain?', a: 'Faster copy production, clearer analytics decisions, and more time back to run your business.' },
  { q: 'Can I choose any AI model?', a: 'Yes. Use Gemini, Claude, GPT-4o mini, Qwen, Mistral, DeepSeek and switch anytime inside Strategy Chat.' },
  { q: 'Is my data safe?', a: 'Prompts stay client-side and are sent only to the selected AI model. We do not store your prompts.' },
];

function FAQItem({ item, dark }: { item: { q: string; a: string }; dark: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${dark ? 'card' : 'card-light'} rounded-xl p-4`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div>
          <p className={`text-sm font-semibold ${dark ? 'text-text' : 'text-text-light'}`}>{item.q}</p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <p className={`text-sm mt-3 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>{item.a}</p>
      </motion.div>
    </div>
  );
}

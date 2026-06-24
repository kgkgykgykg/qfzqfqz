import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { Moon, Sun, ArrowLeft, ArrowRight, Shield, Zap, Target, BarChart3, Globe2, Mail, MessageSquare, FileText, Image as ImageIcon, Video, MousePointer2, Percent, TrendingUp, LineChart, PieChart, Users, DollarSign, Sparkles } from 'lucide-react';
import RotatingGlobe from '../components/RotatingGlobe';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

/* ─── Animated section wrapper ─── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{ willChange: 'transform, opacity' }}
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
      initial={{ opacity: 0, x: -25 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -25 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{ willChange: 'transform, opacity' }}
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
      initial={{ opacity: 0, x: 25 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 25 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{ willChange: 'transform, opacity' }}
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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      style={{ willChange: 'transform, opacity' }}
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
  const { language, t: translate } = useLanguage();
  const d = theme === 'dark';
  const [billingCycle, setBillingCycle] = useState<'month' | 'quarter' | 'year'>('month');

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTarget = params.get('scroll');
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget === 'pricing' ? 'landing-pricing' : scrollTarget.toLowerCase());
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.search]);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  const handleBuyClick = (e: React.MouseEvent, tier: 'starter' | 'pro' | 'business') => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate(`/login?redirect=checkout&tier=${tier}&billing=${billingCycle}`);
    } else {
      navigate(`/checkout?tier=${tier}&billing=${billingCycle}`);
    }
  };

  return (
    <div className={d ? 'bg-gradient-hero text-text' : 'bg-gradient-hero-light text-text-light'}>
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <section className={`pt-24 pb-16 px-6 relative overflow-hidden ${d ? 'bg-gradient-hero' : 'bg-gradient-hero-light'}`}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-4xl md:text-5xl lg:text-[68px] font-black leading-[1.1] tracking-tight mb-8 ${d ? 'text-white' : 'text-slate-950'}`}
          >
            {translate('landing.hero.title1')}
            <br />
            <span className="swoosh-underline text-[#38bdf8]">{translate('landing.hero.accent')}</span> <span className={d ? 'text-white' : 'text-slate-950'}>{translate('landing.hero.title2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-base md:text-lg font-medium mb-10 max-w-2xl mx-auto leading-relaxed ${d ? 'text-text-muted' : 'text-slate-600'}`}
          >
            {translate('landing.hero.desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button 
              onClick={handleDashboardClick}
              className="btn-primary !py-3 !px-8 !text-base rounded-full"
            >
              {translate('landing.hero.cta.primary')}
            </button>
            <button 
              onClick={() => scrollTo('landing-pricing')}
              className={`btn-secondary !py-3 !px-8 !text-base rounded-full ${d ? 'btn-secondary-dark' : 'btn-secondary-light'}`}
            >
              {translate('landing.hero.cta.secondary')}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-x-12"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1 border-b-2 border-accent/10 pb-1">72%</div>
              <div className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${d ? 'text-text-subtle' : 'text-slate-500'}`}>{translate('landing.hero.stats.hours')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-1 border-b-2 border-emerald-500/10 pb-1">+350%</div>
              <div className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${d ? 'text-text-subtle' : 'text-slate-500'}`}>{translate('landing.hero.stats.money')}</div>
            </div>
            <div className="text-center hidden md:block">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1 border-b-2 border-orange-500/10 pb-1">50%</div>
              <div className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${d ? 'text-text-subtle' : 'text-slate-500'}`}>{translate('landing.hero.stats.growth')}</div>
            </div>
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
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">{translate('landing.features.title')}</h2>
            <p className={`text-lg max-w-xl mx-auto ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              {translate('landing.features.subtitle')}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-5 h-5 relative z-10" />,
                title: translate('landing.features.ai.title'),
                desc: translate('landing.features.ai.desc'),
                color: 'bg-blue-500/20 text-blue-500 border-blue-500/10'
              },
              {
                icon: <Percent className="w-5 h-5 relative z-10" />,
                title: translate('landing.features.calc.title'),
                desc: translate('landing.features.calc.desc'),
                color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/10'
              },
              {
                icon: <Globe2 className="w-5 h-5 relative z-10" />,
                title: translate('landing.features.lang.title'),
                desc: translate('landing.features.lang.desc'),
                color: 'bg-orange-500/20 text-orange-500 border-orange-500/10'
              },
            ].map((f, i) => (
              <RevealScale key={f.title} delay={i * 0.12}>
                <div className={`${d ? 'card' : 'card-light'} p-8 rounded-3xl h-full transition-all hover:scale-[1.02]`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative overflow-hidden ${f.color}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className={`text-sm leading-relaxed ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{f.desc}</p>
                </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual Core Tools Showcase ── */}
      <section id="tools" className={`py-28 ${d ? 'bg-gradient-alt' : 'bg-gradient-alt-light'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 leading-tight">{translate('landing.showcase.title')}</h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              {translate('landing.showcase.subtitle')}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI CONTENT TOOLS COLUMN */}
            <RevealScale delay={0.05}>
              <div className={`${d ? 'card bg-bg-elevated/40' : 'card-light bg-white'} p-8 rounded-2xl h-full flex flex-col justify-between border ${d ? 'border-border' : 'border-border-light shadow-subtle'}`}>
                <div>
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden group ${d ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                      <Mail className="w-6 h-6 relative z-10" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">{translate('landing.showcase.ai.title')}</h3>
                      <p className={`text-xs ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>{translate('landing.showcase.ai.badge')}</p>
                    </div>
                  </div>

                  <p className={`text-sm mb-6 leading-relaxed ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    {translate('landing.showcase.ai.desc')}
                  </p>

                  <div className="space-y-4">
                    <Link to="/tools/email-generator" className={`block p-4 rounded-xl ${d ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'bg-blue-50/50 hover:bg-blue-50'} border ${d ? 'border-blue-500/20' : 'border-blue-200'} transition-all hover:translate-x-1`}>
                      <h4 className="font-semibold text-xs text-blue-500 uppercase tracking-wider mb-1">{translate('landing.showcase.ai.tool1')}</h4>
                      <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.showcase.ai.tool1Desc')}</p>
                    </Link>

                    <Link to="/tools/copy-writer" className={`block p-4 rounded-xl ${d ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'bg-blue-50/50 hover:bg-blue-50'} border ${d ? 'border-blue-500/20' : 'border-blue-200'} transition-all hover:translate-x-1`}>
                      <h4 className="font-semibold text-xs text-blue-500 uppercase tracking-wider mb-1">{translate('landing.showcase.ai.tool2')}</h4>
                      <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.showcase.ai.tool2Desc')}</p>
                    </Link>
                    
                    <Link to="/tools/ad-hooks" className={`block p-4 rounded-xl ${d ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'bg-blue-50/50 hover:bg-blue-50'} border ${d ? 'border-blue-500/20' : 'border-blue-200'} transition-all hover:translate-x-1`}>
                      <h4 className="font-semibold text-xs text-blue-500 uppercase tracking-wider mb-1">{translate('landing.showcase.ai.tool3')}</h4>
                      <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.showcase.ai.tool3Desc')}</p>
                    </Link>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.06)] dark:border-white/5">
                  <span className={`text-[11px] font-medium block mb-3 uppercase tracking-wider ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>{translate('common.alsoIncludes')}:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Ad Copy', 'Image Prompts', 'Video Scripts', 'Hook Generator', 'Product Descriptions'].map(tag => (
                      <span key={tag} className={`text-xs px-2.5 py-1 rounded-md font-medium ${d ? 'bg-bg-elevated text-text-muted border border-border' : 'bg-bg-subtle-light text-text-muted-light border border-border-light'}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealScale>

            {/* OPS & STRATEGY COLUMN */}
            <RevealScale delay={0.12}>
              <div className={`${d ? 'card bg-bg-elevated/40' : 'card-light bg-white'} p-8 rounded-2xl h-full flex flex-col justify-between border ${d ? 'border-border' : 'border-border-light shadow-subtle'}`}>
                <div>
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden group ${d ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                      <MessageSquare className="w-6 h-6 relative z-10" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">{translate('landing.showcase.ops.title')}</h3>
                      <p className={`text-xs ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>{translate('landing.showcase.ops.badge')}</p>
                    </div>
                  </div>

                  <p className={`text-sm mb-6 leading-relaxed ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    {translate('landing.showcase.ops.desc')}
                  </p>

                  <div className="space-y-4">
                    <Link to="/tools/competitor-spy" className={`block p-4 rounded-xl ${d ? 'bg-orange-500/5 hover:bg-orange-500/10' : 'bg-orange-50/50 hover:bg-orange-50'} border ${d ? 'border-orange-500/20' : 'border-orange-200'} transition-all hover:translate-x-1`}>
                      <h4 className="font-semibold text-xs text-orange-500 uppercase tracking-wider mb-1">{translate('landing.showcase.ops.tool1')}</h4>
                      <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.showcase.ops.tool1Desc')}</p>
                    </Link>

                    <div className={`p-4 rounded-xl ${d ? 'bg-orange-500/5' : 'bg-orange-50/10'} border border-dashed ${d ? 'border-orange-500/30' : 'border-orange-200'} flex items-center justify-center py-6`}>
                      <span className={`text-xs ${d ? 'text-text-subtle' : 'text-text-subtle-light'} italic`}>{translate('landing.showcase.ops.keyTip')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.06)] dark:border-white/5">
                  <Link to="/dashboard" className="btn-primary w-full text-center block text-sm font-semibold py-3 rounded-lg">
                    {translate('landing.showcase.ops.cta')}
                  </Link>
                </div>
              </div>
            </RevealScale>

            {/* CALCULATORS COLUMN */}
            <RevealScale delay={0.18}>
              <div className={`${d ? 'card bg-bg-elevated/40' : 'card-light bg-white'} p-8 rounded-2xl h-full flex flex-col justify-between border ${d ? 'border-border' : 'border-border-light shadow-subtle'}`}>
                <div>
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden group ${d ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                      <Percent className="w-6 h-6 relative z-10" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">{translate('landing.showcase.calc.title')}</h3>
                      <p className={`text-xs ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>{translate('landing.showcase.calc.badge')}</p>
                    </div>
                  </div>

                  <p className={`text-sm mb-6 leading-relaxed ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
                    {translate('landing.showcase.calc.desc')}
                  </p>

                  <div className="space-y-4">
                    <Link to="/tools/profit-margin" className={`block p-4 rounded-xl ${d ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-emerald-50/50 hover:bg-emerald-50'} border ${d ? 'border-emerald-500/20' : 'border-emerald-200'} transition-all hover:translate-x-1`}>
                      <h4 className="font-semibold text-xs text-emerald-500 uppercase tracking-wider mb-1">{translate('landing.showcase.calc.tool1')}</h4>
                      <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.showcase.calc.tool1Desc')}</p>
                    </Link>

                    <Link to="/tools/roas-calculator" className={`block p-4 rounded-xl ${d ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-emerald-50/50 hover:bg-emerald-50'} border ${d ? 'border-emerald-500/20' : 'border-emerald-200'} transition-all hover:translate-x-1`}>
                      <h4 className="font-semibold text-xs text-emerald-500 uppercase tracking-wider mb-1">{translate('landing.showcase.calc.tool2')}</h4>
                      <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.showcase.calc.tool2Desc')}</p>
                    </Link>

                    <Link to="/tools/cpa-calculator" className={`block p-4 rounded-xl ${d ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-emerald-50/50 hover:bg-emerald-50'} border ${d ? 'border-emerald-500/20' : 'border-emerald-200'} transition-all hover:translate-x-1`}>
                      <h4 className="font-semibold text-xs text-emerald-500 uppercase tracking-wider mb-1">{translate('landing.showcase.calc.tool3')}</h4>
                      <p className={`text-xs ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.showcase.calc.tool3Desc')}</p>
                    </Link>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(0,0,0,0.06)] dark:border-white/5">
                  <span className={`text-[11px] font-medium block mb-3 uppercase tracking-wider ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>{translate('common.alsoIncludes')}:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Customer LTV', 'Ecom Profit'].map(tag => (
                      <span key={tag} className={`text-xs px-2.5 py-1 rounded-md font-medium ${d ? 'bg-bg-elevated text-text-muted border border-border' : 'bg-bg-subtle-light text-text-muted-light border border-border-light'}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealScale>
          </div>
        </div>
      </section>

      {/* ── Comparison Section ── */}
      <section id="comparison" className={`py-28 ${d ? 'bg-bg-subtle/20' : 'bg-[#e0e7ff]/30'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold mb-4">{translate('landing.comparison.title')}</h2>
            <p className={`text-lg max-w-xl mx-auto ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              {translate('landing.comparison.subtitle')}
            </p>
          </Reveal>

          <div className={`overflow-hidden rounded-3xl border ${d ? 'bg-bg/40 border-white/5' : 'bg-white border-slate-300 shadow-xl shadow-slate-200/50'}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={d ? 'bg-bg-subtle/50' : 'bg-slate-50'}>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest opacity-40">{translate('landing.comparison.capability')}</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest text-accent">EcomBoost AI</th>
                  <th className="p-6 text-sm font-bold uppercase tracking-widest opacity-40">{translate('landing.comparison.standardAgency')}</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${d ? 'divide-white/5' : 'divide-slate-200'}`}>
                {[
                  { feature: translate('landing.comparison.row1.f'), active: translate('landing.comparison.row1.a'), agency: translate('landing.comparison.row1.s') },
                  { feature: translate('landing.comparison.row2.f'), active: translate('landing.comparison.row2.a'), agency: translate('landing.comparison.row2.s') },
                  { feature: translate('landing.comparison.row3.f'), active: translate('landing.comparison.row3.a'), agency: translate('landing.comparison.row3.s') },
                  { feature: translate('landing.comparison.row4.f'), active: translate('landing.comparison.row4.a'), agency: translate('landing.comparison.row4.s') },
                  { feature: translate('landing.comparison.row5.f'), active: translate('landing.comparison.row5.a'), agency: translate('landing.comparison.row5.s') },
                  { feature: translate('landing.comparison.row6.f'), active: translate('landing.comparison.row6.a'), agency: translate('landing.comparison.row6.s') },
                  { feature: translate('landing.comparison.row7.f'), active: translate('landing.comparison.row7.a'), agency: translate('landing.comparison.row7.s') }
                ].map((row, i) => (
                  <tr key={i} className={`transition-colors ${d ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                    <td className="p-6 text-sm font-semibold">{row.feature}</td>
                    <td className="p-6 text-sm font-bold text-accent">{row.active}</td>
                    <td className="p-6 text-sm opacity-40">{row.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Customer Reviews ── */}
      <section className={`py-24 border-y ${d ? 'bg-bg-elevated/40 border-border' : 'bg-bg-subtle-light/30 border-border-light'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="flex items-center justify-center gap-1.5 mb-3 text-orange-500">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-center">{translate('landing.reviews.title')}</h2>
            <p className={`text-base md:text-lg max-w-xl mx-auto ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              {translate('landing.reviews.subtitle')}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Alex Mercer',
                role: translate('landing.reviews.user1.role'),
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
                comment: translate('landing.reviews.user1.comment'),
                stars: 5
              },
              {
                name: 'Elena Rodriguez',
                role: translate('landing.reviews.user2.role'),
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
                comment: translate('landing.reviews.user2.comment'),
                stars: 5
              },
              {
                name: 'Jordan Smith',
                role: translate('landing.reviews.user3.role'),
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120',
                comment: translate('landing.reviews.user3.comment'),
                stars: 5
              }
            ].map((review, idx) => (
              <RevealScale key={review.name} delay={idx * 0.1}>
                <div className={`${d ? 'card bg-bg/60' : 'card-light bg-white'} p-6 rounded-xl flex flex-col justify-between h-full border ${d ? 'border-border/60' : 'border-border-light shadow-sm'}`}>
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-orange-500">
                      {[...Array(review.stars)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className={`text-sm italic leading-relaxed mb-6 ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
                      "{review.comment}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-[rgba(0,0,0,0.04)] dark:border-white/5">
                    <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border border-accent/20" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">{review.name}</h4>
                      <p className={`text-xs ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>{review.role}</p>
                    </div>
                  </div>
                </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="landing-pricing" className={`py-28 border-t ${d ? 'bg-gradient-cta' : 'bg-gradient-cta-light'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-3">{translate('landing.pricing.title')}</h2>
            <p className={`text-base md:text-lg max-w-2xl mx-auto mb-10 ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
              {translate('landing.pricing.subtitle')}
            </p>

            {/* Billing cycle controls */}
            <div className={`inline-flex items-center gap-1 p-1 rounded-2xl border ${d ? 'bg-bg border-white/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
              {[
                { id: 'month', label: translate('landing.pricing.cycle.monthly'), discount: null },
                { id: 'quarter', label: translate('landing.pricing.cycle.quarterly'), discount: '-15%' },
                { id: 'year', label: translate('landing.pricing.cycle.annually'), discount: '-30%' }
              ].map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setBillingCycle(cycle.id as 'month' | 'quarter' | 'year')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                    billingCycle === cycle.id
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : d ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-900 font-bold'
                  }`}
                >
                  <span>{cycle.label}</span>
                  {cycle.discount && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                      billingCycle === cycle.id
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {cycle.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 items-stretch pt-12">
            {[
              {
                id: 'starter' as const,
                name: translate('landing.pricing.starter.name'),
                desc: translate('landing.pricing.starter.desc'),
                priceMonth: 59,
                priceQuarter: 51,
                priceYear: 39,
                isPopular: false,
                delay: 0.05,
                features: [
                  { text: translate('landing.pricing.starter.feat1'), highlight: false },
                  { text: translate('landing.pricing.starter.feat2'), highlight: true },
                  { text: translate('landing.pricing.starter.feat3'), highlight: false },
                  { text: translate('landing.pricing.starter.feat4'), highlight: false },
                  { text: translate('landing.pricing.starter.feat5'), highlight: false },
                  { text: translate('landing.pricing.starter.feat6'), highlight: false },
                  { text: translate('landing.pricing.starter.feat7'), highlight: false },
                  { text: translate('landing.pricing.starter.feat8'), highlight: false },
                ],
                buttonText: translate('landing.pricing.starter.btn'),
              },
              {
                id: 'pro' as const,
                name: translate('landing.pricing.pro.name'),
                desc: translate('landing.pricing.pro.desc'),
                priceMonth: 89,
                priceQuarter: 76,
                priceYear: 57,
                isPopular: true,
                delay: 0.1,
                features: [
                  { text: translate('landing.pricing.pro.feat1'), highlight: true },
                  { text: translate('landing.pricing.pro.feat2'), highlight: false },
                  { text: translate('landing.pricing.pro.feat3'), highlight: true },
                  { text: translate('landing.pricing.pro.feat4'), highlight: true },
                  { text: translate('landing.pricing.pro.feat5'), highlight: false },
                  { text: translate('landing.pricing.pro.feat6'), highlight: false },
                  { text: translate('landing.pricing.pro.feat7'), highlight: false },
                  { text: translate('landing.pricing.pro.feat8'), highlight: false },
                ],
                buttonText: translate('landing.pricing.pro.btn'),
              },
              {
                id: 'business' as const,
                name: translate('landing.pricing.business.name'),
                desc: translate('landing.pricing.business.desc'),
                priceMonth: 149,
                priceQuarter: 126,
                priceYear: 110,
                isPopular: false,
                delay: 0.15,
                features: [
                  { text: translate('landing.pricing.business.feat1'), highlight: true },
                  { text: translate('landing.pricing.business.feat2'), highlight: false },
                  { text: translate('landing.pricing.business.feat3'), highlight: true },
                  { text: translate('landing.pricing.business.feat4'), highlight: false },
                  { text: translate('landing.pricing.business.feat5'), highlight: false },
                  { text: translate('landing.pricing.business.feat6'), highlight: false },
                  { text: translate('landing.pricing.business.feat7'), highlight: false },
                  { text: translate('landing.pricing.business.feat8'), highlight: false },
                ],
                buttonText: translate('landing.pricing.business.btn'),
              }
            ].map((plan) => {
              const price = billingCycle === 'month' 
                ? plan.priceMonth 
                : billingCycle === 'quarter' 
                  ? plan.priceQuarter 
                  : plan.priceYear;
              
              const isPopular = plan.isPopular;
              
              const cardClass = isPopular
                ? `${d ? 'bg-zinc-950 border-accent/65 ring-2 ring-accent/35 shadow-2xl shadow-accent/20' : 'bg-white border-2 border-accent shadow-2xl shadow-accent/30'} p-10 rounded-[40px] h-full flex flex-col justify-between border relative overflow-hidden transition-all duration-500 md:-translate-y-6 hover:-translate-y-8`
                : `${d ? 'bg-zinc-950 border-white/5 hover:border-white/10' : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/30'} p-10 rounded-[40px] h-full flex flex-col justify-between border transition-all duration-300 hover:-translate-y-2`;

              const buttonClass = isPopular
                ? "btn-primary w-full py-5"
                : `btn-secondary w-full py-5 ${d ? 'btn-secondary-dark' : 'btn-secondary-light'}`;

              return (
                <RevealScale key={plan.id} delay={plan.delay}>
                  <div className={cardClass}>
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-accent text-white px-5 py-2 rounded-bl-3xl text-[10px] font-bold uppercase tracking-widest">
                        {translate('landing.pricing.pro.popular')}
                      </div>
                    )}
                    <div>
                      {/* Plan Header */}
                      <div className="mb-6">
                        <h3 className="font-display text-2xl font-black mb-1.5 tracking-tight">{plan.name}</h3>
                        <p className={`text-xs font-semibold leading-relaxed h-[42px] overflow-hidden ${d ? 'text-zinc-400' : 'text-slate-500'}`}>
                          {plan.desc}
                        </p>
                      </div>

                      {/* Pricing Section */}
                      <div className="mb-6 flex items-baseline gap-1.5 h-[52px] overflow-hidden relative">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={`${plan.id}-p-${billingCycle}`}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -24 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display text-5xl font-extrabold select-none text-accent inline-block"
                          >
                            ${price}
                          </motion.span>
                        </AnimatePresence>
                        <span className={`text-[11px] font-bold opacity-55 pb-1 select-none self-end`}>
                          /mo{billingCycle === 'month' ? '' : billingCycle === 'quarter' ? translate('landing.pricing.cycle.billedQ') : translate('landing.pricing.cycle.billedY')}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="pt-6 border-t border-[rgba(0,0,0,0.05)] dark:border-white/5 mb-6">
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-4 ${d ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
                          {translate('landing.pricing.featured')}
                        </span>
                        
                        {/* Features List */}
                        <ul className="space-y-3.5">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold">
                              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className={`leading-tight ${feature.highlight ? 'text-accent font-bold' : d ? 'text-zinc-300 opacity-90' : 'text-slate-700'}`}>
                                {feature.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button onClick={(e) => handleBuyClick(e, plan.id)} className={buttonClass}>
                        {plan.buttonText}
                      </button>
                    </div>
                  </div>
                </RevealScale>
              );
            })}
          </div>

          <div className="text-center mt-12 mb-2">
            <Link 
              to="/compare" 
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all border ${
                d 
                  ? 'bg-bg-subtle/80 border-border text-accent hover:bg-accent/10' 
                  : 'bg-white border-border-light text-[#6366f1] hover:bg-[#6366f1]/5 shadow-sm'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              {translate('landing.pricing.compare')}
            </Link>
          </div>

          {/* HORIZONTAL ENTERPRISE BANNER */}
          <RevealScale delay={0.2} className="w-full">
            <div className={`${d ? 'card bg-bg/80' : 'card-light bg-white'} p-8 md:p-10 rounded-2xl border ${d ? 'border-border' : 'border-border-light shadow-sm'} flex flex-col lg:flex-row items-center justify-between gap-8 mt-10`}>
              <div className="max-w-xl text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent mb-4">
                  {translate('landing.pricing.custom.tag')}
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">{translate('landing.pricing.custom.title')}</h3>
                <p className={`text-sm md:text-base leading-relaxed ${d ? 'text-text-muted' : 'text-text-muted-light'}`}>
                  {translate('landing.pricing.custom.desc')}
                </p>
                <div className="mt-6">
                  <Link to="/contact" className="btn-primary inline-block py-3.5 shadow-lg shadow-accent/10">
                    {translate('landing.pricing.custom.btn')}
                  </Link>
                </div>
              </div>

              <div className={`w-full lg:w-auto min-w-[280px] lg:min-w-[450px] p-6 rounded-xl ${d ? 'bg-bg-subtle/50' : 'bg-bg-subtle-light/40'} border ${d ? 'border-border/60' : 'border-border-light/70'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-4 ${d ? 'text-accent' : 'text-accent-light'}`}>
                  {translate('landing.pricing.custom.eco')}
                </span>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-6 text-xs text-left">
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{translate('landing.pricing.custom.f1')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{translate('landing.pricing.custom.f2')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{translate('landing.pricing.custom.f3')}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{translate('landing.pricing.custom.f4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </RevealScale>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={`py-20 ${d ? 'bg-gradient-section' : 'bg-gradient-section-light'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-10">
            <h2 className="font-display text-3xl font-semibold mb-3">{translate('landing.faq.title')}</h2>
            <p className={`${d ? 'text-text-muted' : 'text-text-muted-light'}`}>{translate('landing.faq.subtitle')}</p>
          </Reveal>

          <div className="space-y-3">
            {[
              { q: translate('landing.faq.q1.q'), a: translate('landing.faq.q1.a') },
              { q: translate('landing.faq.q2.q'), a: translate('landing.faq.q2.a') },
              { q: translate('landing.faq.q3.q'), a: translate('landing.faq.q3.a') },
              { q: translate('landing.faq.q4.q'), a: translate('landing.faq.q4.a') },
              { q: translate('landing.faq.q5.q'), a: translate('landing.faq.q5.a') }
            ].map((item, i) => (
              <FAQItem key={i} item={item} dark={d} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      {/* ── Bottom Section with Globe ── */}
      <section className="relative pt-20 pb-0 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10 mb-[-100px]">
           <h2 className={`text-3xl md:text-5xl font-black mb-6 ${d ? 'text-white' : 'text-slate-900'}`}>
              Une infrastructure mondiale <br/> à votre service.
           </h2>
           <p className={`text-base md:text-lg font-medium max-w-2xl mx-auto ${d ? 'text-zinc-400' : 'text-slate-500'}`}>
              Rejoignez des milliers d'entrepreneurs qui utilisent EcomBoost.org pour propulser leur marketing à l'international.
           </p>
        </div>
        <RotatingGlobe isDark={d} />
      </section>

      <Footer isDark={d} />
    </div>
  );
}

const faqItems = [
  {
    q: 'How does EcomBoost.org integrate with different AI models, and can I compare outputs directly?',
    a: 'EcomBoost.org works as a serverless-friendly wrapper that connects to various state-of-the-art LLMs (including Anthropic\'s Claude 3.5 Sonnet, OpenAI\'s GPT-4o, Google\'s Gemini, and open-weights giants like Qwen-2.5 and Mistral Large) via secure high-performance API endpoints. In the Strategy Chat inside your dashboard, you can swap models on-the-fly and compare their strategies directly. This enables you to leverage Claude\'s exceptional creative writing for your ad copies, Gemini\'s high-speed contextual reasoning for rapid brainstorming, and Mistral or GPT-4o for precise analytical operations depending on your specialized growth workflow.'
  },
  {
    q: 'What actual benefits does EcomBoost.org provide for scaling an e-commerce brand\'s ROI?',
    a: 'EcomBoost.org provides immediate operational leverage in two primary ways: hyper-optimized generation and deep analytical clarity. By replacing standard generic prompting with our fine-tuned, context-aware prompt templates, our suite lets you create fully optimized email campaigns, viral TikTok hooks, converting social media ad copies, and SEO product details that outperform generic copywriters. Additionally, our high-precision calculators let you model customer lifetime value (LTV), break-even ROAS across multi-tiered ad sets, and actual monthly net profit before committing ad budgets, allowing you to run a highly scientific, data-driven brand with zero waste.'
  },
  {
    q: 'How are my connection credentials handled, and is my proprietary e-commerce store data safe?',
    a: 'Your privacy is our core architectural pillar. Unlike typical SaaS platforms that store your API secrets and proprietary store data on external remote servers (creating central friction and data leak risks), EcomBoost.org employs a completely decentralized, client-first architecture. Your direct connection tokens and all raw prompt inputs are stored locally in secure client-side storage (localStorage) right inside your browser. They are sent directly to the AI model\'s official API end-points via encrypted, sandbox-safe network layers purely during active request sessions. We never run database collection trackers on your analytical inputs, ensuring that your financial margins, pricing formulas, and copy stays 100% private.'
  },
  {
    q: 'Can I customize the generated copy templates to match my brand\'s unique identity and voice?',
    a: 'Absolutely. When you select any of the AI content tools in the dashboard, the interface provides advanced parameters to fine-tune the output before requesting. You can specify the primary target audience (e.g., Gen-Z, high-income professionals, busy parents), set the target tone of voice (e.g., authoritative, humorous, minimalistic, urgent), describe specific products, and include custom brand guidelines. Furthermore, inside our Strategy Chat, you can act as a prompt engineer and instruct the chosen model to adapt to any style sheet, brand catalog, or target persona, generating hyper-tailored content that resonates with your core demographic.'
  },
  {
    q: 'How do the built-in financial calculators ensure precision in my ad accounts and product margin calculations?',
    a: 'All calculators in EcomBoost.org are designed from standard venture-grade e-commerce accounting frameworks. We do not use simplified, rough estimation formulas. For example, our ROAS Calculator maps the absolute break-even ratio by factoring in cost-of-goods-sold (COGS), average order value (AOV), transaction gateway fees, and operating overheads. Our Customer LTV calculator uses multi-cohort analysis (order frequency, average retention span, churn rate) to show exactly how much you can afford for customer acquisition cost (CAC). Everything is represented in real-time, high-contrast visual charts to give you instant mathematical clarity before scaling.'
  }
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

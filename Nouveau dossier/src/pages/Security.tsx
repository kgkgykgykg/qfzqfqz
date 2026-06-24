import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, EyeOff, ServerOff, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';

export default function Security() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const d = theme === 'dark';
  const navigate = useNavigate();

  return (
    <div id="security-container" className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
      d ? 'bg-gradient-hero text-white' : 'bg-gradient-hero-light text-slate-900'
    }`}>
      {/* Header section */}
      <header id="security-header" className={`h-16 px-6 flex items-center justify-between border-b ${
        d ? 'bg-zinc-900/30 border-white/5' : 'bg-white/80 border-slate-100'
      } backdrop-blur-xl sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              id="back-btn"
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-sm font-bold tracking-wide ${
                d ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-black/5 text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link id="brand-logo" to="/" className={`font-display text-[22px] font-black tracking-wide ${d ? 'text-white' : 'text-slate-900 border-none outline-none'}`} style={{ color: d ? '#ffffff' : '#0f172a' }}>
              EcomBoost<span className="text-accent text-3xl">.</span>org
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="theme-toggler"
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${d ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              {d ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646s" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main id="security-main" className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Hero Header */}
          <div className="space-y-4 text-center md:text-left">
            <div className={`mx-auto md:mx-0 w-12 h-12 rounded-2xl flex items-center justify-center ${d ? 'bg-accent/10 text-accent' : 'bg-accent/5 text-accent-light'}`}>
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight">{t('security.title')}</h1>
            <p className={`text-base ${d ? 'text-zinc-400' : 'text-slate-500'} max-w-2xl leading-relaxed`}>
              {t('security.subtitle')}
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className={`p-6 rounded-3xl border ${d ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
              <Lock className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{t('security.p1.title')}</h3>
              <p className={`text-xs ${d ? 'text-zinc-400' : 'text-slate-500'} leading-relaxed`}>
                {t('security.p1.desc')}
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${d ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
              <EyeOff className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{t('security.p2.title')}</h3>
              <p className={`text-xs ${d ? 'text-zinc-400' : 'text-slate-500'} leading-relaxed`}>
                {t('security.p2.desc')}
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${d ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
              <ServerOff className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{t('security.p3.title')}</h3>
              <p className={`text-xs ${d ? 'text-zinc-400' : 'text-slate-500'} leading-relaxed`}>
                {t('security.p3.desc')}
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${d ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
              <CheckCircle className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">{t('security.p4.title')}</h3>
              <p className={`text-xs ${d ? 'text-zinc-400' : 'text-slate-500'} leading-relaxed`}>
                {t('security.p4.desc')}
              </p>
            </div>
          </div>

          {/* Secure Practices Section */}
          <div className={`p-8 rounded-[32px] border ${d ? 'bg-zinc-950/40 border-white/5' : 'bg-slate-50 border-slate-200'} space-y-6`}>
            <h3 className="font-display text-xl font-bold">{t('security.p5.title')}</h3>
            <div className="space-y-4 text-xs leading-relaxed">
              <p className={d ? 'text-zinc-400' : 'text-slate-600'}>
                <span dangerouslySetInnerHTML={{ __html: t('security.p5.desc1') }} />
              </p>
              <p className={d ? 'text-zinc-400' : 'text-slate-600'}>
                <span dangerouslySetInnerHTML={{ __html: t('security.p5.desc2') }} />
              </p>
              <p className={d ? 'text-zinc-400' : 'text-slate-600'}>
                <span dangerouslySetInnerHTML={{ __html: t('security.p5.desc3') }} />
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer isDark={d} />
    </div>
  );
}

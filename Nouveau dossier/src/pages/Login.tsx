import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { ArrowLeft, Sun, Moon } from 'lucide-react';

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const d = theme === 'dark';
  
  const { 
    authError, 
    isLoggedIn, 
    signInWithGoogle, 
    isLoading: authLoading, 
    clearError 
  } = useAuth();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const tier = searchParams.get('tier');
  const billing = searchParams.get('billing') || 'month';
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      if (redirect === 'checkout' && tier) {
        navigate(`/checkout?tier=${tier}&billing=${billing}`, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isLoggedIn, navigate, redirect, tier, billing]);

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-all duration-500 ${
      d ? 'bg-gradient-hero text-white selection:bg-accent/30' : 'bg-gradient-hero-light text-slate-900 selection:bg-accent/10'
    }`}>
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[10%] left-[10%] w-[35%] h-[35%] rounded-full opacity-10 blur-[120px] ${d ? 'bg-indigo-500/25' : 'bg-indigo-500/15'}`} />
        <div className={`absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full opacity-10 blur-[120px] ${d ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`} />
      </div>

      <header id="login-header" className={`h-16 px-6 flex items-center justify-between border-b ${
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
              onClick={toggleTheme} 
              className={`p-2 rounded-lg transition-all ${
                d ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              {d ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <div className="w-full max-w-[420px] space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-black tracking-tight">{t('login.title')}</h1>
            <p className="text-sm font-medium opacity-60">{t('login.subtitle')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className={`w-full rounded-[40px] border-2 p-8 md:p-10 transition-all duration-500 backdrop-blur-xl ${
              d ? 'bg-zinc-950/80 border-white/20 shadow-2xl' : 'bg-white border-slate-900 shadow-xl shadow-slate-200/50'
            }`}
          >
            <button
              onClick={async () => {
                setIsSubmitting(true);
                clearError();
                try {
                  await signInWithGoogle();
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting || authLoading}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] border-2 uppercase tracking-wide ${
                d 
                  ? 'bg-white text-black hover:bg-zinc-100 border-white shadow-lg' 
                  : 'bg-white border-slate-900 hover:bg-slate-50 text-slate-900 shadow-sm'
              }`}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4" />
              {t('login.cta')}
            </button>

            {authError && (
              <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-semibold text-rose-400 leading-relaxed text-center">
                {authError}
              </div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link to="/" className={`text-sm font-semibold opacity-50 hover:opacity-100 flex items-center justify-center gap-2 transition-opacity inline-flex px-4 py-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              {t('nav.home')}
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer isDark={d} />
    </div>
  );
}

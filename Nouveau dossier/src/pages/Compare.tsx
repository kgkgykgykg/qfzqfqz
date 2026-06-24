import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';


function AnimatedRow({ children, className, delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay, ease: [0.215, 0.610, 0.355, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.tr>
  );
}

export default function Compare() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const d = theme === 'dark';
  const [billingCycle, setBillingCycle] = useState<'month' | 'quarter' | 'year'>('month');

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

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

  // Pricing values mirroring the Landing.tsx configurations
  const pricing = {
    starter: billingCycle === 'month' ? '59' : billingCycle === 'quarter' ? '51' : '39',
    pro: billingCycle === 'month' ? '89' : billingCycle === 'quarter' ? '76' : '57',
    business: billingCycle === 'month' ? '149' : billingCycle === 'quarter' ? '126' : '110',
  };

  const CheckIcon = () => (
    <div className={`inline-flex items-center justify-center p-1 rounded-full ${d ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-500/20 text-emerald-600'}`}>
      <svg className="w-4.5 h-4.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  const CrossIcon = () => (
    <div className={`inline-flex items-center justify-center p-1 rounded-full ${d ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-500/20 text-rose-600'}`}>
      <svg className="w-4.5 h-4.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );

  return (
    <div className={`min-h-screen ${d ? 'bg-gradient-hero text-text' : 'bg-gradient-hero-light text-text-light'}`}>
      <Navbar showBack />

      {/* ── Main content area ── */}
      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
              d ? 'bg-accent/10 text-accent' : 'bg-accent/10 text-accent border border-accent/10'
            }`}>
              Full Comparison Breakdown
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Explore All Tool Features
            </h1>
            <p className={`text-sm md:text-base max-w-2xl mx-auto mb-8 ${d ? 'text-text-muted' : 'text-slate-600 font-medium'}`}>
              Compare capabilities across Starter, Pro, Business, and Enterprise plans to execute the best growth strategy for your e-commerce brand.
            </p>

            {/* Billing Cycle selector (sync with prices!) */}
            <div className={`inline-flex items-center gap-1.5 p-1.5 rounded-2xl border ${d ? 'bg-bg border-border' : 'bg-white border-slate-200 shadow-sm'} mb-4`}>
              {[
                { id: 'month', label: 'Monthly', discount: null },
                { id: 'quarter', label: 'Quarterly', discount: '-15%' },
                { id: 'year', label: 'Annual', discount: '-30%' }
              ].map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() => setBillingCycle(cycle.id as 'month' | 'quarter' | 'year')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    billingCycle === cycle.id
                      ? 'bg-accent text-white shadow-sm'
                      : d ? 'text-text-muted hover:text-text' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{cycle.label}</span>
                  {cycle.discount && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                      billingCycle === cycle.id
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                    }`}>
                      {cycle.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Comparison grid table */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full overflow-x-auto rounded-2xl border"
          style={{ borderColor: d ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
        >
          <table className={`w-full text-left border-collapse min-w-[800px] ${d ? 'bg-bg/60' : 'bg-white'}`}>
            {/* Headers */}
            <thead>
              <tr className={`border-b ${d ? 'border-white/5 bg-white/2' : 'border-slate-200 bg-slate-50/50'}`}>
                <th className={`p-6 text-sm font-bold uppercase tracking-wider w-1/4 ${d ? 'text-text-subtle' : 'text-slate-500'}`}>
                  Features & Dashboard Tools
                </th>
                <th className="p-6 w-[18%]">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-lg">STARTER</span>
                    <div className="h-9 relative mt-1 overflow-hidden flex flex-col justify-center">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`comp-st-p-${pricing.starter}`}
                          initial={{ opacity: 0, y: -16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 16 }}
                          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                          className="text-2xl font-extrabold text-accent block"
                        >
                          ${pricing.starter}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="h-6 relative overflow-hidden flex flex-col justify-start">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`comp-st-lbl-${billingCycle}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`text-[10px] mt-0.5 ${d ? 'text-text-subtle' : 'text-slate-500'} block`}
                        >
                          /mo, billed {billingCycle === 'month' ? 'monthly' : billingCycle === 'quarter' ? 'quarterly' : 'annually'}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button onClick={(e) => handleBuyClick(e, 'starter')} className="btn-secondary text-center mt-4 py-1.5 px-3 rounded-lg text-xs font-semibold">Get Started</button>
                  </div>
                </th>
                <th className={`p-6 w-[18%] border-x ${d ? 'border-white/5 bg-accent/3' : 'border-slate-100 bg-accent/10'}`}>
                  <div className="flex flex-col relative">
                    <div className="absolute -top-3.5 right-0 bg-accent text-white px-2 py-0.5 rounded-md text-[9px] font-bold uppercase z-10">Popular</div>
                    <span className="font-display font-bold text-lg text-accent">PRO</span>
                    <div className="h-9 relative mt-1 overflow-hidden flex flex-col justify-center">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`comp-pro-p-${pricing.pro}`}
                          initial={{ opacity: 0, y: -16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 16 }}
                          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                          className="text-2xl font-extrabold text-accent block"
                        >
                          ${pricing.pro}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="h-6 relative overflow-hidden flex flex-col justify-start">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`comp-pro-lbl-${billingCycle}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`text-[10px] mt-0.5 ${d ? 'text-text-subtle' : 'text-slate-500'} block`}
                        >
                          /mo, billed {billingCycle === 'month' ? 'monthly' : billingCycle === 'quarter' ? 'quarterly' : 'annually'}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button onClick={(e) => handleBuyClick(e, 'pro')} className="btn-primary text-center mt-4 py-1.5 px-3 rounded-lg text-xs font-semibold">Get Started</button>
                  </div>
                </th>
                <th className="p-6 w-[18%]">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-lg">BUSINESS</span>
                    <div className="h-9 relative mt-1 overflow-hidden flex flex-col justify-center">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`comp-biz-p-${pricing.business}`}
                          initial={{ opacity: 0, y: -16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 16 }}
                          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                          className="text-2xl font-extrabold text-accent block"
                        >
                          ${pricing.business}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="h-6 relative overflow-hidden flex flex-col justify-start">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`comp-biz-lbl-${billingCycle}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className={`text-[10px] mt-0.5 ${d ? 'text-text-subtle' : 'text-slate-500'} block`}
                        >
                          /mo, billed {billingCycle === 'month' ? 'monthly' : billingCycle === 'quarter' ? 'quarterly' : 'annually'}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button onClick={(e) => handleBuyClick(e, 'business')} className="btn-secondary text-center mt-4 py-1.5 px-3 rounded-lg text-xs font-semibold">Get Started</button>
                  </div>
                </th>
                <th className="p-6 w-[20%]">
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-lg">CUSTOM</span>
                    <span className={`text-lg font-bold mt-2 ${d ? 'text-text' : 'text-slate-800'}`}>Custom Setup</span>
                    <span className={`text-[10px] mt-0.5 ${d ? 'text-text-subtle' : 'text-slate-500'}`}>Bespoke details</span>
                    <Link to="/contact" className="btn-secondary text-center mt-4 py-1.5 px-3 rounded-lg text-xs font-semibold">Contact Us</Link>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {/* CATEGORY: OVERVIEW & BASE */}
              <AnimatedRow className={`border-b ${d ? 'border-white/5 bg-white/2' : 'border-slate-200/50 bg-slate-50/40'}`}>
                <td colSpan={5} className={`p-4 px-6 text-xs font-bold uppercase tracking-wider ${d ? 'text-accent' : 'text-accent'}`}>
                  Overview & Base Settings
                </td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Engagement Term</td>
                <td className="p-5 text-xs font-medium">Cancel anytime</td>
                <td className="p-5 text-xs font-medium border-x border-[rgba(0,0,0,0.03)] dark:border-white/5">Cancel anytime</td>
                <td className="p-5 text-xs font-medium">Cancel anytime</td>
                <td className="p-5 text-xs font-medium">Bespoke SLA Agreement</td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Team User Seats</td>
                <td className="p-5 text-xs font-semibold">1 seat included</td>
                <td className="p-5 text-xs font-semibold border-x border-[rgba(0,0,0,0.03)] dark:border-white/5 text-accent">2 seats included</td>
                <td className="p-5 text-xs font-semibold">4 seats included</td>
                <td className="p-5 text-xs font-semibold text-emerald-500 dark:text-emerald-400">Unlimited</td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Extra Seat License</td>
                <td className="p-5 text-xs font-medium">+$20 / seat / mo</td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5">+$20 / seat / mo</td>
                <td className="p-5 text-xs font-medium">+$20 / seat / mo</td>
                <td className="p-5 text-xs text-emerald-500 dark:text-emerald-400 font-bold">All Included</td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Bring Your Own API Keys</td>
                <td className="p-5 text-xs font-semibold text-emerald-500"><CheckIcon /> Full Keys Config</td>
                <td className="p-5 text-xs font-semibold border-x border-[rgba(0,0,0,0.03)] dark:border-white/5 text-emerald-500"><CheckIcon /> Full Keys Config</td>
                <td className="p-5 text-xs font-semibold text-emerald-500"><CheckIcon /> Full Keys Config</td>
                <td className="p-5 text-xs font-semibold text-emerald-500"><CheckIcon /> Custom SLA proxy</td>
              </AnimatedRow>

              {/* CATEGORY: AI CONTENT GENERATORS */}
              <AnimatedRow className={`border-b ${d ? 'border-white/5 bg-white/2' : 'border-slate-200/50 bg-slate-50/40'}`}>
                <td colSpan={5} className={`p-4 px-6 text-xs font-bold uppercase tracking-wider ${d ? 'text-accent' : 'text-accent'}`}>
                  AI Content Copywriters & Strategy Tools
                </td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Core AI Copywriters (Email, SMS, Ads)</td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Included</span></td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> <span className="ml-1 font-semibold">Included</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Included</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Custom tuning</span></td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Premium Scripts & Hook Creators</td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1">Standard templates</span></td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> <span className="ml-1 font-semibold text-accent">Full parameters</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold text-emerald-500">Full parameters</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Fully dynamic</span></td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">SEO Optimizer & Offer Architect</td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1">Included</span></td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> <span className="ml-1 font-semibold">Included</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Included</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Fully integrated</span></td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Support Auto-Reply Draft editor</td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1">Included</span></td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> <span className="ml-1 font-semibold">Included</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Included</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Custom LLM system</span></td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Multi-Model Strategy Chat Screen</td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1">Enabled</span></td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5 text-accent"><CheckIcon /> <span className="ml-1 font-bold">Enabled</span></td>
                <td className="p-5 text-xs text-emerald-500"><CheckIcon /> <span className="ml-1 font-bold">Enabled</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-bold">Built-in API endpoint</span></td>
              </AnimatedRow>

              {/* CATEGORY: COMPETITOR LIBRARIES & SPY SUITE */}
              <AnimatedRow className={`border-b ${d ? 'border-white/5 bg-white/2' : 'border-slate-200/50 bg-slate-50/40'}`}>
                <td colSpan={5} className={`p-4 px-6 text-xs font-bold uppercase tracking-wider ${d ? 'text-accent' : 'text-accent'}`}>
                  Competitor Intelligence & Spy Suite
                </td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Brandtracker Live Monitoring</td>
                <td className="p-5 text-xs font-bold">Track up to 2 brands</td>
                <td className="p-5 text-xs font-bold border-x border-[rgba(0,0,0,0.03)] dark:border-white/5 text-accent">Track up to 30 brands</td>
                <td className="p-5 text-xs font-bold text-emerald-550 dark:text-emerald-400">Unlimited Tracks</td>
                <td className="p-5 text-xs font-bold text-emerald-550 dark:text-emerald-400">Unlimited Tracks & Webhooks</td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Shops Discovery Database</td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Standard filter</span></td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> <span className="ml-1 font-semibold">Unlimited search</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Unlimited search</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Direct db exports</span></td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Theme Surveillance & Shop Analytics</td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-medium">Basic audit</span></td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> <span className="ml-1 font-semibold">Advanced audit</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Comprehensive audit</span></td>
                <td className="p-5 text-xs"><CheckIcon /> <span className="ml-1 font-semibold">Real-time alerts</span></td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Ads Library, Swipe & Meta Analyzer</td>
                <td className="p-5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5 border-x border-[rgba(0,0,0,0.03)] dark:border-white/5">
                  <CheckIcon /> <strong className="font-semibold text-accent ml-1">Included</strong>
                </td>
                <td className="p-5">
                  <CheckIcon /> <strong className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">Included</strong>
                </td>
                <td className="p-5">
                  <CheckIcon /> <strong className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">Included</strong>
                </td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Email Library & Automations Tracker</td>
                <td className="p-5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5 border-x border-[rgba(0,0,0,0.03)] dark:border-white/5">
                  <CheckIcon /> <strong className="font-semibold text-accent ml-1">Included</strong>
                </td>
                <td className="p-5">
                  <CheckIcon /> <strong className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">Included</strong>
                </td>
                <td className="p-5">
                  <CheckIcon /> <strong className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">Included</strong>
                </td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Boards & Folder Organizers Suite</td>
                <td className="p-5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5 border-x border-[rgba(0,0,0,0.03)] dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5">
                  <CheckIcon /> <strong className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">Included</strong>
                </td>
                <td className="p-5">
                  <CheckIcon /> <strong className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">Included</strong>
                </td>
              </AnimatedRow>

              {/* CATEGORY: ECOM CALCULATORS */}
              <AnimatedRow className={`border-b ${d ? 'border-white/5 bg-white/2' : 'border-slate-200/50 bg-slate-50/40'}`}>
                <td colSpan={5} className={`p-4 px-6 text-xs font-bold uppercase tracking-wider ${d ? 'text-accent' : 'text-accent'}`}>
                  Ecommerce Financial Calculators
                </td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">ROAS & Margin break-even calculators</td>
                <td className="p-5 text-xs"><CheckIcon /> Included</td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> Included</td>
                <td className="p-5 text-xs"><CheckIcon /> Included</td>
                <td className="p-5 text-xs font-bold text-emerald-500"><CheckIcon /> Custom analytics models</td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">ROI & Customer Cohort LTV modeling</td>
                <td className="p-5 text-xs"><CheckIcon /> Standard LTV</td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5"><CheckIcon /> Full Cohorts</td>
                <td className="p-5 text-xs"><CheckIcon /> Full Cohorts</td>
                <td className="p-5 text-xs font-bold text-emerald-400"><CheckIcon /> Bespoke financial models</td>
              </AnimatedRow>

              {/* CATEGORY: ACCOUNT SERVICE & COMPLIANCE */}
              <AnimatedRow className={`border-b ${d ? 'border-white/5 bg-white/2' : 'border-slate-200/50 bg-slate-50/40'}`}>
                <td colSpan={5} className={`p-4 px-6 text-xs font-bold uppercase tracking-wider ${d ? 'text-accent' : 'text-accent'}`}>
                  Support, Integrations & Collaboration
                </td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Technical Support Service</td>
                <td className="p-5 text-xs text-slate-500 dark:text-text-subtle">Standard (24/48h Email)</td>
                <td className="p-5 text-xs border-x border-[rgba(0,0,0,0.03)] dark:border-white/5 text-accent font-semibold">Priority Chat & Email Support</td>
                <td className="p-5 text-xs font-semibold">Premium dedicated SLA support</td>
                <td className="p-5 text-xs font-semibold text-emerald-500">24/7 Hotline & Private support</td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">Dedicated Slack Channel</td>
                <td className="p-5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5 border-x border-[rgba(0,0,0,0.03)] dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5 text-xs text-emerald-500 font-bold"><CheckIcon /> Included (Response &lt;2h)</td>
              </AnimatedRow>
              <AnimatedRow className={`border-b ${d ? 'border-white/5 hover:bg-white/2' : 'border-slate-200/40 hover:bg-slate-50/50'}`}>
                <td className="p-5 font-semibold text-xs">On-demand Tool Development</td>
                <td className="p-5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5 border-x border-[rgba(0,0,0,0.03)] dark:border-white/5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-1.5">
                    <CrossIcon /> 
                    <span className={`text-[11px] font-bold line-through ${d ? 'text-zinc-500/70' : 'text-zinc-700/80 decoration-rose-500/70'}`}>Not available</span>
                  </div>
                </td>
                <td className="p-5 text-xs text-emerald-500 font-bold"><CheckIcon /> Yes (Custom-tailored builds)</td>
              </AnimatedRow>
            </tbody>
          </table>
        </motion.div>

        {/* Footer actions block */}
        <div className={`mt-12 p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
          d ? 'bg-bg-subtle/50 border-white/5' : 'bg-white border-slate-200/80 shadow-md shadow-slate-100/40'
        }`}>
          <div>
            <h4 className="font-display font-bold text-xl mb-1">Need a custom integrated workspace?</h4>
            <p className={`text-xs ${d ? 'text-text-muted' : 'text-slate-600 font-medium'}`}>
              Our dedicated engineers are ready to assist you in connecting your API keys, pre-loading competitors, and scaling operations.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/" className={`btn-secondary flex-1 md:flex-initial text-center px-6 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
              d ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}>
              Return Home
            </Link>
            <a href="mailto:support@ecomboost.org" className="btn-primary flex-1 md:flex-initial text-center px-6 py-2.5 rounded-xl text-xs font-bold uppercase">
              Contact Team
            </a>
          </div>
        </div>
      </main>

      <Footer isDark={d} />
    </div>
  );
}

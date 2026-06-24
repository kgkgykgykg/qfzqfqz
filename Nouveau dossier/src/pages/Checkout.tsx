import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

const PLAN_INFO = {
  starter: {
    name: 'STARTER',
    desc: 'Essential store spy finder and basic automation calculators for starting marketers.',
    priceMonth: 59,
    priceQuarter: 51,
    priceYear: 39,
    features: [
      '1 user seat included',
      'BrandTracker finder access',
      'Competitor listing lookup',
      'Bring Your Own API Keys'
    ]
  },
  pro: {
    name: 'PRO',
    desc: 'For professional e-commerce marketers seeking complete spy suites and analytics tools.',
    priceMonth: 89,
    priceQuarter: 76,
    priceYear: 57,
    features: [
      '2 user seats included',
      'Everything in Starter',
      'Ads Board & Swipe files database',
      'Unlimited competitor finders'
    ]
  },
  business: {
    name: 'BUSINESS',
    desc: 'For scaling agencies and e-com brands needing customized high-volume automated trackers.',
    priceMonth: 149,
    priceQuarter: 126,
    priceYear: 110,
    features: [
      '4 user seats included',
      'Everything in PRO plan',
      'Full custom API token capabilities',
      'Priority dedicated representative'
    ]
  }
};

export default function Checkout() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const d = theme === 'dark';
  const { updateSubscription, user, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Selected Billing values
  const urlTier = (searchParams.get('tier') || 'pro') as 'starter' | 'pro' | 'business';
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro' | 'business'>(
    ['starter', 'pro', 'business'].includes(urlTier) ? urlTier : 'pro'
  );

  const urlCycle = (searchParams.get('billing') || 'month') as 'month' | 'quarter' | 'year';
  const [billingCycle, setBillingCycle] = useState<'month' | 'quarter' | 'year'>(
    ['month', 'quarter', 'year'].includes(urlCycle) ? urlCycle : 'month'
  );

  // Form inputs
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [billingCountry, setBillingCountry] = useState('United States');
  const [postalCode, setPostalCode] = useState('');

  // Status flags
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Active subscription validation helpers
  const isSubscriptionActive = () => {
    if (!user || !user.subscription) return false;
    if (user.subscriptionStatus === 'active') return true;
    if (user.subscriptionStatus === 'cancelled' && user.subscriptionPeriodEnd) {
      try {
        return new Date() < new Date(user.subscriptionPeriodEnd);
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  const getRemainingDays = () => {
    if (!user || !user.subscriptionPeriodEnd) return 0;
    try {
      const diffTime = new Date(user.subscriptionPeriodEnd).getTime() - new Date().getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch (e) {
      return 0;
    }
  };

  const daysLeft = getRemainingDays();
  const subActive = isSubscriptionActive();
  const isBlockedSamePlan = user?.subscription === selectedTier && subActive && !(user?.subscriptionStatus === 'cancelled' && daysLeft <= 10);

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return isoString || '';
    }
  };

  const getCalculateEnd = () => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString();
  };

  const periodDates = {
    start: formatDate(new Date().toISOString()),
    end: formatDate(getCalculateEnd())
  };

  // Auth Protection Guard
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate(`/login?redirect=checkout&tier=${selectedTier}`, { replace: true });
    }
  }, [isLoggedIn, isLoading, selectedTier, navigate]);

  // Billing computation
  const tierData = PLAN_INFO[selectedTier];
  const unitPrice =
    billingCycle === 'month'
      ? tierData.priceMonth
      : billingCycle === 'quarter'
      ? tierData.priceQuarter
      : tierData.priceYear;

  const totalPeriodMonths = billingCycle === 'month' ? 1 : billingCycle === 'quarter' ? 3 : 12;
  const rawSubtotal = unitPrice * totalPeriodMonths;
  const finalPrice = Math.max(0, rawSubtotal);

  // Autocomplete Card Formats
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) setCvc(val);
  };

  const processPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!cardName) {
      setErr('Full name on card is required.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 11) {
      setErr('Invalid card number.');
      return;
    }
    if (expiry.length < 5) {
      setErr('Expiry must be MM/YY.');
      return;
    }
    if (cvc.length < 3) {
      setErr('CVC code required.');
      return;
    }

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        await updateSubscription(
          selectedTier, 
          billingCycle, 
          'active', 
          Math.round(unitPrice)
        );
        setSuccess(true);
        setTimeout(() => {
          setIsProcessing(false);
          navigate('/dashboard', { replace: true });
        }, 1200);
      } catch (error: any) {
        setErr('Transaction failed. Please try another card.');
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (isLoading || !isLoggedIn || !user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${d ? 'bg-gradient-hero text-white' : 'bg-slate-50'}`}>
        <div className="w-10 h-10 rounded-full border-2 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      d ? 'bg-gradient-hero text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Standard Header */}
      <header className={`h-16 px-6 flex items-center justify-between border-b ${
        d ? 'bg-zinc-900/30 border-white/5' : 'bg-white/80 border-slate-100'
      } backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-sm font-bold tracking-wide ${
                d ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-black/5 text-slate-500 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/" className={`font-display text-[22px] font-black tracking-wide ${d ? 'text-white' : 'text-slate-900 border-none outline-none'}`} style={{ color: d ? '#ffffff' : '#0f172a' }}>
              EcomBoost<span className="text-accent text-3xl">.</span>org
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                d ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Toggle theme"
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

      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Left: Summary */}
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight">Complete your order</h1>
              <p className="text-sm opacity-50">Activation is instant after verification.</p>
            </div>

            {/* Interactive Selectors */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Select Plan Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['starter', 'pro', 'business'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`py-3 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 border-2 text-center flex flex-col justify-center items-center gap-1 ${
                        selectedTier === tier
                          ? d
                            ? 'bg-white text-black border-white'
                            : 'bg-slate-900 text-white border-slate-900'
                          : d
                          ? 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span>{tier}</span>
                      <span className={`text-[10px] font-bold ${selectedTier === tier ? 'opacity-80' : 'opacity-50'}`}>
                        ${PLAN_INFO[tier][billingCycle === 'month' ? 'priceMonth' : billingCycle === 'quarter' ? 'priceQuarter' : 'priceYear']}/mo
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Select Billing Cycle</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['month', 'quarter', 'year'] as const).map((cycle) => (
                    <button
                      key={cycle}
                      type="button"
                      onClick={() => setBillingCycle(cycle)}
                      className={`py-3 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 border-2 text-center flex flex-col justify-center items-center gap-1 ${
                        billingCycle === cycle
                          ? d
                            ? 'bg-white text-black border-white'
                            : 'bg-slate-900 text-white border-slate-900'
                          : d
                          ? 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:border-white/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <span>{cycle === 'month' ? 'Monthly' : cycle === 'quarter' ? 'Quarterly' : 'Annually'}</span>
                      <span className="text-[9px] text-accent font-bold">
                        {cycle === 'quarter' ? 'Save ~15%' : cycle === 'year' ? 'Save ~35%' : 'Standard'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border-2 ${d ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-accent uppercase tracking-wider text-xs mb-1">{tierData.name}</h3>
                  <p className="text-xs opacity-60 leading-relaxed max-w-[200px]">{tierData.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono">${finalPrice}</span>
                  <span className="text-[10px] block opacity-40 font-bold uppercase">{billingCycle}ly</span>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-dashed dark:border-white/5 border-slate-100">
                {tierData.features.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs opacity-70">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 px-2">
              <div className="flex items-center gap-2 select-none">
                {/* Custom secure CSS Visa Badge */}
                <div className="px-2 py-1 rounded bg-[#1a1f71] text-white text-[8px] font-black italic tracking-widest leading-none flex items-center justify-center h-6 shadow-sm border border-[#22277d]">
                  VISA
                </div>
                {/* Custom secure CSS MC Badge */}
                <div className="px-2 py-1 rounded bg-zinc-900 border border-white/5 flex items-center gap-1.5 h-6 shadow-sm">
                  <div className="flex -space-x-1">
                    <div className="w-2 h-2 rounded-full bg-[#eb001b]" />
                    <div className="w-2 h-2 rounded-full bg-[#f79e1b]" />
                  </div>
                  <span className="text-[7px] font-bold tracking-wider text-white">MC</span>
                </div>
                {/* Custom secure CSS AMEX Badge */}
                <div className="px-1.5 py-1 rounded bg-[#0168b3] text-white text-[7px] font-extrabold uppercase tracking-widest leading-none flex items-center justify-center h-6 shadow-sm border border-[#0d7acb]">
                  AMEX
                </div>
              </div>
              <p className="text-[10px] opacity-40 font-medium">Encrypted & Secure Payment Gateway</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className={`p-8 md:p-10 rounded-[32px] border-2 relative overflow-hidden ${
            d ? 'bg-zinc-950 border-white/10 shadow-2xl' : 'bg-white border-slate-900 shadow-xl shadow-slate-200/50'
          }`}>
             {isProcessing && (
                <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center text-center ${d ? 'bg-zinc-950/90' : 'bg-white/90'}`}>
                  {success ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <p className="font-bold text-sm">Welcome aboard!</p>
                    </motion.div>
                  ) : (
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
             )}

            <form onSubmit={processPayment} className="space-y-6">
              {err && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 text-[11px] font-bold text-center">
                  {err}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full px-5 py-4 rounded-2xl border-2 outline-none text-sm font-bold transition-all ${
                      d ? 'bg-zinc-900 border-white/5 focus:border-accent text-white' : 'bg-slate-50 border-slate-200 focus:border-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Card Details</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardChange}
                      placeholder="Card Number"
                      className={`w-full px-5 py-4 rounded-2xl border-2 outline-none text-sm font-bold font-mono transition-all pr-12 ${
                        d ? 'bg-zinc-900 border-white/5 focus:border-accent text-white placeholder-zinc-700' : 'bg-slate-50 border-slate-200 focus:border-slate-900 placeholder-slate-300'
                      }`}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <svg className="w-6 h-6 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className={`w-full px-5 py-4 rounded-2xl border-2 outline-none text-sm font-bold font-mono text-center ${
                      d ? 'bg-zinc-900 border-white/5 focus:border-accent text-white' : 'bg-slate-50 border-slate-200 focus:border-slate-900'
                    }`}
                  />
                  <input
                    type="password"
                    required
                    value={cvc}
                    onChange={handleCvcChange}
                    placeholder="CVC"
                    className={`w-full px-5 py-4 rounded-2xl border-2 outline-none text-sm font-bold font-mono text-center ${
                      d ? 'bg-zinc-900 border-white/5 focus:border-accent text-white' : 'bg-slate-50 border-slate-200 focus:border-slate-900'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  d ? 'bg-white text-black hover:bg-zinc-100' : 'bg-slate-900 text-white hover:bg-black'
                }`}
              >
                Pay Now & Unlock
              </button>

              <p className="text-[10px] text-center opacity-30 font-bold uppercase tracking-widest">
                Bank-Grade 256-bit SSL Encryption
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Unified Footer */}
      <Footer isDark={d} />
    </div>
  );
}

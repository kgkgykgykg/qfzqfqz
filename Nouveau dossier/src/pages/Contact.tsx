import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, ArrowLeft, CheckCircle, Shield, Copy, Check, ExternalLink } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Contact() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const d = theme === 'dark';
  const navigate = useNavigate();

  const [copiedSupport, setCopiedSupport] = useState(false);
  const [copiedBilling, setCopiedBilling] = useState(false);

  const handleCopySupport = () => {
    navigator.clipboard.writeText('support@ecomboost.org');
    setCopiedSupport(true);
    setTimeout(() => setCopiedSupport(false), 2000);
  };

  const handleCopyBilling = () => {
    navigator.clipboard.writeText('billing@ecomboost.org');
    setCopiedBilling(true);
    setTimeout(() => setCopiedBilling(false), 2000);
  };

  return (
    <div id="contact-container" className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${
      d ? 'bg-gradient-hero text-white' : 'bg-gradient-hero-light text-slate-900'
    }`}>
      <Navbar showBack />

      <main id="contact-main" className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6 mb-12">
               <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  d ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-accent/5 text-accent border border-accent/10'
               }`}>
                  <MessageSquare className="w-3 h-3 fill-current" />
                  Operator Support
               </div>
               <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[0.95]">
                  How can we <br />
                  <span className="text-zinc-400 dark:text-zinc-500">help you scale?</span>
               </h1>
               <p className="text-lg opacity-60 leading-relaxed max-w-md">
                  Our dedicated growth partners are available 24/7 to assist with technical integrations, billing inquiries, and feature requests.
               </p>
            </div>

            <div className="space-y-8">
               {[
                 { 
                   title: "Technical Support", 
                   desc: "Implementation assistance for AI modules and API clusters.",
                   icon: <Send className="w-5 h-5 text-accent" />,
                   contact: "support@ecomboost.org"
                 },
                 { 
                   title: "Billing & Licensing", 
                   desc: "Clearance for customized enterprise plans and seat adjustments.",
                   icon: <Shield className="w-5 h-5 text-emerald-500" />,
                   contact: "billing@ecomboost.org"
                 }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110 ${
                       d ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                       {item.icon}
                    </div>
                    <div>
                       <h3 className="font-bold text-base mb-1">{item.title}</h3>
                       <p className="text-xs opacity-50 mb-2 leading-relaxed">{item.desc}</p>
                       <span className="text-xs font-mono font-bold text-accent underline decoration-2 underline-offset-4">{item.contact}</span>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>

          <motion.div
            id="contact-card-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div id="contact-card" className={`p-8 md:p-10 rounded-[32px] border relative overflow-hidden ${
              d ? 'bg-[#121214]/85 border-zinc-850 shadow-2xl' : 'bg-white/90 border-slate-200 shadow-2xl shadow-slate-200/50'
            } backdrop-blur-xl`}>
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <div className="relative z-10 space-y-8">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 uppercase">{t('contact.form.title') || 'Direct Inquiries Hub'}</h2>
                  <p className="text-xs opacity-45 leading-relaxed uppercase tracking-widest font-bold">
                    Select a channel below to communicate directly with our team
                  </p>
                </div>

                {/* Technical Support Email Row */}
                <div className={`p-6 rounded-2xl border transition-all ${
                  d ? 'bg-white/[0.02] border-white/5 hover:border-accent/30' : 'bg-slate-50 border-slate-100 hover:border-accent/20'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-xl bg-accent/10 text-accent">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Technical Support</h4>
                        <p className="text-[11px] opacity-50 font-medium">Integration & API Assistance</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      SLA: 2 HOURS
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3.5 rounded-xl border font-mono text-xs mb-4 ${
                    d ? 'bg-zinc-950/50 border-white/5 text-white' : 'bg-white border-slate-150 text-slate-900'
                  }`}>
                    <span className="font-bold select-all">support@ecomboost.org</span>
                    <button
                      onClick={handleCopySupport}
                      className={`p-1.5 rounded-md transition-all ${
                        d ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-950'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copiedSupport ? (
                        <Check className="w-4.5 h-4.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="mailto:support@ecomboost.org?subject=EcomBoost Technical Support Inquiry"
                    className="w-full py-3 px-4 bg-accent hover:bg-accent-muted text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
                  >
                    <span>Compose Email</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Billing & Licensing Email Row */}
                <div className={`p-6 rounded-2xl border transition-all ${
                  d ? 'bg-white/[0.02] border-white/5 hover:border-emerald-500/30' : 'bg-slate-50 border-slate-100 hover:border-emerald-500/20'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Billing & Accounts</h4>
                        <p className="text-[11px] opacity-50 font-medium">Enterprise Licensing & Upgrades</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      SLA: 6 HOURS
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3.5 rounded-xl border font-mono text-xs mb-4 ${
                    d ? 'bg-zinc-950/50 border-white/5 text-white' : 'bg-white border-slate-150 text-slate-900'
                  }`}>
                    <span className="font-bold select-all">billing@ecomboost.org</span>
                    <button
                      onClick={handleCopyBilling}
                      className={`p-1.5 rounded-md transition-all ${
                        d ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-950'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copiedBilling ? (
                        <Check className="w-4.5 h-4.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>

                  <a
                    href="mailto:billing@ecomboost.org?subject=EcomBoost Billing Inquiry"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                  >
                    <span>Compose Email</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className={`p-4 rounded-2xl border text-[9px] font-bold flex items-start gap-3 leading-relaxed ${
                  d ? 'bg-white/5 border-white/5 text-zinc-400' : 'bg-slate-50 border-slate-100 text-slate-500'
                }`}>
                  <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    Your messages are routed securely and handled directly by our certified operator group under complete end-to-end encryption.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer isDark={d} />
    </div>
  );
}

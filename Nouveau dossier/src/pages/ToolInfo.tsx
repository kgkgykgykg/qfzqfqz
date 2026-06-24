import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageSquare, Percent, Globe, Shield, Zap, Search, Layout, Database, TrendingUp, BarChart3, MailCheck, Target, ShoppingBag, Box, Eye, Calculator, Sparkles, Wand2, MousePointer2 } from 'lucide-react';
import Footer from '../components/Footer';

const toolsData: Record<string, any> = {
  'ad-library': {
    title: 'Ad Library',
    badge: 'HOT',
    desc: 'Explore high-performing ad creatives across all major platforms. Gain inspiration from winning campaigns and analyze their hooks, copy, and visual strategies.',
    color: 'orange',
    icon: <Layout className="w-8 h-8" />,
    category: 'Spy Suite',
    categoryColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  },
  'advertiser-tracker': {
    title: 'Advertiser Tracker',
    badge: 'TRENDING',
    desc: 'Monitor specific advertisers and get notified when they launch new products or campaigns. Stay one step ahead of the competition by tracking their every move.',
    color: 'blue',
    icon: <Target className="w-8 h-8" />,
    category: 'Spy Suite',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  'creator-library': {
    title: 'Creator Library',
    badge: 'NEW',
    desc: 'Discover and track top e-commerce creators. Analyze their content style, engagement rates, and the brands they partner with to fuel your influencer marketing.',
    color: 'emerald',
    icon: <Sparkles className="w-8 h-8" />,
    category: 'Content Suite',
    categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  'advertiser-library': {
    title: 'Advertiser Library',
    badge: 'ESSENTIAL',
    desc: 'A comprehensive database of e-commerce advertisers. Sort by niche, platform, and ad spend to find the major players in your market.',
    color: 'blue',
    icon: <Database className="w-8 h-8" />,
    category: 'Spy Suite',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  'product-library': {
    title: 'Product Library',
    badge: 'WINNING',
    desc: 'Browse a curated list of winning products. Updated daily with new trends, saturation scores, and direct supplier links.',
    color: 'orange',
    icon: <Box className="w-8 h-8" />,
    category: 'Research',
    categoryColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  },
  'shop-library': {
    title: 'Shop Library',
    badge: 'PREMIUM',
    desc: 'Deep dive into thousands of successful Shopify stores. Analyze their theme, apps, traffic sources, and best-selling products.',
    color: 'blue',
    icon: <ShoppingBag className="w-8 h-8" />,
    category: 'Spy Suite',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  'sales-tracker': {
    title: 'Sales Tracker',
    badge: 'LIVE',
    desc: 'Track the real-time sales of any Shopify store. See exactly how many orders they are getting and which products are flying off the shelves.',
    color: 'emerald',
    icon: <BarChart3 className="w-8 h-8" />,
    category: 'Spy Suite',
    categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  'portfolio': {
    title: 'Portfolio Tracker',
    badge: 'NEW',
    desc: 'Manage your entire product portfolio in one place. Track performance across different stores and markets with ease.',
    color: 'blue',
    icon: <Layout className="w-8 h-8" />,
    category: 'Management',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  'competitor-research': {
    title: 'Competitor Research',
    badge: 'ADVANCED',
    desc: 'A powerful AI-driven research tool. Enter a URL and get a full SWOT analysis, estimated revenue, and marketing strategy breakdown.',
    color: 'blue',
    icon: <Search className="w-8 h-8" />,
    category: 'Research',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  'magic-ai-search': {
    title: 'Magic AI Search',
    badge: 'AI',
    desc: 'The most advanced product search engine. Describe a product in natural language and find it across the web instantly.',
    color: 'purple',
    icon: <Wand2 className="w-8 h-8" />,
    category: 'AI Tools',
    categoryColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  },
  'shopify-stores': {
    title: 'Pre-built Stores',
    badge: 'BOOST',
    desc: 'Launch your business faster with our high-converting pre-built Shopify stores. Optimized for speed, SEO, and conversion.',
    color: 'blue',
    icon: <ShoppingBag className="w-8 h-8" />,
    category: 'Free Tools',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  'theme-detector': {
    title: 'Theme Detector',
    badge: 'FREE',
    desc: 'Wondering what theme a competitor is using? Paste the URL and get the exact theme name and custom app list.',
    color: 'emerald',
    icon: <Eye className="w-8 h-8" />,
    category: 'Free Tools',
    categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  'interest-explorer': {
    title: 'Interest Explorer',
    badge: 'FREE',
    desc: 'Find hidden interests for your Meta ad campaigns. Reveal thousands of targeting options that are not visible in the Ads Manager.',
    color: 'orange',
    icon: <Target className="w-8 h-8" />,
    category: 'Free Tools',
    categoryColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  },
  'numbers-breakdown': {
    title: 'Numbers Breakdown',
    badge: 'FREE',
    desc: 'The ultimate margin calculator. Factor in taxes, stripe fees, shipping, and ad spend to see your true net profit.',
    color: 'emerald',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Calculators',
    categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  'cpa-calculator': {
    title: 'CPA Calculator',
    badge: 'FREE',
    desc: 'Calculate your target Cost Per Acquisition. Know exactly how much you can afford to spend to get a customer.',
    color: 'emerald',
    icon: <Percent className="w-8 h-8" />,
    category: 'Calculators',
    categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  'roas-calculator': {
    title: 'ROAS Calculator',
    badge: 'FREE',
    desc: 'Measure the return on your ad spend. Understand which campaigns are profitable and which ones need optimization.',
    color: 'emerald',
    icon: <TrendingUp className="w-8 h-8" />,
    category: 'Calculators',
    categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  'beroas-calculator': {
    title: 'BEROAS Calculator',
    badge: 'FREE',
    desc: 'Calculate your Break-Even Return on Ad Spend. The most important metric for any e-commerce media buyer.',
    color: 'emerald',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Calculators',
    categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  },
  'email-generator': {
    title: 'Email Generator',
    badge: 'PRO',
    desc: 'Generate high-converting email sequences in seconds. Our AI-driven copywriter crafts personalized emails that drive sales and engagement.',
    color: 'blue',
    icon: <Mail className="w-8 h-8" />,
    category: 'AI Content',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  }
};

// Fallback for missing tools
const getToolData = (id: string) => {
  if (toolsData[id]) return toolsData[id];
  
  // Generic fallback based on ID patterns
  if (id.includes('calc')) {
    return {
      title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      badge: 'FREE',
      desc: 'Precision financial auditing tool for e-commerce operators. Model your expenses and growth with bank-level accuracy.',
      color: 'emerald',
      icon: <Percent className="w-8 h-8" />,
      category: 'Calculators',
      categoryColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    };
  }
  
  return {
    title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    badge: 'NEW',
    desc: 'A powerful tool designed to streamline your e-commerce operations. Part of the EcomBoost.org high-performance toolkit.',
    color: 'blue',
    icon: <Zap className="w-8 h-8" />,
    category: 'General Tool',
    categoryColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };
};

export default function ToolInfo() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const d = theme === 'dark';
  
  const tool = getToolData(toolId || '');

  return (
    <div className={`min-h-screen flex flex-col ${d ? 'bg-[#09090b] text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Header */}
      <header className={`h-16 border-b flex items-center px-6 sticky top-0 z-40 backdrop-blur-xl ${d ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-slate-100'}`}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-sm font-bold tracking-wide ${d ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-black/5 text-slate-500 hover:text-slate-900'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/" className={`font-display text-[22px] font-black tracking-wide ${d ? 'text-white' : 'text-slate-900 border-none outline-none'}`} style={{ color: d ? '#ffffff' : '#0f172a' }}>
              EcomBoost<span className="text-accent text-3xl">.</span>org
            </Link>
          </div>
          <button 
            onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')}
            className="btn-primary !py-2 !px-5 !text-sm rounded-full"
          >
            {isLoggedIn ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${tool.categoryColor}`}>
              {tool.category}
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl ${
                tool.color === 'orange' ? 'bg-orange-500/20 text-orange-500' : 
                tool.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                'bg-emerald-500/20 text-emerald-500'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                {React.cloneElement(tool.icon as React.ReactElement<{ className?: string }>, { className: 'w-7 h-7' })}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3 justify-center">
                {tool.title}
                {tool.badge && (
                  <span className="text-[10px] px-2 py-0.5 bg-accent text-white rounded-md font-black uppercase align-middle">
                    {tool.badge}
                  </span>
                )}
              </h1>
            </div>

            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${d ? 'text-zinc-400' : 'text-slate-600'}`}>
              {tool.desc}
            </p>
          </div>

          {/* Animated Tool Icon Section */}
          <div className="relative flex justify-center items-center py-16 mb-8 overflow-hidden rounded-3xl border shadow-2xl bg-zinc-950 border-white/5">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className={`absolute w-64 h-64 blur-[80px] opacity-40 bg-gradient-to-tr from-white ${
                 tool.color === 'orange' ? 'via-orange-500' : 
                 tool.color === 'blue' ? 'via-blue-500' :
                 'via-emerald-500'
               } to-white`}
             />
             <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-white shadow-2xl border ${
                    tool.color === 'orange' ? 'text-orange-500 border-orange-100' : 
                    tool.color === 'blue' ? 'text-blue-500 border-blue-100' :
                    'text-emerald-500 border-emerald-100'
                  }`}
                >
                  {React.cloneElement(tool.icon as React.ReactElement<{ className?: string }>, { className: 'w-10 h-10' })}
                </motion.div>
             </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
             {[
               { title: 'Lightning Fast', desc: 'Results generated in milliseconds using optimized algorithms.' },
               { title: 'Global Scale', desc: 'Support for multiple languages and international markets.' },
               { title: 'Secure & Private', desc: 'Your data is encrypted and never shared with third parties.' },
               { title: 'Real-time Sync', desc: 'Access your work from any device with live cloud synchronization.' }
             ].map((feat, i) => (
               <div key={i} className={`p-6 rounded-2xl border ${d ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className="font-bold text-sm mb-2">{feat.title}</h4>
                  <p className={`text-xs leading-relaxed ${d ? 'text-zinc-400' : 'text-slate-500'}`}>{feat.desc}</p>
               </div>
             ))}
          </div>

          {/* CTA Bottom */}
          <div className={`p-8 rounded-3xl text-center space-y-6 ${d ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
             <h3 className="text-2xl font-bold">Start using {tool.title} today</h3>
             <p className={`text-sm max-w-md mx-auto ${d ? 'text-zinc-400' : 'text-slate-600'}`}>
               Join thousands of e-commerce operators using EcomBoost.org to scale their marketing.
             </p>
             <button 
                onClick={() => navigate('/login')}
                className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-bold py-3 px-8 text-sm rounded-full transition-all shadow-lg shadow-[#38bdf8]/30 hover:scale-105"
             >
                Access AI
             </button>
          </div>
        </motion.div>

        {/* Navigation between tools */}
        <div className="mt-24 pt-12 border-t border-zinc-800">
           <h4 className={`text-xs font-bold uppercase tracking-widest mb-8 text-center ${d ? 'text-zinc-500' : 'text-slate-400'}`}>
              Explore other high-performance tools
           </h4>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['ad-library', 'advertiser-tracker', 'product-library', 'sales-tracker', 'competitor-research', 'magic-ai-search', 'roas-calculator', 'cpa-calculator'].map(id => (
                <Link 
                  key={id}
                  to={`/tools/${id}`}
                  className={`p-4 rounded-xl border text-center transition-all hover:scale-105 ${
                    id === toolId 
                      ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' 
                      : (d ? 'bg-zinc-900 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100 hover:border-slate-200')
                  }`}
                >
                   <div className="text-xs font-bold truncate">{getToolData(id).title}</div>
                </Link>
              ))}
           </div>
        </div>
      </main>

      <Footer isDark={d} />
    </div>
  );
}

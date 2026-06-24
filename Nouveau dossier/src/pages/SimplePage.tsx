import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Users, GraduationCap, HelpCircle, Info, FileText, Zap } from 'lucide-react';
import Footer from '../components/Footer';

const pagesData: Record<string, any> = {
  'about': {
    title: 'About EcomBoost.org',
    icon: <Info className="w-8 h-8 text-blue-500" />,
    content: `EcomBoost.org is the premier infrastructure for modern e-commerce growth. Founded by veteran entrepreneurs, we provide the tools and intelligence needed to navigate the complex world of online retail. Our mission is to democratize high-level marketing data and AI-driven insights for brands of all sizes.`
  },
  'blog': {
    title: 'EcomBoost Blog',
    icon: <Book className="w-8 h-8 text-orange-500" />,
    content: `Stay updated with the latest trends in e-commerce, advertising, and marketing automation. Our experts share case studies, technical breakdowns, and strategic guides to help you scale your business.`
  },
  'community': {
    title: 'EcomBoost Community',
    icon: <Users className="w-8 h-8 text-emerald-500" />,
    content: `Join a network of thousands of like-minded entrepreneurs. Share strategies, find partners, and grow together in our exclusive community hubs.`
  },
  'university': {
    title: 'Dropship University',
    icon: <GraduationCap className="w-8 h-8 text-purple-500" />,
    content: `The ultimate learning platform for e-commerce operators. From setting up your first store to advanced media buying strategies, we cover it all.`
  },
  'faq': {
    title: 'Frequently Asked Questions',
    icon: <HelpCircle className="w-8 h-8 text-blue-500" />,
    content: `Everything you need to know about EcomBoost.org, billing, tool usage, and more. If you can't find your answer here, our support team is always ready to help.`
  },
  'pricing': {
     title: 'Pricing Plans',
     icon: <Zap className="w-8 h-8 text-blue-500" />,
     content: 'Choose the perfect plan for your business scale. From starters to international agencies, we have the infrastructure to support your growth.'
  }
};

export default function SimplePage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const d = theme === 'dark';
  
  const page = pagesData[pageId || 'about'] || pagesData['about'];

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

      <main className="flex-1 max-w-3xl mx-auto px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center text-center gap-4">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${d ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                {page.icon}
             </div>
             <h1 className="text-4xl font-black tracking-tight">{page.title}</h1>
          </div>

          <div className={`prose max-w-none text-lg leading-relaxed ${d ? 'text-zinc-400' : 'text-slate-600'}`}>
             <p>{page.content}</p>
             <div className="mt-12 p-8 rounded-3xl border border-dashed border-zinc-500/20 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Module Under Development</p>
                <p className="text-sm">We are currently migrating our full knowledge base to this new high-performance interface. Stay tuned for deeper content.</p>
             </div>
          </div>

          <div className="pt-12 flex justify-center">
             <button 
                onClick={() => navigate('/')}
                className="btn-primary"
             >
                Back to Home
             </button>
          </div>
        </motion.div>
      </main>

      <Footer isDark={d} />
    </div>
  );
}

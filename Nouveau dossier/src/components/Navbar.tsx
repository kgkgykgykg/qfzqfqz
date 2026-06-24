import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  TrendingUp,
  Eye,
  Layout,
  BarChart3,
  Search,
  Percent,
  Sparkles,
  Target,
  Zap,
  Users,
  DollarSign,
  Link as LinkIcon,
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Shield,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  showBack?: boolean;
}

export default function Navbar({ showBack = false }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { translate, t } = useLanguage();
  const { isLoggedIn, logout } = useAuth();
  const d = theme === 'dark';

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (dropdownId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    // If a dropdown is already active, switch immediately to ensure ultra-smooth navigation
    if (activeDropdown) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setActiveDropdown(dropdownId);
    } else {
      // Snappy and deliberate 150ms hover delay to confirm user intent without requiring excessive patience
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(dropdownId);
      }, 150);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Close cleanly and instantly (100ms) when mouse leaves the button or dropdown popover area
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const handleLinkClick = (id: string, path: string, scrollSectionId?: string) => {
    setActiveDropdown(null);
    if (location.pathname === '/') {
      if (scrollSectionId) {
        const el = document.getElementById(scrollSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(path);
      }
    } else {
      if (scrollSectionId) {
        navigate(`/?scroll=${scrollSectionId}`);
      } else {
        navigate(path);
      }
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const menuItems = [
    {
      id: 'features',
      label: t('nav.features') || 'Features',
      scrollId: 'features',
      path: '/',
      dropdownTitle: 'CORE CAPABILITIES',
      dropdownItems: [
        {
          title: 'Connect with AI',
          desc: 'Unleash multi-model strategic marketing intelligence.',
          icon: <Wand2 className="w-5 h-5 text-accent" />,
          action: () => handleLinkClick('features', '/', 'features')
        },
        {
          title: 'Incredible Profits',
          desc: 'Analyze CAC, margins, and break-even ad spend.',
          icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
          action: () => handleLinkClick('features', '/', 'features')
        },
        {
          title: 'Custom Tracking',
          desc: 'Monitor competitor stores, sales, and products 24/7.',
          icon: <Eye className="w-5 h-5 text-sky-500" />,
          action: () => handleLinkClick('features', '/', 'features')
        }
      ]
    },
    {
      id: 'tools',
      label: t('nav.tools') || 'Tools',
      scrollId: 'tools',
      path: '/',
      dropdownTitle: 'INTELLIGENCE SUITES',
      dropdownItems: [
        {
          title: 'Ad Library',
          desc: 'Explore high-performing ad creatives across major networks.',
          icon: <Layout className="w-5 h-5 text-orange-500" />,
          action: () => { setActiveDropdown(null); navigate('/tools/ad-library'); }
        },
        {
          title: 'Sales Tracker',
          desc: 'Track real-time sales and orders of competitor Shopify stores.',
          icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
          action: () => { setActiveDropdown(null); navigate('/tools/sales-tracker'); }
        },
        {
          title: 'Competitor Research',
          desc: 'AI-driven SWOT, revenue, and strategy analysis.',
          icon: <Search className="w-5 h-5 text-blue-500" />,
          action: () => { setActiveDropdown(null); navigate('/tools/competitor-research'); }
        },
        {
          title: 'Theme Detector',
          desc: 'Identify the exact Shopify themes and apps competitors run.',
          icon: <Eye className="w-5 h-5 text-purple-500" />,
          action: () => { setActiveDropdown(null); navigate('/tools/theme-detector'); }
        },
        {
          title: 'CPA Calculator',
          desc: 'Calculate break-even CPA thresholds based on metrics.',
          icon: <Percent className="w-5 h-5 text-rose-500" />,
          action: () => { setActiveDropdown(null); navigate('/tools/cpa-calculator'); }
        }
      ]
    },
    {
      id: 'comparison',
      label: t('nav.comparison') || 'Comparison',
      scrollId: 'comparison',
      path: '/compare',
      dropdownTitle: 'CHOOSE YOUR ADVANTAGE',
      dropdownItems: [
        {
          title: 'Starter vs Pro vs Business',
          desc: 'Compare tier capabilities side-by-side to find your fit.',
          icon: <Shield className="w-5 h-5 text-blue-500" />,
          action: () => { setActiveDropdown(null); navigate('/compare'); }
        },
        {
          title: 'AI Model Matrix',
          desc: 'Detailed tokens and models compared across plans.',
          icon: <Sparkles className="w-5 h-5 text-purple-500" />,
          action: () => { setActiveDropdown(null); navigate('/compare'); }
        },
        {
          title: 'Competitor Spy Suite',
          desc: 'Compare tracking limits and update frequency tiers.',
          icon: <Target className="w-5 h-5 text-rose-500" />,
          action: () => { setActiveDropdown(null); navigate('/compare'); }
        }
      ]
    },
    {
      id: 'pricing',
      label: t('nav.pricing') || 'Pricing',
      scrollId: 'landing-pricing',
      path: '/',
      dropdownTitle: 'MEMBERSHIP PLANS',
      dropdownItems: [
        {
          title: 'Starter Plan ($59/mo)',
          desc: 'Essential store intelligence and conversion calculators.',
          icon: <Zap className="w-5 h-5 text-yellow-500" />,
          action: () => handleLinkClick('pricing', '/', 'landing-pricing')
        },
        {
          title: 'Pro Plan ($89/mo)',
          desc: 'Professional suite with competitor spy and analytics.',
          icon: <Sparkles className="w-5 h-5 text-purple-500" />,
          action: () => handleLinkClick('pricing', '/', 'landing-pricing')
        },
        {
          title: 'Business Plan ($149/mo)',
          desc: 'High-volume automated trackers and team workspace seats.',
          icon: <Target className="w-5 h-5 text-blue-500" />,
          action: () => handleLinkClick('pricing', '/', 'landing-pricing')
        }
      ]
    },
    {
      id: 'partner',
      label: 'Affiliation',
      scrollId: '',
      path: '/affiliate',
      dropdownTitle: 'EARN 50% RECURRING COMMISSION',
      dropdownItems: [
        {
          title: '1. Generate tracking link',
          desc: 'Click a single button to get your unique partner URL.',
          icon: <LinkIcon className="w-5 h-5 text-blue-500" />,
          action: () => { setActiveDropdown(null); navigate('/affiliate'); }
        },
        {
          title: '2. Share with audience',
          desc: 'Spread the word on socials, blogs, newsletters, or direct messages.',
          icon: <Users className="w-5 h-5 text-emerald-500" />,
          action: () => { setActiveDropdown(null); navigate('/affiliate'); }
        },
        {
          title: '3. Earn 50% commission',
          desc: 'Get half of all recurring revenue, paid out monthly.',
          icon: <DollarSign className="w-5 h-5 text-accent" />,
          action: () => { setActiveDropdown(null); navigate('/affiliate'); }
        }
      ]
    }
  ];

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  const getDropdownClass = () => {
    return `absolute top-[52px] left-1/2 -translate-x-1/2 w-[340px] p-5 rounded-2xl border ${
      d
        ? 'bg-[#0c0c0e]/95 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
        : 'bg-white/95 border-slate-200/60 shadow-[0_20px_50px_rgba(15,23,42,0.08)]'
    } backdrop-blur-3xl z-50`;
  };

  const getArrowClass = () => {
    return 'absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-t border-l';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
      d ? 'bg-[#09090b]/80 border-white/5 text-text' : 'bg-white/80 border-slate-100 text-slate-900'
    } backdrop-blur-xl`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-sm font-bold tracking-wide ${
                d ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-black/5 text-slate-500 hover:text-slate-900'
              }`}
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <Link to="/" className={`font-display text-[22px] font-black tracking-wide border-none outline-none ${d ? 'text-white' : 'text-slate-900'}`}>
            EcomBoost<span className="text-accent text-3xl leading-none">.</span>org
          </Link>
        </div>

        {/* Dynamic Translucent Header Tabs with Staggered Liquid Glass Dropdowns */}
        <nav className="hidden md:flex items-center gap-1 ml-auto mr-0 relative h-full">
          {menuItems.map((item) => {
            const isDropdownActive = activeDropdown === item.id;
            return (
              <div
                key={item.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    if (item.id === 'partner') {
                      navigate('/affiliate');
                    } else {
                      handleLinkClick(item.id, item.path, item.scrollId);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all ${
                    isDropdownActive
                      ? d
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'bg-black/5 text-slate-900 shadow-sm'
                      : d
                        ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-500 hover:text-slate-950 hover:bg-black/5'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isDropdownActive ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                {/* Staggered Liquid Glass Popover Content */}
                <AnimatePresence>
                  {isDropdownActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      className={getDropdownClass()}
                      style={{ transformOrigin: 'top center', willChange: 'transform, opacity' }}
                    >
                      {/* Arrow indicator */}
                      <div className={`${getArrowClass()} ${
                        d ? 'bg-[#0c0c0e] border-white/10' : 'bg-white border-slate-200/60'
                      }`} />

                      <div className="relative z-10 space-y-4">
                        <span className={`text-[9px] font-black tracking-widest block uppercase opacity-45 ${
                          d ? 'text-zinc-400' : 'text-slate-500'
                        }`}>
                          {item.dropdownTitle}
                        </span>

                        <div className="space-y-1.5">
                          {item.dropdownItems.map((subItem, idx) => (
                            <button
                              key={idx}
                              onClick={subItem.action}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3.5 border border-transparent ${
                                d
                                  ? 'hover:bg-white/[0.03] hover:border-white/5 group'
                                  : 'hover:bg-slate-50 hover:border-slate-100 group'
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${
                                d ? 'bg-white/[0.02]' : 'bg-slate-100'
                              }`}>
                                {subItem.icon}
                              </div>
                              <div className="space-y-0.5">
                                <h4 className={`text-xs font-bold transition-colors ${
                                  d ? 'text-white group-hover:text-accent' : 'text-slate-900 group-hover:text-accent'
                                }`}>
                                  {subItem.title}
                                </h4>
                                <p className={`text-[11px] leading-relaxed ${
                                  d ? 'text-zinc-500' : 'text-slate-500 font-medium'
                                }`}>
                                  {subItem.desc}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Footer dynamic link */}
                        <div className={`pt-3 border-t flex justify-end ${
                          d ? 'border-white/5' : 'border-slate-100'
                        }`}>
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              if (item.id === 'partner') {
                                navigate('/affiliate');
                              } else {
                                handleLinkClick(item.id, item.path, item.scrollId);
                              }
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider text-accent hover:underline flex items-center gap-1"
                          >
                            <span>Learn More</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme toggler */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${
              d ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
            aria-label="Toggle theme"
          >
            {d ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Action button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDashboardClick}
                className="btn-primary !py-2 !px-5 !text-sm rounded-full font-bold uppercase tracking-wider"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className={`p-2 rounded-xl transition-all ${
                  d ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-500/10 text-red-600'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary !py-2 !px-5 !text-sm rounded-full font-bold uppercase tracking-wider"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useLanguage, type Language } from '../context/LanguageContext';
import { FlagFR, FlagUS, FlagES, FlagRU, FlagIT, FlagDE, FlagNL } from './flags';
import { motion } from 'framer-motion';

interface FooterProps {
  isDark: boolean;
}

const languages: { code: Language; label: string; flag: React.ReactNode }[] = [
  { code: 'en', label: 'English', flag: <FlagUS /> },
  { code: 'de', label: 'Deutsch', flag: <FlagDE /> },
  { code: 'fr', label: 'Français', flag: <FlagFR /> },
  { code: 'nl', label: 'Nederlands', flag: <FlagNL /> },
  { code: 'es', label: 'Español', flag: <FlagES /> },
];

export default function Footer({ isDark }: FooterProps) {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string, sectionId?: string) => {
    e.preventDefault();
    navigate(path);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className={`pt-24 pb-12 border-t transition-all duration-700 ${isDark ? 'border-emerald-950/40 bg-gradient-to-b from-[#09090b] via-[#02231c] to-[#021730]' : 'border-sky-100 bg-gradient-to-b from-sky-50 via-sky-100 to-sky-200'}`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* CTA Section */}
        <div className="text-center mb-24">
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('landing.hero.cta.primary')}
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {t('footer.cta.sub')}
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary py-2.5 px-6 text-sm font-semibold rounded-full"
          >
            {t('landing.hero.cta.primary')}
          </button>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          
          {/* Logo & Info */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              EcomBoost<span className="text-accent">.</span>org
            </div>
            <p className={`text-sm font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              {t('footer.desc')}
            </p>
            
            {/* Language Switcher */}
            <div className="flex flex-wrap gap-3 pt-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-1.5 transition-all hover:scale-110 ${
                    language === lang.code ? 'scale-[1.6] z-10 mx-2' : 'hover:opacity-100 opacity-60'
                  }`}
                  title={lang.label}
                >
                  <div className={`w-6 h-4 overflow-hidden rounded-sm shadow-md transition-all`}>
                    {lang.flag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className={`text-sm font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.tools')}</h4>
            <ul className={`text-sm space-y-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              <li>
                <a href="/tools/email-generator" onClick={(e) => handleNavigation(e, '/tools/email-generator')} className="hover:text-blue-500 flex items-center gap-2">
                  {t('footer.tool.emailGenerator')} <span className="text-[9px] bg-red-500 text-white px-1 rounded font-black">HOT</span>
                </a>
              </li>
              <li>
                <a href="/tools/copy-writer" onClick={(e) => handleNavigation(e, '/tools/copy-writer')} className="hover:text-blue-500 flex items-center gap-2">
                  {t('footer.tool.scriptWriter')} <span className="text-[9px] bg-blue-500 text-white px-1 rounded font-black">NEW</span>
                </a>
              </li>
              <li>
                <a href="/tools/ad-hooks" onClick={(e) => handleNavigation(e, '/tools/ad-hooks')} className="hover:text-blue-500 flex items-center gap-2">
                  {t('footer.tool.adHooks')} <span className="text-[9px] bg-emerald-500 text-white px-1 rounded font-black">TRENDING</span>
                </a>
              </li>
              <li><a href="/tools/brand-gen" onClick={(e) => handleNavigation(e, '/tools/brand-gen')} className="hover:text-blue-500">{t('footer.tool.brandName')}</a></li>
              <li><a href="/tools/strategy-chat" onClick={(e) => handleNavigation(e, '/tools/strategy-chat')} className="hover:text-blue-500">{t('footer.tool.strategyChat')}</a></li>
            </ul>
          </div>

          {/* Tools 2 */}
          <div>
            <h4 className={`text-sm font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('nav.tools')}</h4>
            <ul className={`text-sm space-y-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              <li><a href="/tools/competitor-spy" onClick={(e) => handleNavigation(e, '/tools/competitor-spy')} className="hover:text-blue-500">{t('footer.tool.competitorSpy')}</a></li>
              <li><a href="/tools/profit-margin" onClick={(e) => handleNavigation(e, '/tools/profit-margin')} className="hover:text-blue-500">{t('footer.tool.profitMargin')}</a></li>
              <li><a href="/tools/roas-calculator" onClick={(e) => handleNavigation(e, '/tools/roas-calculator')} className="hover:text-blue-500">{t('footer.tool.roasCalc')}</a></li>
              <li><a href="/tools/roi-calculator" onClick={(e) => handleNavigation(e, '/tools/roi-calculator')} className="hover:text-blue-500">{t('footer.tool.roiCalc')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`text-sm font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('footer.company.title')}</h4>
            <ul className={`text-sm space-y-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              <li><a href="/#landing-pricing" onClick={(e) => handleNavigation(e, '/', 'landing-pricing')} className="hover:text-blue-500">{t('nav.pricing')}</a></li>
              <li><a href="/#tools" onClick={(e) => handleNavigation(e, '/', 'tools')} className="hover:text-blue-500">{t('nav.features')}</a></li>
              <li><a href="/affiliate" onClick={(e) => handleNavigation(e, '/affiliate')} className="hover:text-blue-500">{t('footer.affiliate')}</a></li>
              <li><a href="/contact" onClick={(e) => handleNavigation(e, '/contact')} className="hover:text-blue-500">{t('nav.contact')}</a></li>
              <li><a href="/#faq" onClick={(e) => handleNavigation(e, '/', 'faq')} className="hover:text-blue-500">{t('footer.faq')}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'border-emerald-950/40 text-zinc-500' : 'border-sky-100 text-slate-400'}`}>
          <p className="text-xs">{t('footer.rights')}</p>
        </div>

      </div>
    </footer>
  );
}

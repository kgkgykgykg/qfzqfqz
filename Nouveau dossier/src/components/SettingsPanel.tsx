import { useAuth } from '../context/AuthContext';
import { useLanguage, type Language } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { FlagFR, FlagUS, FlagES, FlagRU, FlagIT, FlagDE } from './flags';

interface SettingsPanelProps {
  isDark: boolean;
  onBack: () => void;
}

const languages: { code: Language; label: string; flag: React.ReactNode }[] = [
  { code: 'fr', label: 'Français', flag: <FlagFR /> },
  { code: 'en', label: 'English', flag: <FlagUS /> },
  { code: 'es', label: 'Español', flag: <FlagES /> },
  { code: 'ru', label: 'Русский', flag: <FlagRU /> },
  { code: 'it', label: 'Italiano', flag: <FlagIT /> },
  { code: 'de', label: 'Deutsch', flag: <FlagDE /> },
];

export default function SettingsPanel({ isDark, onBack }: SettingsPanelProps) {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`max-w-4xl mx-auto p-6 md:p-10 rounded-3xl border ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/10'} shadow-xl`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">{t('settings.title')}</h2>
        <button onClick={onBack} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
          ← {t('nav.home')}
        </button>
      </div>
      
      <div className="space-y-8">
        {/* Profile Info (Read Only) */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60 text-slate-500 dark:text-zinc-500">First Name</label>
              <input 
                type="text" 
                value={user?.firstName || ''} 
                readOnly
                className={`w-full p-3 rounded-xl border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60 text-slate-500 dark:text-zinc-500">Last Name</label>
              <input 
                type="text" 
                value={user?.lastName || ''} 
                readOnly
                className={`w-full p-3 rounded-xl border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-6 pt-8 border-t border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Settings</h3>
          
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60 text-slate-500 dark:text-zinc-500">
              {t('settings.theme')}
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                  theme === 'light'
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                <Sun size={20} />
                <span className="font-semibold">Light</span>
              </button>
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                  theme === 'dark'
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <Moon size={20} />
                <span className="font-semibold">Dark</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60 text-slate-500 dark:text-zinc-500">
              {t('settings.language')}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    language === lang.code
                      ? 'bg-accent/10 border-accent text-accent'
                      : isDark
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center justify-center w-6 h-6">{lang.flag}</span>
                  <span className="text-sm font-semibold">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

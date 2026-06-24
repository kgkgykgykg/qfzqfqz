import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  dark?: boolean;
}

export default function AuthModal({ isOpen, onClose, dark = true }: AuthModalProps) {
  const { 
    signInWithGoogle, 
    authError, 
    clearError 
  } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         onClick={onClose}
         className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Window */}
      <motion.div
         initial={{ opacity: 0, scale: 0.95, y: 15 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.95, y: 15 }}
         transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
         className={`relative w-full max-w-sm overflow-hidden rounded-[32px] border-2 ${
           dark 
             ? 'bg-zinc-950 border-white/40 text-white shadow-2xl' 
             : 'bg-white border-slate-900 text-slate-900 shadow-xl shadow-slate-200/50'
         }`}
      >
        <div className="p-8 md:p-10 space-y-8">
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-1.5 rounded-lg transition-all ${
              dark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-2 text-center">
            <span className="font-display font-black text-2xl tracking-tighter text-accent">
              Welcome Back
            </span>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-zinc-500' : 'text-slate-400'}`}>
              AUTHENTICATED ACCESS
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
              setIsSubmitting(true);
              clearError();
              try {
                await signInWithGoogle();
                onClose();
              } catch (e) {
                console.error(e);
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] border-2 ${
              dark 
                ? 'bg-transparent text-white hover:bg-zinc-900 border-zinc-800' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm'
            }`}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-4 h-4" />
            Sign In With Google
          </button>

          {authError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 leading-relaxed text-center">
              {authError}
            </div>
          )}

          <p className={`text-[10px] font-medium leading-relaxed max-w-[240px] mx-auto text-center ${dark ? 'text-zinc-500' : 'text-slate-400'}`}>
            By continuing, you agree to our <Link to="/legal" onClick={onClose} className="underline hover:text-accent">Terms of Service</Link> and <Link to="/security" onClick={onClose} className="underline hover:text-accent">Privacy Policies</Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

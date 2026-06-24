import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Globe, Lock, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function MaintenanceOverlay() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [message, setMessage] = useState('');
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'admin', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.maintenanceMode) {
          setIsMaintenance(true);
          setMessage(data.maintenanceMessage || 'The site is currently in maintenance. Please try again later.');
        } else {
          setIsMaintenance(false);
        }
      } else {
        setIsMaintenance(false);
      }
    }, (error) => {
      console.error('Maintenance check error', error);
    });
    return () => unsub();
  }, []);

  if (!isMaintenance) return null;

  // Let admin bypass the lock
  if (user && (user.email === 'vadimtchepikov@gmail.com' || user.email === 'goatcaca111@gmail.com')) {
    return (
      <div className="fixed bottom-4 right-4 z-[5000] bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-2xl flex items-center gap-2">
        <ShieldAlert className="w-5 h-5"/> MAINTENANCE ENFORCE ACTIVE (Bypassed as Admin)
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-95 flex items-center justify-center p-6 text-white text-center">
      <div className="max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-zinc-400" />
            Maintenance
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="bg-zinc-800/50 rounded-lg p-4 w-full flex items-start gap-3 border border-zinc-700/50 text-left">
            <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-zinc-400">
              Our engineers hold the line. Access is temporarily restricted while we perform system upgrades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

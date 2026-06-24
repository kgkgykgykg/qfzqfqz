import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function Join() {
  const { promoCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleReferral = async () => {
      const refCode = promoCode;
      if (refCode) {
        try {
          // Get IP
          let ip = 'unknown';
          try {
            const res = await fetch('/api/ip');
            const data = await res.json();
            ip = data.ip;
          } catch(e) {}

          // Find the link doc
          const q = query(collection(db, 'affiliateLinks'), where('shortCode', '==', refCode));
          const snap = await getDocs(q);
          
          if (!snap.empty) {
            const linkDoc = snap.docs[0];
            
            // Record click
            await addDoc(collection(db, 'affiliateClicks'), {
              linkId: linkDoc.id,
              ip: ip,
              userAgent: navigator.userAgent,
              clickedAt: Date.now()
            });

            // Store ref locally so when user registers it's picked up
            sessionStorage.setItem('ecomboost_ref', linkDoc.id);
          }
        } catch (e) {
          console.error("Affiliate tracking error", e);
        }
      }
      
      // Redirect to login/signup
      navigate('/login');
    };

    handleReferral();
  }, [promoCode, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

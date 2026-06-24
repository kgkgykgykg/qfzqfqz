import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function EmailVerificationPortal() {
  const { isLoggedIn, user } = useAuth();
  
  // This portal is likely unnecessary with Firebase Auth automatic handling
  // but keeping basic structure to prevent complete UI break.
  return null;
}

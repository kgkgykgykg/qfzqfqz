import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Copy,
  Check,
  Users,
  DollarSign,
  Award,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Affiliate() {
  const { user, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const d = theme === "dark";
  const navigate = useNavigate();

  const [generatedLink, setGeneratedLink] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    if (!user) {
      navigate("/login?redirect=affiliate");
      return;
    }
    const shortCode = customCode
      ? customCode.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
      : "AFF_" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const linkId = user.id + "_" + shortCode;

    await setDoc(doc(db, "affiliateLinks", linkId), {
      userId: user.id,
      shortCode: shortCode,
      createdAt: Date.now(),
    });

    const url = `${window.location.origin}/#/${shortCode}`;
    setGeneratedLink(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${d ? "bg-gradient-hero text-text" : "bg-gradient-hero-light text-text-light"} transition-colors duration-300`}
    >
      <Navbar showBack />

      {/* ── Main content area ── */}
      <main className="pt-28 pb-20 px-6 max-w-4xl mx-auto flex-1 flex flex-col justify-center w-full z-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
                d
                  ? "bg-accent/10 text-accent border border-accent/10"
                  : "bg-accent/10 text-accent border border-accent/10"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              EcomBoost.org Affiliate Partner Program
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              {t ? t("affiliate.title") : "Partner Program"}
            </h1>
            <p
              className={`text-base md:text-lg max-w-2xl mx-auto ${d ? "text-text-muted" : "text-slate-600 font-medium"}`}
            >
              {t ? t("affiliate.subtitle.pre") : "You earn "}
              <strong className="text-emerald-500 font-bold dark:text-emerald-400">
                {t ? t("affiliate.subtitle.hl") : "50% of all sales"}
              </strong>
              {t
                ? t("affiliate.subtitle.post")
                : " from users who sign up through your link."}
            </p>
          </motion.div>
        </div>

        {/* 3 Step Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`p-6 rounded-2xl text-center border transition-all duration-300 ${
              d
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
              <span className="font-bold text-lg">1</span>
            </div>
            <h3
              className={`font-bold text-lg mb-2 ${d ? "text-white" : "text-slate-900"}`}
            >
              {t ? t("affiliate.step1.title") : "Generate Link"}
            </h3>
            <p
              className={`text-sm ${d ? "text-zinc-500" : "text-slate-500 font-medium"}`}
            >
              {t
                ? t("affiliate.step1.desc")
                : "Click the button below to generate your unique tracking URL."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`p-6 rounded-2xl text-center border transition-all duration-300 ${
              d
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
              <span className="font-bold text-xl">2</span>
            </div>
            <h3
              className={`font-bold text-lg mb-2 ${d ? "text-white" : "text-slate-900"}`}
            >
              {t ? t("affiliate.step2.title") : "Share With Audience"}
            </h3>
            <p
              className={`text-sm ${d ? "text-zinc-500" : "text-slate-500 font-medium"}`}
            >
              {t
                ? t("affiliate.step2.desc")
                : "Post it on your social media, blog, or send it to your friends."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`p-6 rounded-2xl text-center border transition-all duration-300 ${
              d
                ? "bg-zinc-900 border-zinc-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <span className="font-bold text-xl">3</span>
            </div>
            <h3
              className={`font-bold text-lg mb-2 ${d ? "text-white" : "text-slate-900"}`}
            >
              {t ? t("affiliate.step3.title") : "Earn 50% Commission"}
            </h3>
            <p
              className={`text-sm ${d ? "text-zinc-500" : "text-slate-500 font-medium"}`}
            >
              {t
                ? t("affiliate.step3.desc")
                : "When they subscribe, you instantly earn half of the revenue."}
            </p>
          </motion.div>
        </div>

        {/* Generate / Action Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`w-full max-w-lg mx-auto p-8 rounded-2xl border transition-all duration-300 ${
            d
              ? "bg-zinc-900 border-zinc-800 shadow-2xl shadow-black/40"
              : "bg-white border-slate-200 shadow-lg shadow-slate-100/50"
          }`}
        >
          {!generatedLink ? (
            <div className="w-full space-y-5">
              <div>
                <label
                  className={`text-sm font-bold ml-1 mb-2 block ${d ? "text-zinc-300" : "text-slate-700"}`}
                >
                  Custom Promo Code (Optional)
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="e.g. CODEFREE"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${
                    d
                      ? "bg-black border-zinc-700 text-zinc-300 focus:border-accent"
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:border-accent"
                  }`}
                />
              </div>
              <button
                onClick={generateLink}
                className="w-full bg-accent hover:bg-accent-light text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md active:scale-[0.99]"
              >
                {t ? t("affiliate.generate.btn") : "Generate Affiliate Link"}
              </button>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div
                className={`text-sm font-semibold ml-1 ${d ? "text-zinc-400" : "text-slate-500"}`}
              >
                {t ? t("affiliate.generated.label") : "Your Tracking Link:"}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className={`flex-1 border rounded-xl px-4 py-3 text-xs font-mono outline-none ${
                    d
                      ? "bg-black border-zinc-700 text-zinc-300"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
                <button
                  onClick={copyToClipboard}
                  className={`p-3.5 rounded-xl transition-colors ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : d
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <Footer isDark={d} />
    </div>
  );
}

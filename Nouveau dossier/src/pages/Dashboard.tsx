import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useApiKey } from '../context/ApiKeyContext';
import { useAuth } from '../context/AuthContext';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Zap, Moon, Sun } from 'lucide-react';
import ApiKeyModal from '../components/ApiKeyModal';
import AIToolPanel from '../components/AIToolPanel';
import CalculatorPanel from '../components/CalculatorPanel';
import ChatPanel from '../components/ChatPanel';
import SpySuitePanel from '../components/SpySuitePanel';
import AdminPanel from '../components/AdminPanel';
import SettingsPanel from '../components/SettingsPanel';
import Footer from '../components/Footer';
// CheckoutModal modal was removed in favor of full screen flow

const topSellerTools = [
  {
    id: 'brand-gen',
    name: 'Name & Slogan',
    desc: 'Bestseller Name and Slogan Generator for your brand',
    color: 'orange',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h14a2 2 0 012 2v12a4 4 0 01-4 4H7z" /></svg>
    ),
    systemPrompt: 'Generate highly creative brand names and matching professional slogans based on the product description.',
    placeholder: 'Describe your brand or product...',
  },
  {
    id: 'comp-analysis',
    name: 'Competitor Checker',
    desc: 'Analyze competitor sites, revenue, and market size',
    color: 'orange',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
    systemPrompt: 'Analyze the competition for the provided title/aspect. Identify main competitor websites, estimate their revenue, and conclude if the competition is large or small.',
    placeholder: 'Enter your project title or aspect to analyze...',
  },
  {
    id: 'ga-dashboard',
    name: 'GA Dashboard',
    desc: 'Review Google Analytic Dashboard with views and scrapings',
    color: 'orange',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
    ),
    systemPrompt: 'Simulate a Google Analytics dashboard analysis. Provide insights on views, comments, and engagement through data representation.',
    placeholder: 'Enter target site or data source...',
  }
];

const aiTools = [
  {
    id: 'email',
    name: 'Email Generator',
    desc: 'High-converting email campaigns',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    systemPrompt: `You are an expert email copywriter. Respond in the user's language.

CRITICAL: Output ONLY the email content. NO introduction, NO conclusion, NO tips.

FORMAT:
Subject: [subject line]

[email body with [Name] placeholders]

Nothing else.`,
    placeholder: 'Describe your product/service and the goal of this email...',
  },
  {
    id: 'sms',
    name: 'SMS Generator',
    desc: 'Punchy SMS marketing messages',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    systemPrompt: `You are an SMS marketing expert. Respond in the user's language.

CRITICAL: Output ONLY the SMS text. NO introduction, NO conclusion, NO tips.
Keep under 160 characters. Make it punchy and action-driven.

Just the SMS text. Multiple variations separated by blank lines. Nothing else.`,
    placeholder: 'Describe your promotion or message goal...',
  },
  {
    id: 'script',
    name: 'Script Writer',
    desc: 'Sales scripts and pitches',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    systemPrompt: `You are a professional scriptwriter. Respond in the user's language.

CRITICAL: Output ONLY the script. NO introduction, NO conclusion, NO tips.

Format with speaker directions in [brackets]. Just the script content.`,
    placeholder: 'What kind of script? (sales call, video, podcast...)',
  },
  {
    id: 'adcopy',
    name: 'Ad Copy',
    desc: 'Social media and ad copy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    systemPrompt: `You are an advertising copywriter. Respond in the user's language.

CRITICAL: Output ONLY the ad copy. NO introduction, NO conclusion, NO tips.

Multiple variations separated by ---. Include hashtags where appropriate. Nothing else.`,
    placeholder: 'Describe your product and target audience...',
  },
  {
    id: 'product-desc',
    name: 'Product Descriptions',
    desc: 'SEO-ready product pages',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    systemPrompt: `You are an e-commerce copywriter. Respond in the user's language.

CRITICAL: Output ONLY the product description. NO intro/outro. NO markdown. Keep it scannable: headline, 3-5 bullets benefits, materials/specs, sizing/fit (if relevant), short SEO snippet.

No fluff. Plain text.`,
    placeholder: 'Describe the product, audience, price, key benefits...',
  },

  {
    id: 'image',
    name: 'Image Prompts',
    desc: 'AI image generation prompts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    systemPrompt: `You are an AI image prompt engineer. Respond in English for AI image generators.

CRITICAL: Output ONLY the prompts. NO introduction, NO conclusion, NO tips.

Multiple prompts separated by ---. Detailed, specific, ready to paste. Nothing else.`,
    placeholder: 'Describe the visuals you need...',
  },
  {
    id: 'video',
    name: 'Video Scripts',
    desc: 'Video content and storyboards',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    systemPrompt: `You are a video content strategist. Respond in the user's language.

CRITICAL: Output ONLY the script. NO introduction, NO conclusion, NO tips.

Format:
[HOOK - 0:00-0:03]
Content here

[MAIN - 0:03-X:XX]
Content here

[CTA - Final seconds]
Content here

Just the script with timestamps. Nothing else.`,
    placeholder: 'What kind of video? (TikTok, YouTube, ad...)',
  },
  {
    id: 'hooks',
    name: 'Hook Generator',
    desc: 'Viral hooks for content',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    systemPrompt: `You are a viral content expert. Respond in the user's language.

CRITICAL: Output ONLY the hooks. NO introduction, NO conclusion, NO tips.

10 different hooks, numbered 1-10. Short, punchy, attention-grabbing. Nothing else.`,
    placeholder: 'What topic or product do you need hooks for?',
  },
  {
    id: 'persona',
    name: 'Persona Crafter',
    desc: 'Detailed target customer avatars',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    systemPrompt: `You are a consumer psychology and e-commerce growth marketing expert. Respond in the user's language.

CRITICAL: Output ONLY the detailed customer persona sheet. NO introduction, NO conclusion, NO guides.

Include:
- Persona Name & Tagline
- Demographics (Age, Income, Occupation)
- Core Desires & Emotional Drivers
- Main Objections & Trust Hurdles
- 3 Direct ad hooks to test on them.`,
    placeholder: 'Specify product type and initial buyer signals...',
  },
  {
    id: 'seo-meta',
    name: 'SEO Tag Optimizer',
    desc: 'Shopify search tag generator',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 16H5.436M15.436 12H9" />
      </svg>
    ),
    systemPrompt: `You are an SEO and search algorithms specialist. Respond in the user's language.

CRITICAL: Output ONLY the copy block. NO intro/outro.

Include:
- Page Title (Optimal character length)
- Meta Description (Conversion focused, characters limit)
- 10 High-Intent Shopify tag categories`,
    placeholder: 'Enter product name, main tags, and search keywords...',
  },
  {
    id: 'offer-builder',
    name: 'Offer Architect',
    desc: 'Generate viral bundle & promo offers',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    systemPrompt: `You are an expert in direct-response marketing and e-commerce offer design. Respond in the user's language.

CRITICAL: Output ONLY the offer proposal. NO introduction, NO conclusion.

Provide a high-conversion retail offer setup containing:
- The Core Concept (Hero product positioning)
- Bundle Structure (Tiered pricing or BOGO configuration)
- The Irresistible Bonus (Digital PDF guides, free gifts, or warranty additions)
- Risk Reversal guarantee statement
- High-urgency scarcity trigger copy.`,
    placeholder: 'Enter your main product name, niche, and standard retail price...',
  },
  {
    id: 'customer-support',
    name: 'Support Auto-Reply',
    desc: 'Draft retention-focused support replies',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    systemPrompt: `You are an elite customer success and brand retention manager. Respond in the user's language.

CRITICAL: Output ONLY the support response template. NO intro/outro.

Provide:
- A warm, empathetic acknowledgment of the customer's issue (e.g. shipping delay, broken item, refund request).
- A retention-focused solution proposing store credit (+15% bonus value) or free expedited replacement to prevent refunds.
- A concise, polite fallback signoff.`,
    placeholder: 'Paste customer message or describe the issue (e.g., "Package lost, customer wants refund")...',
  },
  {
    id: 'strategy-chat',
    name: 'Strategy Chat',
    desc: 'Multi-Model AI - Business analyst multi-model chat',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 13.042 3 11.574 3 10c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    systemPrompt: '',
    placeholder: 'Discuss KPIs, margins, ROAS, ops, growth...',
  },
];

const spyTools = [
  {
    id: 'shops',
    name: 'Shops Discovery & Tracker',
    desc: 'Deep-dive into high-growth storefronts, filter through targets, and track active winners.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 'ads-library',
    name: 'Ads Library & Swipe',
    desc: 'Uncover top-converting ads across networks, study strategies, and save templates.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'advertisers',
    name: 'Advertisers Hunter',
    desc: 'Track highest-spending ad accounts, analyze active budgets, and map storefronts.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    ),
  },
  {
    id: 'meta-ads-library',
    name: 'Meta Ads Analyzer',
    desc: 'Drill down into any Facebook/Instagram ad body, track lifetime, and copy content.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    id: 'shop-analytics',
    name: 'Shop Analytics',
    desc: 'Profile competitor storefronts for traffic trends, raw revenue, and tech stack logs.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19M12 15M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'similar-shops',
    name: 'Similar Shops Finder',
    desc: 'Map competitive lookalikes, audit catalog overlays, and compare incoming traffic.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    id: 'email-library',
    name: 'Email Library & Swipe',
    desc: 'Browse winning newsletter designs, capture visuals, and replicate automation.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
      </svg>
    ),
  },
  {
    id: 'shop-emails',
    name: 'Shop Email Tracker',
    desc: 'Decode premium automation workflows, triggers, templates, and delivery hours.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 01-2-2zm9-3h.01M12 12h.01" />
      </svg>
    ),
  },
  {
    id: 'folders',
    name: 'Organized Boards & Folders',
    desc: 'Plot business ideas, track lists, custom spreadsheets, and draw visual concept boards.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'brandtracker',
    name: 'Brandtracker Realtime',
    desc: 'Monitor competitive metrics, live product iterations, and campaign assets.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 01-2-4.516V7H6v.484A6.07 6.07 0 014 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m9 0a3 3 0 11-6 0M9 21h6" />
      </svg>
    ),
  }
];

const calculators = [
  {
    id: 'profit-margin',
    name: 'Profit Margin',
    desc: 'Analyze product profitability',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    fields: [
      { id: 'sellingPrice', label: 'Selling Price', unit: '$' },
      { id: 'productCost', label: 'Product Cost', unit: '$' },
      { id: 'shippingCost', label: 'Shipping Cost', unit: '$' },
      { id: 'adsCost', label: 'Ads Cost per Sale', unit: '$' },
      { id: 'otherCosts', label: 'Other Costs', unit: '$' },
    ],
    calculate: (v: Record<string, number>) => {
      const revenue = v.sellingPrice || 0;
      const costs = (v.productCost || 0) + (v.shippingCost || 0) + (v.adsCost || 0) + (v.otherCosts || 0);
      const profit = revenue - costs;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      return [
        { label: 'Net Profit', value: `$${profit.toFixed(2)}`, highlight: profit > 0 },
        { label: 'Profit Margin', value: `${margin.toFixed(1)}%`, highlight: margin > 20 },
        { label: 'Total Costs', value: `$${costs.toFixed(2)}` },
      ];
    },
  },
  {
    id: 'roas',
    name: 'ROAS Break Even',
    desc: 'Break-even ad spend analysis',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    fields: [
      { id: 'sellingPrice', label: 'Selling Price', unit: '$' },
      { id: 'productCost', label: 'Product Cost', unit: '$' },
      { id: 'shippingCost', label: 'Shipping Cost', unit: '$' },
      { id: 'conversionRate', label: 'Conversion Rate', unit: '%' },
    ],
    calculate: (v: Record<string, number>) => {
      const revenue = v.sellingPrice || 0;
      const costs = (v.productCost || 0) + (v.shippingCost || 0);
      const profit = revenue - costs;
      const breakEvenRoas = profit > 0 ? revenue / profit : 0;
      const breakEvenCpa = profit;
      const cr = (v.conversionRate || 1) / 100;
      const maxCpc = cr > 0 ? breakEvenCpa * cr : 0;
      return [
        { label: 'Break-even ROAS', value: `${breakEvenRoas.toFixed(2)}x`, highlight: true },
        { label: 'Break-even CPA', value: `$${breakEvenCpa.toFixed(2)}` },
        { label: 'Max CPC', value: `$${maxCpc.toFixed(2)}` },
      ];
    },
  },
  {
    id: 'roi',
    name: 'ROI Calculator',
    desc: 'Investment return metrics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    fields: [
      { id: 'investment', label: 'Total Investment', unit: '$' },
      { id: 'revenue', label: 'Revenue Generated', unit: '$' },
    ],
    calculate: (v: Record<string, number>) => {
      const investment = v.investment || 0;
      const revenue = v.revenue || 0;
      const profit = revenue - investment;
      const roi = investment > 0 ? (profit / investment) * 100 : 0;
      return [
        { label: 'ROI', value: `${roi.toFixed(1)}%`, highlight: roi > 0 },
        { label: 'Net Profit', value: `$${profit.toFixed(2)}`, highlight: profit > 0 },
        { label: 'Return per $1', value: `$${(revenue / (investment || 1)).toFixed(2)}` },
      ];
    },
  },
  {
    id: 'ltv',
    name: 'Customer LTV',
    desc: 'Lifetime value estimation',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    fields: [
      { id: 'avgOrderValue', label: 'Avg Order Value', unit: '$' },
      { id: 'purchaseFrequency', label: 'Purchases per Year', unit: 'x' },
      { id: 'customerLifespan', label: 'Customer Lifespan', unit: 'years' },
      { id: 'profitMargin', label: 'Profit Margin', unit: '%' },
    ],
    calculate: (v: Record<string, number>) => {
      const aov = v.avgOrderValue || 0;
      const freq = v.purchaseFrequency || 1;
      const lifespan = v.customerLifespan || 1;
      const margin = (v.profitMargin || 100) / 100;
      const ltv = aov * freq * lifespan;
      const ltvProfit = ltv * margin;
      return [
        { label: 'Customer LTV', value: `$${ltv.toFixed(2)}`, highlight: true },
        { label: 'LTV Profit', value: `$${ltvProfit.toFixed(2)}` },
        { label: 'Annual Value', value: `$${(aov * freq).toFixed(2)}` },
      ];
    },
  },
  {
    id: 'ecom-profit',
    name: 'Ecom Profit',
    desc: 'Monthly profit analysis',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    fields: [
      { id: 'monthlyRevenue', label: 'Monthly Revenue', unit: '$' },
      { id: 'cogs', label: 'Cost of Goods', unit: '$' },
      { id: 'shipping', label: 'Shipping Costs', unit: '$' },
      { id: 'marketing', label: 'Marketing Spend', unit: '$' },
      { id: 'overhead', label: 'Overhead Costs', unit: '$' },
    ],
    calculate: (v: Record<string, number>) => {
      const revenue = v.monthlyRevenue || 0;
      const totalCosts = (v.cogs || 0) + (v.shipping || 0) + (v.marketing || 0) + (v.overhead || 0);
      const profit = revenue - totalCosts;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      return [
        { label: 'Monthly Profit', value: `$${profit.toFixed(2)}`, highlight: profit > 0 },
        { label: 'Profit Margin', value: `${margin.toFixed(1)}%`, highlight: margin > 15 },
        { label: 'Annual Profit', value: `$${(profit * 12).toFixed(2)}` },
      ];
    },
  },
  {
    id: 'scale-projection',
    name: 'Scale Projection',
    desc: 'Forecast scaling ad budgets and CAC margin fatigue',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    fields: [
      { id: 'adBudget', label: 'Ad Budget Spend', unit: '$' },
      { id: 'cpc', label: 'Cost Per Click (CPC)', unit: '$' },
      { id: 'conversionRate', label: 'Conversion Rate', unit: '%' },
      { id: 'avgOrderValue', label: 'Avg Order Value (AOV)', unit: '$' },
    ],
    calculate: (v: Record<string, number>) => {
      const budget = v.adBudget || 0;
      const cpc = v.cpc || 1;
      const cr = (v.conversionRate || 1.5) / 100;
      const aov = v.avgOrderValue || 50;

      const clicks = cpc > 0 ? budget / cpc : 0;
      const conversions = clicks * cr;
      const predictedRevenue = conversions * aov;
      const cac = conversions > 0 ? budget / conversions : 0;
      const netRoas = cac > 0 ? aov / cac : 0;

      return [
        { label: 'Predicted Revenue', value: `$${predictedRevenue.toFixed(2)}`, highlight: predictedRevenue > budget },
        { label: 'Acquired Customers', value: `${conversions.toFixed(0)} units` },
        { label: 'Ecom CAC', value: `$${cac.toFixed(2)}` },
        { label: 'Projected ROAS', value: `${netRoas.toFixed(2)}x`, highlight: netRoas >= 2.0 },
      ];
    },
  },
];

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { isKeySet } = useApiKey();
  const { isLoggedIn, user, logout, deleteAccount, updateProfile, updateSubscription } = useAuth();
  const navigate = useNavigate();

  // Authentication check - redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const [activeView, setActiveView] = useState<{ type: 'ai' | 'calc' | 'spy'; id: string } | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [pendingTool, setPendingTool] = useState<{ type: 'ai' | 'calc' | 'spy'; id: string } | null>(null);

  useEffect(() => {
    if (isKeySet && pendingTool) {
      setActiveView(pendingTool);
      setPendingTool(null);
    }
  }, [isKeySet, pendingTool]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro' | 'business' | null>(null);
  const [accountView, setAccountView] = useState(false);
  const [adminView, setAdminView] = useState(false);
  const [lang, setLang] = useState<'en' | 'fr' | 'es' | 'it' | 'ru'>('en');
  const [showEmail, setShowEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const isDark = theme === 'dark';

  // Profile forms handling state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'month' | 'quarter' | 'year'>('month');

  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [credSuccess, setCredSuccess] = useState<string | null>(null);
  const [credError, setCredError] = useState<string | null>(null);
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  const [dashboardRemember, setDashboardRemember] = useState(() => {
    return localStorage.getItem('ecomboost_remember_me') !== 'false';
  });

  const handleDashboardRememberChange = (checked: boolean) => {
    setDashboardRemember(checked);
    localStorage.setItem('ecomboost_remember_me', checked ? 'true' : 'false');
  };

  // Load user data upon loading
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setSelectedAvatar(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    const handleBreach = () => {
      setShowKeyModal(true);
    };
    window.addEventListener('shieldguard-breach', handleBreach);
    return () => {
      window.removeEventListener('shieldguard-breach', handleBreach);
    };
  }, []);

  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (user?.subscriptionPeriodEnd) {
      const end = new Date(user.subscriptionPeriodEnd).getTime();
      const now = Date.now();
      const diff = end - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysRemaining(days);
    }
  }, [user?.subscriptionPeriodEnd]);

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
          <p className="text-sm text-zinc-400">Restoring your secure connection...</p>
        </div>
      </div>
    );
  }

  const isToolLocked = (toolId: string) => {
    const tier = user.subscription;
    
    // Checked dynamically: only non-expired subscription periods are active
    const isActive = !!user.subscriptionPeriodEnd && new Date() < new Date(user.subscriptionPeriodEnd);
    
    if (!tier || !isActive) return true;
    
    if (tier === 'starter') {
      const allowed = ['email', 'sms', 'adcopy', 'product-desc', 'hooks', 'product-ideas', 'strategy-chat', 'profit-margin', 'roas'];
      return !allowed.includes(toolId);
    }
    
    return false;
  };

  const isModuleLocked = () => {
    const isActive = !!user.subscriptionPeriodEnd && new Date() < new Date(user.subscriptionPeriodEnd);
    return !user.subscription || !isActive;
  };

  const CheckIcon = () => (
    <div className={`inline-flex items-center justify-center p-1 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/15 text-emerald-600'}`}>
      <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  const CrossIcon = () => (
    <div className={`inline-flex items-center justify-center p-1 rounded-full ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/15 text-rose-600'}`}>
      <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );

  const handleToolClick = (toolId: string, type: 'ai' | 'calc' | 'spy') => {
    if (isToolLocked(toolId)) {
      setAccountView(true);
      setTimeout(() => {
        const plansSection = document.getElementById('manage-license');
        if (plansSection) plansSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    
    if ((type === 'ai' || type === 'spy') && !isKeySet) {
      setPendingTool({ type, id: toolId });
      setShowKeyModal(true);
      return;
    }
    
    setActiveView({ type, id: toolId });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        firstName,
        lastName,
        avatar: selectedAvatar
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating user profile:', err);
    }
  };

  const handleCredentialsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredSuccess(null);
    setCredError(null);
    
    if (!editEmail && !editPassword) {
      setCredError('Please fill in a new email or password to update.');
      return;
    }

    setIsUpdatingCreds(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (editEmail && editPassword) {
        setCredSuccess('Email and password updates initiated! Check confirmation links sent to both mailboxes.');
      } else if (editEmail) {
        setCredSuccess('Email update initiated! Check confirmation links sent to both old and new mailboxes.');
      } else {
        setCredSuccess('Security password updated successfully!');
      }
      
      setEditEmail('');
      setEditPassword('');
    } catch (err: any) {
      setCredError(err.message || 'Verification update request failed.');
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(user.passwordHidden);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 2000);
  };

  const activeTool = activeView?.type === 'ai' ? [...aiTools, ...topSellerTools].find(t => t.id === activeView.id) : null;
  const activeCalc = activeView?.type === 'calc' ? calculators.find(c => c.id === activeView.id) : null;
  const activeSpy = activeView?.type === 'spy' ? spyTools.find(s => s.id === activeView.id) : null;

  return (
    <div className={isDark ? 'bg-gradient-dashboard text-text' : 'bg-gradient-dashboard-light text-text-light min-h-screen'}>
      {/* RENEWAL BOT ALERT */}
      {user?.subscription && daysRemaining !== null && daysRemaining <= 10 && daysRemaining > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`sticky top-20 z-40 mx-6 mb-6 p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-xl ${
          isDark ? 'bg-orange-500/10 border-orange-500/20 text-orange-200 backdrop-blur-xl' : 'bg-orange-50 border-orange-200 text-orange-900'
        }`}>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
                <p className="text-sm font-bold">{t('dashboard.alert.expiry.title')}</p>
                <p className="text-xs opacity-80">{t('dashboard.alert.expiry.desc').replace('{days}', daysRemaining.toString())}</p>
             </div>
          </div>
          <button 
            onClick={() => setAccountView(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
          >
            {t('dashboard.alert.expiry.cta')}
          </button>
        </motion.div>
      )}

      {/* Header — matches landing page */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-white/7 border border-white/18 text-text' : 'bg-white/80 border border-black/10 text-slate-900'} backdrop-blur-2xl`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" style={{ backdropFilter: 'blur(18px)' }}>

          <div className="flex items-center gap-6">
            <Link to="/" className={`font-display text-[22px] font-black tracking-wide ${isDark ? 'text-white' : 'text-slate-900 border-none outline-none'}`} style={{ color: isDark ? '#ffffff' : '#0f172a' }}>
              EcomBoost<span className="text-accent text-3xl">.</span>org
            </Link>
            {!activeView && (
              <nav className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => { setAdminView(false); setAccountView(false); setActiveView(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${(!accountView && !activeView && !adminView) ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-slate-900') : (isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5')}`}
                >
                  {t('dashboard.overview')}
                </button>
                {user.subscription && (
                  <>
                    <button
                      onClick={() => { setAdminView(false); setAccountView(false); setActiveView(null); setTimeout(() => document.getElementById('ai-tools')?.scrollIntoView({ behavior: 'smooth' }), 70); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5'}`}
                    >
                      {t('dashboard.aiTools')}
                    </button>
                    <button
                      onClick={() => { setAdminView(false); setAccountView(false); setActiveView(null); setTimeout(() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' }), 70); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5'}`}
                    >
                      {t('dashboard.calculators')}
                    </button>
                    <button
                      onClick={() => { setAdminView(false); setAccountView(false); setActiveView(null); setTimeout(() => document.getElementById('tracker-tools')?.scrollIntoView({ behavior: 'smooth' }), 70); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5'}`}
                    >
                      {t('dashboard.trackerTools')}
                    </button>
                  </>
                )}
                <button
                  onClick={() => { setAdminView(false); setAccountView(true); setActiveView(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${accountView ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-slate-900') : (isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5')}`}
                >
                  {t('dashboard.settings')}
                </button>
                {user?.isAdmin && (
                  <button
                    onClick={() => { setAdminView(true); setAccountView(false); setActiveView(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${adminView ? (isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-slate-900') : (isDark ? 'text-zinc-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5')}`}
                  >
                    {t('dashboard.admin')}
                  </button>
                )}
              </nav>
            )}
            {activeView && (
              <>
                <div className={`h-5 w-px ${isDark ? 'bg-border' : 'bg-border-light'}`} />
                <span className={`text-sm ${isDark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                  {activeTool?.name || activeCalc?.name || activeSpy?.name}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all ${isDark ? 'btn-ghost' : 'btn-ghost-light'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setShowKeyModal(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isKeySet
                  ? 'bg-success/10 text-success'
                  : 'bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="hidden sm:inline">{isKeySet ? t('dashboard.nav.aiKeyActive') : t('dashboard.nav.connectAI')}</span>
            </button>

            {/* Account Settings Toggle */}
            <button
              onClick={() => {
                setAccountView(prev => !prev);
                setActiveView(null);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                accountView 
                  ? 'border-accent bg-accent/10 text-accent font-semibold text-xs' 
                  : isDark 
                    ? 'border-white/10 hover:border-white/20 text-text bg-white/5 text-xs' 
                    : 'border-black/10 hover:border-black/20 text-text-light bg-black/5 text-xs'
              }`}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center border border-accent/40 text-white font-bold text-[10px] uppercase shadow-sm"
                style={{
                  backgroundColor: '#' + Math.floor(Math.abs(Math.sin(user.email.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) * 16777215)).toString(16).padEnd(6, '0')
                }}
              >
                {(firstName || user.firstName?.[0] || user.email[0] || 'E').charAt(0)}
              </div>
              <span className="text-xs font-semibold hidden sm:inline">
                {firstName || user.firstName || t('dashboard.nav.myProfile')}
              </span>
            </button>

            {/* Logout Trigger */}
            <button
              onClick={() => logout()}
              className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300' : 'hover:bg-red-500/10 text-red-650 hover:text-red-700'}`}
              title="Logout Profile"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {adminView ? (
          <AdminPanel isDark={isDark} onBack={() => setAdminView(false)} />
        ) : accountView ? (
          <SettingsPanel isDark={isDark} onBack={() => { setAccountView(false); setActiveView(null); }} />
        ) : !user.subscription ? (
          <div className="max-w-4xl mx-auto text-center py-6 animate-fade-up">
            <div className="mb-10 max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-accent/10 border border-accent/20 text-accent uppercase tracking-wider mb-4">
                {t('dashboard.license.badge')}
              </span>
              <h2 className="font-display text-3xl font-bold mb-3">
                {t('dashboard.license.title')}
              </h2>
              <p className={`text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {t('dashboard.license.desc')}
              </p>
            </div>

            {/* Quick Profile Overview inside guest mode dashboard */}
            <div className={`p-5 rounded-2xl mb-12 max-w-xl mx-auto border flex items-center justify-between text-left ${
              isDark ? 'bg-bg/40 border-white/10 text-white' : 'bg-white border-black/10 text-slate-900 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src={selectedAvatar}
                  alt={user.firstName}
                  className="w-12 h-12 rounded-full border border-accent/40"
                />
                <div>
                  <h4 className="font-semibold text-sm">
                    {firstName || user.firstName || t('common.operator')} {lastName || user.lastName || t('common.operator')}
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-505'}`}>
                    {t('dashboard.profile.activeAccount')}: <strong className="font-medium text-accent">{user.email}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAccountView(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' : 'border-black/15 bg-black/5 hover:bg-black/10 text-black'
                }`}
              >
                {t('dashboard.profile.accessDetails')}
              </button>
            </div>

            {/* Price Plan Slider inside guest mode dashboard */}
            <div className="mb-8 space-y-12">
              <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/8 dark:bg-white/5 border border-black/5 dark:border-white/5 select-none mb-8">
                {[
                  { id: 'month', label: t('pricing.cycles.monthly'), discount: null },
                  { id: 'quarter', label: t('pricing.cycles.quarterly'), discount: '-15%' },
                  { id: 'year', label: t('pricing.cycles.annually'), discount: '-30%' }
                ].map((cycle) => (
                  <button
                    key={cycle.id}
                    onClick={() => setBillingCycle(cycle.id as 'month' | 'quarter' | 'year')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      billingCycle === cycle.id 
                        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                        : isDark ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-900 font-bold'
                    }`}
                  >
                    {cycle.label}
                    {cycle.discount && (
                      <span className="ml-1 text-[9px] opacity-60">({cycle.discount})</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto pt-8">
                {[
                  {
                    id: 'starter',
                    name: 'Starter',
                    desc: t('pricing.plans.starter.desc'),
                    priceMonth: 59,
                    priceQuarter: 51,
                    priceYear: 39,
                    features: [
                      t('pricing.plans.starter.f1'),
                      t('pricing.plans.starter.f2'),
                      t('pricing.plans.starter.f3'),
                      t('pricing.plans.starter.f4'),
                      t('pricing.plans.starter.f5'),
                      t('pricing.plans.starter.f6'),
                      t('pricing.plans.starter.f7'),
                      t('pricing.plans.starter.f8')
                    ]
                  },
                  {
                    id: 'pro',
                    name: 'Pro',
                    desc: t('pricing.plans.pro.desc'),
                    priceMonth: 89,
                    priceQuarter: 76,
                    priceYear: 57,
                    popular: true,
                    features: [
                      t('pricing.plans.pro.f1'),
                      t('pricing.plans.pro.f2'),
                      t('pricing.plans.pro.f3'),
                      t('pricing.plans.pro.f4'),
                      t('pricing.plans.pro.f5'),
                      t('pricing.plans.pro.f6'),
                      t('pricing.plans.pro.f7'),
                      t('pricing.plans.pro.f8')
                    ]
                  },
                  {
                    id: 'business',
                    name: 'Business',
                    desc: t('pricing.plans.business.desc'),
                    priceMonth: 149,
                    priceQuarter: 126,
                    priceYear: 110,
                    features: [
                      t('pricing.plans.business.f1'),
                      t('pricing.plans.business.f2'),
                      t('pricing.plans.business.f3'),
                      t('pricing.plans.business.f4'),
                      t('pricing.plans.business.f5'),
                      t('pricing.plans.business.f6'),
                      t('pricing.plans.business.f7'),
                      t('pricing.plans.business.f8')
                    ]
                  }
                ].map((card) => {
                  const activePrice = billingCycle === 'month' ? card.priceMonth : billingCycle === 'quarter' ? card.priceQuarter : card.priceYear;
                  return (
                    <div
                      key={card.id}
                      className={`p-8 rounded-[32px] border flex flex-col justify-between transition-all duration-500 relative ${
                        card.popular 
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/30 md:-translate-y-6 hover:-translate-y-8 shadow-lg shadow-accent/5' 
                          : isDark ? 'bg-zinc-950 border-white/5 hover:-translate-y-2' : 'bg-white border-slate-200 shadow-sm hover:-translate-y-2'
                      }`}
                    >
                      {card.popular && (
                        <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest">{t('pricing.mostPopular')}</div>
                      )}
                      <div>
                        <h4 className="font-display font-bold text-xl mb-1 tracking-tight">{card.name}</h4>
                        <p className={`text-xs opacity-60 mb-6 leading-relaxed h-[34px] overflow-hidden`}>{card.desc}</p>
                        
                        <div className="flex items-baseline gap-1.5 mb-8 h-[52px] overflow-hidden relative">
                           <AnimatePresence mode="popLayout">
                            <motion.span
                              key={`${card.id}-${billingCycle}-price`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="text-4xl font-bold font-display text-accent inline-block"
                            >
                              ${activePrice}
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-xs font-semibold opacity-50 pb-1.5 select-none">
                            /mo{billingCycle === 'month' ? '' : billingCycle === 'quarter' ? ' (b. quarterly)' : ' (b. annually)'}
                          </span>
                        </div>

                        <ul className="space-y-3.5 mb-8">
                          {card.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs font-semibold">
                              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="opacity-80 leading-normal">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => navigate(`/checkout?tier=${card.id}&billing=${billingCycle}`)}
                        className={`${card.popular ? 'btn-primary' : `btn-secondary ${isDark ? 'btn-secondary-dark' : 'btn-secondary-light'}`} w-full !py-4 text-xs uppercase tracking-widest`}
                      >
                        {t('pricing.subscribeTo')} {card.name}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Advanced Comparison Table */}
              <div className="mt-20">
                <div className="text-center mb-10">
                  <h3 className="font-display font-bold text-2xl">{t('pricing.table.title')}</h3>
                  <p className="text-xs font-medium opacity-50 mt-2">{t('pricing.table.desc')}</p>
                </div>

                <div className={`overflow-hidden rounded-[32px] border ${isDark ? 'bg-zinc-950/40 border-white/5' : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/30'}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={isDark ? 'bg-zinc-900/50' : 'bg-slate-50/50 text-slate-800'}>
                        <th className="p-8 text-[10px] uppercase font-bold tracking-widest opacity-30">{t('pricing.table.features')}</th>
                        <th className="p-8 text-[10px] uppercase font-bold tracking-widest text-[#10b981]">Starter</th>
                        <th className="p-8 text-[10px] uppercase font-bold tracking-widest text-accent">Pro</th>
                        <th className="p-8 text-[10px] uppercase font-bold tracking-widest text-orange-500">Business</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-200'}`}>
                      {[
                        { f: t('pricing.table.tools.generators'), s: <CheckIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.adCopy'), s: <CheckIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.analytics'), s: <CheckIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.strategy'), s: <CheckIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.discovery'), s: '2 / month', p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.brandtracker'), s: <CrossIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.spy'), s: <CrossIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.apiKey'), s: <CheckIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.collaboration'), s: <CrossIcon />, p: <CheckIcon />, b: <CheckIcon /> },
                        { f: t('pricing.table.tools.infrastructure'), s: <CrossIcon />, p: <CrossIcon />, b: <CheckIcon /> },
                      ].map((row, idx) => (
                        <tr key={idx} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition-colors group`}>
                          <td className={`p-8 text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'} opacity-70 group-hover:opacity-100`}>{row.f}</td>
                          <td className="p-8 text-xs font-bold text-zinc-500">{row.s}</td>
                          <td className="p-8 text-xs font-bold text-zinc-500">{row.p}</td>
                          <td className="p-8 text-xs font-bold text-zinc-500">{row.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Enterprise Section */}
              <div className={`mt-16 p-12 rounded-[40px] border flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative ${
                isDark ? 'bg-zinc-950 border-white/5' : 'bg-slate-900 border-slate-800 text-white'
              }`}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 blur-[120px] pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest mb-6">Enterprise Edition</div>
                  <h3 className="text-4xl font-bold tracking-tight mb-4 leading-none">Corporate Solutions <br /> <span className={isDark ? 'text-zinc-500' : 'text-slate-500'}>for elite agencies</span></h3>
                  <p className="text-base opacity-60 font-semibold leading-relaxed">
                    Need more seats or custom features? Our Enterprise plan is designed for high-growth agencies.
                  </p>
                </div>
                <div className="relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
                    <button 
                      onClick={() => navigate('/contact')}
                      className="w-full lg:w-auto px-6 py-3.5 bg-accent hover:bg-accent-muted text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-xl shadow-accent/30 active:scale-95"
                    >
                      Connect with Strategic Desk
                    </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeView ? (
          <div className="animate-fade-up">
            {activeView.type === 'ai' && activeView.id === 'strategy-chat' ? (
              <ChatPanel dark={isDark} onBack={() => setActiveView(null)} />
            ) : activeView.type === 'ai' ? (
              <AIToolPanel tool={activeTool!} onBack={() => setActiveView(null)} dark={isDark} />
            ) : activeView.type === 'calc' ? (
              <CalculatorPanel calculator={activeCalc!} onBack={() => setActiveView(null)} dark={isDark} />
            ) : activeView.type === 'spy' ? (
              <SpySuitePanel toolId={activeView.id} onBack={() => setActiveView(null)} dark={isDark} />
            ) : null}
          </div>
        ) : (
          <div className="animate-fade-up">
            {/* Page Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl font-bold mb-2 tracking-tight">
                  Growth Dashboard
                </h1>
              </div>

              {/* Branding Tag */}
              <div className="hidden lg:flex flex-col items-end">
                 <div className="flex items-center gap-2">
                    <span className="font-display font-black text-2xl leading-none tracking-wide">EcomBoost<span className="text-accent text-3xl">.</span>org</span>
                 </div>
              </div>
            </div>

            {user.subscription && (
              <>
                {/* Top Seller Tools Section */}
                <div id="top-sellers" className="relative group/section mb-12 scroll-mt-24">
                   <div className="flex items-center gap-3 mb-6">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-500/10 text-orange-600'} border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]`}>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36" />
                       </svg>
                     </div>
                     <h2 className="font-display font-bold text-xl tracking-tight text-orange-600 dark:text-orange-500">Tools</h2>
                   </div>                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {topSellerTools.map((tool) => {
                        return (
                          <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool.id, 'ai')}
                            className={`relative flex flex-col transition-all border-2 rounded-2xl text-center group p-6 ${
                              isDark 
                                ? 'bg-zinc-950/40 border-orange-500/20 hover:border-orange-500 shadow-lg' 
                                : 'bg-white border-orange-100 hover:border-orange-600 shadow-sm'
                            } active:scale-95 overflow-hidden`}
                          >
                            <div className="relative mb-6 flex justify-center">
                              {/* Rotating Background with gradient */}
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className={`absolute -inset-10 blur-xl opacity-30 bg-gradient-to-tr from-white via-orange-500 to-white`}
                              />
                              
                              <div className="relative z-10">
                                <motion.div
                                  animate={{ rotate: -360 }}
                                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-xl text-orange-600 border border-orange-100`}
                                >
                                  {tool.icon}
                                </motion.div>
                              </div>
                            </div>

                            <div className="relative z-10">
                              <h3 className="font-bold text-[14px] mb-2 tracking-tight group-hover:text-orange-500 transition-colors">{tool.name}</h3>
                              <p className="text-[11px] opacity-60 font-medium leading-relaxed line-clamp-2">{tool.desc}</p>
                            </div>

                            <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Growth AI Suite Section */}
                  <div id="ai-tools" className="relative group/section mb-12 scroll-mt-24">
                    {/* LOCK OVERLAY IF UNSUBSCRIBED */}
                    {!user.subscription && (
                      <div className="absolute inset-0 z-40 flex items-center justify-center rounded-3xl overflow-hidden">
                         <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] dark:bg-black/80" />
                         <div className={`relative z-10 px-8 py-6 rounded-2xl text-center flex flex-col items-center gap-4 border shadow-2xl ${
                            isDark ? 'bg-zinc-900 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'
                         }`}>
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                               <Lock size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">AI Suite Locked</h3>
                              <p className="text-xs opacity-60 max-w-[200px]">Unlock 15+ AI growth modules with an active license.</p>
                            </div>
                            <button 
                              onClick={() => {
                                setAccountView(true);
                                setTimeout(() => document.getElementById('manage-license')?.scrollIntoView({ behavior: 'smooth' }), 100);
                              }}
                              className="w-full py-2.5 bg-accent hover:bg-accent-muted text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                            >
                              Upgrade Now
                            </button>
                         </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-accent/10 text-accent' : 'bg-accent/5 text-accent'} border border-accent/10`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="font-display font-bold text-xl tracking-tight">
                        Tools
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {aiTools.map((tool) => {
                        const locked = isToolLocked(tool.id);
                        const isStrategyChat = tool.id === 'strategy-chat';
                        return (
                          <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool.id, 'ai')}
                            className={`relative flex flex-col transition-all border-2 rounded-2xl text-center group p-6 ${
                              isDark 
                                ? 'bg-zinc-950/40 border-white/5 hover:border-accent shadow-lg' 
                                : 'bg-white border-slate-100 hover:border-accent shadow-sm'
                            } ${locked ? 'grayscale-[0.5] opacity-60 cursor-not-allowed' : 'active:scale-95'} ${
                              isStrategyChat ? 'col-span-1 md:col-span-2 lg:col-span-4' : ''
                            } overflow-hidden`}
                          >
                            <div className="relative mb-6 flex justify-center">
                              {/* Rotating Background with gradient */}
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className={`absolute -inset-10 blur-xl opacity-20 bg-gradient-to-tr from-white via-accent to-white`}
                              />
                              
                              <div className="relative z-10">
                                <motion.div
                                  animate={{ rotate: isStrategyChat ? 0 : -360 }}
                                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-xl text-accent border border-slate-100 ${isStrategyChat ? 'w-20 h-20' : ''}`}
                                >
                                  {tool.icon}
                                </motion.div>
                              </div>
                            </div>

                            <div className="relative z-10">
                              <h3 className={`font-bold tracking-tight group-hover:text-accent transition-colors ${isStrategyChat ? 'text-lg mb-2' : 'text-[14px] mb-2'}`}>{tool.name}</h3>
                              <p className={`opacity-60 font-medium leading-relaxed ${isStrategyChat ? 'text-xs max-w-md mx-auto' : 'text-[11px] line-clamp-2'}`}>{tool.desc}</p>
                            </div>

                            {!locked && (
                                <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                {/* Calculators Section */}
                <div id="calculators" className="relative group/section mb-12 scroll-mt-24">
                   {/* LOCK OVERLAY IF UNSUBSCBSCRIBED */}
                   {!user.subscription && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center rounded-3xl overflow-hidden">
                       <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] dark:bg-black/60" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500/5 text-emerald-500'} border border-emerald-500/10`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="font-display font-bold text-xl tracking-tight">
                      Tools
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {calculators.map((calc) => {
                      const locked = isToolLocked(calc.id);
                      return (
                        <button
                          key={calc.id}
                          onClick={() => handleToolClick(calc.id, 'calc')}
                          className={`relative flex flex-col group p-6 rounded-2xl text-center transition-all border-2 ${
                            isDark 
                              ? 'bg-zinc-950/40 border-white/5 hover:border-emerald-500 shadow-lg' 
                              : 'bg-white border-slate-100 hover:border-emerald-500 shadow-sm'
                          } ${locked ? 'grayscale opacity-60 cursor-not-allowed' : 'active:scale-95'} overflow-hidden`}
                        >
                          <div className="relative mb-6 flex justify-center">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                              className={`absolute -inset-10 blur-xl opacity-25 bg-gradient-to-tr from-white via-emerald-500 to-white`}
                            />
                            <div className="relative z-10">
                              <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-xl text-emerald-600 border border-emerald-100`}
                              >
                                {calc.icon}
                              </motion.div>
                            </div>
                          </div>

                          <div className="relative z-10">
                            <h3 className="font-bold text-[14px] mb-2 tracking-tight group-hover:text-emerald-500 transition-colors">{calc.name}</h3>
                            <p className="text-[11px] opacity-60 font-medium leading-relaxed line-clamp-2">{calc.desc}</p>
                          </div>

                          {!locked && (
                              <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                              </div>
                          )}
                          {locked && <Lock size={14} className="absolute top-4 right-4 text-zinc-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Competitive Intelligence */}
                <div id="tracker-tools" className="relative group/section mb-12 scroll-mt-24">
                   {/* LOCK OVERLAY IF STARTER OR LOWER */}
                   {(user.subscription === 'starter' || !user.subscription) && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center rounded-3xl overflow-hidden">
                       <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px] dark:bg-black/90" />
                       <div className={`relative z-10 px-10 py-8 rounded-3xl text-center flex flex-col items-center gap-5 border shadow-2xl max-w-sm ${
                          isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                       }`}>
                          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/20">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                             </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-1 tracking-tight">Intelligence Suite Locked</h3>
                            <p className="text-xs opacity-60 mb-4">The Competitor Spy Suite requires a <span className="font-bold text-orange-500 underline decoration-orange-500/30 underline-offset-4 tracking-wide">Pro Partner</span> license or higher.</p>
                          </div>
                          <button 
                            onClick={() => {
                              setAccountView(true);
                              setTimeout(() => document.getElementById('manage-license')?.scrollIntoView({ behavior: 'smooth' }), 100);
                            }}
                            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                          >
                            Upgrade to Pro
                          </button>
                       </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-500/5 text-orange-500'} border border-orange-500/10`}>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h2 className="font-display font-bold text-xl tracking-tight uppercase">
                      Tools
                    </h2>
                  </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {spyTools.map((tool) => {
                      const locked = isToolLocked(tool.id);
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleToolClick(tool.id, 'spy')}
                          className={`relative flex flex-col group p-6 rounded-2xl text-center transition-all border-2 ${
                            isDark 
                              ? 'bg-zinc-950/40 border-white/5 hover:border-orange-500 shadow-lg' 
                              : 'bg-white border-slate-100 hover:border-orange-500 shadow-sm'
                          } ${locked ? 'grayscale opacity-60 cursor-not-allowed' : 'active:scale-95'} overflow-hidden`}
                        >
                          <div className="relative mb-6 flex justify-center">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                              className={`absolute -inset-10 blur-xl opacity-25 bg-gradient-to-tr from-white via-orange-500 to-white`}
                            />
                            <div className="relative z-10">
                              <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 21, repeat: Infinity, ease: "linear" }}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-xl text-orange-600 border border-orange-100`}
                              >
                                {tool.icon}
                              </motion.div>
                            </div>
                          </div>

                          <div className="relative z-10">
                            <h3 className="font-bold text-[14px] mb-2 tracking-tight group-hover:text-orange-500 transition-colors">{tool.name}</h3>
                            <p className="text-[11px] opacity-60 font-medium leading-relaxed line-clamp-2">{tool.desc}</p>
                          </div>

                          {!locked && (
                              <div className="absolute right-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                              </div>
                          )}
                          {locked && <Lock size={14} className="absolute top-4 right-4 text-zinc-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      
      <div className="mt-auto"></div>


      <ApiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} />
      <Footer isDark={isDark} />
    </div>
  );
}

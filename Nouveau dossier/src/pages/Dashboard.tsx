import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useApiKey } from '../context/ApiKeyContext';
import ApiKeyModal from '../components/ApiKeyModal';
import AIToolPanel from '../components/AIToolPanel';
import CalculatorPanel from '../components/CalculatorPanel';
import ChatPanel from '../components/ChatPanel';

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
    id: 'strategy-chat',
    name: 'Strategy Chat',
    desc: 'Business analyst multi-model chat',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 13.042 3 11.574 3 10c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    systemPrompt: '',
    placeholder: 'Discuss KPIs, margins, ROAS, ops, growth...',
  },
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
];

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { isKeySet } = useApiKey();
  const [activeView, setActiveView] = useState<{ type: 'ai' | 'calc'; id: string } | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const isDark = theme === 'dark';

  const activeTool = activeView?.type === 'ai' ? aiTools.find(t => t.id === activeView.id) : null;
  const activeCalc = activeView?.type === 'calc' ? calculators.find(c => c.id === activeView.id) : null;

  return (
    <div className={isDark ? 'bg-gradient-dashboard text-text' : 'bg-gradient-dashboard-light text-text-light'}>
      {/* Header — matches landing page */}
      <header className={`sticky top-0 z-40 ${isDark ? 'bg-white/7 border border-white/18 text-text' : 'bg-white/16 border border-white/40 text-text-light'} backdrop-blur-2xl`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" style={{ backdropFilter: 'blur(18px)' }}>

          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-xl font-semibold">
              EcomBoost<span className="text-accent">.</span>ai
            </Link>
            {!activeView && (
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => { setActiveView(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'bg-bg-subtle text-text' : 'bg-bg-muted-light text-text-light'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => document.getElementById('ai-tools')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'text-text-muted hover:text-text hover:bg-bg-subtle' : 'text-text-muted-light hover:text-text-light hover:bg-bg-muted-light'}`}
                >
                  AI Tools
                </button>
                <button
                  onClick={() => document.getElementById('calculators')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'text-text-muted hover:text-text hover:bg-bg-subtle' : 'text-text-muted-light hover:text-text-light hover:bg-bg-muted-light'}`}
                >
                  Calculators
                </button>
              </nav>
            )}
            {activeView && (
              <>
                <div className={`h-5 w-px ${isDark ? 'bg-border' : 'bg-border-light'}`} />
                <span className={`text-sm ${isDark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                  {activeTool?.name || activeCalc?.name}
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
              {isDark ? (
                <svg className="w-[18px] h-[18px] theme-icon" style={{ transform: 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px] theme-icon" style={{ transform: 'rotate(180deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowKeyModal(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                isKeySet
                  ? 'bg-success/10 text-success'
                  : isDark ? 'btn-secondary' : 'btn-secondary-light'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="hidden sm:inline">{isKeySet ? 'API Key Set' : 'Set API Key'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTool ? (
          activeTool.id === 'strategy-chat' ? (
            <ChatPanel
              onBack={() => setActiveView(null)}
              dark={isDark}
            />
          ) : (
            <AIToolPanel
              tool={activeTool}
              onBack={() => setActiveView(null)}
              dark={isDark}
            />
          )
        ) : activeCalc ? (
          <CalculatorPanel
            calculator={activeCalc}
            onBack={() => setActiveView(null)}
            dark={isDark}
          />
        ) : (
          <div className="animate-fade-up">
            {/* Page Header */}
            <div className="mb-10">
              <h1 className="font-display text-3xl font-semibold mb-2">
                Dashboard
              </h1>
              <p className={`text-base ${isDark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                AI-powered tools and calculators for e-commerce growth
              </p>
            </div>

            {/* AI Tools Section */}
            <div id="ai-tools" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-accent-soft text-accent-light' : 'bg-accent-softer text-accent'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="font-display text-lg font-semibold">
                  AI Content Tools
                </h2>
                <span className={`text-xs font-medium px-2 py-1 rounded ${isDark ? 'bg-bg-subtle text-text-subtle' : 'bg-bg-muted-light text-text-subtle-light'}`}>
                  {aiTools.length} tools
                </span>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
                {aiTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (!isKeySet && tool.id !== 'strategy-chat') {
                        setShowKeyModal(true);
                        return;
                      }
                      setActiveView({ type: 'ai', id: tool.id });
                    }}
                    className={`${isDark ? 'card card-interactive' : 'card-light card-interactive'} p-5 rounded-xl text-left group ${tool.id === 'strategy-chat' ? 'lg:col-span-2' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${isDark ? 'bg-accent-soft text-accent-light' : 'bg-accent-softer text-accent'}`}>
                        {tool.icon}
                      </div>
                      <svg className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${isDark ? 'text-text-subtle' : 'text-text-subtle-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      {tool.name}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                      {tool.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculators Section */}
            <div id="calculators" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-success-soft text-success' : 'bg-success/8 text-success'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-display text-lg font-semibold">
                  Calculators
                </h2>
                <span className={`text-xs font-medium px-2 py-1 rounded ${isDark ? 'bg-bg-subtle text-text-subtle' : 'bg-bg-muted-light text-text-subtle-light'}`}>
                  {calculators.length} calculators
                </span>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger-children">
                {calculators.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => setActiveView({ type: 'calc', id: calc.id })}
                    className={`${isDark ? 'card card-interactive' : 'card-light card-interactive'} p-5 rounded-xl text-left group`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${isDark ? 'bg-success-soft text-success' : 'bg-success/8 text-success'}`}>
                        {calc.icon}
                      </div>
                      <svg className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${isDark ? 'text-text-subtle' : 'text-text-subtle-light'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">
                      {calc.name}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-text-muted' : 'text-text-muted-light'}`}>
                      {calc.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <ApiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} />
    </div>
  );
}

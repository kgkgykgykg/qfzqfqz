import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApiKey } from '../context/ApiKeyContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface CaptchaTile {
  id: number;
  category: string;
  svg: string;
}

// Crisp, beautiful standalone vector illustrations for 3x3 category identification
const TILE_TEMPLATES = [
  {
    category: 'traffic-light',
    svg: `<svg width="40" height="40" class="w-10 h-10 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="2" width="8" height="20" rx="4" />
      <circle cx="12" cy="7" r="2" fill="#ef4444" />
      <circle cx="12" cy="12" r="2" fill="#f59e0b" />
      <circle cx="12" cy="17" r="2" fill="#22c55e" />
    </svg>`
  },
  {
    category: 'bicycle',
    svg: `<svg width="40" height="40" class="w-10 h-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="5.5" cy="15" r="3.5" />
      <circle cx="18.5" cy="15" r="3.5" />
      <path d="M12 17.5V14l-3-3.5h4l3-3.5h3" />
      <path d="M12 11h5.5" />
    </svg>`
  },
  {
    category: 'hydrant',
    svg: `<svg width="40" height="40" class="w-10 h-10 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a4 4 0 014 4v2h2v4h-2v10H10V12H8V8h2V6a4 4 0 014-4z" />
      <circle cx="12" cy="11" r="1.5" />
      <path d="M6 10h12" />
    </svg>`
  },
  {
    category: 'palm-tree',
    svg: `<svg width="40" height="40" class="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 22l-1-7m1 7l1-5" />
      <path d="M12 11c-1.5-2.5-4-3-6-2.5 1.5.5 2 2 2.5 3.5m3.5-1c1.5-2.5 4-3 6-2.5-1.5.5-2 2-2.5 3.5" />
      <path d="M12 11V3c0 2-2 3-4 3" />
    </svg>`
  },
  {
    category: 'car',
    svg: `<svg width="40" height="40" class="w-10 h-10 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 001 13v3c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>`
  }
];

export default function ApiKeyModal({ isOpen, onClose }: Props) {
  const { theme } = useTheme();
  const { apiKey, setApiKey, isVerified, setIsVerified } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey);
  const isDark = theme === 'dark';

  // Captcha general state machine
  const [captchaType, setCaptchaType] = useState<'checkbox' | 'texthash' | 'shapes' | 'images' | 'puzzle'>('checkbox');
  const [captchaState, setCaptchaState] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [captchaError, setCaptchaError] = useState('');
  
  // Anti-bot gesture vectors
  const [modalOpenTime, setModalOpenTime] = useState(0);
  const [mousePoints, setMousePoints] = useState<{ x: number; y: number; t: number }[]>([]);
  const [hasHovered, setHasHovered] = useState(false);

  // Challenge 2: Alphanumeric distorted textual representation
  const [generatedHash, setGeneratedHash] = useState('');
  const [hashInput, setHashInput] = useState('');

  // Challenge 3: Visual shape matching targets
  const [shapesList, setShapesList] = useState<{ id: string; name: string; color: string; labelColor: string; shapeSvg: string }[]>([]);
  const [targetShape, setTargetShape] = useState<{ id: string; name: string } | null>(null);

  // Challenge 4: 3x3 category matrix variables
  const [targetCategory, setTargetCategory] = useState<{ key: string; labelEn: string } | null>(null);
  const [gridTiles, setGridTiles] = useState<CaptchaTile[]>([]);
  const [selectedTileIds, setSelectedTileIds] = useState<number[]>([]);

  // Challenge 5: Randomized Slider Alignment Puzzle
  const [puzzleTargetX, setPuzzleTargetX] = useState<number>(120);
  const [puzzleCurrentX, setPuzzleCurrentX] = useState<number>(10);
  const [puzzleYOffset, setPuzzleYOffset] = useState<number>(30);

  // Reset states & randomly pick an active validator challenge
  const nextCaptchaChallenge = () => {
    setCaptchaState('idle');
    setCaptchaError('');
    setHashInput('');
    setSelectedTileIds([]);
    
    const types: ('checkbox' | 'texthash' | 'shapes' | 'images' | 'puzzle')[] = [
      'checkbox', 
      'texthash', 
      'shapes', 
      'images', 
      'puzzle'
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];
    setCaptchaType(chosen);

    // 1. Setup Distorted Alphanumeric characters
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let hash = '';
    for (let i = 0; i < 5; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedHash(hash);

    // 2. Setup Vector geometric shapes
    const shapesPool = [
      { id: 'sh-1', name: 'Green Circle', color: 'bg-emerald-500 border-emerald-600', labelColor: 'text-emerald-500', shapeSvg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none" /></svg>' },
      { id: 'sh-2', name: 'Blue Square', color: 'bg-accent/10 border-accent/10', labelColor: 'text-accent', shapeSvg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none" /></svg>' },
      { id: 'sh-3', name: 'Orange Star', color: 'bg-orange-400 border-orange-500', labelColor: 'text-orange-500', shapeSvg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none" /></svg>' },
      { id: 'sh-4', name: 'Red Triangle', color: 'bg-rose-500 border-rose-600', labelColor: 'text-rose-500', shapeSvg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8"><polygon points="12,3 2,21 22,21" stroke="currentColor" stroke-width="2" fill="none" /></svg>' },
      { id: 'sh-5', name: 'Orange Diamond', color: 'bg-orange-500 border-orange-600', labelColor: 'text-orange-500', shapeSvg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8"><polygon points="12,2 22,12 12,22 2,12" stroke="currentColor" stroke-width="2" fill="none" /></svg>' },
      { id: 'sh-6', name: 'Orange Hexagon', color: 'bg-orange-500 border-orange-600', labelColor: 'text-orange-500', shapeSvg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-8 h-8"><polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="currentColor" stroke-width="2" fill="none" /></svg>' }
    ];
    // Fully shuffle shapes list
    const shuffledShapes = [...shapesPool].sort(() => Math.random() - 0.5);
    setShapesList(shuffledShapes);
    const chosenTargetShape = shuffledShapes[Math.floor(Math.random() * shuffledShapes.length)];
    setTargetShape({ id: chosenTargetShape.id, name: chosenTargetShape.name });

    // 3. Setup Grid Matrix selection
    const targetPool = [
      { key: 'traffic-light', labelEn: 'Traffic Lights' },
      { key: 'bicycle', labelEn: 'Bicycles' },
      { key: 'hydrant', labelEn: 'Fire Hydrants' },
      { key: 'palm-tree', labelEn: 'Palm Trees' },
      { key: 'car', labelEn: 'Cars' }
    ];
    const chosenTargetCat = targetPool[Math.floor(Math.random() * targetPool.length)];
    setTargetCategory(chosenTargetCat);

    const matchingTemplates = TILE_TEMPLATES.filter(t => t.category === chosenTargetCat.key);
    const nonMatchingTemplates = TILE_TEMPLATES.filter(t => t.category !== chosenTargetCat.key);

    const generatedTiles: CaptchaTile[] = [];
    const matchCount = Math.floor(Math.random() * 2) + 3; // 3 or 4 match targets
    
    for (let i = 0; i < matchCount; i++) {
      const templ = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
      generatedTiles.push({
        id: i,
        category: templ.category,
        svg: templ.svg
      });
    }

    for (let i = matchCount; i < 9; i++) {
      const templ = nonMatchingTemplates[Math.floor(Math.random() * nonMatchingTemplates.length)];
      generatedTiles.push({
        id: i,
        category: templ.category,
        svg: templ.svg
      });
    }

    // Fully shuffle and re-assign unique serial identifiers
    const shuffledTiles = generatedTiles
      .sort(() => Math.random() - 0.5)
      .map((tile, newIdx) => ({
        ...tile,
        id: newIdx
      }));
    setGridTiles(shuffledTiles);

    // 4. Setup Alignment Slider Puzzle coordinates
    const targetX = Math.floor(Math.random() * 140) + 60; // 60px to 200px range
    const startX = Math.floor(Math.random() * 25) + 5;   // 5px to 30px start range
    const targetY = Math.floor(Math.random() * 50) + 15;  // 15px to 65px vertical height range
    setPuzzleTargetX(targetX);
    setPuzzleCurrentX(startX);
    setPuzzleYOffset(targetY);
  };

  // Monitor mouse parameters to establish secure biometric trajectory records
  useEffect(() => {
    if (!isOpen) return;

    setInputValue(apiKey);
    setModalOpenTime(Date.now());
    setMousePoints([]);
    setHasHovered(false);

    // Reset verification on open and initialize randomized task list
    setIsVerified(false);
    nextCaptchaChallenge();

    const handleMouseMove = (e: MouseEvent) => {
      setHasHovered(true);
      setMousePoints(prev => {
        if (prev.length >= 40) return [...prev.slice(1), { x: e.clientX, y: e.clientY, t: Date.now() }];
        return [...prev, { x: e.clientX, y: e.clientY, t: Date.now() }];
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!isVerified) return;
    setApiKey(inputValue);
    onClose();
  };

  // Analyze speed profile, synthetic coordinates & linear trajectory uniformity
  const performBiometricCheck = (e: React.MouseEvent): boolean => {
    const timeDelta = Date.now() - modalOpenTime;

    // Reject instant automated interactions
    if (timeDelta < 450) {
      setCaptchaError('Authentication rejected: Automated machine cursor signature detected.');
      return false;
    }

    // Reject headless API click simulation
    if (e.clientX === 0 && e.clientY === 0 && e.screenX === 0) {
      setCaptchaError('Authentication rejected: Synthetic click trigger intercepted.');
      return false;
    }

    // Reject if there is no continuous drag or sweep vector recorded
    if (!hasHovered || mousePoints.length < 3) {
      setCaptchaError('Security shield: No physical cursor sweep path detected. Please sweep your cursor over the screen.');
      return false;
    }

    // Reject perfectly linear movements calculated by bot scripts (zero speed speed-variance)
    if (mousePoints.length >= 6) {
      let speeds: number[] = [];
      for (let i = 1; i < mousePoints.length; i++) {
        const dt = mousePoints[i].t - mousePoints[i - 1].t;
        const dx = mousePoints[i].x - mousePoints[i - 1].x;
        const dy = mousePoints[i].y - mousePoints[i - 1].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (dt > 0) speeds.push(distance / dt);
      }
      const mean = speeds.reduce((a, b) => a + b, 0) / (speeds.length || 1);
      const variance = speeds.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (speeds.length || 1);
      
      if (variance < 0.003) {
        setCaptchaError('Security alert: Continuous uniform movement matching macro-script behavior.');
        return false;
      }
    }

    return true;
  };

  // Challenge Handler 1: Traditional I Am Not Robot checkbox
  const handleCheckboxClick = (e: React.MouseEvent) => {
    if (captchaState !== 'idle') return;
    if (!performBiometricCheck(e)) return;

    setCaptchaState('verifying');
    setCaptchaError('');

    setTimeout(() => {
      setCaptchaState('success');
      setIsVerified(true);
    }, 1300);
  };

  // Challenge Handler 2: Alphanumeric input verification
  const handleHashVerify = (e: React.MouseEvent) => {
    if (captchaState !== 'idle') return;
    if (!performBiometricCheck(e)) return;

    if (hashInput.trim().toUpperCase() !== generatedHash) {
      setCaptchaError('Incorrect characters. Please carefully replicate the security code.');
      // Re-randomize distorted hash to prevent script guessing
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let hash = '';
      for (let i = 0; i < 5; i++) hash += chars.charAt(Math.floor(Math.random() * chars.length));
      setGeneratedHash(hash);
      setHashInput('');
      return;
    }

    setCaptchaState('verifying');
    setCaptchaError('');
    setTimeout(() => {
      setCaptchaState('success');
      setIsVerified(true);
    }, 1200);
  };

  // Challenge Handler 3: Geometric shape identification click
  const handleShapeClick = (e: React.MouseEvent, shapeId: string) => {
    if (captchaState !== 'idle') return;
    if (!performBiometricCheck(e)) return;

    if (!targetShape || shapeId !== targetShape.id) {
      setCaptchaError('Verification shape mismatch. Please try again.');
      nextCaptchaChallenge();
      return;
    }

    setCaptchaState('verifying');
    setCaptchaError('');
    setTimeout(() => {
      setCaptchaState('success');
      setIsVerified(true);
    }, 1100);
  };

  // Challenge Handler 4: 3x3 category matrix targets
  const handleTileToggle = (tileId: number) => {
    if (captchaState !== 'idle') return;
    setSelectedTileIds(prev =>
      prev.includes(tileId) ? prev.filter(id => id !== tileId) : [...prev, tileId]
    );
  };

  const handleImagesVerify = (e: React.MouseEvent) => {
    if (captchaState !== 'idle') return;
    if (!performBiometricCheck(e)) return;
    if (!targetCategory) return;

    const correctTileIds = gridTiles
      .filter(t => t.category === targetCategory.key)
      .map(t => t.id);

    const hasError =
      selectedTileIds.length !== correctTileIds.length ||
      !selectedTileIds.every(id => correctTileIds.includes(id));

    if (hasError) {
      setCaptchaError('Incorrect selections. Please identify every single matching target icon.');
      setTimeout(() => {
        nextCaptchaChallenge();
      }, 1000);
      return;
    }

    setCaptchaState('verifying');
    setCaptchaError('');
    setTimeout(() => {
      setCaptchaState('success');
      setIsVerified(true);
    }, 1250);
  };

  // Challenge Handler 5: Sliding Puzzle Alignment Verification
  const handlePuzzleVerify = (e: React.MouseEvent | React.TouchEvent) => {
    if (captchaState !== 'idle') return;

    // Mimic synthetic event wrapper for touch or slide end
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const fakeEvent = {
      clientX,
      clientY,
      screenX: 1,
    } as React.MouseEvent;

    if (!performBiometricCheck(fakeEvent)) {
      setPuzzleCurrentX(15);
      return;
    }

    // Strict alignment tolerance range of 6 pixels maximum offset
    const errorDistance = Math.abs(puzzleCurrentX - puzzleTargetX);
    if (errorDistance <= 6) {
      setCaptchaState('verifying');
      setCaptchaError('');
      setTimeout(() => {
        setCaptchaState('success');
        setIsVerified(true);
      }, 1200);
    } else {
      setCaptchaError('Puzzle misaligned. Place the puzzle piece precisely inside the target outline.');
      // Randomize again slightly to avoid repeated trial guessing
      const newTargetX = Math.floor(Math.random() * 140) + 60;
      setPuzzleTargetX(newTargetX);
      setPuzzleCurrentX(15);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      <div className={`relative w-full max-w-md rounded-2xl p-8 animate-scale-in border ${
        isDark 
          ? 'bg-[#121214] border-zinc-800 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-zinc-200 text-zinc-900 shadow-[0_20px_40px_rgba(0,0,0,0.12)]'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100'
          }`}
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Key Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
          isDark ? 'bg-accent/10 text-accent' : 'bg-accent/10 text-accent'
        }`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <h2 className="font-display text-lg font-semibold mb-2">
          AI API Authorization Required
        </h2>
        <p className={`text-xs mb-6 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Enter your AI model access key to run deep optimizations. Your secret credentials are encrypted multi-layer on compile & never stored on external databases.
        </p>

        <input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="sk-or-v1-..."
          className={`w-full px-4 py-3 rounded-xl text-sm mb-6 outline-none transition-all border ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600 focus:border-accent/10' 
              : 'bg-zinc-50 border-zinc-250 text-zinc-900 placeholder-zinc-400 focus:border-accent/10'
          }`}
        />

        {/* Captcha Shield Widget Wrapper */}
        <div className="w-full mb-6 max-w-[325px] mx-auto">
          {/* Header section with Dynamic security status badge */}
          <div className={`p-2.5 rounded-t-lg border-t border-x flex items-center justify-between text-[10px] ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-650'
          }`}>
            <span className="font-mono text-[9px] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full ${captchaState === 'success' ? 'bg-emerald-500 animate-ping' : 'bg-accent/10 animate-pulse'}`} />
              ShieldGuard Security Core
            </span>
            {captchaState !== 'success' && captchaState !== 'verifying' && (
              <button 
                onClick={(e) => { e.preventDefault(); nextCaptchaChallenge(); }}
                className="text-[9px] text-accent hover:underline hover:text-accent flex items-center gap-1 font-semibold"
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.2 16" />
                </svg>
                Change Challenge
              </button>
            )}
          </div>

          <div className={`p-4 rounded-b-lg border-b border-x shadow-sm transition-all duration-300 ${
            isDark ? 'bg-[#18181b] border-[#2e2e33]' : 'bg-[#fafafa] border-[#d3d3d3]'
          }`}>
            {/* Verification Success Representation */}
            {captchaState === 'success' ? (
              <div className="flex items-center gap-3 py-2 animate-scale-in">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/25">
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-emerald-500">Identity Confirmed</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">Anti-bot biometric signature is verified.</p>
                </div>
              </div>
            ) : captchaState === 'verifying' ? (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <svg className="w-8 h-8 animate-spin text-accent" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <div className="text-center">
                  <p className="text-xs font-semibold text-accent animate-pulse">Running Integrity Analysis...</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Validating physical micro-gesture patterns</p>
                </div>
              </div>
            ) : (
              <div>
                {/* TYPE 1: GOOGLE STYLE CHECKBOX */}
                {captchaType === 'checkbox' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={handleCheckboxClick}
                        className={`w-7 h-7 rounded-md border transition-all duration-150 outline-none focus:ring-2 focus:ring-indigo-400/50 ${
                          isDark 
                            ? 'bg-[#222226] border-[#444] hover:border-[#666]' 
                            : 'bg-white border-[#c1c1c1] hover:border-[#b2b2b2]'
                        }`}
                        style={{ boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.08)' }}
                        aria-label="Click to verify"
                      />
                      <span 
                        className={`text-[13px] font-sans font-medium select-none cursor-pointer hover:opacity-85 ${
                          isDark ? 'text-zinc-200' : 'text-zinc-700'
                        }`} 
                        onClick={handleCheckboxClick}
                      >
                        I am not a robot
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-1 pl-3 border-l border-zinc-200 dark:border-zinc-800">
                      <svg className="w-6 h-6 text-accent animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.07 4.93C17.22 3.08 14.72 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c3.81 0 7.13-2.13 8.85-5.27l-1.74-.87c-1.34 2.45-3.95 4.14-6.91 4.14-4.41 0-8-3.59-8-8s3.59-8 8-8c2.16 0 4.13.86 5.59 2.25L14 10h8V2l-2.93 2.93z" />
                      </svg>
                      <span className="text-[7.5px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                        reCAPTCHA
                      </span>
                    </div>
                  </div>
                )}

                {/* TYPE 2: DISTORTED CODE VALIDATION */}
                {captchaType === 'texthash' && (
                  <div className="space-y-3">
                    <p className={`text-[11px] font-medium leading-normal ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Decipher and type the 5-character sequence shown below:
                    </p>
                    
                    {/* Security hash viewport with background noise stripes */}
                    <div className="relative w-full h-11 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-850 flex items-center justify-center overflow-hidden font-mono select-none">
                      <div className="absolute inset-0 opacity-15 pointer-events-none">
                        <div className="absolute w-full h-[1px] bg-red-500 top-1/4 transform rotate-3" />
                        <div className="absolute w-full h-[1px] bg-accent/10 top-1/2 transform -rotate-2" />
                        <div className="absolute w-full h-[1px] bg-green-500 top-2/3 transform rotate-6" />
                        <div className="absolute w-full h-[1px] bg-orange-500 top-1/3 transform -rotate-6" />
                      </div>
                      
                      <div className="flex gap-2.5 items-center relative z-10">
                        {generatedHash.split('').map((char, index) => {
                          const colors = ['text-rose-500', 'text-accent', 'text-orange-500', 'text-accent', 'text-emerald-500'];
                          return (
                            <span 
                              key={index}
                              className={`text-base font-extrabold tracking-widest pointer-events-none select-none inline-block font-mono ${colors[index % colors.length]}`}
                              style={{ transform: `rotate(${(index % 2 === 0 ? 6 : -6) * (index + 0.5)}deg) translateY(${index % 2 === 0 ? 2 : -2}px)` }}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="Security code..."
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs leading-none outline-none font-mono border uppercase tracking-wider ${
                          isDark 
                            ? 'bg-zinc-900 border-zinc-800 text-white focus:border-accent/10' 
                            : 'bg-white border-zinc-200 text-zinc-900 focus:border-accent/10'
                        }`}
                      />
                      <button
                        onClick={handleHashVerify}
                        disabled={hashInput.trim().length < 5}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold select-none transition-colors ${
                          hashInput.trim().length < 5
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                            : 'bg-accent/10 hover:bg-accent/10 text-white'
                        }`}
                      >
                        Verify Code
                      </button>
                    </div>
                  </div>
                )}

                {/* TYPE 3: GEOMETRIC SHAPES SELECTION */}
                {captchaType === 'shapes' && (
                  <div className="space-y-3">
                    <div className={`p-2.5 rounded-lg text-[11px] text-center border leading-relaxed ${
                      isDark ? 'bg-accent/10 border-accent/10 text-accent' : 'bg-accent/10 border-accent/10 text-accent'
                    }`}>
                      Security Challenge: Please click the target below: <br />
                      <span className="text-xs font-extrabold underline block tracking-wide uppercase mt-1">
                        {targetShape?.name || 'Target symbol'}
                      </span>
                    </div>
                    
                    {/* Visual shapes grid with fully randomized items */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      {shapesList.map((shape) => (
                        <button
                          key={shape.id}
                          id={`shape-btn-${shape.id}`}
                          onClick={(e) => handleShapeClick(e, shape.id)}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2.5 transition-all duration-200 group relative select-none ${
                            isDark 
                              ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:scale-[1.05]' 
                              : 'bg-white border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 hover:scale-[1.05]'
                          }`}
                        >
                          <div 
                            className={`w-7 h-7 flex items-center justify-center transition-transform group-hover:scale-110 ${shape.labelColor}`}
                            dangerouslySetInnerHTML={{ __html: shape.shapeSvg }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TYPE 4: IMAGE GRID SELECTION */}
                {captchaType === 'images' && (
                  <div className="relative overflow-hidden rounded-md">
                    {/* Clean heading detail bar in clear English */}
                    <div className="bg-accent/10 dark:bg-accent/10 text-white p-3.5 -mx-4 -mt-4 mb-3">
                      <div className="text-[10px] font-sans font-normal opacity-90 leading-tight">
                        Select all grid tiles containing:
                      </div>
                      <div className="text-base font-sans font-extrabold leading-none tracking-wide uppercase mt-1">
                        {targetCategory?.labelEn || 'Target Category'}
                      </div>
                    </div>

                    {/* Randomized 3x3 layout matrix */}
                    <div className="grid grid-cols-3 gap-1 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-sm">
                      {gridTiles.map((tile) => {
                        const isSelected = selectedTileIds.includes(tile.id);
                        return (
                          <button
                            key={tile.id}
                            id={`captcha-tile-${tile.id}`}
                            onClick={(e) => { e.preventDefault(); handleTileToggle(tile.id); }}
                            className={`aspect-square transition-all duration-150 border-2 relative flex items-center justify-center bg-white ${
                              isSelected 
                                ? 'border-[#1a73e8] z-10 scale-[0.98]' 
                                : 'border-transparent hover:brightness-95 hover:scale-[1.01]'
                            }`}
                          >
                            <div 
                              className={`transition-opacity flex items-center justify-center w-full h-full ${isSelected ? 'opacity-40 bg-accent/10' : ''}`}
                              dangerouslySetInnerHTML={{ __html: tile.svg }} 
                            />
                            
                            {/* Visual checkmark badge */}
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-[#1a73e8] text-white rounded-full p-0.5 shadow-md flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800 mt-3">
                      <button 
                        onClick={(e) => { e.preventDefault(); nextCaptchaChallenge(); }}
                        className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors text-[10px] flex items-center gap-1 font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        id="btn-switch-captcha-images"
                      >
                        Reset Grid
                      </button>
                      <button
                        id="btn-image-captcha-verify-v2"
                        onClick={handleImagesVerify}
                        className="px-4 py-1.5 rounded-sm bg-[#1a73e8] hover:bg-[#155cb4] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm select-none transition-colors"
                      >
                        Verify Identity
                      </button>
                    </div>
                  </div>
                )}

                {/* TYPE 5: INTERACTIVE 2D ALIGNMENT SLIDER PUZZLE */}
                {captchaType === 'puzzle' && (
                  <div className="space-y-4">
                    <p className={`text-[11px] font-medium leading-normal ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      Drag the slide handle to align the floating puzzle piece inside the dash frame:
                    </p>

                    {/* Puzzle stage area */}
                    <div className="relative w-full h-24 bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center select-none">
                      {/* Abstract geometric background patterns */}
                      <div className="absolute inset-0 bg-opacity-5" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 80%)' }} />
                      <div className="absolute top-2 left-10 w-12 h-12 rounded-full border border-zinc-300/30 dark:border-zinc-700/20" />
                      <div className="absolute bottom-1 right-20 w-8 h-8 rounded-full border border-dashed border-zinc-350/20" />
                      
                      {/* Target Cutout slot at puzzleTargetX */}
                      <div 
                        className="absolute w-10 h-10 border-2 border-dashed border-accent/10 dark:border-accent/10 bg-zinc-200/40 dark:bg-zinc-800/50 rounded-xl flex items-center justify-center shadow-inner"
                        style={{ 
                          left: `${puzzleTargetX}px`, 
                          top: `${puzzleYOffset}px` 
                        }}
                      >
                        {/* Target slot lock visual icon */}
                        <svg className="w-5 h-5 text-accent/50 dark:text-accent/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2.5" />
                          <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2.5" />
                        </svg>
                      </div>

                      {/* Sliding puzzle floating object */}
                      <div 
                        className="absolute w-10 h-10 bg-accent/10 border border-accent/10 text-white rounded-xl shadow-[0_5px_15px_rgba(79,70,229,0.4)] flex items-center justify-center transition-transform z-20"
                        style={{ 
                          left: `${puzzleCurrentX}px`, 
                          top: `${puzzleYOffset}px` 
                        }}
                      >
                        {/* Matching puzzle piece key visual icon */}
                        <svg className="w-5 h-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2.5" />
                          <path d="M7 11V7a5 5 0 019.9-1" strokeWidth="2.5" />
                        </svg>
                      </div>
                    </div>

                    {/* Smooth, elegant sliding track input */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        <span>Align slider</span>
                        <span className="font-mono">{Math.round((puzzleCurrentX / 240) * 100)}% Match</span>
                      </div>
                      
                      <div className="relative flex items-center w-full">
                        <input 
                          type="range"
                          min="0"
                          max="240"
                          value={puzzleCurrentX}
                          onChange={(e) => setPuzzleCurrentX(Number(e.target.value))}
                          onMouseUp={handlePuzzleVerify}
                          onTouchEnd={handlePuzzleVerify}
                          className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-grab active:cursor-grabbing accent-indigo-600 outline-none hover:bg-zinc-250 dark:hover:bg-zinc-750 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Display CAPTCHA error prompts or biometric warnings in clean English */}
        {captchaError && (
          <div className="text-rose-500 dark:text-rose-400 text-xs text-center font-semibold mb-6 animate-pulse leading-normal max-w-[325px] mx-auto bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
            {captchaError}
          </div>
        )}

        {/* Guard and action targets */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!inputValue.trim() || !isVerified}
            className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
              !inputValue.trim() || !isVerified
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-transparent'
                : 'btn-primary'
            }`}
          >
            Save Key
          </button>
          <button
            onClick={onClose}
            className={`px-5 py-3 rounded-xl text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300' 
                : 'bg-zinc-150 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            Cancel
          </button>
        </div>

        {/* Informational documentation footer link */}
        <div className={`mt-6 pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-150'}`}>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-2 text-accent hover:underline hover:text-accent justify-center font-medium"
          >
            Get your private OpenRouter API access key
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

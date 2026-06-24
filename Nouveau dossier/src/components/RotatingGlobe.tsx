import { useEffect, useState } from 'react';

// Pre-generate shops and clouds so they are perfectly aligned
const generateShopsAndClouds = () => {
  const shopNames = [
    'EcoStore', 'GadgetHub', 'StyleWay', 'QuickMart', 'LuxeBrand', 
    'TrendBox', 'SmartPick', 'PureGlow', 'DailyDeal', 'VibeShop',
    'ZestStore', 'NovaBuy', 'PeakCart', 'SwiftShop', 'EliteBuy',
    'BloomBox', 'ZenithShop', 'PrimePick', 'UrbanStyle', 'Modish'
  ];

  // Generate 45 clouds
  const cloudList = Array.from({ length: 45 }).map((_, i) => {
    const isWhite = i % 7 === 0; // 14% white, 86% light blue ciel
    const background = isWhite 
      ? 'rgba(255, 255, 255, 0.45)' // Soft white highlight
      : i % 2 === 0
        ? 'rgba(186, 230, 253, 0.85)' // light blue sky-200
        : 'rgba(56, 189, 248, 0.75)'; // sky-400
    
    return {
      id: i,
      // Keep cloud positions away from the very edges to avoid seam clipping completely
      top: Math.random() * 75 + 10,
      left: Math.random() * 70 + 15,
      width: Math.random() * 220 + 140,
      height: Math.random() * 220 + 140,
      background,
      isWhite,
    };
  });

  // Generate shops placed relative to these clouds
  const shopList = Array.from({ length: 80 }).map((_, i) => {
    const cloudIndex = Math.floor(Math.random() * cloudList.length);
    const cloud = cloudList[cloudIndex];
    
    // Position shop close to its designated cloud to match the color
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 35; // within cloud radius
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;

    const topVal = Math.max(8, Math.min(92, cloud.top + yOffset));
    const leftVal = Math.max(8, Math.min(92, cloud.left + xOffset));

    return {
      id: i,
      name: shopNames[i % shopNames.length],
      top: `${topVal}%`,
      left: `${leftVal}%`,
    };
  });

  return { clouds: cloudList, shops: shopList };
};

const { clouds, shops } = generateShopsAndClouds();

export default function RotatingGlobe({ isDark }: { isDark: boolean }) {
  const [activeShops, setActiveShops] = useState<number[]>([]);

  useEffect(() => {
    const activeIds: { id: number; timer: NodeJS.Timeout }[] = [];

    const spawnShop = () => {
      const activeCurrent = activeIds.map(x => x.id);
      const inactiveIndices = shops
        .map((_, idx) => idx)
        .filter(idx => !activeCurrent.includes(idx));
      
      if (inactiveIndices.length === 0) return;
      const nextId = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];

      // Make sure the shop disappears after exactly 3 seconds
      const timer = setTimeout(() => {
        const idxToRemove = activeIds.findIndex(x => x.id === nextId);
        if (idxToRemove !== -1) {
          activeIds.splice(idxToRemove, 1);
          setActiveShops([...activeIds.map(x => x.id)]);
        }
      }, 3000);

      activeIds.push({ id: nextId, timer });
      setActiveShops([...activeIds.map(x => x.id)]);
    };

    // Staggered initial spawning (only 3 active shops at start for a cleaner, premium look)
    for (let i = 0; i < 3; i++) {
      const inactiveIndices = shops
        .map((_, idx) => idx)
        .filter(idx => !activeIds.map(x => x.id).includes(idx));
      if (inactiveIndices.length > 0) {
        const nextId = inactiveIndices[Math.floor(Math.random() * inactiveIndices.length)];
        const lifetime = 500 + Math.random() * 2500;
        const timer = setTimeout(() => {
          const idxToRemove = activeIds.findIndex(x => x.id === nextId);
          if (idxToRemove !== -1) {
            activeIds.splice(idxToRemove, 1);
            setActiveShops([...activeIds.map(x => x.id)]);
          }
        }, lifetime);
        activeIds.push({ id: nextId, timer });
      }
    }
    setActiveShops([...activeIds.map(x => x.id)]);

    // Spawn 2x slower as requested (every 1200ms instead of 500ms)
    const interval = setInterval(spawnShop, 1200);

    return () => {
      clearInterval(interval);
      activeIds.forEach(x => clearTimeout(x.timer));
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] md:h-[800px] overflow-hidden flex items-end justify-center pointer-events-none">
      {/* Dynamic Keyframes injected safely */}
      <style>{`
        @keyframes rotateGlobe {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-1000px, 0, 0); }
        }
      `}</style>

      {/* The Globe Stage */}
      <div className="relative w-[1000px] h-[1000px] rounded-full mb-[-500px] overflow-hidden"
           style={{
             background: `radial-gradient(circle at 30% 30%, #f0f9ff 0%, #bae6fd 25%, #38bdf8 60%, #0284c7 100%)`,
             boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.15)'
           }}
      >
        {/* Deep Atmosphere Glow */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_100px_rgba(56,189,248,0.35)] z-10 pointer-events-none" />

        {/* Seamless, GPU-accelerated moving Texture Layer */}
        <div className="absolute inset-0 z-1 rounded-full">
          <div
            className="flex h-full"
            style={{ 
              width: '2000px',
              animation: 'rotateGlobe 140s linear infinite'
            }}
          >
            {[1, 2].map((loop) => (
              <div key={loop} className="relative w-[1000px] h-full flex items-center shrink-0 opacity-95">
                {/* Cloud/Atmosphere Spots - Mostly light blue ciel and very soft white */}
                <div className="absolute inset-0">
                  {clouds.map((cloud) => (
                    <div 
                      key={cloud.id}
                      className="absolute rounded-full blur-[55px]"
                      style={{
                        top: `${cloud.top}%`,
                        left: `${cloud.left}%`,
                        width: cloud.width,
                        height: cloud.height,
                        background: cloud.background,
                      }}
                    />
                  ))}
                </div>

                {/* Shops inside moving layer - Perfect Visibility & Ultra Lightweight CSS Animations */}
                <div className="absolute inset-0">
                  {shops.map((shop, i) => {
                    const isActive = activeShops.includes(i);
                    return (
                      <div
                        key={`${loop}-${shop.id}`}
                        className="absolute flex items-center justify-center transition-all duration-300 ease-out origin-center"
                        style={{ 
                          top: shop.top, 
                          left: shop.left,
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'scale(1)' : 'scale(0)',
                          willChange: 'transform, opacity',
                          pointerEvents: isActive ? 'auto' : 'none'
                        }}
                      >
                        <div className={`relative text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border whitespace-nowrap ${
                          isDark 
                            ? 'bg-[#0f172a] text-white border-white/10 shadow-[0_0_15px_rgba(56,189,248,0.25)]' 
                            : 'bg-white text-slate-900 border-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.08)]'
                        }`}>
                          {/* Richly Animated Blue Circle/Icon */}
                          <div className="relative flex items-center justify-center w-3 h-3">
                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-cyan-400 opacity-80 duration-1000"></span>
                            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-sky-500 opacity-50 duration-750"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-sky-400 to-cyan-500 shadow-[0_0_12px_rgba(34,211,238,1)]" />
                          </div>
                          {shop.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specular Highlight / 3D Shine */}
        <div 
          className="absolute inset-0 z-2 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)'
          }}
        />

        {/* Inner Shadow for depth */}
        <div className="absolute inset-0 z-3 rounded-full shadow-[inset_-30px_-30px_60px_rgba(0,0,0,0.1),inset_30px_30px_60px_rgba(255,255,255,0.08)] pointer-events-none" />

        {/* Global Atmosphere Glow (Inner) */}
        <div className="absolute inset-0 z-4 rounded-full shadow-[inset_0_0_80px_rgba(56,189,248,0.25)] pointer-events-none" />

        {/* Edge Atmospheric Fringe */}
        <div className="absolute inset-0 z-5 rounded-full border border-[#38bdf8]/20 pointer-events-none" />
      </div>

      {/* Soft ground blending gradient - significantly shorter and softer to prevent darkening the background */}
      <div className={`absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t ${
        isDark ? 'from-[#09090b] via-[#09090b]/40 to-transparent' : 'from-white via-white/40 to-transparent'
      } z-20 pointer-events-none`} />
    </div>
  );
}

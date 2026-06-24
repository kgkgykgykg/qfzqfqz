import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DownloadIcon, 
  Ban, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Users, 
  Link as LinkIcon, 
  Globe, 
  ArrowLeft, 
  Search, 
  TrendingUp, 
  Percent, 
  MousePointer, 
  UserX, 
  Database,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([]);
  const [affiliateClicks, setAffiliateClicks] = useState<any[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [bannedIps, setBannedIps] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'banned_id' | 'banned_accounts' | 'data'>('analytics');
  
  // IP Ban Input
  const [ipToBan, setIpToBan] = useState('');
  
  // Search Inputs
  const [userSearch, setUserSearch] = useState('');
  const [clickSearch, setClickSearch] = useState('');
  
  // Loading status
  const [loading, setLoading] = useState(true);

  if (user?.email !== 'vadimtchepikov@gmail.com' && user?.email !== 'goatcaca111@gmail.com') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-950/20 border border-red-500/30 p-8 rounded-2xl max-w-md">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
          <h1 className="text-2xl font-black text-red-500 mb-2">UNAUTHORIZED ACCESS</h1>
          <p className="text-zinc-400 text-sm mb-6">This console is protected and encrypted. Your current credentials do not have admin access permissions.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
            Return to Safety
          </button>
        </div>
      </div>
    );
  }

  const loadData = async () => {
    setLoading(true);
    try {
      const uQs = await getDocs(collection(db, 'users'));
      setUsers(uQs.docs.map(d => ({ id: d.id, ...d.data() })));

      const lQs = await getDocs(collection(db, 'affiliateLinks'));
      setAffiliateLinks(lQs.docs.map(d => ({ id: d.id, ...d.data() })));

      const cQs = await getDocs(collection(db, 'affiliateClicks'));
      setAffiliateClicks(cQs.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const bDoc = await getDoc(doc(db, 'admin', 'bannedIps'));
      if (bDoc.exists()) {
        setBannedIps(bDoc.data().ips || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const unsub = onSnapshot(doc(db, 'admin', 'settings'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().maintenanceMode) {
        setMaintenanceMode(true);
      } else {
        setMaintenanceMode(false);
      }
    });

    return () => unsub();
  }, []);

  const toggleMaintenance = async () => {
    const newVal = !maintenanceMode;
    await setDoc(doc(db, 'admin', 'settings'), { maintenanceMode: newVal, maintenanceMessage: 'The site is currently in maintenance.' }, { merge: true });
  };

  const toggleBanUser = async (userId: string, currentBanStatus: boolean) => {
    await updateDoc(doc(db, 'users', userId), { isBanned: !currentBanStatus });
    setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentBanStatus } : u));
  };

  const banIp = async (ip: string) => {
    const cleanIp = ip.trim();
    if (!cleanIp) return;
    if (bannedIps.includes(cleanIp)) {
      alert("IP is already banned.");
      return;
    }
    const newIps = [...bannedIps, cleanIp];
    await setDoc(doc(db, 'admin', 'bannedIps'), { ips: newIps }, { merge: true });
    setBannedIps(newIps);
    setIpToBan('');
  };

  const unbanIp = async (ip: string) => {
    const newIps = bannedIps.filter(item => item !== ip);
    await setDoc(doc(db, 'admin', 'bannedIps'), { ips: newIps }, { merge: true });
    setBannedIps(newIps);
  };

  const downloadData = (format: 'json' | 'csv' | 'txt') => {
    const data = { users, affiliateLinks, affiliateClicks, bannedIps };
    let content = '';
    let type = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      type = 'application/json';
    } else if (format === 'txt') {
      content = JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
      content = 'ID,Email,IP,UserAgent,IsBanned,SubTier\n' + users.map(u => `${u.id},${u.email},${u.created_ip},"${u.userAgent}",${!!u.isBanned},${u.subscriptionStatus}`).join('\n');
      type = 'text/csv';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Analytics variables
  const countPaying = users.filter(u => u.subscriptionStatus && u.subscriptionStatus !== 'inactive' && u.subscriptionStatus !== 'free').length;
  const countFree = users.length - countPaying;
  const countTotalClicks = affiliateClicks.length;
  const countTotalLinks = affiliateLinks.length;

  const totalReferredUsers = users.filter(u => u.referredByLink).length;
  const conversionRate = countTotalClicks ? ((totalReferredUsers / countTotalClicks) * 100).toFixed(1) : '0';

  const newUsersToday = users.filter(u => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (u.createdAt || 0) >= today.getTime();
  }).length;

  const newUsersThisWeek = users.filter(u => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return (u.createdAt || 0) >= weekAgo.getTime();
  }).length;

  const growthPercentage = users.length > 0 ? (((newUsersThisWeek) / (users.length - newUsersThisWeek || 1)) * 100).toFixed(1) : '0';

  const subscriptionTiers = [
    { name: 'Starter', value: users.filter(u => u.subscriptionStatus === 'starter').length },
    { name: 'Pro', value: users.filter(u => u.subscriptionStatus === 'pro').length },
    { name: 'Business', value: users.filter(u => u.subscriptionStatus === 'business').length },
    { name: 'Agency', value: users.filter(u => u.subscriptionStatus === 'agency').length },
    { name: 'Free/Guest', value: countFree },
  ];
  const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#4b5563'];

  // Clicks by codes data for Recharts bar chart
  const clicksByCode = affiliateLinks.map(link => {
    const clickCount = affiliateClicks.filter(c => c.linkId === link.id).length;
    return {
      code: link.shortCode,
      Clicks: clickCount,
    };
  }).sort((a, b) => b.Clicks - a.Clicks).slice(0, 8); // Top 8 codes

  // Filtered users
  const filteredUsers = users.filter(u => {
    const email = (u.email || '').toLowerCase();
    const query = userSearch.toLowerCase();
    return email.includes(query) || (u.id || '').includes(query) || (u.created_ip || '').includes(query);
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row font-sans">
      
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-900 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <span className="font-display text-lg font-black tracking-wide text-white">
                Admin Console
              </span>
            </div>
            <p className="text-[10px] font-bold text-accent tracking-widest uppercase opacity-60">System Overlord</p>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Activity className="w-5 h-5" />
              Analytics
            </button>
            <button 
              onClick={() => setActiveTab('banned_id')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'banned_id' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Globe className="w-5 h-5" />
              Banned IPs
            </button>
            <button 
              onClick={() => setActiveTab('banned_accounts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'banned_accounts' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <UserX className="w-5 h-5" />
              Banned Accounts
            </button>
            <button 
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'data' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}
            >
              <Database className="w-5 h-5" />
              Data Explorer
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-900 space-y-4">
          <button
            onClick={toggleMaintenance}
            className={`w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-xs border transition-all ${
              maintenanceMode 
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {maintenanceMode ? 'Maintenance ON' : 'Turn On Maintenance'}
          </button>

          <button 
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Dashboard
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
        
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white">
              {activeTab === 'analytics' && 'System Analytics'}
              {activeTab === 'banned_id' && 'IP Restriction'}
              {activeTab === 'banned_accounts' && 'User Management'}
              {activeTab === 'data' && 'Raw Data Records'}
            </h1>
            <p className="text-sm text-zinc-400">Monitoring EcomBoost node activity and metrics.</p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={loadData} 
              disabled={loading}
              className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center bg-zinc-950 border border-zinc-900 rounded-xl p-1 gap-1">
              <button onClick={() => downloadData('csv')} className="px-3 py-1.5 hover:bg-zinc-900 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all">CSV</button>
              <button onClick={() => downloadData('json')} className="px-3 py-1.5 hover:bg-zinc-900 rounded-lg text-xs font-bold text-zinc-400 hover:text-white transition-all">JSON</button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
            <span className="text-xs text-zinc-500 font-bold tracking-widest">DECRYPTING FIREBASE LOGS...</span>
          </div>
        ) : (
          <>
            {/* ── TAB CONTENT ── */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 4 Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Users', value: users.length, growth: `${growthPercentage}%`, icon: Users, color: 'text-blue-500' },
                    { label: 'Paid Access', value: countPaying, growth: 'Verified', icon: ShieldCheck, color: 'text-accent' },
                    { label: 'Click Stream', value: countTotalClicks, growth: `+${newUsersToday} today`, icon: MousePointer, color: 'text-purple-500' },
                    { label: 'Conversion', value: `${conversionRate}%`, growth: 'Optimized', icon: Percent, color: 'text-emerald-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-xl bg-zinc-900 ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-zinc-900 text-emerald-500 border border-emerald-500/10">
                          {stat.growth}
                        </span>
                      </div>
                      <div className="text-3xl font-black mb-1">{stat.value}</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[40px] p-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-zinc-400">Promo Code Traffic Distribution</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clicksByCode}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                          <XAxis dataKey="code" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }} />
                          <Bar dataKey="Clicks" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-zinc-400">License Profiles</h3>
                    <div className="h-48 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={subscriptionTiers} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                            {subscriptionTiers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black">{users.length}</span>
                        <span className="text-[8px] text-zinc-500 font-black uppercase">Operators</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-6">
                      {subscriptionTiers.map((t, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-[9px] font-bold text-zinc-500 truncate">{t.name}: {t.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'banned_id' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[40px]">
                  <h2 className="text-2xl font-black mb-2">Restrict IP Route</h2>
                  <p className="text-zinc-500 text-sm mb-6">Instantly block access to the site from specific IP addresses.</p>
                  <div className="flex gap-4 max-w-md">
                    <input 
                      type="text" value={ipToBan} onChange={(e) => setIpToBan(e.target.value)}
                      placeholder="e.g. 192.168.1.1"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:border-red-500 outline-none transition-all font-mono"
                    />
                    <button onClick={() => banIp(ipToBan)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all">
                      Ban IP
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] overflow-hidden">
                  <div className="p-8 border-b border-zinc-900 bg-white/2 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Currently Blocked Access</h3>
                    <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-500/20">
                      {bannedIps.length} Active Blocks
                    </span>
                  </div>
                  <div className="divide-y divide-zinc-900">
                    {bannedIps.length === 0 ? (
                      <div className="p-10 text-center text-zinc-600 italic">No IP blocks active.</div>
                    ) : (
                      bannedIps.map(ip => (
                        <div key={ip} className="p-6 flex items-center justify-between hover:bg-zinc-900/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                              <Globe className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="font-mono font-black text-red-400">{ip}</span>
                          </div>
                          <button onClick={() => unbanIp(ip)} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                            Revoke
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'banned_accounts' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 p-5 rounded-3xl">
                  <Search className="w-5 h-5 text-zinc-600" />
                  <input 
                    type="text" value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by email, ID or IP..."
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-zinc-700"
                  />
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-900/50 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      <tr>
                        <th className="px-8 py-5">Operator Info</th>
                        <th className="px-8 py-5">Origin</th>
                        <th className="px-8 py-5">License</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-zinc-900/30 transition-all group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.isBanned ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                <Users className={`w-5 h-5 ${u.isBanned ? 'text-red-500' : 'text-emerald-500'}`} />
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm">{u.email}</p>
                                <p className="text-[9px] text-zinc-600 font-mono mt-0.5">{u.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-mono text-zinc-500">{u.created_ip || 'N/A'}</td>
                          <td className="px-8 py-6 uppercase font-black text-[9px] tracking-widest text-zinc-400">{u.subscriptionStatus || 'Guest'}</td>
                          <td className="px-8 py-6 text-right">
                            <button onClick={() => toggleBanUser(u.id, !!u.isBanned)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                              u.isBanned ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                            }`}>
                              {u.isBanned ? 'Restore' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] overflow-hidden">
                  <div className="p-8 border-b border-zinc-900 bg-white/2">
                    <h3 className="text-xl font-bold">Promo Codes Manifest</h3>
                  </div>
                  <div className="divide-y divide-zinc-900 max-h-[500px] overflow-y-auto">
                    {affiliateLinks.map(link => (
                      <div key={link.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/30 transition-all">
                        <div>
                          <p className="font-black text-accent text-lg">/{link.shortCode}</p>
                          <p className="text-[10px] text-zinc-600 truncate mt-1">ID: {link.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black">{affiliateClicks.filter(c => c.linkId === link.id).length}</p>
                          <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Intercepts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] overflow-hidden">
                  <div className="p-8 border-b border-zinc-900 bg-white/2">
                    <h3 className="text-xl font-bold">System Clickstream</h3>
                  </div>
                  <div className="divide-y divide-zinc-900 max-h-[500px] overflow-y-auto font-mono text-[10px]">
                    {affiliateClicks.sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)).slice(0, 50).map((click, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-zinc-900/30 transition-all">
                        <div>
                          <p className="text-zinc-300">{click.ip}</p>
                          <p className="text-zinc-600 mt-1">{click.timestamp?.toDate?.().toLocaleString() || 'Log Stream'}</p>
                        </div>
                        <p className="font-black text-accent uppercase">/{click.shortCode || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

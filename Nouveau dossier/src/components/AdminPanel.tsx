import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  AreaChart, Area 
} from 'recharts';
import { 
  Activity, Users, UserX, Database, ShieldCheck, RefreshCw, 
  Globe, AlertTriangle, ArrowLeft, Search, Link as LinkIcon,
  MapPin, CreditCard, Gift, Languages, Clock, UserCheck, ShieldAlert, Trash2
} from 'lucide-react';

interface AdminPanelProps {
  isDark: boolean;
  onBack: () => void;
}

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  language?: string;
  subscription: 'starter' | 'pro' | 'business' | null;
  subscriptionStatus?: 'active' | 'cancelled' | 'paused' | 'inactive';
  subscriptionPrice?: number;
  subscriptionPeriodEnd?: string | null;
  isBanned?: boolean;
  created_ip?: string;
  authorized_ips?: string[];
  createdAt?: number;
}

export default function AdminPanel({ isDark, onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'banned'>('analytics');
  const [selectedMetric, setSelectedMetric] = useState('totalUsers');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([]);
  const [affiliateClicks, setAffiliateClicks] = useState<any[]>([]);
  const [otpsCount, setOtpsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Deep Trace / Lookup Search engine state
  const [lookupQuery, setLookupQuery] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUser | null>(null);

  const metrics = {
    totalUsers: users.length,
    totalAffiliateLinks: affiliateLinks.length,
    totalClicks: affiliateClicks.length,
    totalBanned: users.filter(u => u.isBanned).length,
    premiumUsers: users.filter(u => u.subscription === 'pro' || u.subscription === 'business').length,
    freeUsers: users.filter(u => !u.subscription).length,
    starterUsers: users.filter(u => u.subscription === 'starter').length,
    proUsers: users.filter(u => u.subscription === 'pro').length,
    businessUsers: users.filter(u => u.subscription === 'business').length,
    totalOtps: otpsCount,
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersList: AdminUser[] = [];
      usersSnap.forEach((doc) => {
        const data = doc.data();
        usersList.push({
          id: doc.id,
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          country: data.country || 'Unknown',
          language: data.language || 'en',
          subscription: data.subscription || null,
          subscriptionStatus: data.subscriptionStatus || 'inactive',
          subscriptionPrice: data.subscriptionPrice || 0,
          subscriptionPeriodEnd: data.subscriptionPeriodEnd || null,
          isBanned: data.isBanned || false,
          created_ip: data.created_ip || '127.0.0.1',
          authorized_ips: data.authorized_ips || [],
          createdAt: data.createdAt || 0
        } as AdminUser);
      });
      setUsers(usersList);

      const linksSnap = await getDocs(collection(db, 'affiliateLinks'));
      setAffiliateLinks(linksSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const clicksSnap = await getDocs(collection(db, 'affiliateClicks'));
      setAffiliateClicks(clicksSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const otpsSnap = await getDocs(collection(db, 'otps'));
      setOtpsCount(otpsSnap.size);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateSubscription = async (userId: string, newTier: 'starter' | 'pro' | 'business' | null) => {
    setUpdatingUserId(userId);
    setSuccessMsg(null);
    try {
      const uRef = doc(db, 'users', userId);
      const updatePayload = {
        subscription: newTier,
        subscriptionStatus: newTier ? 'active' : 'inactive',
        subscriptionPrice: newTier === 'starter' ? 59 : newTier === 'pro' ? 89 : newTier === 'business' ? 149 : 0,
        subscriptionPeriodEnd: newTier ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      };

      await updateDoc(uRef, updatePayload);
      
      setUsers(prev => prev.map(u => u.id === userId ? { 
        ...u, 
        subscription: newTier,
        subscriptionStatus: updatePayload.subscriptionStatus as any,
        subscriptionPrice: updatePayload.subscriptionPrice,
        subscriptionPeriodEnd: updatePayload.subscriptionPeriodEnd
      } : u));

      if (selectedUserDetail?.id === userId) {
        setSelectedUserDetail(prev => prev ? {
          ...prev,
          subscription: newTier,
          subscriptionStatus: updatePayload.subscriptionStatus as any,
          subscriptionPrice: updatePayload.subscriptionPrice,
          subscriptionPeriodEnd: updatePayload.subscriptionPeriodEnd
        } : null);
      }

      setSuccessMsg('User subscription adjusted successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      alert('Failed to update subscription: ' + e.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    try {
      const uRef = doc(db, 'users', userId);
      await updateDoc(uRef, { isBanned: !isBanned });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !isBanned } : u));
      if (selectedUserDetail?.id === userId) {
        setSelectedUserDetail(prev => prev ? { ...prev, isBanned: !isBanned } : null);
      }
      setSuccessMsg(`User successfully ${!isBanned ? 'banned' : 'unbanned'}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      alert('Failed to update ban status: ' + e.message);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === 'goatcaca111@gmail.com' || email === 'vadimtchepikov@gmail.com') {
      alert('Root master owner cannot be deleted.');
      return;
    }
    
    const confirm = window.confirm(`CONFIRM: Are you absolutely sure you want to permanently delete user ${email}?`);
    if (!confirm) return;

    setUpdatingUserId(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      if (selectedUserDetail?.id === userId) {
        setSelectedUserDetail(null);
      }
      setSuccessMsg('User registry purged permanently.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      alert('Purge operation failed: ' + e.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const exportData = (format: 'csv' | 'json' | 'txt') => {
    let content = "";
    let filename = `analytics_export.${format}`;
    const dataToExport = { metrics, users, affiliateLinks, affiliateClicks };
    
    if (format === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
    } else if (format === 'csv') {
      content = "Metric,Value\n" + Object.entries(metrics).map(([k,v]) => `${k},${v}`).join("\n");
    } else {
      content = JSON.stringify(dataToExport, null, 2);
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const getMetricExplanation = () => {
    switch (selectedMetric) {
      case 'totalUsers':
        return "Total registered users across all database regions. This shows every active operator currently boarded on the EcomBoost platform.";
      case 'totalAffiliateLinks':
        return "Custom tracking URLs generated by our affiliate program partners. These are used to refer new users and earn recurring commissions.";
      case 'totalClicks':
        return "Live visitor clicks on affiliate links. Tracks referral hits, visitor IPs, and maps them to link owners to attribute credit.";
      case 'totalBanned':
        return "Accounts that have been restricted from accessing the application due to policy violations, concurrent sessions sharing, or fraud.";
      case 'premiumUsers':
        return "Elite subscription licenses (Pro and Business tiers combined). These are our highest-growth operators who generate the most platform volume.";
      case 'freeUsers':
        return "Guest operators currently utilizing local storage and basic analysis capabilities under the free tier limit.";
      case 'starterUsers':
        return "Operators boarded on the Starter plan. Includes single workspace seats, standard conversion models, and individual spy tools.";
      case 'proUsers':
        return "Operators boarded on the Pro growth license. Displays their email, full name, country (derived via IP), and app language setting.";
      case 'businessUsers':
        return "Operators on the Business tier. Scale-out enterprises with up to 4 workspace seats, custom APIs, and white-label tools.";
      case 'totalOtps':
        return "Total passwordless one-time pin authentication sessions dispatched to user emails for safe, single-session logins.";
      default:
        return "Detailed analytical breakdown for the selected workspace metric.";
    }
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'premiumUsers': 
        return users.filter(u => u.subscription === 'pro' || u.subscription === 'business');
      case 'freeUsers':
        return users.filter(u => !u.subscription);
      case 'starterUsers':
        return users.filter(u => u.subscription === 'starter');
      case 'proUsers':
        return users.filter(u => u.subscription === 'pro');
      case 'businessUsers':
        return users.filter(u => u.subscription === 'business');
      case 'totalBanned': 
        return users.filter(u => u.isBanned);
      case 'totalAffiliateLinks':
        return affiliateLinks.map(link => {
          const owner = users.find(u => u.id === link.userId);
          const clickCount = affiliateClicks.filter(c => c.linkId === link.id).length;
          return {
            ...link,
            ownerEmail: owner?.email || 'N/A',
            ownerName: owner ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim() : 'Unknown',
            clicks: clickCount
          };
        });
      case 'totalClicks': 
        return affiliateClicks.map(c => {
          const link = affiliateLinks.find(l => l.id === c.linkId);
          const owner = link ? users.find(u => u.id === link.userId) : null;
          // Find if there is any user registered using this referral
          const referredUser = users.find(u => u.referredByLink === c.linkId);
          return {
            ...c,
            linkCode: link?.shortCode || 'N/A',
            ownerEmail: owner?.email || 'N/A',
            ownerName: owner ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim() : 'Unknown',
            referredUserEmail: referredUser?.email || null,
            referredUserName: referredUser ? `${referredUser.firstName || ''} ${referredUser.lastName || ''}`.trim() : null
          };
        });
      case 'totalUsers':
      default: 
        return users;
    }
  };

  const getMetricHeaders = () => {
    switch (selectedMetric) {
      case 'totalAffiliateLinks':
        return ['Link Code', 'Link Owner', 'Owner Email', 'Total Clicks', 'Created'];
      case 'totalClicks':
        return ['Referral Code', 'Link Owner', 'Visitor IP', 'Timestamp', 'Subsequent Signup'];
      default:
        return ['Identity & Email', 'IP Country', 'Language', 'Subscription Tier', 'Status'];
    }
  };

  const renderMetricRow = (item: any, i: number) => {
    if (selectedMetric === 'totalAffiliateLinks') {
      return (
        <tr key={item.id || i} className={`hover:bg-accent/5 border-b transition-colors ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <td className="p-3 font-mono font-bold text-accent text-xs">{item.shortCode || item.code || 'N/A'}</td>
          <td className="p-3 font-semibold text-xs">{item.ownerName}</td>
          <td className="p-3 text-xs opacity-80">{item.ownerEmail}</td>
          <td className="p-3 text-xs font-mono font-bold">{item.clicks}</td>
          <td className="p-3 text-xs opacity-75">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
        </tr>
      );
    }
    if (selectedMetric === 'totalClicks') {
      return (
        <tr key={item.id || i} className={`hover:bg-accent/5 border-b transition-colors ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <td className="p-3 font-mono text-xs">{item.linkCode}</td>
          <td className="p-3 text-xs">
            <p className="font-semibold">{item.ownerName}</p>
            <p className="text-[10px] opacity-60">{item.ownerEmail}</p>
          </td>
          <td className="p-3 text-xs font-mono">{item.ip || 'Unknown'}</td>
          <td className="p-3 text-xs opacity-75">{item.clickedAt ? new Date(item.clickedAt).toLocaleString() : 'N/A'}</td>
          <td className="p-3 text-xs">
            {item.referredUserEmail ? (
              <span className="inline-flex flex-col">
                <span className="font-bold text-green-500">Converted</span>
                <span className="text-[10px] opacity-75">{item.referredUserEmail} ({item.referredUserName})</span>
              </span>
            ) : (
              <span className="text-zinc-500 italic">No signup yet</span>
            )}
          </td>
        </tr>
      );
    }

    return (
      <tr key={item.id || i} className={`hover:bg-accent/5 border-b transition-colors ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <td className="p-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent/25 text-accent flex items-center justify-center text-[10px] font-black uppercase">
            {(item.firstName || item.email)[0]}
          </div>
          <div>
            <p className="font-bold text-xs">{item.firstName || item.lastName ? `${item.firstName} ${item.lastName}` : 'Guest Operator'}</p>
            <p className="text-[10px] opacity-70 font-mono">{item.email}</p>
          </div>
        </td>
        <td className="p-3 text-xs">
          <p className="font-semibold flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
            {item.country || 'Unknown'}
          </p>
          <p className="text-[9px] font-mono opacity-50">{item.created_ip}</p>
        </td>
        <td className="p-3 text-xs font-bold uppercase">{item.language || 'en'}</td>
        <td className="p-3 text-xs">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
            item.subscription === 'business' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
            item.subscription === 'pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            item.subscription === 'starter' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
            'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
          }`}>
            {item.subscription || 'Free Guest'}
          </span>
        </td>
        <td className="p-3 text-xs">
          {item.isBanned ? (
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 font-bold text-[9px] uppercase border border-red-500/30">Suspended</span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-500 font-bold text-[9px] uppercase border border-green-500/30">Authorized</span>
          )}
        </td>
      </tr>
    );
  };

  const getChartData = () => {
    // Return mock distribution data or real segmentations to make chart "real"
    if (selectedMetric === 'totalUsers') {
      return [
        { name: 'Free', val: metrics.freeUsers },
        { name: 'Starter', val: metrics.starterUsers },
        { name: 'Pro', val: metrics.proUsers },
        { name: 'Business', val: metrics.businessUsers }
      ];
    }
    if (selectedMetric === 'premiumUsers') {
      return [
        { name: 'Starter', val: metrics.starterUsers },
        { name: 'Pro', val: metrics.proUsers },
        { name: 'Business', val: metrics.businessUsers }
      ];
    }
    return [
      { name: 'Active', val: metrics[selectedMetric as keyof typeof metrics] || 0 },
      { name: 'Other segments', val: Math.max(0, users.length - (metrics[selectedMetric as keyof typeof metrics] || 0)) }
    ];
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Deep lookup trace queries
  const lookupResults = lookupQuery.trim() === '' ? [] : users.filter(u =>
    u.email.toLowerCase().includes(lookupQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(lookupQuery.toLowerCase()) ||
    `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(lookupQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Toast banner */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-3 shadow-2xl animate-bounce">
          <ShieldCheck className="w-5 h-5 text-black" />
          {successMsg}
        </div>
      )}

      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 dark:border-white/5 border-black/5">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight flex items-center gap-3">
            <span className="w-2.5 h-7 bg-accent rounded-full shrink-0" />
            Administrative Intelligence Terminal
          </h1>
          <p className="text-xs opacity-60 mt-1 font-mono uppercase tracking-widest">Global Node Control Panel & High-Contrast Analytics</p>
        </div>
        <button
          onClick={onBack}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 ${
            isDark ? 'bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Terminal
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0">
          {[
            { id: 'analytics', label: 'Analytics Console', icon: Activity },
            { id: 'users', label: 'Operators Directory', icon: Users },
            { id: 'banned', label: 'Restricted Node Logs', icon: UserX }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedUserDetail(null);
                setLookupQuery('');
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all shrink-0 ${
                activeTab === tab.id 
                ? (isDark ? 'bg-accent/15 text-accent border border-accent/30' : 'bg-accent/10 text-accent border border-accent/20') 
                : (isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent')
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Tab Content */}
        <main className="flex-1 space-y-6">

          {/* Quick Operator Lookup / Deep Trace Search Input */}
          <div className={`p-5 rounded-3xl border ${isDark ? 'bg-zinc-900/60 border-white/5' : 'bg-white border-black/10 shadow-sm'} space-y-3`}>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-sm uppercase tracking-wide">Operator Deep-Trace Lookup</h3>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter ID, email, or name to trace complete workspace logs..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className={`w-full px-4 py-3 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-accent border transition-all ${
                  isDark ? 'bg-black/40 border-zinc-800 text-white focus:bg-black' : 'bg-slate-50 border-slate-300 text-slate-800 focus:bg-white'
                }`}
              />
              {lookupQuery && (
                <button 
                  onClick={() => setLookupQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
            {/* Lookup result list dropdown */}
            {lookupResults.length > 0 && (
              <div className={`rounded-xl border p-2 space-y-1 shadow-2xl ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-black/15'}`}>
                <p className="text-[9px] uppercase font-bold text-zinc-500 px-3 py-1">Direct matches:</p>
                {lookupResults.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUserDetail(u);
                      setLookupQuery('');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold">{u.email} <span className="opacity-50 text-[10px]">({u.firstName} {u.lastName})</span></span>
                    <span className="text-[10px] font-mono text-accent uppercase font-extrabold">{u.subscription || 'free'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Deep Trace Popup Detail Modal */}
          {selectedUserDetail && (
            <div className={`p-6 rounded-3xl border-2 border-accent/40 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 border-accent/30'} animate-fade-up space-y-6 relative`}>
              <button 
                onClick={() => setSelectedUserDetail(null)}
                className="absolute top-4 right-4 text-xs font-bold px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition-all"
              >
                Close Trace
              </button>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center font-black text-lg uppercase shadow-lg">
                  {selectedUserDetail.email[0]}
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">{selectedUserDetail.firstName || selectedUserDetail.lastName ? `${selectedUserDetail.firstName} ${selectedUserDetail.lastName}` : 'Guest Operator'}</h2>
                  <p className="text-xs font-mono text-accent">{selectedUserDetail.email}</p>
                  <p className="text-[9px] text-zinc-500 uppercase font-bold">Trace ID: {selectedUserDetail.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section: Geo IP Credentials */}
                <div className={`p-4 rounded-2xl space-y-3 ${isDark ? 'bg-zinc-900/40' : 'bg-white border'}`}>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent" />
                    Geographical & Localization Trace
                  </h4>
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b pb-1 border-white/5">
                      <span className="opacity-60">IP Country:</span>
                      <span className="font-bold">{selectedUserDetail.country || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-white/5">
                      <span className="opacity-60">Sign-up IP:</span>
                      <span className="font-bold">{selectedUserDetail.created_ip || '127.0.0.1'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-white/5">
                      <span className="opacity-60">App Language preference:</span>
                      <span className="font-bold uppercase text-accent">{selectedUserDetail.language || 'en'}</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-1">
                      <span className="opacity-60">Session Authorized IP History:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedUserDetail.authorized_ips && selectedUserDetail.authorized_ips.length > 0 ? (
                          selectedUserDetail.authorized_ips.map(ip => (
                            <span key={ip} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-bold">{ip}</span>
                          ))
                        ) : (
                          <span className="text-zinc-600">None logged</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Workspace License Status */}
                <div className={`p-4 rounded-2xl space-y-3 ${isDark ? 'bg-zinc-900/40' : 'bg-white border'}`}>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-accent" />
                    Active Workspace License Status
                  </h4>
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b pb-1 border-white/5">
                      <span className="opacity-60">Active Tier:</span>
                      <span className="font-extrabold text-accent uppercase">{selectedUserDetail.subscription || 'free guest'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-white/5">
                      <span className="opacity-60">License Status:</span>
                      <span className="font-bold uppercase text-green-400">{selectedUserDetail.subscriptionStatus || 'inactive'}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-white/5">
                      <span className="opacity-60">License Price Point:</span>
                      <span className="font-bold">${selectedUserDetail.subscriptionPrice || 0}/mo</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="opacity-60">Period End Date:</span>
                      <span className="font-bold">{selectedUserDetail.subscriptionPeriodEnd ? new Date(selectedUserDetail.subscriptionPeriodEnd).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Affiliation Referral Data */}
              <div className={`p-4 rounded-2xl space-y-3 ${isDark ? 'bg-zinc-900/40' : 'bg-white border'}`}>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-accent" />
                  Affiliate Program Tracking Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
                  <div>
                    <span className="opacity-60 block">Owner Referral Code:</span>
                    <span className="font-bold text-accent text-xs">
                      {affiliateLinks.find(l => l.userId === selectedUserDetail.id)?.shortCode || 'No Link Generated'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-60 block">Referral link clicks:</span>
                    <span className="font-bold text-xs">
                      {(() => {
                        const linkId = affiliateLinks.find(l => l.userId === selectedUserDetail.id)?.id;
                        return linkId ? affiliateClicks.filter(c => c.linkId === linkId).length : 0;
                      })()} clicks
                    </span>
                  </div>
                  <div>
                    <span className="opacity-60 block">Successful Conversions:</span>
                    <span className="font-bold text-xs text-green-400">
                      {users.filter(u => {
                        const linkId = affiliateLinks.find(l => l.userId === selectedUserDetail.id)?.id;
                        return linkId && u.referredByLink === linkId;
                      }).length} operators registered
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions panel */}
              <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-zinc-400">Quick Adjust License:</span>
                  <select 
                    value={selectedUserDetail.subscription || ''} 
                    onChange={(e) => handleUpdateSubscription(selectedUserDetail.id, (e.target.value || null) as any)}
                    className={`text-xs p-2 rounded-lg font-bold uppercase focus:outline-none focus:ring-1 focus:ring-accent ${
                      isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border text-slate-800'
                    }`}
                  >
                    <option value="">FREE GUEST</option>
                    <option value="starter">STARTER</option>
                    <option value="pro">PRO</option>
                    <option value="business">BUSINESS</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBanUser(selectedUserDetail.id, !!selectedUserDetail.isBanned)}
                    className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                      selectedUserDetail.isBanned 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' 
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20'
                    }`}
                  >
                    {selectedUserDetail.isBanned ? 'Unban Node' : 'Ban Operator'}
                  </button>

                  <button 
                    onClick={() => handleDeleteUser(selectedUserDetail.id, selectedUserDetail.email)}
                    className="px-4 py-2 text-xs font-bold uppercase rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Purge Registry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* PLATFORM METRICS GROUP:平台增长 */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
                  <Activity className="w-4 h-4 shrink-0" />
                  Growth & Global Segments
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'totalUsers', label: 'All Operators', count: metrics.totalUsers, color: 'text-accent' },
                    { id: 'premiumUsers', label: 'Elite Pro/Biz', count: metrics.premiumUsers, color: 'text-blue-400' },
                    { id: 'totalClicks', label: 'Referral Clicks', count: metrics.totalClicks, color: 'text-green-400' },
                    { id: 'totalAffiliateLinks', label: 'Partner Links', count: metrics.totalAffiliateLinks, color: 'text-pink-400' },
                    { id: 'totalBanned', label: 'Suspended Nodes', count: metrics.totalBanned, color: 'text-red-400' }
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => setSelectedMetric(item.id)}
                      className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] duration-200 ${
                        selectedMetric === item.id 
                          ? (isDark ? 'bg-accent/15 border-accent text-accent' : 'bg-accent/10 border-accent text-accent shadow-sm') 
                          : (isDark ? 'bg-zinc-900/55 border-white/5 text-white' : 'bg-white border-black/10 text-slate-800 shadow-sm')
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider truncate">{item.label}</p>
                      <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.count}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* PLATFORM METRICS GROUP:授权计划 */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  Workspace Licenses Segmentations
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'freeUsers', label: 'Free Guests', count: metrics.freeUsers, color: 'text-zinc-400' },
                    { id: 'starterUsers', label: 'Starter Seats', count: metrics.starterUsers, color: 'text-orange-400' },
                    { id: 'proUsers', label: 'Pro Operators', count: metrics.proUsers, color: 'text-blue-400' },
                    { id: 'businessUsers', label: 'Business Tier', count: metrics.businessUsers, color: 'text-purple-400' },
                    { id: 'totalOtps', label: 'Safe OTP Dispatches', count: metrics.totalOtps, color: 'text-yellow-400' }
                  ].map(item => (
                    <button 
                      key={item.id}
                      onClick={() => setSelectedMetric(item.id)}
                      className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] duration-200 ${
                        selectedMetric === item.id 
                          ? (isDark ? 'bg-accent/15 border-accent text-accent' : 'bg-accent/10 border-accent text-accent shadow-sm') 
                          : (isDark ? 'bg-zinc-900/55 border-white/5 text-white' : 'bg-white border-black/10 text-slate-800 shadow-sm')
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold opacity-60 tracking-wider truncate">{item.label}</p>
                      <p className={`text-xl font-black mt-1 ${item.color}`}>{item.count}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Chart & Explainers */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visualizer Chart */}
                <div className={`lg:col-span-2 p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/10 shadow-sm'}`}>
                  <h3 className="font-extrabold text-sm mb-4 uppercase tracking-widest text-accent flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    Segmentation Distribution Chart
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getChartData()}>
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#222" : "#eee"} />
                        <XAxis dataKey="name" stroke={isDark ? "#888" : "#444"} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis stroke={isDark ? "#888" : "#444"} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: isDark ? '#111' : '#fff', border: 'none', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="val" fill="url(#chartGradient)" stroke="#0ea5e9" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metric explanatory card */}
                <div className={`p-6 rounded-3xl border flex flex-col justify-between ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-black/10 shadow-sm'}`}>
                  <div className="space-y-3">
                    <span className="px-2 py-1 rounded bg-accent/20 text-accent font-black text-[9px] uppercase tracking-wider">Metric Definition</span>
                    <h3 className="text-xl font-black tracking-tight uppercase">{selectedMetric.replace(/([A-Z])/g, ' $1')}</h3>
                    <p className="text-xs opacity-85 leading-relaxed font-sans">{getMetricExplanation()}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 mt-4 text-[10px] font-mono opacity-60">
                    Database node sync: Real-time active.
                  </div>
                </div>
              </div>

              {/* Data Segment Details table */}
              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/10 shadow-sm'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                  <div>
                    <h4 className="font-extrabold text-sm uppercase tracking-wider text-accent">Active Records Listing</h4>
                    <p className="text-[10px] opacity-60">Dynamically queried records representing {selectedMetric.replace(/([A-Z])/g, ' $1')}.</p>
                  </div>
                  
                  {/* Export buttons */}
                  <div className="flex gap-2">
                    <button onClick={() => exportData('csv')} className="px-3 py-1.5 bg-accent/15 border border-accent/20 text-accent hover:bg-accent/25 rounded-lg font-bold text-[10px] uppercase tracking-wider">Export CSV</button>
                    <button onClick={() => exportData('json')} className="px-3 py-1.5 bg-accent/15 border border-accent/20 text-accent hover:bg-accent/25 rounded-lg font-bold text-[10px] uppercase tracking-wider">Export JSON</button>
                    <button onClick={() => exportData('txt')} className="px-3 py-1.5 bg-accent/15 border border-accent/20 text-accent hover:bg-accent/25 rounded-lg font-bold text-[10px] uppercase tracking-wider">Export TXT</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className={`border-b uppercase text-[10px] font-black tracking-wider ${isDark ? 'border-white/10 text-zinc-500' : 'border-black/10 text-slate-500'}`}>
                        {getMetricHeaders().map(h => <th key={h} className="p-3">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
                      {getMetricData().length > 0 ? (
                        getMetricData().map((item: any, i) => renderMetricRow(item, i))
                      ) : (
                        <tr>
                          <td colSpan={getMetricHeaders().length} className="p-6 text-center text-xs opacity-50 italic">
                            No records found matching this analytics category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER DIRECTORY AND ACCOUNT MANAGE */}
          {activeTab === 'users' && (
            <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/10 shadow-sm'}`}>
              <div className="p-6 border-b dark:border-white/5 border-black/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wide text-accent flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Operator Directory & Registry Access
                  </h3>
                  <p className={`text-[11px] ${isDark ? 'text-zinc-500' : 'text-slate-400'} font-medium`}>Query user accounts, active licenses, and trace geographical IPs.</p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search directory by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full md:w-80 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-accent border-2 transition-all ${
                      isDark ? 'bg-black/30 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-800 focus:bg-white'
                    }`}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`${isDark ? 'bg-zinc-900/40 border-b border-white/5 text-zinc-400' : 'bg-slate-50 text-slate-700 border-b border-slate-200'}`}>
                      <th className="p-4 font-bold uppercase tracking-wider">Operator Identity</th>
                      <th className="p-4 font-bold uppercase tracking-wider">Country & IP Trace</th>
                      <th className="p-4 font-bold uppercase tracking-wider">Workspace License</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-200'}`}>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-accent/5 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0">
                              {u.email[0]}
                            </div>
                            <div>
                              <p className="font-bold text-xs">{u.firstName || u.lastName ? `${u.firstName} ${u.lastName}` : 'Guest'}</p>
                              <p className="text-[10px] font-mono opacity-70">{u.email}</p>
                              <p className="text-[9px] font-mono opacity-40">ID: {u.id}</p>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-semibold">
                            <p className="flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 text-accent" />
                              {u.country || 'Unknown'}
                            </p>
                            <p className="text-[10px] font-mono opacity-55 font-normal">{u.created_ip}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                              u.subscription === 'business' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              u.subscription === 'pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              u.subscription === 'starter' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                              'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                            }`}>
                              {u.subscription || 'Free'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => setSelectedUserDetail(u)}
                                className="px-2.5 py-1 text-[10px] uppercase font-black bg-accent/20 text-accent rounded hover:bg-accent/30 transition-all"
                              >
                                Deep Trace
                              </button>
                              <button 
                                onClick={() => handleBanUser(u.id, !!u.isBanned)} 
                                className={`px-2.5 py-1 text-[10px] uppercase font-black rounded border transition-all ${
                                  u.isBanned 
                                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                                }`}
                              >
                                {u.isBanned ? 'Authorize' : 'Suspend'}
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(u.id, u.email)} 
                                className="px-2.5 py-1 text-[10px] uppercase font-black bg-red-500/10 border border-red-500/20 text-red-500 rounded hover:bg-red-500/20 transition-all"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-xs opacity-50 italic">
                          No operators match your query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BANNED USERS / SUSPENDED NODES */}
          {activeTab === 'banned' && (
            <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/10 shadow-sm'} space-y-4`}>
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wide text-accent flex items-center gap-2">
                  <UserX className="w-5 h-5 text-red-500" />
                  Banned Accounts & Restricted Nodes
                </h3>
                <p className="text-[11px] opacity-60">System-wide suspensions. Banned users are logged out immediately and barred from signing in.</p>
              </div>
              <div className="divide-y divide-white/5 border border-white/5 rounded-2xl overflow-hidden">
                {users.filter(u => u.isBanned).length > 0 ? (
                  users.filter(u => u.isBanned).map(u => (
                    <div key={u.id} className={`flex justify-between items-center p-4 transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                        <div>
                          <span className="font-mono text-xs font-bold text-red-500">{u.email}</span>
                          <p className="text-[10px] opacity-50 font-mono">ID: {u.id}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleBanUser(u.id, true)} 
                        className="px-3 py-1.5 bg-green-500/15 border border-green-500/20 text-green-400 font-black uppercase text-[10px] rounded hover:bg-green-500/25 transition-all"
                      >
                        Unban Operator
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="p-6 text-center text-xs opacity-50 italic">
                    Platform security clean. No accounts currently suspended.
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

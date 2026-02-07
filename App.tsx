
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, AssetRecord, EntryType, UserAccount } from './types';
import { dbService } from './services/dbService';
import { StatsCard } from './components/StatsCard';
import { AssetForm } from './components/AssetForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Icons = {
  Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Package: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'users'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<EntryType | 'ALL'>('ALL');
  
  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.USER);

  useEffect(() => {
    setAssets(dbService.getAssets());
    setAllUsers(dbService.getUsers());
    
    const savedUser = localStorage.getItem('active_user_email');
    if (savedUser) {
      const u = dbService.getUserByEmail(savedUser);
      if (u) setCurrentUser(u);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = dbService.authenticate(loginEmail, loginPassword);
    if (u) {
      setCurrentUser(u);
      localStorage.setItem('active_user_email', u.email);
    } else {
      alert('Invalid Email or Password. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('active_user_email');
    setActiveTab('dashboard');
    setLoginPassword('');
  };

  const handleAddOrEditAsset = (data: Omit<AssetRecord, 'id' | 'createdAt'>) => {
    if (editingAsset) {
      const updated = dbService.updateAsset(editingAsset.id, data);
      setAssets(assets.map(a => a.id === editingAsset.id ? updated : a));
    } else {
      const added = dbService.addAsset(data);
      setAssets([added, ...assets]);
    }
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      dbService.deleteAsset(id);
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleUpsertUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) return alert('Email and Password are required');
    dbService.upsertUser(newUserEmail, newUserRole, newUserPassword);
    setAllUsers(dbService.getUsers());
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole(UserRole.USER);
  };

  const handleDeleteUser = (email: string) => {
    if (email === currentUser?.email) return alert('Cannot delete yourself!');
    if (confirm(`Remove access for ${email}?`)) {
      dbService.deleteUser(email);
      setAllUsers(dbService.getUsers());
    }
  };

  const isOwner = currentUser?.role === UserRole.OWNER;
  const isAdmin = currentUser?.role === UserRole.ADMIN || isOwner;
  const isViewer = currentUser?.role === UserRole.USER;

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            asset.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            asset.handledBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || asset.entryType === filterType;
      return matchesSearch && matchesType;
    });
  }, [assets, searchQuery, filterType]);

  const stats = useMemo(() => {
    const inward = assets.filter(a => a.entryType === EntryType.INWARD).reduce((acc, curr) => acc + curr.quantity, 0);
    const outward = assets.filter(a => a.entryType === EntryType.OUTWARD).reduce((acc, curr) => acc + curr.quantity, 0);
    return { totalItems: assets.length, totalInward: inward, totalOutward: outward, netStock: inward - outward };
  }, [assets]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0];
    }).reverse();
    return last7Days.map(date => {
      const dayAssets = assets.filter(a => a.createdAt.split('T')[0] === date);
      return {
        name: date.split('-').slice(1).join('/'),
        inward: dayAssets.filter(a => a.entryType === EntryType.INWARD).length,
        outward: dayAssets.filter(a => a.entryType === EntryType.OUTWARD).length,
      };
    });
  }, [assets]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-500/20 mb-4">A</div>
            <h2 className="text-2xl font-bold text-slate-900">AssetTrack Pro Login</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in with your email and password</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="email@company.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input 
                required 
                type="password" 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">A</div>
          <span className="text-xl font-bold text-white tracking-tight">AssetTrack<span className="text-indigo-400">Pro</span></span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}>
            <Icons.Dashboard /><span className="font-medium">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('assets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'assets' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}>
            <Icons.Package /><span className="font-medium">Inventory</span>
          </button>
          {isAdmin && (
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-slate-800'}`}>
              <Icons.Shield /><span className="font-medium">User Management</span>
            </button>
          )}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-400 border border-slate-600">
                {currentUser.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{currentUser.email}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isOwner ? 'bg-amber-500/20 text-amber-500' : isAdmin ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-all">
              <Icons.LogOut /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">{activeTab}</h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {activeTab === 'assets' && (
              <div className="relative flex-1 sm:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></span>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
              </div>
            )}
            <button onClick={() => { setEditingAsset(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              <Icons.Plus /> Add New Record
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard label="Total Items" value={stats.totalItems} icon={<Icons.Package />} colorClass="bg-indigo-100 text-indigo-600" trend="+4% increase" />
                <StatsCard label="Inward Qty" value={stats.totalInward} icon={<Icons.Plus />} colorClass="bg-emerald-100 text-emerald-600" />
                <StatsCard label="Outward Qty" value={stats.totalOutward} icon={<div className="rotate-180"><Icons.Plus /></div>} colorClass="bg-rose-100 text-rose-600" />
                <StatsCard label="Net Stock" value={stats.netStock} icon={<Icons.Users />} colorClass="bg-amber-100 text-amber-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-8">Activity Flow</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="inward" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                        <Bar dataKey="outward" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                  <h3 className="text-lg font-bold text-slate-800 mb-8 w-full">Stock Distribution</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'Inward', value: stats.totalInward },
                          { name: 'Outward', value: stats.totalOutward },
                        ]} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                          <Cell fill="#10b981" stroke="none" />
                          <Cell fill="#f43f5e" stroke="none" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> INWARD</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-rose-500"></div> OUTWARD</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                      <tr>
                        <th className="px-8 py-5 text-nowrap">Product Name</th>
                        <th className="px-8 py-5">Qty & Unit</th>
                        <th className="px-8 py-5">Type</th>
                        <th className="px-8 py-5 text-nowrap">Location</th>
                        <th className="px-8 py-5 text-nowrap">Handled By</th>
                        {isOwner && <th className="px-8 py-5">Remarks (Private)</th>}
                        <th className="px-8 py-5">Date</th>
                        {!isViewer && <th className="px-8 py-5 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-nowrap">
                      {filteredAssets.map(asset => (
                        <tr key={asset.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 font-bold text-slate-900">{asset.productName}</td>
                          <td className="px-8 py-5 text-slate-600">{asset.quantity} <span className="text-slate-400 text-xs">{asset.units}</span></td>
                          <td className="px-8 py-5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${asset.entryType === EntryType.INWARD ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {asset.entryType}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-slate-500 text-sm">{asset.address}</td>
                          <td className="px-8 py-5 text-slate-600 font-medium">{asset.handledBy}</td>
                          {isOwner && <td className="px-8 py-5"><span className="text-amber-700 text-xs italic bg-amber-50 px-2 py-1 rounded border border-amber-100 block max-w-xs truncate">{asset.remarks || 'None'}</span></td>}
                          <td className="px-8 py-5 text-slate-400 text-xs">{new Date(asset.createdAt).toLocaleDateString()}</td>
                          {!isViewer && (
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingAsset(asset); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Icons.Edit /></button>
                                <button onClick={() => handleDeleteAsset(asset.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Icons.Trash /></button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && isAdmin && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Icons.Shield /> Allocate Roles & Credentials</h3>
                <form onSubmit={handleUpsertUser} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <input required type="email" placeholder="Email Address" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="md:col-span-3">
                    <input required type="password" placeholder="Password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div className="md:col-span-3">
                    <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value={UserRole.USER}>Viewer (Staff)</option>
                      <option value={UserRole.ADMIN}>Administrator</option>
                      {isOwner && <option value={UserRole.OWNER}>Owner</option>}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-100">
                      Add
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-8 py-5">Email Address</th>
                      <th className="px-8 py-5">Assigned Role</th>
                      <th className="px-8 py-5">Password</th>
                      <th className="px-8 py-5">Access Since</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allUsers.map(user => (
                      <tr key={user.email} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 font-medium text-slate-900">{user.email} {user.email === currentUser.email && <span className="ml-2 text-[10px] bg-slate-100 px-2 py-0.5 rounded italic">You</span>}</td>
                        <td className="px-8 py-5">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            user.role === UserRole.OWNER ? 'bg-amber-100 text-amber-700' : user.role === UserRole.ADMIN ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-500 font-mono tracking-tighter">
                          {isOwner || isAdmin ? user.password : '••••••••'}
                        </td>
                        <td className="px-8 py-5 text-slate-400 text-sm">{new Date(user.addedAt).toLocaleDateString()}</td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => handleDeleteUser(user.email)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors" disabled={user.email === currentUser.email}><Icons.Trash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{editingAsset ? 'Modify Entry' : 'New Asset Entry'}</h2>
                <p className="text-slate-400 text-xs mt-1">Fill the details below for current stock movement</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-xl transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-10">
              <AssetForm isOwner={isOwner} initialData={editingAsset || undefined} onSubmit={handleAddOrEditAsset} onCancel={() => setIsModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

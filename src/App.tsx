import React, { useState, useEffect } from 'react';
import { KatalogKaca } from './types';
import { INITIAL_KATALOG_KACA } from './data';
import UserCatalog from './components/UserCatalog';
import AdminDashboard from './components/AdminDashboard';
import PhpExporter from './components/PhpExporter';
import Login from './components/Login';
import DatabaseDocs from './components/DatabaseDocs';
import { LogOut, Code, ShieldCheck, User, Database as DbIcon, Sun, Moon } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'catalog' | 'auth' | 'admin'>('catalog');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userRole, setUserRole] = useState<'guest' | 'user' | 'admin'>('guest');
  const [currentUser, setCurrentUser] = useState('');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'export' | 'database'>('dashboard');
  const [katalog, setKatalog] = useState<KatalogKaca[]>([]);
  
  // --- STATE TEMA (LIGHT / DARK) ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Mengubah tema layar setiap kali tombol diklik
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  useEffect(() => {
    const fetchKatalogDatabase = async () => {
      try {
        const response = await fetch('http://localhost/api_toko_kaca/get_katalog.php');
        const data = await response.json();
        if (data && data.length > 0) setKatalog(data);
        else setKatalog(INITIAL_KATALOG_KACA);
      } catch (error) {
        const savedKatalog = localStorage.getItem('karya_indah_mandiri_katalog');
        if (savedKatalog) {
          try { setKatalog(JSON.parse(savedKatalog)); } catch (e) { setKatalog(INITIAL_KATALOG_KACA); }
        } else setKatalog(INITIAL_KATALOG_KACA);
      }
    };
    fetchKatalogDatabase();
  }, []);

  const saveKatalogState = (newKatalog: KatalogKaca[]) => {
    setKatalog(newKatalog);
    localStorage.setItem('karya_indah_mandiri_katalog', JSON.stringify(newKatalog));
  };

  const handleAddItem = async (item: Omit<KatalogKaca, 'id'>) => {
    const newItem: KatalogKaca = { ...item, id: 'KCA-' + Date.now() };
    try {
      const response = await fetch('http://localhost/api_toko_kaca/tambah_katalog.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setKatalog([newItem, ...katalog]); 
        alert("Berhasil: " + result.message);
      } else alert("Gagal: " + result.message);
    } catch (err) {
      alert("Koneksi gagal! Pastikan XAMPP menyala.");
    }
  };

  const handleUpdateItem = (id: string, updatedFields: Partial<KatalogKaca>) => {
    const updated = katalog.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    saveKatalogState(updated);
  };

  const handleDeleteItem = (id: string) => {
    saveKatalogState(katalog.filter(item => item.id !== id));
  };

  const handleAuthSuccess = (role: 'admin' | 'user', username: string) => {
    setUserRole(role); setCurrentUser(username);
    setCurrentView(role === 'admin' ? 'admin' : 'catalog');
  };

  const handleLogout = () => {
    setUserRole('guest'); setCurrentUser(''); setCurrentView('catalog'); setAdminTab('dashboard');
  };

  const triggerAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode); setCurrentView('auth');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // ================= RENDER OTENTIKASI =================
  if (currentView === 'auth') {
    return <Login onLogin={handleAuthSuccess} onCancel={() => setCurrentView('catalog')} initialMode={authMode} />;
  }

  // ================= RENDER ADMIN (Tetap Mode Gelap Standar) =================
  if (currentView === 'admin' && userRole === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-sky-500" />
              <div>
                <span className="text-xl font-bold block">KIM Workspace</span>
                <span className="text-[10px] text-sky-400 font-bold tracking-widest uppercase block">Admin Panel</span>
              </div>
            </div>
            <nav className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
              <button onClick={() => setAdminTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm transition-all ${adminTab === 'dashboard' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Dashboard</button>
              <button onClick={() => setAdminTab('database')} className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${adminTab === 'database' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}><DbIcon className="w-4 h-4"/> Database</button>
              <button onClick={() => setAdminTab('export')} className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${adminTab === 'export' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}><Code className="w-4 h-4"/> API</button>
              <div className="w-px h-6 bg-slate-700 mx-2"></div>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
          {adminTab === 'dashboard' && <AdminDashboard katalog={katalog} onAdd={handleAddItem} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} />}
          {adminTab === 'export' && <PhpExporter />}
          {adminTab === 'database' && <DatabaseDocs />}
        </main>
      </div>
    );
  }

  // ================= RENDER PELANGGAN (Immersive Light/Dark Theme) =================
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-500 selection:text-white relative">
      
      {/* NAVBAR MODERN IMMERSIVE */}
      <header className="modern-header">
        <div className="max-w-7xl w-full mx-auto px-6 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            {/* --- LOGO DIPERBESAR (h-20) DENGAN EFEK BAYANGAN --- */}
            <div className="p-1.5 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
               <img src="public/logo-kim.jpeg" alt="KIM Logo" className="h-20 w-auto object-contain drop-shadow-xl" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-adaptive tracking-wide block leading-tight">KARYA INDAH MANDIRI</span>
              <span className="text-xs text-sky-500 font-bold tracking-[0.2em] uppercase block">Glass & Architectural Solutions</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* --- TOMBOL TOGGLE TEMA --- */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full border border-gray-400/30 hover:bg-gray-400/10 transition-all cursor-pointer"
              title="Ganti Tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400 drop-shadow-md" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 drop-shadow-md" />
              )}
            </button>

            <div className="w-px h-6 bg-gray-400/30"></div>

            {userRole === 'guest' ? (
              <>
                <button onClick={() => triggerAuth('login')} className="btn-modern-outline px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer">
                  Masuk
                </button>
                <button onClick={() => triggerAuth('register')} className="btn-modern-primary px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer">
                  Daftar
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-adaptive text-sm font-medium">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-sky-500">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{currentUser}</span>
                </div>
                <button onClick={handleLogout} className="text-adaptive-muted hover:text-red-500 transition-colors p-2 cursor-pointer" title="Keluar">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full pt-20 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-500 text-xs font-bold tracking-widest uppercase mb-4">
            Presisi • Estetika • Ketahanan
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-adaptive tracking-tight leading-tight">
            Wujudkan Arsitektur <br/>Kaca <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Impian Anda</span>
          </h1>
          <p className="text-adaptive-muted text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Dari kaca polos hingga kustom tempered berkualitas tinggi. Hitung estimasi harga secara instan dan pesan langsung kebutuhan material proyek bangunan Anda.
          </p>
        </div>
      </section>

      {/* KONTEN KATALOG */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="glass-panel p-6 md:p-8 rounded-2xl">
          <UserCatalog 
            katalog={katalog} 
            isGuest={userRole === 'guest'} 
            onRequireAuth={() => triggerAuth('login')} 
            username={currentUser}
          />
        </div>
      </main>

      {/* FOOTER MODERN */}
      <footer className="modern-footer py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-adaptive-muted text-sm">
          <div>
            <span className="font-bold text-adaptive block">Toko Kaca Karya Indah Mandiri &copy; 2026</span>
            Sistem Informasi Manajemen Bisnis Penjualan Kaca Kustom
          </div>
          <div className="text-right">
            Universitas Pembangunan Jaya<br/>
            Program Studi Sistem Informasi
          </div>
        </div>
      </footer>

    </div>
  );
}
import React, { useState } from 'react';
import { User, Lock, LogIn, Sparkles, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'admin' | 'user', username: string) => void;
  onCancel: () => void;
  initialMode?: 'login' | 'register';
}

export default function Login({ onLogin, onCancel, initialMode = 'login' }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Efek loading saat tembak database

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && name.trim() === '') {
      setError('Nama lengkap wajib diisi!'); return;
    }
    if (email.trim() === '' || password.trim() === '') {
      setError('Email dan password wajib diisi!'); return;
    }

    setIsLoading(true);

    try {
      // Tentukan URL PHP mana yang mau ditembak
      const apiUrl = mode === 'login' 
        ? 'http://localhost/api_toko_kaca/login.php' 
        : 'http://localhost/api_toko_kaca/register.php';

      // Siapkan data yang mau dikirim
      const payload = mode === 'login' 
        ? { email, password } 
        : { name, email, password };

      // Proses tembak ke API Database
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Jika sukses dari database, masuk ke aplikasi
        onLogin(result.role, result.name);
      } else {
        // Jika gagal (email salah / sudah terdaftar)
        setError(result.message);
      }
    } catch (err) {
      setError('Gagal terhubung ke Server/Database. Pastikan XAMPP menyala!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Tombol Kembali (Melayang) */}
      <button
        onClick={onCancel}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white rounded-full text-sm font-bold shadow-lg transition-all hover:-translate-x-1 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      {/* Ornamen Cahaya Latar Belakang */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-500/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* KARTU LOGIN GLASSMORPHISM */}
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Logo & Teks */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-xl shadow-black/10 mb-5">
            <img 
              src="/logo-kim.jpeg" 
              alt="Logo Karya Indah Mandiri" 
              className="w-16 h-16 object-contain"
              onError={(e) => { 
                e.currentTarget.src = 'https://ui-avatars.com/api/?name=K+I&background=0D8ABC&color=fff&size=128'; 
              }}
            />
          </div>
          
          <h2 className="text-3xl font-extrabold text-adaptive tracking-tight mb-2">
            {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
          </h2>
          <p className="text-xs text-sky-500 font-bold uppercase tracking-widest">
            Sistem Terhubung Database
          </p>
        </div>

        {/* Notifikasi Error Premium */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs p-3 rounded-xl mb-5 text-center font-bold animate-pulse backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {mode === 'register' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2">
              <label className="text-[11px] font-bold text-adaptive-muted uppercase tracking-wider ml-1">Nama Lengkap</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-adaptive placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all backdrop-blur-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-adaptive-muted uppercase tracking-wider ml-1">Email / Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email atau Username"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-adaptive placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-adaptive-muted uppercase tracking-wider">Password</label>
              {mode === 'login' && (
                <a href="#" className="text-[11px] font-bold text-sky-500 hover:text-sky-400 transition-colors">Lupa Password?</a>
              )}
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-adaptive placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Tombol Submit Utama */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-modern-primary w-full py-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                'Memproses Database...'
              ) : mode === 'login' ? (
                <><LogIn className="w-4 h-4" /> Sign In</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Buat Akun Sekarang</>
              )}
            </button>
          </div>
        </form>

        {/* Pembatas (Divider) */}
        <div className="mt-8 mb-6 flex items-center justify-center gap-4">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[10px] text-adaptive-muted font-bold uppercase tracking-widest">Atau</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* Tombol Ganti Mode */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-adaptive text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            {mode === 'login' ? 'Belum punya akun? Daftar gratis di sini' : 'Sudah punya akun? Masuk di sini'}
          </button>
        </div>

      </div>
    </div>
  );
}
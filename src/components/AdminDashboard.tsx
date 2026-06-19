import React, { useState } from 'react';
import { KatalogKaca } from '../types';
import { Edit2, Trash2, PlusCircle, AlertTriangle, LogIn, LogOut, CheckCircle, Image, List, Settings } from 'lucide-react';

interface AdminDashboardProps {
  katalog: KatalogKaca[];
  onAdd: (item: Omit<KatalogKaca, 'id'>) => void;
  onUpdate: (id: string, item: Partial<KatalogKaca>) => void;
  onDelete: (id: string) => void;
}

export default function AdminDashboard({ katalog, onAdd, onUpdate, onDelete }: AdminDashboardProps) {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // default true for convenience in prototype, editable
  const [usernameInput, setUsernameInput] = useState<string>('admin');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    jenis_kaca: '',
    ketebalan_mm: '',
    deskripsi: '',
    gambar_url: '',
    harga_per_m2: ''
  });

  // UI state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'admin' && (passwordInput === 'admin123' || passwordInput === '')) {
      setIsLoggedIn(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Kombinasi Username & Password Anda Salah! (Petunjuk: admin / admin123)');
    }
  };

  const handleEditClick = (item: KatalogKaca) => {
    setEditingId(item.id);
    setFormState({
      jenis_kaca: item.jenis_kaca,
      ketebalan_mm: String(item.ketebalan_mm),
      deskripsi: item.deskripsi,
      gambar_url: item.gambar_url,
      harga_per_m2: String(item.harga_per_m2)
    });
    // Scroll to form nicely
    document.getElementById('form-admin-kaca')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { jenis_kaca, ketebalan_mm, deskripsi, gambar_url, harga_per_m2 } = formState;

    if (!jenis_kaca || !ketebalan_mm || !harga_per_m2) {
      setErrorMsg('Semua kolom dengan bintang (*) wajib diisi!');
      return;
    }

    const payload = {
      jenis_kaca,
      ketebalan_mm: parseInt(ketebalan_mm) || 2,
      deskripsi,
      gambar_url: gambar_url || 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800',
      harga_per_m2: parseFloat(harga_per_m2) || 0
    };

    if (editingId) {
      onUpdate(editingId, payload);
      setSuccessMsg(`Berhasil memperbarui katalog Kaca: "${jenis_kaca}"`);
      setEditingId(null);
    } else {
      onAdd(payload);
      setSuccessMsg(`Berhasil menambahkan Kaca baru: "${jenis_kaca}"`);
    }

    // Reset Form
    setFormState({
      jenis_kaca: '',
      ketebalan_mm: '',
      deskripsi: '',
      gambar_url: '',
      harga_per_m2: ''
    });

    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${name}" dari katalog?`)) {
      onDelete(id);
      setSuccessMsg(`Berhasil menghapus item dari katalog.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      if (editingId === id) {
        setEditingId(null);
        setFormState({ jenis_kaca: '', ketebalan_mm: '', deskripsi: '', gambar_url: '', harga_per_m2: '' });
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState({ jenis_kaca: '', ketebalan_mm: '', deskripsi: '', gambar_url: '', harga_per_m2: '' });
  };

  // Login view if not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12" id="login-admin-view">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center space-y-3 mb-8">
            <span className="text-4xl">🔐</span>
            <h2 className="text-2xl font-bold text-slate-900">Admin Login Dashboard</h2>
            <p className="text-slate-500 text-xs">Untuk mengelola katalog kaca digital Karya Indah Mandiri.</p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs mb-6 flex gap-2 items-center" id="lbl-error-login">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Username Admin*</label>
              <input 
                type="text" 
                id="input-username"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="Contoh: admin"
                className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none placeholder-slate-300 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Password*</label>
              <input 
                type="password" 
                id="input-password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Masukkan Password (admin123)"
                className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none placeholder-slate-300 font-medium"
              />
              <p className="text-[10px] text-slate-400 mt-1">Kosongkan password atau ketik <b>admin123</b> untuk masuk langsung.</p>
            </div>

            <button 
              type="submit"
              id="btn-submit-login"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-sm shadow-sky-500/10 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button 
              type="button" 
              onClick={() => { setIsLoggedIn(true); setErrorMsg(null); }}
              className="text-xs text-sky-600 hover:text-sky-700 font-bold"
            >
              Demo Masuk Instan &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="admin-main-dashboard">
      {/* Admin Dashboard header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Dashboard Kontrol Katalog</h2>
            <span className="bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-sky-200">ADMIN MODE</span>
          </div>
          <p className="text-slate-500 text-xs mt-1">Gunakan panel ini untuk menambah, merubah, dan menghapus kaca di katalog utama.</p>
        </div>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs px-4 py-2 rounded-xl transition border border-slate-200 flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar (Logout)
        </button>
      </div>

      {successMsg && (
        <div id="alert-success" className="bg-lime-50 border border-lime-200 text-lime-850 p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-pulse">
          <CheckCircle className="w-5 h-5 text-lime-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT FORM (4 column) */}
        <section className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit space-y-6" id="form-admin-kaca">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <PlusCircle className="w-4 h-4 text-sky-600" />
              {editingId ? 'Edit Data Kaca' : 'Tambah Katalog Baru'}
            </h3>
            {editingId && (
              <button 
                onClick={resetForm}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold"
              >
                Batal Edit
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama / Jenis Kaca*</label>
              <input 
                type="text"
                id="form-jenis-kaca"
                required
                placeholder="Contoh: Kaca Tempered Tinted"
                value={formState.jenis_kaca}
                onChange={e => setFormState(prev => ({ ...prev, jenis_kaca: e.target.value }))}
                className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none font-medium placeholder-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tebal (mm)*</label>
                <input 
                  type="number"
                  id="form-tebal"
                  required
                  min="1"
                  placeholder="Contoh: 8"
                  value={formState.ketebalan_mm}
                  onChange={e => setFormState(prev => ({ ...prev, ketebalan_mm: e.target.value }))}
                  className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none font-medium placeholder-slate-300 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Harga / m² (Rp)*</label>
                <input 
                  type="number"
                  id="form-harga"
                  required
                  min="0"
                  placeholder="Contoh: 320000"
                  value={formState.harga_per_m2}
                  onChange={e => setFormState(prev => ({ ...prev, harga_per_m2: e.target.value }))}
                  className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none font-medium placeholder-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Link Gambar URL</label>
              <input 
                type="url"
                id="form-gambar-url"
                placeholder="https://images.unsplash.com..."
                value={formState.gambar_url}
                onChange={e => setFormState(prev => ({ ...prev, gambar_url: e.target.value }))}
                className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none font-medium placeholder-slate-300"
              />
              <p className="text-[9px] text-slate-400 mt-1">Kosongkan untuk menggunakan gambar generic toko secara otomatis.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keterangan / Deskripsi</label>
              <textarea 
                id="form-deskripsi"
                rows={4}
                placeholder="Tulis spesifikasi ringkas, keunggulan, & kegunaan kaca..."
                value={formState.deskripsi}
                onChange={e => setFormState(prev => ({ ...prev, deskripsi: e.target.value }))}
                className="w-full text-xs border border-slate-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none font-medium placeholder-slate-300 leading-relaxed"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="submit"
                id="btn-save-katalog"
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm hover:shadow transition"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah ke Katalog'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-200 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LIST TABLE (8 column) */}
        <section className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <List className="w-4 h-4 text-sky-600" />
              Katalog Terdaftar ({katalog.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-slate-700 text-xs text-left border-collapse" id="table-admin-katalog">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-16">Preview</th>
                  <th className="py-3 px-4">Info Produk</th>
                  <th className="py-3 px-4 text-right">Harga / m²</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {katalog.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-400">
                      Belum ada kaca. Gunakan form di sebelah kiri untuk menambahkannya!
                    </td>
                  </tr>
                ) : (
                  katalog.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors" id={`row-${item.id}`}>
                      <td className="py-3 px-4">
                        <div className="w-12 h-10 rounded overflow-hidden shadow-sm bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <img 
                            src={item.gambar_url || 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800'} 
                            alt={item.jenis_kaca} 
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800'; }}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.jenis_kaca}</div>
                        <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>Ketebalan:</span>
                          <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded font-mono text-[10px]">
                            {item.ketebalan_mm} mm
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-sky-700 text-sm">
                        Rp {item.harga_per_m2.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex gap-1.5">
                          <button
                            type="button"
                            id={`btn-edit-${item.id}`}
                            onClick={() => handleEditClick(item)}
                            className="bg-sky-50 text-sky-600 hover:bg-sky-100 p-2 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            id={`btn-del-${item.id}`}
                            onClick={() => handleDeleteClick(item.id, item.jenis_kaca)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 p-2 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

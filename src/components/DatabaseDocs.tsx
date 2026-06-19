import React from 'react';
import { Database, Table as TableIcon, Key, FileText, ArrowRight } from 'lucide-react';

export default function DatabaseDocs() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Dokumen */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-bl-full opacity-60 pointer-events-none" />
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="bg-sky-100 text-sky-600 p-3 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Rancangan Database & Tabel</h2>
            <p className="text-sm text-slate-500 mt-1">
              Dokumentasi struktur relasional untuk sistem informasi Toko Kaca Karya Indah Mandiri.
            </p>
          </div>
        </div>
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-xl mt-4 text-sm text-slate-700 relative z-10 leading-relaxed">
          <strong>Penjelasan Umum Sistem:</strong> Database ini dinamakan <code>db_karya_indah_mandiri</code>. Database dirancang menggunakan pendekatan relasional (RDBMS) untuk mengakomodasi alur bisnis pemesanan kaca kustom. Terdiri dari 4 tabel utama yang saling berelasi untuk memisahkan entitas Pengguna, Katalog Master, dan Transaksi/RAB secara terstruktur.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TABEL 1: USERS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold">
              <TableIcon className="w-5 h-5 text-sky-400" />
              tb_users
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase tracking-wider font-bold">Master Akun</span>
          </div>
          <div className="p-6 flex-1">
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              <strong>Penjelasan:</strong> Tabel ini berfungsi untuk menyimpan kredensial autentikasi pengguna. Terdapat pemisahan hak akses (Role) antara Administrator toko dan Pelanggan biasa (Guest/User).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-2 font-bold">Nama Kolom</th>
                    <th className="py-2 font-bold">Tipe Data</th>
                    <th className="py-2 font-bold">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-medium">
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 flex items-center gap-1.5"><Key className="w-3 h-3 text-amber-500" /> id_user</td>
                    <td className="py-2.5 text-sky-600 font-mono">INT(11)</td>
                    <td className="py-2.5">Primary Key, Auto Increment</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">nama_lengkap</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(100)</td>
                    <td className="py-2.5">Nama pengguna/pelanggan</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">email</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(100)</td>
                    <td className="py-2.5">Email (Unique) untuk login</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">password</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(255)</td>
                    <td className="py-2.5">Password (Hashed)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">role</td>
                    <td className="py-2.5 text-sky-600 font-mono">ENUM</td>
                    <td className="py-2.5">Nilai: 'admin' atau 'user'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TABEL 2: KATALOG */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold">
              <TableIcon className="w-5 h-5 text-emerald-400" />
              tb_katalog
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase tracking-wider font-bold">Master Produk</span>
          </div>
          <div className="p-6 flex-1">
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              <strong>Penjelasan:</strong> Tabel master yang menyimpan seluruh jenis kaca yang dijual. Dikelola sepenuhnya oleh Admin melalui dashboard CRUD. Harga disimpan per meter persegi (m²) sebagai dasar kalkulasi.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-2 font-bold">Nama Kolom</th>
                    <th className="py-2 font-bold">Tipe Data</th>
                    <th className="py-2 font-bold">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-medium">
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 flex items-center gap-1.5"><Key className="w-3 h-3 text-amber-500" /> id_kaca</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(50)</td>
                    <td className="py-2.5">Primary Key (Timestamp ID)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">jenis_kaca</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(100)</td>
                    <td className="py-2.5">Nama/Jenis kaca</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">ketebalan_mm</td>
                    <td className="py-2.5 text-sky-600 font-mono">INT(5)</td>
                    <td className="py-2.5">Tebal kaca dalam milimeter</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">harga_per_m2</td>
                    <td className="py-2.5 text-sky-600 font-mono">DECIMAL(10,2)</td>
                    <td className="py-2.5">Harga patokan per meter persegi</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">deskripsi</td>
                    <td className="py-2.5 text-sky-600 font-mono">TEXT</td>
                    <td className="py-2.5">Penjelasan spesifikasi produk</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">gambar_url</td>
                    <td className="py-2.5 text-sky-600 font-mono">TEXT</td>
                    <td className="py-2.5">Link gambar referensi kaca</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TABEL 3: PESANAN */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold">
              <TableIcon className="w-5 h-5 text-rose-400" />
              tb_pesanan
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase tracking-wider font-bold">Transaksi Header</span>
          </div>
          <div className="p-6 flex-1">
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              <strong>Penjelasan:</strong> Tabel *header* untuk merekam keranjang RAB pengguna secara keseluruhan. Berelasi dengan tabel <code className="text-slate-800">tb_users</code> untuk mengetahui milik siapa pesanan tersebut.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-2 font-bold">Nama Kolom</th>
                    <th className="py-2 font-bold">Tipe Data</th>
                    <th className="py-2 font-bold">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-medium">
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 flex items-center gap-1.5"><Key className="w-3 h-3 text-amber-500" /> id_pesanan</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(50)</td>
                    <td className="py-2.5">Primary Key (Kode Invoice)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 flex items-center gap-1.5"><Key className="w-3 h-3 text-slate-400" /> id_user</td>
                    <td className="py-2.5 text-sky-600 font-mono">INT(11)</td>
                    <td className="py-2.5">Foreign Key &rarr; tb_users</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">nama_proyek</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(150)</td>
                    <td className="py-2.5">Nama proyek (Opsional)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">total_harga</td>
                    <td className="py-2.5 text-sky-600 font-mono">DECIMAL(12,2)</td>
                    <td className="py-2.5">Grand Total seluruh RAB</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">tanggal_dibuat</td>
                    <td className="py-2.5 text-sky-600 font-mono">DATETIME</td>
                    <td className="py-2.5">Waktu pembuatan RAB</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">status_pesanan</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(50)</td>
                    <td className="py-2.5">Status: 'Draft', 'WhatsApp Sent'</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TABEL 4: DETAIL PESANAN */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold">
              <TableIcon className="w-5 h-5 text-amber-400" />
              tb_detail_pesanan
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded uppercase tracking-wider font-bold">Transaksi Detail</span>
          </div>
          <div className="p-6 flex-1">
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              <strong>Penjelasan:</strong> Tabel detail transaksi. Satu pesanan dapat memiliki banyak potongan kaca (One-to-Many). Di sini disimpan spesifikasi khusus kustomisasi pelanggan. Berelasi dengan <code className="text-slate-800">tb_pesanan</code> dan <code className="text-slate-800">tb_katalog</code>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-2 font-bold">Nama Kolom</th>
                    <th className="py-2 font-bold">Tipe Data</th>
                    <th className="py-2 font-bold">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 font-medium">
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 flex items-center gap-1.5"><Key className="w-3 h-3 text-amber-500" /> id_detail</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(50)</td>
                    <td className="py-2.5">Primary Key</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 flex items-center gap-1.5"><Key className="w-3 h-3 text-slate-400" /> id_pesanan</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(50)</td>
                    <td className="py-2.5">Foreign Key &rarr; tb_pesanan</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5 flex items-center gap-1.5"><Key className="w-3 h-3 text-slate-400" /> id_kaca</td>
                    <td className="py-2.5 text-sky-600 font-mono">VARCHAR(50)</td>
                    <td className="py-2.5">Foreign Key &rarr; tb_katalog</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">panjang_cm</td>
                    <td className="py-2.5 text-sky-600 font-mono">DECIMAL(6,2)</td>
                    <td className="py-2.5">Ukuran potong panjang</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">lebar_cm</td>
                    <td className="py-2.5 text-sky-600 font-mono">DECIMAL(6,2)</td>
                    <td className="py-2.5">Ukuran potong lebar</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">jenis_gosok</td>
                    <td className="py-2.5 text-sky-600 font-mono">ENUM</td>
                    <td className="py-2.5">'none', 'halus', 'bevel'</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">jml_lubang_bor</td>
                    <td className="py-2.5 text-sky-600 font-mono">INT(3)</td>
                    <td className="py-2.5">Banyaknya lubang engsel</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2.5">is_tempered</td>
                    <td className="py-2.5 text-sky-600 font-mono">BOOLEAN</td>
                    <td className="py-2.5">1: Ya (Upgrade), 0: Tidak</td>
                  </tr>
                  <tr>
                    <td className="py-2.5">subtotal_harga</td>
                    <td className="py-2.5 text-sky-600 font-mono">DECIMAL(12,2)</td>
                    <td className="py-2.5">Harga kaca + biaya jasa proses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
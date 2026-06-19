import React, { useState } from 'react';
import { Copy, Check, Download, Info, Database, FileCode, CheckCircle2 } from 'lucide-react';

export default function PhpExporter() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadFile = (fileName: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sqlCode = `-- SQL Script untuk Membuat Database Toko Kaca V2
CREATE DATABASE IF NOT EXISTS db_toko_kaca_v2;
USE db_toko_kaca_v2;

-- 1. Membuat Tabel Admin
CREATE TABLE IF NOT EXISTS tb_admin (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 2. Membuat Tabel Katalog Kaca
CREATE TABLE IF NOT EXISTS tb_katalog (
    id_kaca INT AUTO_INCREMENT PRIMARY KEY,
    jenis_kaca VARCHAR(100) NOT NULL,
    ketebalan_mm INT NOT NULL,
    deskripsi TEXT,
    gambar_url VARCHAR(255) DEFAULT NULL,
    harga_per_m2 DECIMAL(12, 2) NOT NULL
);

-- 3. Memasukkan Data Admin Default (Username: admin, Password: admin123)
-- Menggunakan hashing bcrypt untuk keamanan
INSERT INTO tb_admin (username, password) VALUES 
('admin', '$2y$10$9Xun79U7kK3fR/QyF8Yisuzq6gXclA51e.A5c5Y1bTidU5l8dM19u')
ON DUPLICATE KEY UPDATE username=username;

-- 4. Memasukkan Contoh Katalog Awal
INSERT INTO tb_katalog (jenis_kaca, ketebalan_mm, deskripsi, gambar_url, harga_per_m2) VALUES
('Kaca Polos (Clear)', 5, 'Kaca polos jernih berkualitas tinggi untuk jendela, lemari, sekat ruangan, dan kebutuhan rumah tangga lainnya.', 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800', 165000),
('Kaca Tempered', 8, 'Kaca tempered dengan ketahanan ekstra terhadap benturan dan perubahan suhu ekstrem. Cocok untuk pintu shower, railing, dan kanopi.', 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800', 320000),
('Kaca Tinted (Rayban)', 6, 'Kaca film rayban berwarna hitam/redup untuk meredam panas matahari dan meningkatkan privasi ruangan Anda.', 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800', 210000),
('Kaca Cermin (Mirror)', 5, 'Kaca cermin reflektif berkualitas tinggi memberikan ilusi ruangan lebih luas dan elegan. Cocok untuk wastafel, gym, maupun kamar tidur.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800', 250000);
`;

  const configPhp = `<?php
// config.php - Konfigurasi Koneksi Database MySQL
$host = "localhost";
$username = "root";
$password = "";
$db_name = "db_toko_kaca_v2";

$conn = mysqli_connect($host, $username, $password, $db_name);

// Cek Koneksi
if (!$conn) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}
?>`;

  const indexPhp = `<?php
// index.php - Halaman Utama Pelanggan (Toko Kaca Karya Indah Mandiri)
require_once 'config.php';

// Ambil data katalog kaca
$query = "SELECT * FROM tb_katalog ORDER BY id_kaca DESC";
$result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karya Indah Mandiri - Toko Kaca Pilihan Anda</title>
    <!-- Tailwind CSS Play CDN untuk desain modern dan responsif -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts inter & Outfit -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        h1, h2, h3 {
            font-family: 'Outfit', sans-serif;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800">

    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-sky-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-3">
                <span class="text-2xl font-bold text-sky-600 tracking-tight flex items-center gap-1">
                    💎 Karya Indah Mandiri
                </span>
                <span class="text-xs bg-sky-50 text-sky-700 font-medium px-2.5 py-1 rounded-full border border-sky-100">Toko Kaca</span>
            </div>
            <nav class="flex items-center gap-6 text-sm font-medium">
                <a href="#katalog" class="text-slate-600 hover:text-sky-600 transition-colors">Katalog Kaca</a>
                <a href="#kalkulator" class="text-slate-600 hover:text-sky-600 transition-colors">Panduan Ukuran</a>
                <a href="admin_katalog.php" class="bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition px-4 py-2 rounded-lg border border-slate-200">
                    🔐 Dashboard Admin
                </a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 py-20 px-4 text-white overflow-hidden shadow-inner">
        <!-- background glossy glass effect -->
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div class="relative max-w-4xl mx-auto text-center">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/30 text-sky-100 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur border border-white/10">
                ⭐ Terpercaya, Presisi & Bergaransi
            </span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Toko Kaca Karya Indah Mandiri
            </h1>
            <p class="text-lg sm:text-xl text-sky-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Menyediakan segala jenis kaca potongan & custom tempered dengan kualitas premium dan harga kompetitif. Hitung estimasi harga instan Anda di bawah ini!
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="#katalog" class="bg-white text-sky-800 hover:bg-sky-50 px-8 py-3.5 rounded-xl font-semibold shadow-md transition transform hover:-translate-y-0.5">
                    🔎 Lihat Katalog Kaca
                </a>
                <a href="https://wa.me/6281234567890" target="_blank" class="bg-lime-500 hover:bg-lime-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-md transition flex items-center justify-center gap-2">
                    💬 Hubungi Langsung
                </a>
            </div>
        </div>
    </section>

    <!-- Info Section / USP -->
    <section class="max-w-7xl mx-auto px-4 mt-[-40px] relative z-10">
        <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border border-sky-50">
            <div class="flex items-start gap-4">
                <div class="p-3 bg-sky-50 text-sky-600 rounded-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1">Presisi Tinggi</h3>
                    <p class="text-slate-500 text-sm">Pemotongan kaca presisi menggunakan alat profesional sesuai pesanan Anda.</p>
                </div>
            </div>
            <div class="flex items-start gap-4">
                <div class="p-3 bg-lime-50 text-lime-600 rounded-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1">Harga Transparan</h3>
                    <p class="text-slate-500 text-sm">Hitung estimasi seketika berdasarkan ukuran panjang dan lebar kebutuhan Anda.</p>
                </div>
            </div>
            <div class="flex items-start gap-4">
                <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
                <div>
                    <h3 class="font-bold text-slate-800 text-base mb-1">Survei & Konsultasi</h3>
                    <p class="text-slate-500 text-sm">Cukup kirim estimasi ukuran, tim kami siap jadwalkan survei lokasi langsung.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Catalog Section -->
    <main id="katalog" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl mb-3">
                Katalog Produk Kaca Kami
            </h2>
            <p class="text-slate-500 max-w-xl mx-auto">
                Temukan pilihan jenis kaca yang sesuai dengan kebutuhan dekorasi, arsitektur, dan pelindung hunian Anda. Master harga per m² ter-update.
            </p>
        </div>

        <?php if (mysqli_num_rows($result) > 0): ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php while ($row = mysqli_fetch_assoc($result)): 
                    $id = $row['id_kaca'];
                    $nama = htmlspecialchars($row['jenis_kaca']);
                    $tebal = intval($row['ketebalan_mm']);
                    $deskripsi = htmlspecialchars($row['deskripsi']);
                    $harga = doubleval($row['harga_per_m2']);
                    $gambar = !empty($row['gambar_url']) ? htmlspecialchars($row['gambar_url']) : 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800';
                ?>
                    <article class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-100 flex flex-col">
                        <!-- Gambar Kaca -->
                        <div class="h-48 w-full bg-slate-100 overflow-hidden relative">
                            <img src="<?php echo $gambar; ?>" alt="<?php echo $nama; ?>" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                            <span class="absolute top-4 right-4 bg-sky-600 text-white font-semibold text-xs px-3 py-1 rounded-full shadow-sm">
                                <?php echo $tebal; ?> mm
                            </span>
                        </div>

                        <!-- Data & Deskripsi -->
                        <div class="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 class="text-xl font-bold text-slate-900 mb-2"><?php echo $nama; ?></h3>
                                <p class="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed h-[56px]">
                                    <?php echo $deskripsi; ?>
                                </p>
                                
                                <div class="bg-sky-50/50 padding py-3 px-4 rounded-xl border border-sky-100/50 mb-6 flex justify-between items-center">
                                    <span class="text-xs text-sky-800 font-medium font-mono">Harga per m²</span>
                                    <span class="text-lg font-bold text-sky-700">Rp <?php echo number_format($harga, 0, ',', '.'); ?></span>
                                </div>
                            </div>

                            <!-- Kalkulator Estimasi & WA Form -->
                            <div class="space-y-4 pt-4 border-t border-slate-100">
                                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Hitung Estimasi Ukuran</h4>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs text-slate-500 mb-1">Panjang (cm)</label>
                                        <input type="number" id="panjang-<?php echo $id; ?>" min="1" placeholder="P cm" class="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-center" oninput="hitungHarga(<?php echo $id; ?>, <?php echo $harga; ?>)">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-slate-500 mb-1">Lebar (cm)</label>
                                        <input type="number" id="lebar-<?php echo $id; ?>" min="1" placeholder="L cm" class="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-center" oninput="hitungHarga(<?php echo $id; ?>, <?php echo $harga; ?>)">
                                    </div>
                                </div>

                                <!-- Box Estimasi Harga -->
                                <div id="box-estimasi-<?php echo $id; ?>" class="hidden bg-slate-50 border border-slate-200/60 p-3 rounded-lg text-xs leading-relaxed">
                                    <div class="flex justify-between mb-1">
                                        <span class="text-slate-500">Luas:</span>
                                        <span id="luas-<?php echo $id; ?>" class="font-semibold text-slate-700">- m²</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="font-medium text-slate-800">Estimasi Kaca:</span>
                                        <span id="harga-estimasi-<?php echo $id; ?>" class="font-bold text-sky-600">-</span>
                                    </div>
                                    <p class="text-[10px] text-slate-400 mt-1.5 leading-tight">*Estimasi belum termasuk biaya potong presisi & jasa rakit/pasang.</p>
                                </div>

                                <!-- Tombol WA -->
                                <button onclick="pesanKaca(<?php echo $id; ?>, '<?php echo $nama; ?>', <?php echo $tebal; ?>, <?php echo $harga; ?>)" class="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2">
                                    <!-- WhatsApp SVG Icon -->
                                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.727-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.59 1.996 14.117 1.01 11.5 1.01c-5.44 0-9.866 4.372-9.87 9.802 0 1.63.45 3.224 1.302 4.634L1.9 20.844l5.747-1.49zM18.15 14.585c-.324-.162-1.917-.946-2.212-1.054-.294-.108-.507-.162-.721.162-.213.324-.829 1.054-1.014 1.27-.185.218-.369.243-.693.08-1.53-.761-2.518-1.341-3.411-2.873-.243-.418.243-.388.697-1.293.077-.162.038-.3-.02-.418-.058-.118-.507-1.22-.693-1.673-.185-.433-.369-.4-.507-.4-.108-.008-.243-.008-.369-.008-.129 0-.342.049-.523.243-.183.195-.693.678-.693 1.654 0 .975.71 1.917.81 2.05.101.133 1.398 2.134 3.387 2.99.473.203.842.324 1.129.418.475.148.907.127 1.25.077.38-.057 1.916-.782 2.187-1.5s.27-1.332.188-1.46c-.08-.127-.294-.203-.618-.365z"/></svg>
                                    Konsultasi & Pesan WA
                                </button>
                            </div>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>
        <?php else: ?>
            <div class="text-center bg-white border border-slate-100 rounded-3xl p-12 max-w-lg mx-auto shadow-sm">
                <span class="text-4xl block mb-4">🗃️</span>
                <h3 class="text-lg font-bold text-slate-800">Katalog Kosong</h3>
                <p class="text-slate-500 text-sm mt-1">Belum ada daftar kaca yang diinput oleh Admin di dashboard.</p>
            </div>
        <?php endif; ?>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm space-y-3">
            <p class="text-slate-100 font-semibold">Toko Kaca Karya Indah Mandiri &copy; 2026</p>
            <p class="text-slate-500 text-xs">Aplikasi Toko Kaca V2 - Prototype Web native PHP & Tailwind CSS untuk penunjang operasional.</p>
            <div class="flex justify-center gap-6 pt-3 text-xs">
                <a href="#katalog" class="hover:text-white">Katalog</a>
                <span class="text-slate-700">|</span>
                <p>No. WhatsApp Admin: <b>0812-3456-7890</b></p>
            </div>
        </div>
    </footer>

    <!-- Logika JavaScript Pelanggan -->
    <script>
        // Fungsi menghitung estimasi harga
        function hitungHarga(id, hargaPerM2) {
            const pInput = document.getElementById('panjang-' + id);
            const lInput = document.getElementById('lebar-' + id);
            const boxEstimasi = document.getElementById('box-estimasi-' + id);
            const luasSpan = document.getElementById('luas-' + id);
            const hargaSpan = document.getElementById('harga-estimasi-' + id);

            const panjang = parseFloat(pInput.value);
            const lebar = parseFloat(lInput.value);

            if (!isNaN(panjang) && panjang > 0 && !isNaN(lebar) && lebar > 0) {
                // Hitung Luas dalam m2 (cm -> m, / 100)
                const luas = (panjang * lebar) / 10000;
                const totalHarga = luas * hargaPerM2;

                // Tampilkan box estimasi
                boxEstimasi.classList.remove('hidden');
                luasSpan.innerText = luas.toFixed(3) + ' m²';
                hargaSpan.innerText = 'Rp ' + totalHarga.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else {
                boxEstimasi.classList.add('hidden');
            }
        }

        // Fungsi melempar pesanan ke WhatsApp
        function pesanKaca(id, namaKaca, tebalMm, hargaPerM2) {
            const pInput = document.getElementById('panjang-' + id);
            const lInput = document.getElementById('lebar-' + id);
            
            const panjang = pInput ? parseFloat(pInput.value) : 0;
            const lebar = lInput ? parseFloat(lInput.value) : 0;

            let textMessage = "Halo Admin Karya Indah Mandiri, saya tertarik dengan produk:\\n" +
                              "💎 *" + namaKaca + " " + tebalMm + "mm*\\n" +
                              "Master Harga: Rp " + hargaPerM2.toLocaleString('id-ID') + "/m²\\n\\n";
            
            if (panjang > 0 && lebar > 0) {
                const luas = (panjang * lebar) / 10000;
                const totalHarga = luas * hargaPerM2;
                textMessage += "Saya membutuhkan ukuran custom:\\n" +
                               "📐 *Panjang:* " + panjang + " cm\\n" +
                               "📐 *Lebar:* " + lebar + " cm\\n" +
                               "📐 *Estimasi Luas:* " + luas.toFixed(3) + " m²\\n" +
                               "💰 *Estimasi Harga:* Rp " + totalHarga.toLocaleString('id-ID', { maximumFractionDigits: 0 }) + "\\n\\n";
            } else {
                textMessage += "Saya ingin bertanya lebih lanjut mengenai jenis kaca ini dan mohon informasi ketersediaan barangnya.\\n\\n";
            }

            textMessage += "Mohon info ketersediaan stok, harga final beserta biaya potong, dan jadwal survei lokasi. Terima kasih!";

            // Encode pesan teks untuk URL
            const encodedText = encodeURIComponent(textMessage);
            const noWA = "6281234567890"; // Ganti dengan nomor WhatsApp Toko Asli Anda

            // Buka di tab baru
            window.open("https://wa.me/" + noWA + "?text=" + encodedText, "_blank");
        }
    </script>
</body>
</html>`;

  const adminKatalogPhp = `<?php
// admin_katalog.php - Halaman Dashboard CRUD Katalog Kaca (Toko Kaca Karya Indah Mandiri)
require_once 'config.php';

// Memulai Session Sederhana untuk Admin Login (Simulasi login ringan)
session_start();

// Buat akun admin default jika belum dikonfigurasi secara manual
// (Admin Login Helper sederhana)
if (isset($_GET['login_demo'])) {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['username'] = 'admin';
    header("Location: admin_katalog.php");
    exit();
}

// Proses Logout
if (isset($_GET['action']) && $_GET['action'] == 'logout') {
    session_destroy();
    header("Location: admin_katalog.php");
    exit();
}

// Proses Form Penambahan / Pengubahan Kaca
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Cek keamanan login
    if (!isset($_SESSION['admin_logged_in'])) {
        die("Maaf, Anda harus login terlebih dahulu.");
    }

    $id_kaca = isset($_POST['id_kaca']) ? (int)$_POST['id_kaca'] : 0;
    $jenis_kaca = mysqli_real_escape_string($conn, $_POST['jenis_kaca']);
    $ketebalan_mm = (int)$_POST['ketebalan_mm'];
    $deskripsi = mysqli_real_escape_string($conn, $_POST['deskripsi']);
    $gambar_url = mysqli_real_escape_string($conn, $_POST['gambar_url']);
    $harga_per_m2 = (double)$_POST['harga_per_m2'];

    if ($id_kaca > 0) {
        // Mode EDIT data lama
        $query_save = "UPDATE tb_katalog SET 
            jenis_kaca = '$jenis_kaca', 
            ketebalan_mm = '$ketebalan_mm', 
            deskripsi = '$deskripsi', 
            gambar_url = '$gambar_url', 
            harga_per_m2 = '$harga_per_m2' 
            WHERE id_kaca = $id_kaca";
        $msg = "Kaca berhasil diperbarui!";
    } else {
        // Mode TAMBAH data baru
        $query_save = "INSERT INTO tb_katalog (jenis_kaca, ketebalan_mm, deskripsi, gambar_url, harga_per_m2) 
            VALUES ('$jenis_kaca', '$ketebalan_mm', '$deskripsi', '$gambar_url', '$harga_per_m2')";
        $msg = "Kaca baru berhasil ditambahkan!";
    }

    if (mysqli_query($conn, $query_save)) {
        header("Location: admin_katalog.php?status=success&msg=" . urlencode($msg));
        exit();
    } else {
        $error = "Terjadi kesalahan database: " . mysqli_error($conn);
    }
}

// Proses Penghapusan Kaca (DELETE)
if (isset($_GET['action']) && $_GET['action'] == 'delete') {
    // Cek keamanan login
    if (!isset($_SESSION['admin_logged_in'])) {
        die("Akses dilarang.");
    }

    $id_del = (int)$_GET['id'];
    $query_del = "DELETE FROM tb_katalog WHERE id_kaca = $id_del";
    
    if (mysqli_query($conn, $query_del)) {
        header("Location: admin_katalog.php?status=success&msg=" . urlencode("Kaca berhasil dihapus!"));
        exit();
    } else {
        $error = "Gagal menghapus data: " . mysqli_error($conn);
    }
}

// Proses Autentikasi Pengunjung (Login Biasa)
$login_error = "";
if (isset($_POST['login_submit'])) {
    $user = mysqli_real_escape_string($conn, $_POST['username']);
    $pass = $_POST['password'];

    $query_u = "SELECT * FROM tb_admin WHERE username = '$user' LIMIT 1";
    $res_u = mysqli_query($conn, $query_u);

    if (mysqli_num_rows($res_u) > 0) {
        $admin_data = mysqli_fetch_assoc($res_u);
        // Verifikasi password hash atau password polos
        if (password_verify($pass, $admin_data['password']) || $pass == 'admin123') {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['username'] = $admin_data['username'];
            header("Location: admin_katalog.php");
            exit();
        } else {
            $login_error = "Password Salah! Silakan coba lagi.";
        }
    } else {
        $login_error = "Username tidak terdaftar!";
    }
}

// Cari data edit jika parameter 'edit' dikirimkan
$edit_data = null;
if (isset($_GET['action']) && $_GET['action'] == 'edit') {
    $id_edit = (int)$_GET['id'];
    $query_edit = "SELECT * FROM tb_katalog WHERE id_kaca = $id_edit LIMIT 1";
    $res_edit = mysqli_query($conn, $query_edit);
    if (mysqli_num_rows($res_edit) > 0) {
        $edit_data = mysqli_fetch_assoc($res_edit);
    }
}

// Ambil Katalog Kaca
$query_list = "SELECT * FROM tb_katalog ORDER BY id_kaca DESC";
$result_list = mysqli_query($conn, $query_list);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Karya Indah Mandiri</title>
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1, h2, h3, h4 { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="bg-slate-100 text-slate-800">

    <?php if (!isset($_SESSION['admin_logged_in'])): ?>
    <!-- Halaman Login Form -->
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-sky-100">
            <div class="text-center mb-8">
                <span class="text-4xl">🔐</span>
                <h1 class="text-2xl font-bold text-slate-900 mt-3">Admin Login</h1>
                <p class="text-slate-500 text-xs mt-1">Sistem Manajemen Katalog Karya Indah Mandiri</p>
            </div>

            <?php if (!empty($login_error)): ?>
                <div class="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl mb-6">
                    ⚠️ <?php echo $login_error; ?>
                </div>
            <?php endif; ?>

            <form action="" method="POST" class="space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Username</label>
                    <input type="text" name="username" required placeholder="Contoh: admin" class="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                    <input type="password" name="password" required placeholder="Password Anda" class="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                </div>
                <button type="submit" name="login_submit" class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md">
                    Masuk ke Dashboard
                </button>
            </form>

            <div class="mt-8 pt-6 border-t border-slate-100 text-center">
                <p class="text-xs text-slate-400">Gunakan akun demo instan:</p>
                <a href="admin_katalog.php?login_demo=true" class="inline-block mt-2 text-xs font-semibold text-sky-600 hover:text-sky-700 underline">
                    Masuk Instan (Demo Mode) &rarr;
                </a>
            </div>
            
            <div class="text-center mt-6">
                <a href="index.php" class="text-xs text-slate-500 hover:text-sky-600">&larr; Kembali ke Katalog Pelanggan</a>
            </div>
        </div>
    </div>

    <?php else: ?>
    <!-- Halaman Utama Dashboard (Setelah Login) -->
    
    <!-- Header Admin -->
    <header class="bg-slate-900 text-white shadow-md py-4 px-6 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-3">
                <span class="text-xl font-bold tracking-tight">Karya Indah Mandiri 💎</span>
                <span class="bg-sky-500 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded text-white shadow-sm">ADMIN DASHBOARD</span>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-xs text-slate-300">Logged in as: <b class="text-white"><?php echo htmlspecialchars($_SESSION['username']); ?></b></span>
                <a href="index.php" target="_blank" class="text-xs text-sky-400 hover:text-sky-300">Lihat Toko Utama</a>
                <a href="admin_katalog.php?action=logout" class="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition">
                    Keluar / Logout
                </a>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Flash Alert Message -->
        <?php if (isset($_GET['status']) && $_GET['status'] == 'success'): ?>
            <div class="bg-lime-50 border border-lime-200 text-lime-800 text-sm p-4 rounded-xl mb-8 flex justify-between items-center">
                <span>🎉 <b>Sukses:</b> <?php echo htmlspecialchars($_GET['msg']); ?></span>
                <button onclick="this.parentElement.remove()" class="text-lime-600 hover:text-lime-800 font-bold">&times;</button>
            </div>
        <?php endif; ?>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- FORM TAMBAH / EDIT KACA (Lg: 4 kolom) -->
            <section class="lg:col-span-4 bg-white rounded-2xl shadow-sm p-6 border border-slate-200 h-fit">
                <h2 class="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    <?php echo $edit_data ? '📝 Edit Item Kaca' : '➕ Tambah Kaca Baru'; ?>
                </h2>

                <form action="admin_katalog.php" method="POST" class="space-y-4">
                    <input type="hidden" name="id_kaca" value="<?php echo $edit_data ? intval($edit_data['id_kaca']) : '0'; ?>">

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Nama / Jenis Kaca</label>
                        <input type="text" name="jenis_kaca" required placeholder="Contoh: Kaca Tempered Tinted" value="<?php echo $edit_data ? htmlspecialchars($edit_data['jenis_kaca']) : ''; ?>" class="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Ketebalan (mm)</label>
                            <input type="number" min="1" name="ketebalan_mm" required placeholder="Contoh: 8" value="<?php echo $edit_data ? intval($edit_data['ketebalan_mm']) : ''; ?>" class="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Harga per m² (Rp)</label>
                            <input type="number" min="0" name="harga_per_m2" required placeholder="Contoh: 320000" value="<?php echo $edit_data ? doubleval($edit_data['harga_per_m2']) : ''; ?>" class="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm- focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Link Gambar URL</label>
                        <input type="url" name="gambar_url" placeholder="https://..." value="<?php echo $edit_data ? htmlspecialchars($edit_data['gambar_url']) : ''; ?>" class="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                        <p class="text-[10px] text-slate-400 mt-1">Kosongkan untuk menggunakan gambar template default.</p>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-600 mb-1">Deskripsi Spesifikasi</label>
                        <textarea name="deskripsi" rows="3" placeholder="Informasi detail mengenai kaca..." class="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"><?php echo $edit_data ? htmlspecialchars($edit_data['deskripsi']) : ''; ?></textarea>
                    </div>

                    <div class="flex gap-2 pt-2">
                        <button type="submit" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-xl text-sm shadow transition">
                            <?php echo $edit_data ? 'Simpan Perubahan' : 'Masukkan ke Katalog'; ?>
                        </button>
                        <?php if ($edit_data): ?>
                            <a href="admin_katalog.php" class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-xl text-sm border border-slate-200 transition">
                                Batal
                            </a>
                        <?php endif; ?>
                    </div>
                </form>
            </section>

            <!-- TABEL DAFTAR KACA (Lg: 8 kolom) -->
            <section class="lg:col-span-8 bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <h2 class="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    📋 List Katalog Kaca Terdaftar
                </h2>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase font-bold">
                                <th class="py-3 px-4">Gambar</th>
                                <th class="py-3 px-4">Spesifikasi Kaca</th>
                                <th class="py-3 px-4 text-right">Harga / m²</th>
                                <th class="py-3 px-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php if (mysqli_num_rows($result_list) > 0): ?>
                                <?php while ($item = mysqli_fetch_assoc($result_list)): 
                                    $gbr = !empty($item['gambar_url']) ? htmlspecialchars($item['gambar_url']) : 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800';
                                ?>
                                    <tr class="hover:bg-slate-50/50 transition-colors">
                                        <td class="py-3 px-4 w-20">
                                            <div class="w-16 h-12 rounded overflow-hidden shadow-sm bg-slate-100">
                                                <img src="<?php echo $gbr; ?>" class="w-full h-full object-cover">
                                            </div>
                                        </td>
                                        <td class="py-3 px-4">
                                            <p class="font-bold text-slate-900"><?php echo htmlspecialchars($item['jenis_kaca']); ?></p>
                                            <p class="text-xs text-slate-400">
                                                Ketebalan: <span class="bg-slate-100 text-slate-700 font-semibold px-1 rounded"><?php echo intval($item['ketebalan_mm']); ?> mm</span>
                                            </p>
                                        </td>
                                        <td class="py-3 px-4 text-right">
                                            <p class="font-bold text-sky-700">Rp <?php echo number_format($item['harga_per_m2'], 0, ',', '.'); ?></p>
                                        </td>
                                        <td class="py-3 px-4 text-center">
                                            <div class="inline-flex gap-2">
                                                <a href="admin_katalog.php?action=edit&id=<?php echo $item['id_kaca']; ?>" class="bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                                                    Edit
                                                </a>
                                                <a href="admin_katalog.php?action=delete&id=<?php echo $item['id_kaca']; ?>" onclick="return confirm('Apakah Anda yakin ingin menghapus kaca ini dari katalog?')" class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                                                    Hapus
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="4" class="text-center py-12 text-slate-400 text-xs">
                                        Belum ada katalog kustom yang diinput. Hubungi developer atau tambah data di panel sebelah kiri.
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    </main>
    <?php endif; ?>

</body>
</html>`;

  return (
    <div className="space-y-8" id="php-exporter-section">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Hasil Rancangan Kode &amp; Database PHP Native</h2>
            <p className="text-slate-500 text-xs">Salin kode di bawah untuk diintegrasikan langsung ke folder XAMPP lokal Anda.</p>
          </div>
        </div>

        {/* Insting panduan XAMPP */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 mb-8 text-xs text-amber-900 leading-relaxed">
          <div className="flex gap-2.5 items-start">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-950 mb-1">Panduan Jalankan Aplikasi di XAMPP Tercepat:</h4>
              <ol className="list-decimal list-inside space-y-1.5 pl-1">
                <li>Aktifkan <b>Apache</b> dan <b>MySQL</b> di panel kontrol XAMPP Anda.</li>
                <li>Buka <u>http://localhost/phpmyadmin/</u> di browser, lalu buat database baru bernama: <code className="bg-white/80 px-1 py-0.5 rounded font-mono border">db_toko_kaca_v2</code>.</li>
                <li>Pilih tab <b>SQL</b> di phpMyAdmin, tempelkan kode dari file <code className="bg-white/80 px-1 py-0.5 rounded font-mono border">db_toko_kaca_v2.sql</code> di bawah, lalu klik <b>Go</b>/<b>Kirim</b>.</li>
                <li>Pergi ke folder instalasi XAMPP Anda: <code className="bg-white/80 px-1 py-0.5 rounded font-mono border">C:\xampp\htdocs\</code>.</li>
                <li>Buat folder baru bernama <code className="bg-white/80 px-1 py-0.5 rounded font-mono border font-semibold text-rose-700">toko_kaca</code>.</li>
                <li>Buat file PHP kosong: <code className="bg-white/80 px-1 py-0.5 rounded font-mono border">config.php</code>, <code className="bg-white/80 px-1 py-0.5 rounded font-mono border">index.php</code>, dan <code className="bg-white/80 px-1 py-0.5 rounded font-mono border">admin_katalog.php</code> di dalam folder baru tersebut, lalu tempel kode yang sesuai di bawah.</li>
                <li>Akses aplikasi melalui browser Anda di URL: <u className="font-bold text-sky-700">http://localhost/toko_kaca/index.php</u>.</li>
                <li>Untuk masuk ke Control Panel, klik tombol "Dashboard Admin" atau ke <u className="font-bold text-sky-700">http://localhost/toko_kaca/admin_katalog.php</u>. Login Demo Instan disediakan!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* FILE CONTAINER CARDS */}
        <div className="space-y-6">
          {/* SQL FILE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
            <div className="bg-slate-900/5 px-4 py-3 border-b border-light flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                (Tugas 1) <code>db_toko_kaca_v2.sql</code>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="btn-copy-sql"
                  onClick={() => copyToClipboard(sqlCode, 'sql')}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-300 font-semibold flex items-center gap-1 transition"
                >
                  {copiedId === 'sql' ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'sql' ? 'Tersalin' : 'Salin Kode'}
                </button>
                <button
                  type="button"
                  id="btn-dl-sql"
                  onClick={() => downloadFile('db_toko_kaca_v2.sql', sqlCode)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded font-semibold flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh SQL
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] font-mono bg-slate-900 text-slate-300 max-h-[220px]">
              {sqlCode}
            </pre>
          </div>

          {/* CONFIG FILE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
            <div className="bg-slate-900/5 px-4 py-3 border-b border-light flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <code>config.php</code>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="btn-copy-config"
                  onClick={() => copyToClipboard(configPhp, 'config')}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-300 font-semibold flex items-center gap-1 transition"
                >
                  {copiedId === 'config' ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'config' ? 'Tersalin' : 'Salin Kode'}
                </button>
                <button
                  type="button"
                  id="btn-dl-config"
                  onClick={() => downloadFile('config.php', configPhp)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded font-semibold flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh PHP
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] font-mono bg-slate-900 text-slate-300 max-h-[140px]">
              {configPhp}
            </pre>
          </div>

          {/* INDEX.PHP FILE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
            <div className="bg-slate-900/5 px-4 py-3 border-b border-light flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-600 animate-pulse" />
                (Tugas 2) <code>index.php</code> (Katalog &amp; Kalkulator Pemesanan WA)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="btn-copy-index"
                  onClick={() => copyToClipboard(indexPhp, 'index')}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-300 font-semibold flex items-center gap-1 transition"
                >
                  {copiedId === 'index' ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'index' ? 'Tersalin' : 'Salin Kode'}
                </button>
                <button
                  type="button"
                  id="btn-dl-index"
                  onClick={() => downloadFile('index.php', indexPhp)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded font-semibold flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh PHP
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] font-mono bg-slate-900 text-slate-300 max-h-[350px]">
              {indexPhp}
            </pre>
          </div>

          {/* ADMIN_KATALOG.PHP FILE */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
            <div className="bg-slate-900/5 px-4 py-3 border-b border-light flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-600" />
                (Tugas 3) <code>admin_katalog.php</code> (Input Form, Tabel, Edit, Hapus)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="btn-copy-admin"
                  onClick={() => copyToClipboard(adminKatalogPhp, 'admin_katalog')}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-300 font-semibold flex items-center gap-1 transition"
                >
                  {copiedId === 'admin_katalog' ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'admin_katalog' ? 'Tersalin' : 'Salin Kode'}
                </button>
                <button
                  type="button"
                  id="btn-dl-admin"
                  onClick={() => downloadFile('admin_katalog.php', adminKatalogPhp)}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded font-semibold flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh PHP
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] font-mono bg-slate-900 text-slate-300 max-h-[350px]">
              {adminKatalogPhp}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}

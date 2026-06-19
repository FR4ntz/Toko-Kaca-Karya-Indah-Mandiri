import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <-- TAMBAHAN BARU UNTUK MEMAKSA MODAL KE DEPAN LAYAR
import { KatalogKaca } from '../types';
import { 
  Info, Sparkles, Shield, Ruler, PhoneCall, HelpCircle, 
  AlertCircle, Bookmark, Trash2, Plus, Calculator, 
  ClipboardList, Scale, Check, RefreshCw, Calendar, 
  MapPin, User, ChevronDown, ChevronUp, Clock, Truck, 
  ChevronRight, CheckCircle2, Flame, Hammer, Eye, ShoppingCart,
  X, Download
} from 'lucide-react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UserCatalogProps {
  katalog: KatalogKaca[];
  isGuest?: boolean;
  onRequireAuth?: () => void;
  username?: string;
}

interface GlassConfig {
  panjang: string;
  lebar: string;
  gosokType: 'none' | 'halus' | 'bevel';
  lubangCount: number;
  temperedProcess: boolean;
}

interface SavedRABItem {
  id: string;
  glassId: string;
  jenis_kaca: string;
  ketebalan_mm: number;
  panjang: number;
  lebar: number;
  luasM2: number;
  kelilingM: number;
  gosokType: 'none' | 'halus' | 'bevel';
  lubangCount: number;
  temperedProcess: boolean;
  estimasiHarga: number;
  beratKg: number;
}

const PRESETS = [
  {
    name: "Cermin Wastafel Cantik",
    glassTypeKeyword: "cermin",
    panjang: "60",
    lebar: "80",
    gosokType: "bevel" as const,
    lubangCount: 0,
    temperedProcess: false,
    deskripsi: "Cermin hias premium 5mm dengan bevel mewah 2cm keliling."
  },
  {
    name: "Sekat Shower Kamar Mandi",
    glassTypeKeyword: "tempered",
    panjang: "90",
    lebar: "200",
    gosokType: "halus" as const,
    lubangCount: 2,
    temperedProcess: true,
    deskripsi: "Kaca tempered tebal aman, digosok mesin halus dengan 2 lubang engsel fitting."
  },
  {
    name: "Kaca Meja Makan (Table Top)",
    glassTypeKeyword: "polos",
    panjang: "80",
    lebar: "120",
    gosokType: "halus" as const,
    lubangCount: 0,
    temperedProcess: false,
    deskripsi: "Alas meja kaca bersih, ujung tumpul aman gosok mesin kilap."
  },
  {
    name: "Kaca Jendela Rayban",
    glassTypeKeyword: "rayban",
    panjang: "40",
    lebar: "60",
    gosokType: "none" as const,
    lubangCount: 0,
    temperedProcess: false,
    deskripsi: "Kaca rayban antipanas peredam silau matahari luar."
  }
];

const PORTFOLIO_ITEMS = [
  {
    title: "Shower Box Frameless Minimalis",
    category: "Sekat Shower",
    glassTypeKeyword: "tempered",
    panjang: "90",
    lebar: "190",
    gosokType: "halus" as const,
    lubangCount: 2,
    temperedProcess: true,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    deskripsi: "Hasil pemasangan kaca tempered 8mm polos untuk sekat kering kamar mandi.",
    location: "Kamar Mandi Utama, BSD City"
  },
  {
    title: "Cermin Dinding Bevel Diamond Luxury",
    category: "Cermin Hias",
    glassTypeKeyword: "cermin",
    panjang: "120",
    lebar: "200",
    gosokType: "bevel" as const,
    lubangCount: 0,
    temperedProcess: false,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
    deskripsi: "Seni penyusunan cermin bevel 5mm bermotif wajik / diamond elegan.",
    location: "Lobby Apartemen Kemang"
  },
  {
    title: "Partisi Kaca Kantor Frameless Office",
    category: "Partisi Ruangan",
    glassTypeKeyword: "polos",
    panjang: "150",
    lebar: "240",
    gosokType: "halus" as const,
    lubangCount: 0,
    temperedProcess: true,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    deskripsi: "Penyekat kaca kantor modern setinggi plafon menggunakan kaca 8mm tempered.",
    location: "Ruang Meeting, Sudirman Jakarta"
  },
  {
    title: "Replaced Table Top Dining Wood Table",
    category: "Alas Meja Kaca",
    glassTypeKeyword: "polos",
    panjang: "90",
    lebar: "160",
    gosokType: "halus" as const,
    lubangCount: 0,
    temperedProcess: false,
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800",
    deskripsi: "Alas kaca pelindung meja makan berukuran 90x160cm tebal 5mm.",
    location: "Ruang Makan, Pondok Indah"
  }
];

const FAQS = [
  {
    question: "Berapa lama proses pengerjaan potong kaca kustom?",
    answer: "Untuk pemotongan kaca polos (clear) dan cermin biasa, proses pengerjaan selesai dalam 1-2 hari kerja sejak pembayaran diterima. Sementara itu, untuk pemesanan kaca tempered membutuhkan waktu sekitar 7-10 hari kerja karena kaca harus melalui proses pemotongan kasar dan pengeboran terlebih dahulu baru dimasukkan ke dalam unit oven pembakaran tempered bertekanan tinggi."
  },
  {
    question: "Bagaimana cara pengiriman barang karena kaca rentan pecah?",
    answer: "Keamanan kaca Anda adalah prioritas utama kami. Karya Indah Mandiri memiliki armada mobil pick-up & truk khusus toko yang dimodifikasi dengan rak kayu penyangga (A-Frame) agar lembaran kaca tidak berbenturan. Kami mengirim pesanan langsung ke lokasi Anda di seluruh Jabodetabek."
  },
  {
    question: "Apakah tersedia jasa survei lokasi langsung dan pemasangan?",
    answer: "Sangat bersedia! Tim aplikator profesional kami siap datang ke rumah, apartemen, atau ruko Anda untuk melakukan pengukuran presisi (siku-siku, posisi engsel, keliling sekat) menggunakan laser meter, sekaligus melakukan pemasangan bergaransi rapi."
  },
  {
    question: "Berapa batas toleransi dari hasil pemotongan kaca?",
    answer: "Potongan kaca manual dan mesin kami memiliki tingkat akurasi tinggi dengan toleransi presisi minimal ±1mm hingga ±2mm. Kami sarankan Anda mengurangi ukuran sebanyak 2-3 milimeter dari ukuran bersih ruang/kusen agar kaca tidak terlalu sesak atau terhimpit saat dipasang."
  }
];

export default function UserCatalog({ katalog, isGuest, onRequireAuth, username }: UserCatalogProps) {
  const [configs, setConfigs] = useState<{ [id: string]: GlassConfig }>({});
  const [filterType, setFilterType] = useState<string>('semua');
  const [rabList, setRabList] = useState<SavedRABItem[]>([]);
  const [projectName, setProjectName] = useState<string>('Proyek Renovasi Rumah');
  const [openFaqs, setOpenFaqs] = useState<{ [index: number]: boolean }>({ 0: true });
  const [surveyForm, setSurveyForm] = useState({
    nama: '', whatsapp: '', alamat: '', proyekType: 'Shower Kamar Mandi',
    tanggalSurvei: '', deskripsi: '', butuhBantuanUkur: true
  });
  const [surveySubmitted, setSurveySubmitted] = useState<boolean>(false);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const [waLink, setWaLink] = useState('');
  const [currentInvoiceId, setCurrentInvoiceId] = useState('');

  useEffect(() => {
    const savedRab = localStorage.getItem('karya_indah_mandiri_rab');
    if (savedRab) {
      try { setRabList(JSON.parse(savedRab)); } catch (e) {}
    }
    const savedProj = localStorage.getItem('karya_indah_mandiri_projname');
    if (savedProj) setProjectName(savedProj);
  }, []);

  const saveRabList = (newList: SavedRABItem[]) => {
    setRabList(newList);
    localStorage.setItem('karya_indah_mandiri_rab', JSON.stringify(newList));
  };

  const handleProjNameChange = (name: string) => {
    setProjectName(name);
    localStorage.setItem('karya_indah_mandiri_projname', name);
  };

  const handleDimensionChange = (id: string, field: 'panjang' | 'lebar', value: string) => {
    if (value !== '' && (isNaN(Number(value)) || Number(value) < 0)) return;
    setConfigs(prev => {
      const current = prev[id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };
      return { ...prev, [id]: { ...current, [field]: value } };
    });
  };

  const handleGosokChange = (id: string, value: 'none' | 'halus' | 'bevel') => {
    setConfigs(prev => {
      const current = prev[id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };
      return { ...prev, [id]: { ...current, gosokType: value } };
    });
  };

  const handleLubangChange = (id: string, increment: number) => {
    setConfigs(prev => {
      const current = prev[id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };
      const nextCount = Math.max(0, current.lubangCount + increment);
      return { ...prev, [id]: { ...current, lubangCount: nextCount } };
    });
  };

  const handleTemperedToggle = (id: string) => {
    setConfigs(prev => {
      const current = prev[id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };
      return { ...prev, [id]: { ...current, temperedProcess: !current.temperedProcess } };
    });
  };

  const getCalculation = (item: KatalogKaca) => {
    const config = configs[item.id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };
    const p = parseFloat(config.panjang);
    const l = parseFloat(config.lebar);

    if (!isNaN(p) && p > 0 && !isNaN(l) && l > 0) {
      const luasM2 = (p * l) / 10000; 
      const kelilingM = (2 * (p + l)) / 100; 
      const glassPrice = luasM2 * item.harga_per_m2;
      const gosokPrice = config.gosokType === 'halus' ? kelilingM * 18000 : config.gosokType === 'bevel' ? kelilingM * 35000 : 0;
      const lubangPrice = config.lubangCount * 15000; 
      const isAlreadyTempered = item.jenis_kaca.toLowerCase().includes('tempered');
      const temperingPrice = (config.temperedProcess && !isAlreadyTempered) ? luasM2 * 120000 : 0;
      const estimasiHarga = glassPrice + gosokPrice + lubangPrice + temperingPrice;
      const beratKg = luasM2 * item.ketebalan_mm * 2.5; 

      return { p, l, luasM2, kelilingM, glassPrice, gosokPrice, lubangPrice, temperingPrice, estimasiHarga, beratKg, isValid: true };
    }
    return { p: 0, l: 0, luasM2: 0, kelilingM: 0, glassPrice: 0, gosokPrice: 0, lubangPrice: 0, temperingPrice: 0, estimasiHarga: 0, beratKg: 0, isValid: false };
  };

  const handleAddToRab = (item: KatalogKaca) => {
    if (isGuest && onRequireAuth) {
      alert("Silakan Sign In atau Sign Up terlebih dahulu untuk menambahkan produk ke dalam Keranjang (RAB).");
      onRequireAuth();
      return;
    }
    const calc = getCalculation(item);
    if (!calc.isValid) return;
    const config = configs[item.id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };

    const newRabItem: SavedRABItem = {
      id: String(Date.now() + Math.random()), glassId: item.id, jenis_kaca: item.jenis_kaca,
      ketebalan_mm: item.ketebalan_mm, panjang: calc.p, lebar: calc.l, luasM2: calc.luasM2,
      kelilingM: calc.kelilingM, gosokType: config.gosokType, lubangCount: config.lubangCount,
      temperedProcess: config.temperedProcess && !item.jenis_kaca.toLowerCase().includes('tempered'),
      estimasiHarga: calc.estimasiHarga, beratKg: calc.beratKg
    };

    saveRabList([...rabList, newRabItem]);
    setConfigs(prev => ({ ...prev, [item.id]: { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false } }));
  };

  const handleRemoveFromRab = (id: string) => {
    saveRabList(rabList.filter(item => item.id !== id));
  };

  const kirimWhatsAppSingle = (item: KatalogKaca) => {
    if (isGuest && onRequireAuth) {
      alert("Silakan Sign In atau Sign Up terlebih dahulu untuk memesan produk ini.");
      onRequireAuth();
      return;
    }
    const calc = getCalculation(item);
    const phoneNumber = "62895384224006";
    
    let text = `Halo Admin Karya Indah Mandiri, saya ingin *berkonsultasi* mengenai produk berikut:\n`;
    text += `💎 *${item.jenis_kaca} ${item.ketebalan_mm}mm*\n`;
    text += `Harga Dasar: Rp ${item.harga_per_m2.toLocaleString('id-ID')}/m²\n\n`;

    if (calc.isValid) {
      const config = configs[item.id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };
      text += `Berikut adalah *rancangan awal* yang saya butuhkan:\n`;
      text += `📐 *Panjang:* ${calc.p} cm\n📐 *Lebar:* ${calc.l} cm\n📐 *Estimasi Luas:* ${calc.luasM2.toFixed(3)} m²\n`;
      let gosokDetail = 'Tanpa finishing gosok (potongan biasa)';
      if (config.gosokType === 'halus') gosokDetail = 'Gosok mesin halus keliling (polished)';
      if (config.gosokType === 'bevel') gosokDetail = 'Gosok bevel estetik (beveled)';
      text += `✨ *Gosok Siku:* ${gosokDetail}\n`;
      if (config.lubangCount > 0) text += `🔘 *Lubang Bor:* ${config.lubangCount} lubang bor engsel\n`;
      if (config.temperedProcess && !item.jenis_kaca.toLowerCase().includes('tempered')) text += `🔥 *Proses:* Proses pengerasan Tempered tambahan\n`;
      text += `⚖️ *Estimasi Berat:* ${calc.beratKg.toFixed(1)} kg\n💰 *Estimasi Biaya Sementara:* Rp ${calc.estimasiHarga.toLocaleString('id-ID', { maximumFractionDigits: 0 })}\n\n`;
      text += `Apakah detail ukuran dan estimasi harga di atas bisa dikoreksi/divalidasi? Saya ingin bertanya lebih lanjut mengenai teknis dan jadwal survei. Terima kasih!`;
    } else {
      text += `Saya ingin berkonsultasi mengenai produk ini dan menanyakan info ketersediaan stok atau pilihan ukuran. Terima kasih!\n\n`;
    }

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const prosesPreviewRAB = async () => {
    if (isGuest && onRequireAuth) {
      alert("Silakan Login terlebih dahulu untuk melihat dan memproses RAB.");
      onRequireAuth();
      return;
    }
    if (rabList.length === 0) return;

    const totalWeight = rabList.reduce((acc, x) => acc + x.beratKg, 0);
    const totalArea = rabList.reduce((acc, x) => acc + x.luasM2, 0);
    const totalPrice = rabList.reduce((acc, x) => acc + x.estimasiHarga, 0);

    const payload = {
      username: username,
      nama_proyek: projectName,
      total_harga: totalPrice,
      items: rabList
    };

    try {
      const response = await fetch('http://localhost/api_toko_kaca/simpan_pesanan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const textResponse = await response.text(); 
      let result;
      try { result = JSON.parse(textResponse); } 
      catch (e) { alert("PHP Mengeluarkan Error (Bukan JSON). Cek Console."); return; }

      if (result.status === 'success') {
        const idPesanan = result.id_pesanan;
        setCurrentInvoiceId(idPesanan);

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(14, 165, 233);
        doc.text("KARYA INDAH MANDIRI", 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Pusat Spesialis Kaca Custom Jabodetabek", 14, 26);
        doc.setFontSize(12);
        doc.setTextColor(20, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.text("DRAFT ESTIMASI BIAYA (RAB)", 14, 40);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`No. Referensi  : ${idPesanan}`, 14, 48);
        doc.text(`Nama Pelanggan : ${username || 'Guest'}`, 14, 54);
        doc.text(`Nama Proyek    : ${projectName}`, 14, 60);
        doc.text(`Tanggal        : ${new Date().toLocaleDateString('id-ID')}`, 14, 66);

        const tableColumn = ["No", "Jenis Kaca", "Ukuran", "Finishing", "Bor", "Tempered", "Subtotal"];
        const tableRows: any[] = [];

        rabList.forEach((item, index) => {
          const jenisKaca = `${item.jenis_kaca} (${item.ketebalan_mm}mm)`;
          const ukuran = `${item.panjang}x${item.lebar} cm\n(${item.luasM2.toFixed(2)} m²)`;
          const finishing = item.gosokType === 'none' ? '-' : item.gosokType;
          const bor = item.lubangCount > 0 ? `${item.lubangCount} ttk` : '-';
          const tempered = item.temperedProcess ? 'Ya' : 'Tidak';
          const subtotal = `Rp ${item.estimasiHarga.toLocaleString('id-ID')}`;
          
          tableRows.push([index + 1, jenisKaca, ukuran, finishing, bor, tempered, subtotal]);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 72,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [14, 165, 233], textColor: [255, 255, 255], fontStyle: 'bold' }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 72;
        doc.setFontSize(10);
        doc.text(`Total Luas Keseluruhan : ${totalArea.toFixed(3)} m²`, 14, finalY + 10);
        doc.text(`Estimasi Total Berat   : ${totalWeight.toFixed(1)} kg`, 14, finalY + 16);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(14, 165, 233);
        doc.text(`ESTIMASI TOTAL BIAYA : Rp ${totalPrice.toLocaleString('id-ID')}`, 14, finalY + 28);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("*Catatan: Dokumen ini adalah rancangan estimasi awal. Harga dapat menyesuaikan setelah survei lapangan.", 14, finalY + 40);

        const blobPdf = doc.output('bloburl');
        setPdfBlobUrl(blobPdf.toString());

        const phoneNumber = "62895384224006";
        let text = `Halo Admin Karya Indah Mandiri,\nSaya ingin *berkonsultasi* mengenai Rencana Anggaran Biaya (RAB) kaca untuk kebutuhan saya.\n\n`;
        text += `🎫 *KODE REFERENSI:* ${idPesanan}\n`; 
        text += `👤 *NAMA:* ${username}\n`;
        text += `📁 *PROYEK:* ${projectName.toUpperCase()}\n=====================================\n\n`;

        rabList.forEach((rab, index) => {
          text += `*${index + 1}) ${rab.jenis_kaca} (${rab.ketebalan_mm}mm)*\n   📐 Ukuran Custom: ${rab.panjang} x ${rab.lebar} cm (${rab.luasM2.toFixed(3)} m²)\n`;
          let gosokDetail = 'Tanpa finishing gosok (potongan biasa)';
          if (rab.gosokType === 'halus') gosokDetail = 'Gosok mesin halus keliling (polished)';
          if (rab.gosokType === 'bevel') gosokDetail = 'Gosok bevel hias (beveled)';
          text += `   ✨ Finishing: ${gosokDetail}\n`;
          if (rab.lubangCount > 0) text += `   🔘 Tambahan: ${rab.lubangCount} lubang bor engsel\n`;
          if (rab.temperedProcess) text += `   🔥 Jasa Khusus: Ditambah proses tempered\n`;
          text += `   ⚖️ Berat Est: ${rab.beratKg.toFixed(1)} kg\n   💰 Estimasi: Rp ${rab.estimasiHarga.toLocaleString('id-ID')}\n\n`;
        });

        text += `=====================================\n📦 *RINGKASAN ESTIMASI AWAL:*\n• Total Kaca: ${rabList.length} unit\n• Total Luas: ${totalArea.toFixed(3)} m²\n• Perkiraan Berat: ${totalWeight.toFixed(1)} kg\n• *ESTIMASI TOTAL:* *Rp ${totalPrice.toLocaleString('id-ID')}*\n\n`;
        text += `*Catatan:* Data di atas adalah perhitungan awal dari website (RAB telah saya simpan). Mohon bantuannya untuk mengecek ulang harga final, ketersediaan bahan, dan jadwal survei ke lokasi. Terima kasih!`;
        
        setWaLink(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`);
        setPdfModalOpen(true);

      } else {
        alert("Ditolak oleh MySQL: " + result.message);
      }
    } catch (err: any) {
      alert("Error Network / Fetch: " + err.message);
    }
  };

  const handleDownloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = `RAB_Kaca_${currentInvoiceId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLanjutWA = () => {
    window.open(waLink, '_blank');
    setPdfModalOpen(false);
    saveRabList([]); 
  };

  const kirimWhatsAppLinkSurvei = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyForm.nama || !surveyForm.whatsapp || !surveyForm.alamat) {
      alert("Mohon lengkapi Nama, WhatsApp, dan Alamat Anda!");
      return;
    }
    const phoneNumber = "62895384224006";
    let text = `Halo Admin Karya Indah Mandiri,\nSaya ingin mengajukan permohonan survei lapangan:\n\n📋 *DATA PELANGGAN:* \n• *Nama:* ${surveyForm.nama}\n• *No. WA:* ${surveyForm.whatsapp}\n• *Alamat:* ${surveyForm.alamat}\n\n🏢 *DETAIL KEBUTUHAN:* \n• *Jenis Proyek:* ${surveyForm.proyekType}\n• *Rencana Survei:* ${surveyForm.tanggalSurvei || 'Fleksibel'}\n• *Butuh Tim Ukur:* ${surveyForm.butuhBantuanUkur ? 'Ya' : 'Tidak'}\n`;
    if (surveyForm.deskripsi) text += `• *Catatan:* ${surveyForm.deskripsi}\n\n`;
    text += `Mohon segera dihubungi. Terima kasih!`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setSurveySubmitted(true);
    setTimeout(() => {
      setSurveySubmitted(false);
      setSurveyForm({ nama: '', whatsapp: '', alamat: '', proyekType: 'Shower Kamar Mandi', tanggalSurvei: '', deskripsi: '', butuhBantuanUkur: true });
    }, 5000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const applyPreset = (preset: any) => {
    const targetGlass = katalog.find(item => item.jenis_kaca.toLowerCase().includes(preset.glassTypeKeyword));
    if (!targetGlass) {
      alert(`Produk kaca bertipe "${preset.glassTypeKeyword}" sedang tidak tersedia.`);
      return;
    }
    setConfigs(prev => ({
      ...prev, [targetGlass.id]: { panjang: preset.panjang, lebar: preset.lebar, gosokType: preset.gosokType, lubangCount: preset.lubangCount, temperedProcess: preset.temperedProcess }
    }));
    const element = document.getElementById(`kaca-card-${targetGlass.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-sky-500/30', 'border-sky-500');
      setTimeout(() => element.classList.remove('ring-4', 'ring-sky-500/30', 'border-sky-500'), 1800);
    }
  };

  const filteredKatalog = katalog.filter(item => {
    if (filterType === 'semua') return true;
    if (filterType === 'tempered') return item.jenis_kaca.toLowerCase().includes('tempered');
    if (filterType === 'mirror') return item.jenis_kaca.toLowerCase().includes('mirror') || item.jenis_kaca.toLowerCase().includes('cermin');
    if (filterType === 'clear') return item.jenis_kaca.toLowerCase().includes('clear') || item.jenis_kaca.toLowerCase().includes('polos');
    return true;
  });

  return (
    <div className="space-y-12 relative">
      
      {/* 1. LAYOUT BARU: FULL-WIDTH HERO BANNER */}
      <section className="banner-kaca-gelap rounded-3xl p-8 md:p-14 shadow-lg relative overflow-hidden flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-white/20">
          <Sparkles className="w-3.5 h-3.5" /> PUSAT KACA CUSTOM JABODETABEK
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 max-w-3xl">
          Wujudkan Desain Kaca Impian dengan Presisi Milimeter
        </h1>
        <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-2xl mb-10 opacity-95">
          Mulai dari Partisi Shower, Kanopi Tempered, hingga Cermin Bevel Estetik. Kalkulasi estimasi harga secara instan, atur lubang engsel, dan jadwalkan pemasangan langsung dari layar Anda.
        </p>
        <button 
          onClick={() => document.getElementById('daftar-katalog')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-slate-900 hover:bg-sky-50 px-8 py-3.5 rounded-xl font-extrabold shadow-xl transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-1"
        >
          <ShoppingCart className="w-5 h-5" /> Mulai Belanja Kaca
        </button>
      </section>

      {/* INFO CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Subsidi Ongkir Cargo</p>
            <p className="text-[10px] text-slate-500">Free JABODETABEK &gt; 10m²</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Kualitas SNI</p>
            <p className="text-[10px] text-slate-500">Standar Asahimas Murni</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Oven Tempered</p>
            <p className="text-[10px] text-slate-500">Ketahanan panas 700°C</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Fast Response</p>
            <p className="text-[10px] text-slate-500">Senin - Sabtu (08:00 - 17:00)</p>
          </div>
        </div>
      </div>

      {/* 2. LAYOUT BARU: KATALOG NAIK KE ATAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KATALOG PRODUK */}
        <section id="daftar-katalog" className="lg:col-span-8 space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-adaptive">Katalog Produk &amp; Kalkulator</h2>
              <p className="text-xs text-adaptive-muted">Sesuaikan ukuran potongan, pelindung tambahan, dan finishing pinggiran.</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto gap-0.5 shrink-0">
              {['semua', 'clear', 'tempered', 'mirror', 'rayban'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg transition-colors capitalize cursor-pointer ${
                    filterType === t ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {filteredKatalog.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-sm mx-auto shadow-sm">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Tidak ada produk ditemukan</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredKatalog.map(item => {
                const calc = getCalculation(item);
                const config = configs[item.id] || { panjang: '', lebar: '', gosokType: 'none', lubangCount: 0, temperedProcess: false };

                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between relative" id={`kaca-card-${item.id}`}>
                    <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 overflow-hidden relative group">
                      <img 
                        src={item.gambar_url || 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800'} 
                        alt={item.jenis_kaca} 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=800'; }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        Tebal {item.ketebalan_mm} mm
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1 mb-3">
                        <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{item.jenis_kaca}</h3>
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 min-h-[32px]">
                          {item.deskripsi || "Spesifikasi kustom prima untuk kaca pengaman, arsitektural, dan mebel ruangan Anda."}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sky-600 font-extrabold text-lg">
                          Rp {item.harga_per_m2.toLocaleString('id-ID')} <span className="text-slate-400 font-normal text-xs">/m²</span>
                        </p>
                      </div>

                      <div className="space-y-4 pt-3 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-2" id={`inputs-container-${item.id}`}>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">Panjang (cm)</label>
                            <input 
                              type="text" placeholder="Cth: 100" value={config.panjang}
                              onChange={(e) => handleDimensionChange(item.id, 'panjang', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">Lebar (cm)</label>
                            <input 
                              type="text" placeholder="Cth: 50" value={config.lebar}
                              onChange={(e) => handleDimensionChange(item.id, 'lebar', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 text-center focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1.5">Tipe Finishing Tepi</label>
                          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                            <button
                              type="button" onClick={() => handleGosokChange(item.id, 'none')}
                              className={`py-1.5 rounded-lg border text-center cursor-pointer transition ${config.gosokType === 'none' ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >Tanpa Gosok</button>
                            <button
                              type="button" onClick={() => handleGosokChange(item.id, 'halus')}
                              className={`py-1.5 rounded-lg border text-center cursor-pointer transition ${config.gosokType === 'halus' ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >Mesin Kilap</button>
                            <button
                              type="button" onClick={() => handleGosokChange(item.id, 'bevel')}
                              className={`py-1.5 rounded-lg border text-center cursor-pointer transition ${config.gosokType === 'bevel' ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >Bevel Hias</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 items-center">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 block">Lubang Engsel</label>
                            <div className="flex items-center gap-1.5">
                              <button type="button" onClick={() => handleLubangChange(item.id, -1)} className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-extrabold cursor-pointer">-</button>
                              <span className="w-8 text-center text-sm font-bold text-slate-700 py-0.5">{config.lubangCount}</span>
                              <button type="button" onClick={() => handleLubangChange(item.id, 1)} className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-extrabold cursor-pointer">+</button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            {!item.jenis_kaca.toLowerCase().includes('tempered') ? (
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block">Proses Tempered</label>
                                <label className="inline-flex items-center gap-2 mt-1.5 cursor-pointer">
                                  <input type="checkbox" checked={config.temperedProcess} onChange={() => handleTemperedToggle(item.id)} className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                                  <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">+Rp120k/m²</span>
                                </label>
                              </div>
                            ) : (
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block">Standar Pabrik</label>
                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1.5 font-bold">✓ Bawaan Tempered</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {calc.isValid && (
                          <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100 text-[11px] space-y-1.5 text-slate-600">
                            <div className="flex justify-between items-center text-slate-500 font-medium">
                              <span>Volume Est:</span>
                              <span className="text-slate-800 font-bold">{calc.luasM2.toFixed(3)} m² ({calc.beratKg.toFixed(1)} kg)</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                              <span className="font-extrabold text-slate-800">Total Harga:</span>
                              <span className="font-extrabold text-sky-600">Rp {calc.estimasiHarga.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button
                            type="button" disabled={!calc.isValid} onClick={() => handleAddToRab(item)}
                            className={`py-2.5 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${calc.isValid ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer' : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}`}
                          >
                            <Plus className="w-4 h-4" /> + Keranjang
                          </button>
                          <button 
                            type="button" onClick={() => kirimWhatsAppSingle(item)}
                            className="py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>💬</span> {calc.isValid ? "Beli Sekarang" : "Tanya Admin"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SIDEBAR KERANJANG RAB */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 sticky top-28 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-sky-600" />
              <h3 className="font-extrabold text-slate-800 text-sm">Keranjang (RAB)</h3>
            </div>
            <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{rabList.length} Item</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ID/Nama Proyek</label>
            <input 
              type="text" value={projectName} onChange={(e) => handleProjNameChange(e.target.value)}
              placeholder="Contoh: Proyek Rumah Bu Linda"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {rabList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ShoppingCart className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Keranjang Masih Kosong</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {rabList.map(rab => (
                <div key={rab.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs space-y-2 relative group">
                  <button 
                    onClick={() => handleRemoveFromRab(rab.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="font-bold text-slate-800 pr-6 text-sm">{rab.jenis_kaca} ({rab.ketebalan_mm}mm)</div>
                  <div className="text-slate-500 space-y-1 font-medium text-[11px]">
                    <p>📏 Ukuran: <span className="font-bold text-slate-700">{rab.panjang} x {rab.lebar} cm</span></p>
                    <p>✨ Finishing: <span className="text-slate-700 font-semibold">{rab.gosokType === 'halus' ? 'Gosok Halus Tepi' : rab.gosokType === 'bevel' ? 'Garis Bevel' : 'Tanpa Finishing'}</span></p>
                    {rab.lubangCount > 0 && <p>🔘 Lubang Bor: <span className="text-slate-700 font-semibold">{rab.lubangCount} Titik</span></p>}
                    {rab.temperedProcess && <p className="text-rose-600 font-bold">🔥 Upgrade Oven Tempered</p>}
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200 font-bold">
                    <span className="text-slate-400 text-[10px]">Subtotal:</span>
                    <span className="text-sky-600 text-sm">Rp {rab.estimasiHarga.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {rabList.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500"><span>Total Volume:</span><span className="text-slate-800 font-bold">{rabList.reduce((acc, x) => acc + x.luasM2, 0).toFixed(3)} m²</span></div>
                <div className="flex justify-between text-slate-500"><span>Total Berat:</span><span className="text-slate-800 font-bold">{rabList.reduce((acc, x) => acc + x.beratKg, 0).toFixed(1)} kg</span></div>
                <div className="flex justify-between items-center font-bold text-sm pt-3 border-t border-slate-200 text-slate-900">
                  <span>TOTAL BIAYA:</span>
                  <span className="text-sky-600 text-lg">Rp {rabList.reduce((acc, x) => acc + x.estimasiHarga, 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => { if (window.confirm("Kosongkan keranjang?")) saveRabList([]); }} className="col-span-1 py-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl transition cursor-pointer">Clear</button>
                <button onClick={prosesPreviewRAB} className="col-span-2 py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-sky-500/20">
                  <Calculator className="w-4 h-4"/> Buat Draft RAB
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. LAYOUT BARU: TEMPLATE & INSPIRASI */}
      <div className="pt-8 space-y-12 border-t border-slate-200">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-adaptive text-lg">Template Ukuran Populer</h3>
              <p className="text-xs text-adaptive-muted">Klik template di bawah ini untuk mengisi kalkulator secara otomatis.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx} onClick={() => applyPreset(preset)}
                className="bg-white border border-slate-200 rounded-xl p-5 text-left shadow-sm hover:shadow-md hover:border-sky-400 transition cursor-pointer group space-y-2 relative"
              >
                <div className="font-bold text-slate-800 text-sm pr-6 truncate">{preset.name}</div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 h-8">{preset.deskripsi}</p>
                <div className="flex flex-wrap gap-1.5 items-center pt-2 text-[10px] font-bold text-sky-700">
                  <span className="bg-sky-50 px-2 py-1 rounded">{preset.panjang}x{preset.lebar} cm</span>
                  <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{preset.gosokType === 'none' ? 'Biasa' : preset.gosokType}</span>
                  {preset.temperedProcess && <span className="bg-amber-50 text-amber-800 px-2 py-1 rounded">Tempered</span>}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h3 className="font-extrabold text-adaptive text-xl">📸 Galeri Pemasangan Kami</h3>
            <p className="text-sm text-adaptive-muted mt-1">Inspirasi model asli dari pengerjaan tim Karya Indah Mandiri di lapangan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTFOLIO_ITEMS.map((port, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  <img src={port.imageUrl} alt={port.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {port.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{port.title}</h4>
                    <p className="text-[11px] text-sky-600 flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5" />{port.location}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-1">{port.deskripsi}</p>
                  </div>
                  <button
                    type="button" onClick={() => applyPreset(port)}
                    className="w-full py-2 bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white border border-sky-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Coba Ukuran Ini
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FORM SURVEI LOKASI */}
      <section className="bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-900 text-white rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5 flex flex-col justify-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-300 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wide">
              🛠️ JASA PASANG & UKUR
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight leading-tight">Butuh Teknisi ke Lokasi Anda?</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tim spesialis kami siap datang untuk mengukur area dengan laser meter presisi tinggi, memastikan kaca terpasang rapi dan aman.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/10">
            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Garansi ukuran presisi (anti salah potong).</li>
            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Armada kirim khusus anti pecah.</li>
            <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Pemasangan dengan sealant premium.</li>
          </ul>
        </div>

        <div className="lg:col-span-7 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
          <h4 className="font-bold text-lg mb-4">Jadwalkan Survei Sekarang</h4>
          <form onSubmit={kirimWhatsAppLinkSurvei} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nama Lengkap</label>
                <input type="text" required value={surveyForm.nama} onChange={(e) => setSurveyForm({...surveyForm, nama: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-400" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nomor WhatsApp</label>
                <input type="tel" required value={surveyForm.whatsapp} onChange={(e) => setSurveyForm({...surveyForm, whatsapp: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kategori Proyek</label>
                <select value={surveyForm.proyekType} onChange={(e) => setSurveyForm({...surveyForm, proyekType: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-400 cursor-pointer">
                  <option value="Shower Kamar Mandi">Sekat Shower Glass</option>
                  <option value="Cermin Dinding Bevel">Cermin Dinding / Gym</option>
                  <option value="Partisi Kaca Kantor">Partisi Ruangan Kantor</option>
                  <option value="Kanopi Kaca Void">Kanopi Kaca Atap</option>
                  <option value="Lainnya">Kebutuhan Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tanggal Rencana Survei</label>
                <input type="date" value={surveyForm.tanggalSurvei} onChange={(e) => setSurveyForm({...surveyForm, tanggalSurvei: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-400 cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Alamat Lengkap</label>
              <input type="text" required value={surveyForm.alamat} onChange={(e) => setSurveyForm({...surveyForm, alamat: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Catatan Khusus (Opsional)</label>
              <textarea rows={2} value={surveyForm.deskripsi} onChange={(e) => setSurveyForm({...surveyForm, deskripsi: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-sky-400" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold rounded-xl transition cursor-pointer flex justify-center items-center gap-2">
              <span>💬</span> HUBUNGI ADMIN VIA WHATSAPP
            </button>
            {surveySubmitted && <p className="text-xs text-emerald-400 text-center font-bold mt-2">✓ Permohonan terkirim ke WhatsApp Admin!</p>}
          </form>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="glass-panel rounded-3xl p-8 md:p-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="font-extrabold text-adaptive text-2xl mb-2">Tanya Jawab & Edukasi</h3>
          <p className="text-sm text-adaptive-muted font-medium">Ketahui info penting tentang material, pemotongan, dan pengiriman kaca kami.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = !!openFaqs[idx];
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button type="button" onClick={() => toggleFaq(idx)} className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer">
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {isOpen && <div className="px-6 pb-5 pt-2 text-sm text-slate-500 border-t border-slate-100 leading-relaxed"><p>{faq.answer}</p></div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 🧾 MODAL PREVIEW PDF (DIPAKSA KE DEPAN LAYAR MENGGUNAKAN PORTAL) */}
      {/* ========================================================= */}
      {pdfModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-xl text-slate-800">Preview Draft RAB</h3>
                <p className="text-xs text-slate-500">Mohon periksa kembali estimasi anggaran dan kebutuhan Anda.</p>
              </div>
              <button onClick={() => setPdfModalOpen(false)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Iframe Preview Document */}
            <div className="flex-1 bg-slate-100 p-2 md:p-4">
              <iframe 
                src={pdfBlobUrl} 
                className="w-full h-full rounded-xl border border-slate-300 shadow-inner bg-white" 
                title="Preview PDF RAB Kaca" 
              />
            </div>

            {/* Footer Modal / Action Buttons */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setPdfModalOpen(false)} 
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition cursor-pointer text-sm"
              >
                Batal
              </button>
              
              <button 
                onClick={handleDownloadPdf} 
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer text-sm shadow-md"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              
              <button 
                onClick={handleLanjutWA} 
                className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-extrabold transition flex items-center gap-2 cursor-pointer text-sm shadow-md"
              >
                <span>💬</span> Lanjut Diskusi ke WA
              </button>
            </div>
            
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

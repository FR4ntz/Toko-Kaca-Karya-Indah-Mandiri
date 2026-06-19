export interface KatalogKaca {
  id: string; // Used as key in local storage state
  jenis_kaca: string;
  ketebalan_mm: number;
  deskripsi: string;
  gambar_url: string;
  harga_per_m2: number;
}

export interface AdminCredential {
  username: string;
  id_admin?: number;
}

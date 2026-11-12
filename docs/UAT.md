# Panduan UAT Manual (User Acceptance Testing)

Aplikasi: **Personal CV & Academic Score App**  
Mahasiswa: **Naelul Kirom Indalloh** (NIM: **242505011**)  
Perangkat Uji: **Smartphone Android Fisik via Expo Go**

Gunakan tabel pengujian mandiri berikut untuk memverifikasi seluruh fungsionalitas sebelum melakukan perekaman video demo 3 menit.

---

## Tabel Checklist UAT

| ID | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status |
| --- | --- | --- | --- | :---: |
| **U-01** | Buka aplikasi dari Expo Go | Jalankan `npx expo start`, scan QR code di aplikasi Expo Go Android | Home Screen tampil lancar tanpa crash; Foto profil bulat tampil; NIM 242505011 dan nama Naelul Kirom Indalloh terlihat jelas | [x] |
| **U-02** | Navigasi 6 Tab berurutan | Ketuk setiap tab dari kiri ke kanan: Home, About, Skills, Portfolio, My Score, Contact | Setiap halaman berpindah dengan mulus; Tab yang aktif ditandai dengan warna aksen dan ikon terisi | [x] |
| **U-03** | Penggantian Tema (Dark/Light) | Ketuk tombol bulan/matahari di pojok kanan atas header pada tab mana saja; tutup aplikasi dan buka kembali | Tampilan berpindah seketika antara tema terang dan gelap; Pilihan tema terakhir tetap tersimpan saat aplikasi dibuka ulang | [x] |
| **U-04** | Pencarian Proyek Tidak Ditemukan | Masuk ke tab Portfolio, ketik kata kunci acak misal "Zebra123" | Tampil `EmptyState` informatif dengan tombol "Reset Pencarian"; Menekan tombol reset mengembalikan seluruh daftar proyek | [x] |
| **U-05** | Buka Halaman Detail Proyek | Di tab Portfolio, ketuk kartu "Calliandra Home Living" | Halaman detail rute `/project/calliandra` terbuka dengan animasi halus; Tampil deskripsi lengkap, peran, fitur, tech chips; Tombol kembali (panah kiri) berfungsi | [x] |
| **U-06** | Simulasi Error State & Retry | Set `EXPO_PUBLIC_SIMULATE_ERROR=true` di `.env` (atau panggil `setSimulateError(true)`), buka My Score | Tampil `ErrorState` dengan pesan galat ramah dan tombol "Coba Lagi"; Menekan "Coba Lagi" saat normal memuat ulang data dengan sukses | [x] |
| **U-07** | Validasi Formulir Kontak | Masuk ke tab Contact, biarkan field kosong lalu tekan "Kirim Pesan"; Selanjutnya isi dengan data valid lalu tekan "Kirim Pesan" | Form kosong menampilkan 3 pesan error inline; Form valid menampilkan banner sukses hijau, kolom input di-reset, dan pesan muncul di Riwayat Pesan Lokal | [x] |
| **U-08** | Hapus Riwayat Pesan | Pada tab Contact, tekan tombol "Hapus Riwayat" | Riwayat pesan lokal terhapus dari AsyncStorage dan daftar menjadi kosong kembali | [x] |
| **U-09** | Tampilan Skala Font Besar | Ubah pengaturan font di Android ke ukuran terbesar (Font Size: Maximum) | Seluruh teks tetap terbaca dengan jelas tanpa terpotong (*text clipping*) atau menumpuk | [x] |
| **U-10** | Bukti Pemisahan Data & UI | Ubah nama atau deskripsi pada `data/profile.json` | Tampilan pada layar Home dan About otomatis berubah saat aplikasi dimuat ulang tanpa mengubah satu pun file komponen JSX | [x] |
| **U-11** | Verifikasi Pembaca Layar (TalkBack) | Aktifkan fitur Google TalkBack pada Android, jelajahi elemen utama di Home dan Contact | Seluruh tombol, gambar profil, header, dan progress bar memiliki pengumuman suara yang masuk akal dan jelas | [x] |

---

## Verifikasi Kelulusan Pengujian Otomatis

Sebelum perekaman video demo, pastikan seluruh pengujian unit otomatis telah lolos:

```bash
# Menjalankan 49 unit test di Jest
npm test

# Menjalankan ESLint React Native
npm run lint
```

Kedua perintah di atas wajib menghasilkan status **lulus tanpa pesan kesalahan (Exit Code 0)**.


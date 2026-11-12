# Personal CV & Academic Score App

> **Ujian Tengah Semester (UTS) Pemrograman Mobile 2 · Ganjil 2026/2027**  
> Proyek Individu — Progressive Challenge (Target: **Level 10 — Industry**)

---

## 📌 Identitas Mahasiswa

| Item | Keterangan |
| :--- | :--- |
| **Nama Lengkap** | **Naelul Kirom Indalloh** |
| **NIM** | **242505011** |
| **Program Studi / Fakultas** | Sistem Informasi / Komputer |
| **Perguruan Tinggi** | Universitas Ma'soem |
| **Kelas** | SI-R-5, SI-NR-5 |
| **Mata Kuliah** | Pemrograman Mobile 2 |
| **Dosen Pengampu** | Iin, M.Kom |
| **Level yang Diklaim** | **Level 10 (Industry) — Kumulatif Level 1 s.d. 10** |
| **Perangkat Demo** | Smartphone Android Fisik via Expo Go |
| **Teknologi** | React Native + Expo, JavaScript (`.jsx`/`.js`), Expo Router |

---

## 🚀 Panduan Menjalankan Aplikasi

Pastikan Node.js (v18+) telah terpasang di komputer Anda.

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan Expo
```bash
npx expo start
```
- Buka aplikasi **Expo Go** pada ponsel Android fisik Anda.
- Pastikan ponsel dan komputer terhubung ke jaringan Wi-Fi yang sama (atau gunakan mode `--tunnel`).
- Scan kode QR yang tampil di terminal atau browser.

### 3. Menjalankan Pengujian Unit Otomatis (Jest + RNTL)
Aplikasi dilengkapi dengan 10 test suite dan 49 unit test otomatis:
```bash
npm test
```

### 4. Menjalankan Analisis Kerapian Kode (ESLint)
```bash
npm run lint
```

---

## 🛠️ Cara Mengubah Data Portofolio & Profil

Sesuai arsitektur Level 5 & 6, **komponen UI terpisah sepenuhnya dari data**. Seluruh isi profil, portofolio, dan keahlian disimpan secara terpusat dalam berkas JSON di folder `data/`:

| Berkas Data | Deskripsi Isi |
| :--- | :--- |
| `data/profile.json` | Identitas nama, NIM, profesi, deskripsi singkat, kampus, dan tautan kontak/sosial. |
| `data/score.json` | Nilai akademik UTS (**89 / Grade A / 12.375 LP** dan 4 indikator progres). |
| `data/skills.json` | Daftar kompetensi teknis terkelompok per kategori beserta nilai tingkat kemahiran (0–100). |
| `data/portfolio.json` | Daftar proyek (Calliandra POS, Surat Desa, Mobile App, dll.) lengkap dengan teknologi dan tautan GitHub. |
| `data/experience.json` | Riwayat pendidikan formal dan keaktifan organisasi (*timeline*). |
| `data/hobbies.json` | Minat & hobi yang dilengkapi nama ikon vektor Ionicons. |

> **Catatan Penggantian Foto:** Ganti berkas gambar pada path `assets/profile.jpg` dengan foto profil formal Anda.

---

## 🧪 Cara Mendemokan Kondisi Error (Level 10)

Untuk mendemokan kondisi penanganan galat (*ErrorState*) dengan tombol *"Coba Lagi"* saat perekaman video demo:
1. Buat berkas `.env` di direktori proyek dan tambahkan baris:
   ```env
   EXPO_PUBLIC_SIMULATE_ERROR=true
   ```
2. Jalankan ulang `npx expo start -c` (bersihkan cache).
3. Buka halaman mana saja (misal: *My Score* atau *Skills*). Layar akan menampilkan antarmuka `ErrorState` yang ramah pengguna.
4. Hapus baris tersebut atau ubah menjadi `false` untuk mengembalikan ke mode normal.

---

## 🏗️ Ringkasan Arsitektur (5-Lapisan)

Aplikasi dibangun menggunakan pola arsitektur searah yang modular:
```
data/*.json (Data Tunggal)
    ↓
services/*.js (Mock API berlatensi 500-1000ms & penanganan galat)
    ↓
hooks/*.js (State management data, tema, filter, & form)
    ↓
app/(tabs)/*.jsx & app/project/[id].jsx (Navigasi Expo Router 6 Tab + Detail)
    ↓
components/*.jsx & components/ui/*.jsx (Komponen murni berbasis Props)
```

Dokumentasi diagram mendalam dan keputusan desain dapat dibaca pada [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).  
Daftar checklist 11 skenario pengujian manual dapat dibaca pada [docs/UAT.md](docs/UAT.md).

---

## 📁 Struktur Folder & File Aplikasi

```text
uts_expo_naelul/
├── app/                         # Routing layar aplikasi (Expo Router)
│   ├── _layout.jsx              # Root layout (ThemeProvider & Stack navigator)
│   ├── (tabs)/                  # Navigasi Bottom Tab (6 tab utama)
│   │   ├── _layout.jsx          # Konfigurasi ikon & label tab navigator
│   │   ├── index.jsx            # Tab Home (Profil, ringkasan, ekspor CV PDF)
│   │   ├── about.jsx            # Tab About (Tentang saya, riwayat & hobi)
│   │   ├── skills.jsx           # Tab Skills (Kompetensi teknis per kategori)
│   │   ├── portfolio.jsx        # Tab Portfolio (Galeri proyek, pencarian & filter)
│   │   ├── score.jsx            # Tab My Score (Nilai UTS, LP & 4 progress card)
│   │   └── contact.jsx          # Tab Contact (Formulir kontak & riwayat lokal)
│   └── project/
│       └── [id].jsx             # Halaman detail proyek dinamis
├── assets/                      # Aset gambar & media aplikasi
│   ├── profile.jpg              # Foto profil mahasiswa
│   ├── profileBase64.js         # Representasi Base64 foto untuk cetak CV PDF
│   ├── expo.icon/               # Aset ikon aplikasi iOS
│   └── images/                  # Ikon aplikasi, adaptive icon, splash & logo
├── components/                  # Komponen UI modular berbasis Props
│   ├── states/                  # Komponen state global (LoadingState, ErrorState, EmptyState)
│   ├── ui/                      # Primitif UI reusable (Card, Chip, ProgressBar, Screen, SearchBar, Section, StatTile)
│   ├── AboutSection.jsx         # Bagian ringkasan tentang diri
│   ├── ContactForm.jsx          # Komponen formulir kontak & validasi
│   ├── CvPrintCard.jsx          # Kartu aksi pratinjau & ekspor CV PDF
│   ├── HobbyCard.jsx            # Kartu hobi & minat
│   ├── ProfileHeader.jsx        # Header profil dengan foto & toggle tema
│   ├── ProgressCard.jsx         # Kartu progres indikator nilai akademik
│   ├── ProjectCard.jsx          # Kartu ringkasan proyek portofolio
│   ├── ScoreSummary.jsx         # Ringkasan skor akademik & Learning Points
│   ├── SkillItem.jsx            # Item keahlian dengan bar kemahiran
│   └── TimelineItem.jsx         # Item linimasa pendidikan & organisasi
├── data/                        # Sumber data tunggal terpisah (JSON)
│   ├── experience.json          # Riwayat pendidikan & organisasi
│   ├── hobbies.json             # Daftar minat & hobi
│   ├── portfolio.json           # Daftar proyek portofolio
│   ├── profile.json             # Data profil, kontak & identitas mahasiswa
│   ├── score.json               # Data nilai UTS & indikator progres
│   └── skills.json              # Daftar keahlian & tingkat kemahiran
├── docs/                        # Dokumentasi teknis aplikasi
│   ├── ARCHITECTURE.md          # Dokumentasi arsitektur 5-lapisan
│   └── UAT.md                   # Checklist skenario pengujian manual (UAT)
├── hooks/                       # Custom React Hooks
│   ├── useAsyncData.js          # Hook fetch async dengan loading/error/refresh
│   ├── useContactForm.js        # Hook state, validasi & submit formulir kontak
│   ├── usePortfolioFilter.js    # Hook pencarian & filter kategori portofolio
│   └── useTheme.js              # Hook akses & toggle tema (Dark/Light)
├── scripts/                     # Skrip utilitas proyek Expo
│   └── reset-project.js         # Skrip bawaan template Expo
├── services/                    # Layer layanan & simulasi API async
│   ├── api.js                   # Helper delay & simulasi error jaringan
│   ├── contactService.js        # Layanan kirim & simpan riwayat pesan kontak
│   ├── cvPdfService.js          # Layanan generator HTML & cetak/bagikan CV PDF
│   ├── portfolioService.js      # Layanan pengambilan data portofolio
│   ├── profileService.js        # Layanan pengambilan data profil, skill, hobi & pengalaman
│   └── scoreService.js          # Layanan pengambilan data nilai akademik
├── theme/                       # Sistem desain & manajemen tema
│   ├── ThemeContext.jsx         # Context provider tema dengan persistensi AsyncStorage
│   └── tokens.js                # Token warna, spasi, radius & tipografi
├── utils/                       # Fungsi utilitas murni
│   ├── format.js                # Utilitas pemformatan teks & angka
│   ├── storage.js               # Wrapper AsyncStorage
│   └── validators.js            # Validasi input formulir kontak
├── __tests__/                   # Unit & component test otomatis (Jest + RNTL)
│   ├── ContactForm.test.js
│   ├── ProfileHeader.test.js
│   ├── ProgressCard.test.js
│   ├── ScoreSummary.test.js
│   ├── cvPdfService.test.js
│   ├── data.test.js
│   ├── format.test.js
│   ├── services.test.js
│   ├── storage.test.js
│   ├── usePortfolioFilter.test.js
│   └── validators.test.js
├── .gitignore                   # Daftar file/folder yang dikecualikan dari Git
├── LICENSE                      # Lisensi proyek
├── README.md                    # Dokumentasi utama proyek
├── app.json                     # Konfigurasi Expo (ikon, splash, plugin, skema)
├── babel.config.js              # Konfigurasi Babel
├── eslint.config.js             # Konfigurasi ESLint
├── jest.setup.js                # Setup environment Jest & mock native modules
├── package.json                 # Daftar dependensi & skrip npm
├── package-lock.json            # Lockfile dependensi npm
└── tsconfig.json                # Konfigurasi TypeScript / path aliases
```

---

## 📋 Checklist Pemenuhan Syarat Level 1 s.d. Level 10

| Level | Kode Persyaratan | Keterangan Pemenuhan | Status |
| :---: | :--- | :--- | :---: |
| **Level 1** | FR-01 s.d. FR-04 | Tampil NIM 242505011, nama lengkap, foto profil bulat, aplikasi berjalan di Expo Go tanpa error. | ✅ Terpenuhi |
| **Level 2** | FR-05 s.d. FR-08 | Tampil profesi, deskripsi singkat diri, heading terstruktur, komponen dasar React Native (`View`, `Text`, `Image`, `ScrollView`, `Pressable`). | ✅ Terpenuhi |
| **Level 3** | FR-09 s.d. FR-12 | Tata letak Flexbox rapi, styling terpusat dengan theme tokens, tipografi proporsional, responsif di berbagai lebar ponsel. | ✅ Terpenuhi |
| **Level 4** | FR-13 s.d. FR-19 | Props passing, `useState`, formulir kontak interaktif (Nama, Email, Pesan), penanganan event, validasi field kosong, pesan sukses & reset form. | ✅ Terpenuhi |
| **Level 5** | FR-20 s.d. FR-22 | Pemisahan penuh data dari UI (zero text hardcoded di komponen), komponen reusable di folder terorganisir (`components/`, `data/`, `services/`, `hooks/`). | ✅ Terpenuhi |
| **Level 6** | FR-23 s.d. FR-25 | 6 Berkas JSON valid (`profile`, `skills`, `portfolio`, `experience`, `hobbies`, `score`), perenderan data via `FlatList` dan `map()`. | ✅ Terpenuhi |
| **Level 7** | FR-26 s.d. FR-31 | Dynamic Skills, Portfolio Gallery + Search/Filter kategori, Theme Switcher (Dark/Light instan), Experience Timeline vertikal, Hobby section. | ✅ Terpenuhi |
| **Level 8** | FR-32 s.d. FR-37 | Tab My Score terintegrasi, Current Score **89 / Grade A**, Learning Points **12.375 LP**, 4 Kartu Progress Bar (Attendance 100%, Practice 87%, Quest 95%, Challenge 100%). | ✅ Terpenuhi |
| **Level 9** | FR-38 s.d. FR-42 | Bottom Tab Navigator 6 tab (Home, About, Skills, Portfolio, My Score, Contact), halaman detail dinamis `/project/[id]`, list ter-virtualisasi hemat memori. | ✅ Terpenuhi |
| **Level 10** | FR-43 s.d. FR-50 | Mock API service layer async (delay 500-1000ms), 3 state eksplisit (`LoadingState`, `ErrorState`, `EmptyState`), persistensi `AsyncStorage`, aksesibilitas TalkBack & touch target ≥ 44dp, 49 unit test Jest hijau, dokumentasi komprehensif. | ✅ Terpenuhi |

---


Source code: https://github.com/sunghoon31/uts_expo_naelul

Nama Lengkap: Naelul Kirom Indalloh
NIM: 242505011
Mata Kuliah: Pemrograman Mobile 2
Dosen Pengampu: Iin, M.Kom
Program Studi: S1 Sistem Informasi - Universitas Ma'soem
Kelas: SI-R-5 / SI-NR-5
Level yang Diklaim: Level 10 (Industry)

Cara Menjalankan:
1. npm install
2. npx expo start
3. Scan QR code menggunakan aplikasi Expo Go di smartphone Android
4. Pengujian Otomatis: npm test
5. Linting: npm run lint

Daftar Fitur:
- Identitas lengkap mahasiswa & foto profil (Level 1)
- Profesi, bio singkat, heading, komponen dasar RN (Level 2)
- Layout Flexbox responsif, sistem tema terpadu (Level 3)
- Props, state, form kontak, validasi inline, reset form (Level 4)
- Arsitektur terpisah data-UI, komponen modular reusable (Level 5)
- 6 Berkas JSON valid terpisah, pemetaan data via FlatList/map (Level 6)
- Dynamic skills, portfolio gallery + search/filter, theme switcher (Level 7)
- My Score: Current score 89/A, 12.375 LP, 4 progress card (Level 8)
- Navigasi Expo Router 6 Tab + dynamic route detail proyek (Level 9)
- Mock API async delay, loading/error/empty states, AsyncStorage persistence, TalkBack accessibility, 49 unit tests Jest hijau, dokumentasi komprehensif (Level 10).
```

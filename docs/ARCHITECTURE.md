# Dokumentasi Arsitektur Perangkat Lunak

Aplikasi: **Personal CV & Academic Score App**  
Mahasiswa: **Naelul Kirom Indalloh** (NIM: **242505011**)  
Mata Kuliah: **Pemrograman Mobile 2** — Dosen: **Iin, M.Kom**  
Target Capaian: **Level 10 (Industry)**

---

## 1. Arsitektur Berlapis (5-Layer Pattern)

Aplikasi ini mengadopsi pola arsitektur berlapis searah (*unidirectional layered architecture*) guna memisahkan secara tegas antara data, logika bisnis, dan antarmuka pengguna (*separation of concerns*):

```
+-------------------------------------------------------------+
| 1. Data Layer (data/*.json)                                 |
|    Sumber tunggal isi profil, skills, proyek, skor, dll     |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 2. Service Layer (services/*.js - Mock API)                 |
|    Abstraksi network async, latency delay 500-1000ms,       |
|    simulasi error toggle, AsyncStorage I/O                  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 3. Hook Layer (hooks/*.js)                                  |
|    State management, loading/error flags, filtering, form   |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 4. Screen Layer (app/(tabs)/*.jsx & app/project/[id].jsx)   |
|    Struktur rute navigasi Expo Router, page layout          |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| 5. Component Layer (components/*.jsx & components/ui/*.jsx) |
|    Komponen presentasional murni via props, reusable        |
+-------------------------------------------------------------+
```

### Mengapa Pemisahan Data & UI Penting (Level 5, 6, 10)?
1. **Komponen Presentasional Murni**: Komponen seperti `ProfileHeader`, `ScoreSummary`, `ProjectCard`, dan `SkillItem` tidak tahu dari mana data berasal. Mereka hanya menerima data melalui *props*.
2. **Kesiapan Menuju API Produksi**: Jika di kemudian hari data diambil dari server REST API / LMS kampus sungguhan, kita hanya perlu mengubah implementasi di dalam folder `services/`, tanpa menyentuh satu baris pun kode antarmuka di `components/` maupun `app/`.
3. **Keterujian (Testability)**: Logika validasi (`utils/validators.js`), formatting (`utils/format.js`), penyimpanan (`utils/storage.js`), dan hook filter dapat diuji secara independen dengan pengujian unit otomatis tanpa memerlukan emulator atau server aktif.

---

## 2. Navigasi & Struktur Rute (Expo Router)

Navigasi menggunakan **Expo Router** berbasis berkas (*file-based routing*):

- `app/_layout.jsx`: Root Stack Navigator yang membungkus `ThemeProvider`.
- `app/(tabs)/_layout.jsx`: Bottom Tab Navigator dengan 6 tab utama:
  1. `index.jsx` (Home): Ringkasan identitas mahasiswa, foto bulat, NIM, nama, profesi, statistik, dan preview skor.
  2. `about.jsx` (About): Bio diri, riwayat pendidikan & organisasi (*vertical timeline* interaktif), serta minat/hobi.
  3. `skills.jsx` (Skills): Daftar keahlian teknis terkelompok per kategori dengan *collapsible card* dan bar persentase.
  4. `portfolio.jsx` (Portfolio): Galeri kartu proyek dinamis dengan pencarian kata kunci dan filter kategori chip, dilengkapi *EmptyState*.
  5. `score.jsx` (My Score): Capaian akademik lengkap (Nilai 89, Grade A, 12.375 LP, 4 kartu progres capaian belajar).
  6. `contact.jsx` (Contact): Formulir pesan interaktif dengan validasi instan, riwayat pesan lokal, dan tautan sosial langsung.
- `app/project/[id].jsx`: Layar rute dinamis untuk menampilkan rincian proyek, deskripsi mendalam, daftar fitur, teknologi, dan tautan GitHub.

---

## 3. Strategi Pengguliran & List Virtualization

Sesuai panduan performa React Native (FR-41 dan NFR-02):
- **List Panjang & Dinamis** (`portfolio.jsx`, `skills.jsx`): Menggunakan `FlatList` sebagai penggulir utama tanpa dibungkus `ScrollView` bertingkat, sehingga terhindar dari *VirtualizedLists should never be nested warning* dan menjaga konsumsi memori tetap hemat di perangkat Android.
- Bagian atas list (judul, pencarian, filter chips) dipasang secara deklaratif melalui properti `ListHeaderComponent`.
- Kondisi kosong ditangani lewat `ListEmptyComponent` dengan komponen `EmptyState`.
- Tarik-untuk-muat-ulang (*pull-to-refresh*) didukung pada semua layar utama.

---

## 4. Sistem Desain & Dual Theme (Modern Biru-Ungu)

Seluruh token visual dipusatkan di `theme/tokens.js`:
- **Light Theme**:
  - Primary: `#4F46E5` (Indigo)
  - Accent: `#7C3AED` (Purple)
  - Background: `#F8FAFC`
  - Surface: `#FFFFFF`
  - Text: `#0F172A`
- **Dark Theme**:
  - Primary: `#818CF8`
  - Accent: `#A78BFA`
  - Background: `#0B1020`
  - Surface: `#151B2E`
  - Text: `#E5E7EB`

Preferensi tema disimpan secara persisten di penyimpanan perangkat via `@react-native-async-storage/async-storage` dengan kunci `@cv/theme` dan secara otomatis mendeteksi mode bawaan sistem pengguna (*system default*).

---

## 5. Aksesibilitas & Standar Industri (Level 10)

- Semua elemen interaktif memiliki `accessibilityRole` (button, link, search, alert, header).
- Label suara yang deskriptif disematkan via `accessibilityLabel` dan `accessibilityHint`.
- Nilai dinamis pada progress bar diumumkan via `accessibilityValue`.
- Target sentuh minimum dijamin **≥ 44 x 44 dp** untuk kenyamanan jempol tangan.
- Skalabilitas teks (`allowFontScaling`) didukung tanpa merusak tata letak.
- Formulir kontak dibungkus `KeyboardAvoidingView` agar kolom input tidak tertutup papan ketik virtual di Android.


# Tahap 3 — Struktur, Tumpuan, dan Stabilitas

**Proyek:** Gapura Papua STMKG, freestanding di depan tenda 3×3 m
**Status:** perhitungan pendahuluan untuk desain, **bukan sertifikasi struktur**
**Revisi:** 3 — 27 November 2026
**Dasar geometri:** Tahap 2C + revisi 3A/3B (banner digeser keluar, pemberat menjadi box)

---

## 1. Tujuan dan batas

Dokumen ini memeriksa:

1. stabilitas guling dan geser akibat angin;
2. tumpuan dan kebutuhan pemberat;
3. kekuatan balok, pilar, dan sambungan utama;
4. batas operasi dan rencana angin;
5. kecukupan material yang ada.

Yang **tidak** termasuk: analisis dinamis, sambungan las, pondasi, uji tarik material, dan verifikasi lapangan. Semua angka adalah estimasi konservatif dengan asumsi yang ditandai. Struktur belum boleh disebut "aman" sebelum diperiksa insinyur berwenang dan diuji coba di lokasi.

---

## 2. Dasar desain

### 2.1 Geometri final (Tahap 2C + revisi 3)

| Elemen | Dimensi | Posisi | Label |
|---|---|---|---|
| Balok | 3.600 × 500 × 500 mm | z = 2.000–2.500; y = 0.150–0.650 | K2/K3 |
| Pilar | 500×500 → 400×400 mm, h = 2.000 | x = ±1.000…±1.500; y = 0.150–0.650 | K1/K2 |
| Bukaan | 2.000 m bawah; 2.200 m atas | — | K2 |
| Lengkung | band 250 mm; naik 500 mm | y = 0.350–0.450; z = 2.500–3.000 | D4 |
| Burung | 800 × 800 × 100 mm | x = ±1.400…±2.200; z = 2.600–3.400 | D9 |
| Tiang burung | 100 × 100 × 500 mm | x = ±1.750; y = 0.400; z = 2.500–3.000 | KEPUTUSAN-2C |
| Banner | 600 × 1500 mm | x = ±1.500…±2.100; y = 0.800; z = 0–1.500 | KEPUTUSAN-3A |
| Rel banner | 600 × 80 × 60 mm | x = ±1.500…±2.100; y = 0.760–0.840; z = 1.480–1.540 | KEPUTUSAN-2C/3A |
| Runner | 1.600 × 100 × 100 mm | x = ±1.200…±1.300; y = 0.150–1.750 | KOREKSI-2B |
| Box pemberat | 500 × 1.050 × 400 mm | x = ±0.980…±1.480; y = 0.700–1.750; z = 0.100–0.500 | KEPUTUSAN-3B |
| Tenda | 3.000 × 3.000 mm; puncak 3.200 | y = −3.000…0 | D5/ASUMSI |

**Revisi 3A:** banner digeser 150 mm keluar (dari x = ±1.350…±1.950 menjadi ±1.500…±2.100) agar tidak bertabrakan dengan box pemberat. Lebar dan tinggi banner tidak berubah. Hanger dipindah ke x = ±1.500 dan ±1.800; rel menumpu di dua titik dengan kantilever 300 mm ke luar.

**Revisi 3B:** pemberat berubah dari blok 200×200×200 mm (placeholder 2C) menjadi box 500×1.050×400 mm per sisi, berisi 300 kg pasir/kerikil. Box duduk di atas runner dan dua kaki kayu, di depan pilar, dengan celah 20 mm ke banner.

### 2.2 Material (asumsi konservatif)

| Material | Asumsi | Label |
|---|---|---|
| Kayu | 45 × 70 mm, E = 10.000 MPa, izin lentur 8 MPa, izin tekan 10 MPa | `[ASUMSI]` |
| Plywood | 9 mm, E = 6.000 MPa, izin lentur 12 MPa | `[ASUMSI]` |
| Baut M10 4.6 | tarik 12 kN; geser 16 kN; faktor sambungan kayu 0.5 | `[ASUMSI]` |
| Baut M8 4.6 | tarik 7 kN; geser 9 kN; faktor sambungan kayu 0.5 | `[ASUMSI]` |
| Pasir/kerikil | 1.600 kg/m³ (kering, padat) | `[ASUMSI]` |
| Paving | daya dukung izin 100 kPa | `[ASUMSI]` |
| Beban angin | v = 20 m/s; Cp = 1.3 | `[ASUMSI]` |

### 2.3 Berat

| Komponen | Massa | Berat |
|---|---:|---:|
| Superstruktur (kayu, plywood, lengkung, burung, banner, alat) | 180 kg | 1,77 kN |
| Isi pemberat 2 × 300 kg | 600 kg | 5,89 kN |
| Box + kaki + lid (2 box) | ≈ 30 kg | 0,29 kN |
| **Total** | **810 kg** | **7,95 kN** |

Untuk perhitungan guling, berat box (30 kg) diabaikan sehingga hasilnya konservatif. Pusat massa superstruktur diasumsikan di **y = 0,42 m**. Pusat massa isi pemberat di **y = 1,225 m** (box y = 0,700–1,750).

### 2.4 Angin

Kecepatan rencana operasi:

```text
v = 20 m/s
q = 0,5 × ρ × v² = 0,5 × 1,225 × 20² = 245 Pa
p = Cp × q = 1,3 × 245 = 318,5 Pa ≈ 320 Pa
```

`Cp = 1,3` mencakup bentuk persegi dan gust sedang. `[ASUMSI]`

---

## 3. Beban angin efektif

Luas proyeksi dan porositas:

| Komponen | A bruto (m²) | Porositas | A efektif (m²) | z pusat (m) |
|---|---:|---:|---:|---:|
| Balok | 1,80 | 1,00 | 1,80 | 2,25 |
| Pilar (2) | 2,00 | 1,00 | 2,00 | 1,00 |
| Lengkung terekspos | 0,60 | 1,00 | 0,60 | 2,70 |
| Burung (2) | 1,28 | 0,50 | 0,64 | 3,00 |
| Banner (2) | 1,80 | 0,50 | 0,90 | 0,75 |
| Tiang burung (2) | 0,10 | 1,00 | 0,10 | 2,75 |
| Box pemberat (2) | 0,40 | 1,00 | 0,40 | 0,30 |
| **Total** | **7,98** | — | **6,44** | — |

```text
A_eff = 6,44 m²
z_c = Σ(A_i × z_i) / ΣA_i = 1,65 m
F_w = p × A_eff = 320 × 6,44 = 2,061 kN
M_w = F_w × z_c = 2,061 × 1,65 = 3,40 kN·m
```

---

## 4. Stabilitas guling

Dua pivot diperiksa:

- **A — tepi belakang** y = 0,150 m (angin dari depan, atas terdorong ke tenda);
- **B — tepi depan** y = 1,750 m (angin dari belakang, atas terdorong ke pengunjung).

### 4.1 Guling ke belakang (pivot A)

```text
M_penahan = W_s × (0,42 − 0,15) + W_b × (1,225 − 0,15)
          = 1,77 × 0,27 + 5,89 × 1,075
          = 0,478 + 6,332 = 6,810 kN·m

FOS_A = 6,810 / 3,40 = 2,00
```

### 4.2 Guling ke depan (pivot B)

```text
M_penahan = W_s × (1,75 − 0,42) + W_b × (1,75 − 1,225)
          = 1,77 × 1,33 + 5,89 × 0,525
          = 2,354 + 3,092 = 5,446 kN·m

FOS_B = 5,446 / 3,40 = 1,60
```

**Kedua FOS ≥ 1,5.** Dengan 600 kg pemberat, batas operasi 20 m/s tercapai. FOS minimum adalah 1,60 pada angin dari belakang.

### 4.3 Tanpa pemberat

```text
FOS_A = 0,478 / 3,40 = 0,14
FOS_B = 2,354 / 3,40 = 0,69
```

**Gapura tidak boleh berdiri tanpa pemberat.** Ini batas mutlak, bukan saran.

### 4.4 Pemberat 300 kg total (150 kg/sisi)

```text
M_A = 0,478 + 1,47 × 1,075 = 2,058 kN·m → FOS_A = 0,61
M_B = 2,354 + 1,47 × 0,525 = 3,126 kN·m → FOS_B = 0,92
```

Gagal. **600 kg adalah minimum desain.** Dengan 650 kg total, FOS_B ≈ 1,68; dengan 700 kg, FOS_B ≈ 1,76.

### 4.5 Ringkasan

| Kondisi | FOS_A | FOS_B | Status |
|---|---:|---:|---|
| Tanpa pemberat | 0,14 | 0,69 | **tidak boleh** |
| 300 kg total | 0,61 | 0,92 | gagal |
| **600 kg total** | **2,00** | **1,60** | **minimum desain** |
| 650 kg total | 2,16 | 1,68 | disarankan jika ruang izin |

---

## 5. Geser dan bearing

### 5.1 Geser

```text
R = μ × W_total = 0,50 × 7,66 = 3,83 kN
FOS_geser = 3,83 / 2,061 = 1,86
```

Dengan paving basah μ = 0,35:

```text
R = 2,68 kN; FOS = 1,30
```

**Syarat:** hanya dipasang di paving kering; tambahkan pad karet 6 mm di bawah kaki box pemberat dan alas pilar. Jika hujan lebat/paving basah, operasi dihentikan.

### 5.2 Bearing

```text
A_tumpuan = 2 × (0,50 × 0,50) + 4 × (0,10 × 1,05)
          = 0,50 + 0,42 = 0,92 m²
p_rata = 7,66 / 0,92 = 8,3 kPa
p_max_kaki_box = 1,47 / 0,105 = 14,0 kPa
p_max_pilar = 0,90 / 0,25 = 3,6 kPa
```

Semua jauh di bawah 100 kPa. Bearing bukan penentu; yang kritis adalah guling dan geser. Paving harus rata dan tidak berlubang; gunakan alas plywood 12 mm di bawah kaki box untuk menyebar beban.

---

## 6. Pemeriksaan elemen

### 6.1 Balok

Bentang bersih antar pilar atas = 2,20 m. Beban angin balok:

```text
w = 1,80 × 320 / 3,60 = 160 N/m
M = w L² / 8 = 160 × 2,20² / 8 = 96,8 N·m
```

Section box 500×500 dengan plywood 9 mm dan 4 flange kayu 45×70:

```text
I ≈ 1,31 × 10⁻³ m⁴
S = I / 0,25 = 5,24 × 10⁻³ m³
σ = M / S = 96,8 / 5,24e-3 = 18,5 kPa = 0,019 MPa
δ = 5 w L⁴ / (384 E I) = 0,004 mm
```

Tegangan dan defleksi sangat kecil. **Balok tidak kritis untuk lentur**; yang kritis adalah sambungan dan guling. Kantilever 0,70 m di ujung balok juga kecil: M = 160 × 0,70² / 2 = 39 N·m.

### 6.2 Pilar

Beban aksial per pilar ≈ 0,90 kN. Luas kayu 4 × 45 × 70 = 12.600 mm²:

```text
σ_aksial = 900 / 12.600 = 0,071 MPa
```

Momen angin per pilar (A = 1,0 m², resultan di z = 1,0 m):

```text
M_p = 320 × 1,0 = 320 N·m
I_4post ≈ 5,82 × 10⁸ mm⁴; S ≈ 2,33 × 10⁶ mm³
σ_lentur = 320.000 / 2,33e6 = 0,137 MPa
σ_total = 0,071 + 0,137 = 0,208 MPa << 8 MPa
```

Pilar 500×500 dengan 4 post 45×70 tidak kritis terhadap tekan/lentur; stabilitas global yang menentukan.

### 6.3 Lengkung dan burung

Lengkung adalah band 250 mm dari kayu laminasi/kerf + skin. Beban angin 0,6 m² × 320 = 192 N, ditahan oleh dua ujung di atas balok. Burung 800×800×100 mm dari plywood 9 mm; berat ≈ 4 kg/burung; angin 0,32 m² efektif × 320 = 102 N per burung. Tiang burung 100×100×500 menahan momen 102 × 0,4 = 41 N·m; section modulus 100×100²/6 = 1,67e5 mm³; σ = 0,25 MPa. Aman.

---

## 7. Sambungan

| Sambungan | Gaya desain | Alat | Cek |
|---|---|---|---|
| Balok–pilar | V = 0,97 kN; M = 0,48 kN·m | 4 × M10 + gusset plywood 9 mm 200×200, dua sisi | T tarik 1,6 kN/baut; izin 6 kN → FOS 3,7 |
| Pilar–runner | Uplift 0,72 kN; geser 0,97 kN | notch 100×100 + 2 saddle block 100×100×300 + 2 × M10 tembus + 2 gusset 200×200×9 | Geser 0,49 kN/baut; izin 8 kN → FOS 16 |
| Tiang burung–balok | V = 0,20 kN; M = 0,10 kN·m | 2 × M8 × 160 + blocking 100×100×100 dalam balok + base plate 150×150×9 | 1,0 kN/baut; izin 4 kN → FOS 4 |
| Banner–rel | 0,14 kN/hanger | 2 × rod 6 mm + eye screw + hook + safety wire | izin 2 kN → FOS 14 |
| Box pemberat–runner | 0,97 kN/box | 2 × M8 + 2 strap 25 mm | gesekan + baut |
| Skin plywood–rangka | 7,2 N/sekrup | sekrup 4×40 @150 mm + PU | pull-through > 200 N |

**Catatan:** semua baut harus tembus dengan ring lebar (Ø ≥ 30 mm) di kedua sisi kayu. Gusset plywood dipasang bolak-balik dengan lem PU + sekrup. Jangan mengandalkan sekrup saja untuk menahan momen.

### 7.1 Detail pilar–runner (KEPUTUSAN-3C)

1. Potong **notch 100×100 mm** pada bottom frame dan kulit depan/belakang pilar, dari y = 0,150 sampai 0,650, di x = 1,200–1,300 (kiri: −1,300…−1,200).
2. Letakkan runner 100×100 di dalam notch, rata dengan paving.
3. Pasang **2 saddle block 100×100×300 mm** di kiri-kanan runner, di dalam pilar, direkatkan dan disekrup ke bottom frame.
4. Bor **2 × M10** horizontal menembus saddle block–runner–saddle block, di y = 0,25 dan 0,55; ring lebar di kedua sisi.
5. Pasang **2 gusset plywood 9 mm 200×200** di luar pilar, menghubungkan runner ke kulit depan pilar; lem + sekrup 4×40 @75 mm.
6. Seal semua potongan dengan cat kayu/waterproof.

### 7.2 Detail balok–pilar (KEPUTUSAN-3D)

1. Balok diletakkan di atas pilar; soffit balok z = 2,000.
2. Bor **4 × M10** vertikal menembus bottom rail balok dan top rail pilar, pada jarak 100 mm dari tepi, dengan ring 30 mm.
3. Pasang **gusset plywood 9 mm 200×200** di dua sisi pertemuan, lem PU + sekrup.
4. Cek plumb pilar sebelum mengencangkan; gunakan shim 2–3 mm jika perlu.
5. Tutup kepala baut dengan dempul kayu dan cat.

### 7.3 Detail tiang burung–balok (KEPUTUSAN-3E)

1. Pasang **blocking 100×100×100 mm** di dalam balok, di x = ±1,750, y = 0,350–0,450, z = 2,400–2,500; lem + sekrup ke rangka balok.
2. Letakkan **base plate plywood 150×150×9 mm** di atas kulit balok, di atas blocking.
3. Bor **2 × M8 × 160 mm** menembus base plate, kulit balok, dan blocking; ring 25 mm.
4. Pasang tiang 100×100×500 mm; cek vertikal; kencangkan.
5. Burung diikat ke tiang dengan **2 × M8** melalui tab 100×100×12 mm; tab masuk ke celah di badan burung.

### 7.4 Detail banner–rel–hanger (KEPUTUSAN-3F)

1. Rel 600×80×60 mm di z = 1,480–1,540, y = 0,760–0,840.
2. Dua hanger rod galvanis 6 mm, dari eye screw di soffit balok (x = ±1,500 dan ±1,800, y = 0,650, z = 2,000) ke hook di rel (y = 0,820, z = 1,540). Panjang rod ≈ 490 mm.
3. Rel menumpu di x = 1,500 dan 1,800; kantilever 300 mm ke x = 2,100.
4. Banner 600×1500 dijahit dengan sleeve atas; masukkan rel; kencangkan dengan 3 sekrup kecil di tiap ujung.
5. Pasang **safety wire** 1,5 mm dari eye screw ke hook agar banner tidak lepas saat angin.

### 7.5 Detail box pemberat–runner (KEPUTUSAN-3G)

1. Box 500×1.050×400 mm, dinding plywood 9 mm/OSB + rangka 45×70, dua kaki 100×100×1.050 mm.
2. Letakkan box di atas runner, dengan runner di antara kedua kaki; alas kaki diberi pad karet 6 mm.
3. Isi 12 kantong × 25 kg per box (300 kg); padatkan; tutup lid.
4. Ikat box ke runner dengan **2 strap 25 mm** di y = 0,90 dan 1,55, plus **2 × M8** melalui bottom box ke runner.
5. Beri celah 20 mm ke banner; jangan menaruh beban tambahan di atas box saat angin.

---

## 8. Desain box pemberat

Setiap sisi:

```text
Box: 500 (x) × 1.050 (y) × 400 (z) mm
Isi: 300 kg pasir/kerikil = 0,1875 m³ (89% dari volume box 0,21 m³)
Kantong: 12 × 25 kg per box; 24 kantong total
Posisi: x = ±0,980…±1,480; y = 0,700–1,750; z = 0,100–0,500
```

Konstruksi:

- shell plywood 9 mm/OSB + rangka kayu 45×70;
- dua kaki 100×100×1.050 mm di sisi kiri-kanan runner;
- alas kaki + pad karet 6 mm;
- tutup plywood yang bisa dibuka untuk mengisi/mengeluarkan kantong;
- 2 baut M8 + 2 strap ke runner;
- dicat warna paving/kayu agar menyatu.

Fungsi ganda: pemberat + planter/bench rendah. Jangan duduk/berdiri di atas box saat angin kencang.

---

## 9. Batas operasi dan rencana angin

| Kondisi | Tindakan |
|---|---|
| v ≤ 20 m/s (72 km/h) | boleh berdiri dengan 600 kg pemberat, banner terpasang |
| 20 < v ≤ 25 m/s | lepas banner (mengurangi 0,90 m²), tambah 4 kantong per sisi, atau bongkar |
| v > 25 m/s atau badai | bongkar/lipat gapura; jangan andalkan pemberat |
| Paving basah/licin | hentikan operasi; pasang pad karet; keringkan |
| Setelah hujan/angin | periksa baut, strap, box, banner, dan plumb |

Rencana bongkar:

1. lepas banner dan burung (ringan);
2. lepas baut pilar–runner;
3. turunkan balok+pilar bersama (4 orang) atau bongkar per komponen;
4. simpan di tempat kering.

---

## 10. Temuan material

Perhitungan ini mengasumsikan box plywood dengan rangka kayu. Dengan material awal **2 lembar plywood 9 mm + 8 balok 4 m**, cakupan tidak cukup untuk versi kulit penuh. Ada dua jalur:

### 10.1 Versi Rekomendasi — 3 lembar plywood

| Kebutuhan plywood tampak | Luas |
|---|---:|
| Kulit depan balok | 1,80 m² |
| Kulit bawah balok (soffit) | 1,80 m² |
| Kulit depan pilar (2) | 2,00 m² |
| Burung (2, 800×800) | 1,28 m² |
| Lengkung + gusset + cadangan | 0,60 m² |
| **Total** | **7,48 m²** |
| 2 lembar existing (1220×2440) | 5,95 m² |
| **Kekurangan** | **1,53 m²** |

**Cukup dengan 1 lembar tambahan** (2,98 m²), total 3 lembar, sisa ≈ 1,45 m² untuk lid box/cadangan. Box pemberat memakai kayu reklaim/OSB, bukan jatah plywood ini.

### 10.2 Versi Hemat — 2 lembar plywood

| Kebutuhan | Luas |
|---|---:|
| Kulit depan balok | 1,80 m² |
| Kulit depan pilar (2) | 2,00 m² |
| Burung 600×600 (2) | 0,72 m² |
| Gusset + cadangan | 0,50 m² |
| **Total** | **5,02 m²** |

Soffit balok memakai kain tebal dicat, lengkung memakai kain, banner memakai flexi/banner cloth, box pemberat memakai kayu reklaim. Sisa ≈ 0,93 m². Konsekuensi: kekakuan balok sedikit turun, burung lebih kecil (total lebar 4,0 m; G ≥ 0,50 m), dan soffit kain perlu dirawat. Stabilitas global tidak berubah karena ditentukan pemberat.

### 10.3 Kayu

| Kebutuhan kayu | Estimasi |
|---|---:|
| 8 post pilar 2,0 m | 16,0 m |
| 4 rail balok 3,6 m | 14,4 m |
| **Subtotal rangka utama** | **30,4 m** |
| Rusuk/bracing/arch spine/runner/banner rail/saddle block | ≈ 20–24 m |
| **Total** | **50–54 m (13–14 balok 4 m)** |

8 balok existing = 32 m; perlu **5–6 balok tambahan** atau kayu reklaim untuk runner, arch spine, bracing, dan saddle block. Prioritaskan pembelian untuk bagian struktural (runner, arch spine); bagian tersembunyi boleh reklaim.

---

## 11. Checklist verifikasi sebelum fabrikasi

- [ ] Ukur puncak tenda; konfirmasi 3.200 mm atau perbarui geometri.
- [ ] Ukur lebar lokasi; pastikan G ≥ 0.700 m ke tetangga (versi 3,6 m) atau G ≥ 0.550 m (varian 3,3 m).
- [ ] Pastikan paving rata (kemiringan ≤ 2%) dan kering.
- [ ] Konfirmasi section kayu aktual (45×70 atau lain); perbarui perhitungan jika berbeda.
- [ ] Konfirmasi plywood 9 mm vs 12 mm; perbarui berat.
- [ ] Siapkan 24 kantong pasir 25 kg (600 kg) dan 2 box.
- [ ] Siapkan 4 orang untuk angkat/turun.
- [ ] Buat uji coba rakitan di halaman sebelum hari-H.
- [ ] Isi checklist inspeksi Tahap 5.

---

## 12. Kesimpulan

1. Gapura **tidak stabil tanpa pemberat**; 600 kg adalah minimum desain untuk v = 20 m/s.
2. Dengan 600 kg, FOS guling 2,00 (belakang) dan 1,60 (depan); geser 1,86 (kering); bearing 8,3 kPa rata-rata.
3. Batas operasi: **20 m/s**; di atas itu lepas banner dan tambah pemberat atau bongkar.
4. Balok dan pilar sangat kuat untuk lentur/tekan; **sambungan dan ballast** yang menentukan.
5. Material: 3 lembar plywood (rekomendasi) atau 2 lembar + kain (hemat); 8 balok + 5–6 balok tambahan/reklaim.
6. Semua angka adalah pendahuluan; verifikasi oleh insinyur dan uji coba lapangan wajib sebelum digunakan publik.

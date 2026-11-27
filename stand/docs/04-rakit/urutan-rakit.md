# Tahap 4 — Urutan Rakit, Cutting List, dan Persiapan Lokasi

**Proyek:** Gapura Papua STMKG, freestanding di depan tenda 3×3 m
**Status:** panduan fabrikasi dan rakit, **bukan gambar kerja tersertifikasi**
**Revisi:** 1 — 27 November 2026
**Dasar:** Tahap 2C (geometri) + Tahap 3 (struktur, rev 3) + KEPUTUSAN-3A…3G
**Gambar pendamping:** `urutan-rakit.png` (8 langkah), `../03-struktur/detail-1.png`, `../03-struktur/detail-2.png`

---

## 1. Prasyarat dan batas

Pekerjaan ini boleh dimulai hanya jika:

1. Paving rata (kemiringan ≤ 2%), kering, tidak berlubang, dan mampu menahan beban ≥ 100 kPa `[ASUMSI]`.
2. Jarak ke tetangga G ≥ 0.700 m untuk versi balok 3.600 mm; G ≥ 0.550 m untuk varian 3.300 mm `[KONFIRMASI]`.
3. Puncak tenda sudah diukur; angka 3.200 mm masih `[ASUMSI]` sampai diukur.
4. Material, alat, dan 24 kantong pasir 25 kg (600 kg) tersedia.
5. Minimal 4 orang untuk angkat balok; 2 orang untuk pekerjaan di atas tangga.
6. Tidak ada penambatan, tiang pancang, atau lubang pada paving/tenda. Tenda **tidak boleh** dibebani atau diikat.

Dokumen ini tidak menggantikan pemeriksaan insinyur berwenang. Semua sambungan dan pemberat harus dicek di lokasi sebelum dipakai publik.

---

## 2. Data yang dipakai

| Item | Nilai | Label |
|---|---|---|
| Lebar total gapura (ujung ekor) | 4.400 mm | `[KEPUTUSAN]` |
| Tinggi total | 3.400 mm | `[KEPUTUSAN]` |
| Soffit balok | z = 2.000 mm | `[KEPUTUSAN-K2]` |
| Balok | 3.600 × 500 × 500 mm | `[KEPUTUSAN-K2]` |
| Pilar | 500×500 → 400×400 mm, h = 2.000 mm | `[KEPUTUSAN-K1/K2]` |
| Bukaan bawah / atas | 2.000 / 2.200 mm | `[KEPUTUSAN-K2]` |
| Runner | 1.600 × 100 × 100 mm, y = 0.150–1.750 | `[KOREKSI-2B]` |
| Box pemberat | 500 × 1.050 × 400 mm, 2 × 300 kg | `[KEPUTUSAN-3B]` |
| Banner | 600 × 1.500 mm, x = ±1.500…±2.100 | `[KEPUTUSAN-3A]` |
| Rel banner | 600 × 80 × 60 mm | `[KEPUTUSAN-2C/3A]` |
| Jarak ke tenda | 150 mm (y = 0.150) | `[KONFIRMASI]` |
| Batas angin operasi | 20 m/s | `[ASUMSI]` |
| Pemberat minimum | 600 kg total | `[KEPUTUSAN-3B]` |

---

## 3. Cutting list kayu 45×70 mm

Section kayu aktual harus dicek; tabel memakai 45×70 mm `[ASUMSI]`. Jika section berbeda, perbarui panjang dan perhitungan.

| No | Komponen | Potongan (mm) | Qty | Total (m) | Catatan |
|---:|---|---:|---:|---:|---|
| 1 | Post pilar | 2.000 | 8 | 16.0 | 4 post per pilar |
| 2 | Rail bawah pilar | 500 | 8 | 4.0 | 2 pilar × 4 sisi |
| 3 | Rail atas pilar | 400 | 8 | 3.2 | 2 pilar × 4 sisi |
| 4 | Rail tengah/bracing pilar | 800 | 4 | 3.2 | 2 per pilar |
| 5 | Rail balok memanjang | 3.600 | 4 | 14.4 | 4 sisi balok |
| 6 | Vertikal/blocking balok | 500 | 4 | 2.0 | @ ±1.200 dan ±1.750 |
| 7 | Spine lengkung | 3.700 | 2 | 7.4 | kerf/laminasi; panjang developed |
| 8 | Rusuk lengkung | 300 | 4 | 1.2 | penopang band |
| 9 | Gusset/cleat | 200 | 10 | 2.0 | dari offcut |
| **Total** | | | | **53.4 m** | ≈ 13–14 balok 4 m |

**Cek material:**

```text
8 balok existing × 4.0 m = 32.0 m
Kebutuhan tambahan = 53.4 − 32.0 = 21.4 m
Jumlah balok 4 m tambahan = 21.4 / 4 = 5.35 → 6 balok (atau reklaim)
```

Sisa potongan disimpan untuk shim, cleat, dan perbaikan.

### 3.1 Kayu 100×100 mm (runner, saddle, tiang burung)

| Komponen | Potongan (mm) | Qty | Total (m) | Catatan |
|---|---:|---:|---:|---|
| Runner | 1.600 | 2 | 3.2 | bisa 100×100 solid atau laminasi |
| Saddle block | 300 | 4 | 1.2 | 2 per pilar |
| Tiang burung | 500 | 2 | 1.0 | x = ±1.750 |
| Blocking dalam balok | 100 | 2 | 0.2 | di x = ±1.750 |
| **Total** | | | **5.6 m** | stok/reklaim terpisah |

Jika 100×100 tidak tersedia, laminasi 2 × 45×70 dengan lem PU + sekrup; kebutuhan kayu 45×70 menjadi 11.2 m tambahan. Jangan memakai potongan yang berlubang besar atau retak.

### 3.2 Kayu 80×60 mm (rel banner)

| Komponen | Potongan (mm) | Qty | Total (m) |
|---|---:|---:|---:|
| Rel banner | 600 | 2 | 1.2 |

Bisa juga di-rip dari kayu 45×70 yang dilaminasi menjadi 80×60; label `[ASUMSI]` jika section berbeda.

---

## 4. Cutting list plywood 9 mm

| No | Komponen | Ukuran (mm) | Luas (m²) | Catatan |
|---:|---|---:|---:|---|
| 1 | Kulit depan balok | 3.600 × 500 | 1.80 | 1 lembar utuh |
| 2 | Kulit soffit balok | 3.600 × 500 | 1.80 | sambung bila perlu |
| 3 | Kulit depan pilar | 2.000 × 500 | 2.00 | 2 pilar |
| 4 | Burung | 800 × 800 | 1.28 | 2 pcs |
| 5 | Lengkung, gusset, cadangan | — | 0.60 | termasuk 8 gusset 200×200 |
| **Total** | | | **7.48 m²** | |

**Cek lembar:**

```text
1 lembar 1.220 × 2.440 = 2.977 m²
3 lembar = 8.931 m²
Sisa = 8.931 − 7.48 = 1.45 m²
```

**Keputusan:** 3 lembar (2 existing + 1 tambahan) `[KEPUTUSAN]`. Box pemberat memakai OSB/kayu reklaim, bukan jatah plywood ini. Jika hanya 2 lembar, pakai versi hemat (soffit kain, burung 600×600) seperti laporan struktur §10.2.

---

## 5. Hardware dan bahan habis pakai

| Item | Spesifikasi | Qty | Catatan |
|---|---|---:|---|
| Baut M10×160 | 4.6, ring lebar Ø30, mur | 14 | 8 balok–pilar + 4 pilar–runner + 2 cadangan |
| Baut M8×160 | 4.6, ring Ø25, mur | 14 | 4 tiang burung + 4 tab burung + 4 box + 2 cadangan |
| Sekrup kayu 4×40 | galvanis | 500 | skin, gusset, arch @150 |
| Sekrup kayu 5×80 | galvanis | 100 | rangka |
| Sekrup kayu 8×100 | galvanis | 50 | saddle/blocking |
| Lem PU | exterior | 2 kg | semua sambungan kayu |
| Sealant | exterior | 2 tube | celah skin |
| Eye screw | Ø6, 50 mm | 4 | soffit balok |
| Hook | Ø6 | 4 | rel banner |
| Rod galvanis | Ø6 × 500 | 4 | hanger |
| Safety wire | Ø1.5 | 4 m | banner |
| Strap ratchet | 25 mm | 4 | 2 per box |
| Kantong pasir | 25 kg | 24 | 600 kg total |
| Karet pad | 6 mm | 4 × (100×1.050) + 2 × (500×500) | bawah kaki box & pilar |
| Plywood pad | 12 mm | 2 × (550×1.100) | sebar beban di paving |
| Warning strip | 3.400 × 80 | 1 | reflektor/plywood dicat |
| Banner | 600 × 1.500 | 2 | flexi/kain |
| Cat kayu | sealer + exterior | 5 L + 5 L | 2 lapis |
| Amplas, kuas, kain | — | secukupnya | |

**Catatan banner:** jika banner 1.500 mm menyentuh paving, lipat hem bawah 50 mm atau gunakan tinggi cetak 1.450 mm. Area angin berubah < 4%; stabilitas tetap ditentukan pemberat. `[KEPUTUSAN-4A]`

---

## 6. Alat

- Circular saw + guide rail, jigsaw, bor 8/10 mm, impact driver.
- Kunci socket 10/13/17, kunci pas, tang, cutter.
- Waterpass 1.2 m, unting, tali, meteran 5 m, siku, pensil.
- 4 sawhorse, 6 clamp, 2 tangga aluminium, terpal.
- APD: helm, sarung tangan, kacamata, sepatu, rompi.
- Barikade/cone dan papan "pekerjaan".

---

## 7. Tenaga dan waktu

| Tahap | Orang | Waktu |
|---|---:|---:|
| Fabrikasi rangka + skin | 2–3 | 3–4 hari |
| Pra-rakit di halaman | 3–4 | 1 hari |
| Rakit di lokasi | 4 | 3–4 jam |
| Bongkar | 3–4 | 2 jam |

Waktu tidak termasuk pengeringan cat (24 jam) dan pengeringan lem (12 jam).

---

## 8. Setting out di lokasi

1. Bersihkan paving; tandai tepi tenda sebagai garis y = 0.
2. Tarik garis sejajar tenda pada y = 0.150 (muka depan gapura). Jangan membuat lubang.
3. Tandai centerline runner kiri dan kanan pada x = −1.250 dan +1.250.
4. Tandai ujung runner y = 0.150 dan y = 1.750.
5. Cek persegi dengan diagonal.

**Rumus diagonal runner:**

```text
d = √(2.500² + 1.600²)
  = √(6.250.000 + 2.560.000)
  = √8.810.000
  = 2.968 mm
```

Toleransi diagonal ±10 mm. Jika lebih, geser runner sebelum dipasang.

**Cek bukaan pilar:**

```text
Diagonal bukaan (bawah 2.000, atas 2.200, tinggi 2.000):
d = √(2.100² + 2.000²) = √(4.410.000 + 4.000.000) = 2.900 mm
```

Kedua diagonal harus sama (±10 mm). Ini memastikan pilar tidak miring ke samping.

---

## 9. Pra-rakit di halaman

Lakukan sebelum hari-H, di permukaan rata:

1. Potong semua kayu sesuai cutting list; beri label L/R dan nomor komponen.
2. Buat 2 rangka pilar 500×500 → 400×400; cek diagonal alas 707 mm dan atas 566 mm.
3. Buat rangka balok 3.600×500; cek diagonal 3.635 mm; pasang 4 rail memanjang.
4. Buat lengkung di template: band 250 mm, naik 500 mm; cek tali.
5. Potong burung 800×800; haluskan tepi; cat.
6. Buat 2 box pemberat; coba masukkan 12 kantong; timbang.
7. Coba pasang balok di atas 2 pilar; bor lubang M10; pasang gusset; bongkar lagi.
8. Cat semua permukaan; keringkan 24 jam. Beri tanda "DEPAN" pada balok.

**Cek rangka pilar:**

```text
Diagonal alas 500×500 = √(500² + 500²) = 707 mm
Diagonal atas 400×400 = √(400² + 400²) = 566 mm
```

**Cek rangka balok:**

```text
Diagonal = √(3.600² + 500²) = √(12.960.000 + 250.000) = 3.635 mm
```

---

## 10. Urutan rakit di lokasi (8 langkah)

### Langkah 1 — Set out dan runner

1. Pasang plywood pad 12 mm + karet 6 mm di jalur runner.
2. Letakkan 2 runner 100×100 pada x = ±1.250, y = 0.150–1.750.
3. Letakkan box pemberat kosong di atas runner; jangan isi dulu.
4. Cek level runner (≤3 mm/m) dan diagonal 2.968 mm.

**Jangan** mengisi pasir sebelum pilar dan balok terpasang; box berat sulit digeser.

### Langkah 2 — Pilar kiri

1. Angkat rangka pilar kiri (2 orang) dan masukkan runner ke notch 100×100.
2. Pasang 2 saddle 100×100×300 di kiri-kanan runner; lem + sekrup.
3. Bor 2×M10 tembus saddle–runner–saddle di y = 0.25 dan 0.55; ring Ø30.
4. Pasang 2 gusset 200×200×9 di luar pilar; lem + sekrup @75 mm.
5. Cek plumb dengan unting; deviasi ≤5 mm per 2 m. Pasang brace sementara ke box/runner (bukan ke paving).

### Langkah 3 — Pilar kanan

1. Ulangi langkah 2 untuk pilar kanan.
2. Cek jarak luar atas 3.000 mm (2 × 1.500), jarak dalam atas 2.200 mm, jarak dalam bawah 2.000 mm.
3. Cek kedua diagonal bukaan 2.900 mm; selisih ≤10 mm.
4. Pasang brace sementara antar pilar di z ≈ 1.0 m; jangan skrup permanen.

### Langkah 4 — Balok

1. Angkat balok 3.600×500×500 dengan 4 orang; jangan angkat satu sisi.
2. Letakkan di atas pilar; soffit z = 2.000; cek overhang 300 mm dari muka luar pilar.
3. Bor 4×M10×160 per sisi; ring Ø30; kencangkan silang.
4. Pasang gusset 200×200×9 di dua sisi; lem + sekrup.
5. Cek level balok (≤3 mm/3.6 m); lepas brace sementara setelah baut kencang.

**Alternatif aman:** pasang lengkung dan tiang burung ke balok di tanah, lalu angkat satu unit. Berat tambahan ≈ 8–10 kg; masih dapat diangkat 4 orang. Kurangi pekerjaan di tangga.

### Langkah 5 — Lengkung dan tiang burung

1. Pasang band lengkung 250 mm di atas balok; lem PU + sekrup 4×40 @150 mm.
2. Pasang 2 tiang burung 100×100×500 di x = ±1.750, y = 0.400; base plate 150×150×9 + 2×M8×160.
3. Cek simetri lengkung dengan tali; deviasi maks 5 mm.
4. Cek tiang burung vertikal; jangan menambah beban di tengah lengkung.

### Langkah 6 — Burung

1. Pasang burung 800×800×9 di ujung lengkung/tiang burung.
2. Tab 100×100×12 masuk celah badan burung; 2×M8 per burung; ring Ø25.
3. Cek kiri-kanan simetris dan tidak menyentuh tenda (celah ≥150 mm).
4. Kencangkan secukupnya; jangan sampai plywood retak.

### Langkah 7 — Banner dan rel

1. Pasang rel 600×80×60 di z = 1.480–1.540; dua hanger Ø6 per banner.
2. Masukkan banner 600×1500 ke sleeve rel; 3 sekrup kecil tiap ujung.
3. Pasang safety wire 1.5 mm dari eye screw ke hook.
4. Cek celah 20 mm ke box pemberat; banner tidak menempel tenda.
5. Jika banner menyentuh paving, lipat hem 50 mm.

### Langkah 8 — Pemberat dan serah terima

1. Isi 12 kantong ×25 kg per box; padatkan; jangan ada kantong menggantung.
2. Tutup lid; pasang 2 strap 25 mm + 2×M8 box–runner.
3. Cek total 600 kg (timbang atau hitung kantong).
4. Cek semua baut, ring, gusset, plumb, dan level.
5. Isi checklist, foto, dan serah terima. **Jangan dipakai tanpa 600 kg.**

**Cek pemberat:**

```text
12 kantong × 25 kg = 300 kg per box
2 box × 300 kg = 600 kg total
```

**Cek stabilitas (dari laporan struktur):**

```text
FOS_A = 2.00 (angin dari depan)
FOS_B = 1.60 (angin dari belakang)
Batas operasi v = 20 m/s
```

Jika angin >20 m/s: lepas banner, tambah 4 kantong per sisi, atau bongkar.

---

## 11. Checklist pemeriksaan per langkah

| Langkah | Yang dicek | Kriteria | Paraf |
|---:|---|---|---|
| 1 | Level runner | ≤3 mm/m | |
| 1 | Jarak runner | 2.500 ±5 mm | |
| 1 | Diagonal runner | 2.968 ±10 mm | |
| 2 | Plumb pilar kiri | ≤5 mm/2 m | |
| 2 | Baut pilar–runner | 2×M10 kencang, ring lengkap | |
| 3 | Jarak dalam atas | 2.200 ±5 mm | |
| 3 | Jarak dalam bawah | 2.000 ±5 mm | |
| 3 | Diagonal bukaan | 2.900 ±10 mm, selisih ≤10 mm | |
| 4 | Level balok | ≤3 mm/3.6 m | |
| 4 | Baut balok–pilar | 8×M10 kencang | |
| 4 | Gusset | 2 sisi, lem + sekrup | |
| 5 | Rise lengkung | 500 ±10 mm | |
| 5 | Plumb tiang burung | ≤5 mm | |
| 6 | Simetri burung | selisih ≤10 mm | |
| 6 | Celah ke tenda | ≥150 mm | |
| 7 | Celah banner–box | 20 ±5 mm | |
| 7 | Safety wire | terpasang, tidak kendor | |
| 8 | Total pemberat | 600 kg | |
| 8 | Semua baut/strap | kencang, tidak ada yang hilang | |
| 8 | Dokumen | checklist + foto + tanda tangan | |

---

## 12. Bongkar dan penyimpanan

1. Lepas banner dan burung lebih dulu (ringan).
2. Lepas safety wire, hook, dan rel.
3. Lepas baut balok–pilar; turunkan balok dengan 4 orang.
4. Lepas baut pilar–runner; turunkan pilar.
5. Kosongkan box; lipat/lepas kaki bila perlu.
6. Simpan kayu di tempat kering, tidak menumpuk di tanah; beri ganjal.
7. Periksa kerusakan; cat ulang bagian yang lecet sebelum dipakai lagi.

---

## 13. Risiko dan pengendalian

| Risiko | Pengendalian |
|---|---|
| Angin >20 m/s | Pantau cuaca; lepas banner/tambah pemberat/bongkar |
| Paving basah/licin | Hentikan operasi; keringkan; pasang karet |
| Lifting manual | 4 orang; tekuk lutut; jangan angkat satu sisi |
| Kerja di tangga | 2 orang; tangga stabil; jangan menjangkau jauh |
| Baut/ring jatuh | Tool lanyard; helm; area steril |
| Pengunjung | Barikade; satu pintu masuk; awasi anak-anak |
| Plywood retak | Pilot hole; ring lebar; jangan over-torque |
| Banner lepas | Safety wire; sekrup ujung; cek setelah hujan |

---

## 14. Batas dan catatan akhir

1. Semua dimensi dalam mm kecuali dinyatakan lain.
2. Section kayu 45×70 mm dan plywood 9 mm adalah `[ASUMSI]`; ukur material aktual sebelum potong.
3. Puncak tenda 3.200 mm adalah `[ASUMSI]`; ukur sebelum fabrikasi.
4. Paving 100 kPa adalah `[ASUMSI]`; jika paving tipis/berlubang, tambah alas plywood 12 mm.
5. Gapura tidak boleh berdiri tanpa 600 kg pemberat.
6. Batas operasi 20 m/s; di atas itu lepas banner dan tambah pemberat atau bongkar.
7. Dokumen ini pendahuluan; verifikasi insinyur dan uji coba lapangan wajib sebelum digunakan publik.

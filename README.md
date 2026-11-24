# DETEKTIF SAMPAH — Misi Pilah 1.000

Game pembelajaran interaktif 2D untuk mengenal pemilahan **Organik, Anorganik, dan Sampah B3**. Dibuat dengan JavaScript modular + Vite agar mudah dikembangkan lewat GitHub/Codex dan dapat di-host sebagai situs statis di Vercel.

## Fitur utama

- **Mode Hujan Sampah**: tantangan sampai 1.000 objek, dibagi menjadi gelombang kecil agar tetap ringan pada layar sentuh/PID.
- **Objek 2D ilustratif**: sisa nasi, kulit pisang, daun, kulit jeruk, apel, tisu, botol, kaleng, bungkus makanan, kantong plastik, gelas plastik, kotak minuman, baterai, pecahan kaca, dan masker.
- **Drag-and-drop multi-touch**: memakai Pointer Events dan `pointerId`, sehingga beberapa objek berbeda dapat ditarik oleh beberapa jari pada waktu yang sama pada perangkat/browser yang mendukung multi-touch.
- **Validasi kategori**: objek yang benar diterima dan memicu kilatan hijau/warna wadah yang terang, skor, streak, dan bunyi berhasil. Objek yang salah ditolak, wadah berkedip merah, alarm berbunyi, dan objek kembali ke area sortir.
- **Kontrol sentuh dan mouse**, mode layar penuh, jeda, pengaturan 100/250/500/1.000 objek, tiga kecepatan hujan, dan pengaturan suara.
- **Statistik permainan**: skor, progres, jumlah benar/salah, akurasi, gelombang, dan streak terbaik.
- **Kontrol alternatif**: sentuh objek untuk memilih, lalu sentuh wadah; atau pilih objek lalu tekan `1` (organik), `2` (anorganik), `3` (B3).
- **Tanpa database, akun, atau API berbayar**. Skor hanya berlangsung di sesi browser saat ini.

## Teknologi dan struktur

```text
src/
├── main.js              # UI, input pointer/multi-touch, audio, fullscreen, statistik
├── style.css            # tampilan responsif desktop, tablet, dan layar PID
└── game/
    ├── catalog.js       # katalog benda, kategori, penjelasan, dan komposisi latihan
    ├── engine.js        # manifest 1.000 item, gelombang, validasi, skor, progres, drag sessions
    └── renderer.js      # gambar lingkungan sekolah, benda, tempat sampah, dan efek di Canvas 2D
index.html
package.json
```

### Mengapa logika memakai JavaScript?

Proyek ini ditujukan untuk **Vercel Free sebagai web statis**. Seluruh logika game berjalan di browser menggunakan JavaScript, sehingga tidak membutuhkan server Python yang harus selalu hidup. Jika nantinya dibutuhkan backend Python (misalnya rekap nilai antarkelas atau dashboard guru yang tersimpan), backend/API dapat ditambahkan sebagai proyek terpisah.

### Tentang komposisi 1.000 objek

Komposisi awal untuk tantangan adalah **40% Organik, 50% Anorganik, dan 10% B3**. Ini adalah rasio simulasi untuk latihan game, **bukan statistik resmi timbulan sampah Indonesia**. Ubah `DEFAULT_DISTRIBUTION` dalam `src/game/catalog.js` untuk menyesuaikan skenario latihan.

Warna wadah dalam game: hijau untuk Organik, kuning untuk Anorganik, merah untuk B3. Warna dan sistem pemilahan dapat berbeda sesuai peraturan daerah atau fasilitas pengelola sampah. Kategori beberapa contoh pada game mengikuti materi pembelajaran yang diberikan; untuk praktik nyata, ikuti petunjuk pengelola sampah setempat. Pecahan kaca juga perlu ditangani dengan hati-hati agar tidak melukai.

## Menjalankan di Windows 11

1. Instal **Node.js versi LTS** dari situs resminya: https://nodejs.org/.
2. Ekstrak ZIP proyek ini.
3. Buka folder `detektif-sampah-game` di VS Code.
4. Buka Terminal → New Terminal.
5. Jalankan:

```bash
npm install
npm run dev
```

6. Buka alamat yang ditampilkan terminal, biasanya `http://localhost:5173`.
7. Untuk memastikan versi produksi dapat dibangun:

```bash
npm run build
npm run preview
```

Hasil produksi akan dibuat dalam folder `dist/`.

## Deploy gratis ke Vercel melalui GitHub

1. Buat repository baru di GitHub, misalnya `detektif-sampah-game`.
2. Buka terminal dari folder proyek lalu jalankan (ganti URL dengan URL repository milik Anda):

```bash
git init
git add .
git commit -m "Initial Detektif Sampah game"
git branch -M main
git remote add origin https://github.com/USERNAME/detektif-sampah-game.git
git push -u origin main
```

3. Masuk ke Vercel dan pilih **Add New → Project**.
4. Hubungkan GitHub, lalu pilih repository `detektif-sampah-game`.
5. Pastikan pengaturan build:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Pilih **Deploy**. Setelah selesai, Vercel memberikan alamat `*.vercel.app`.
7. Untuk memperbarui game, push perubahan ke branch `main`; integrasi Git akan membuat deployment baru.

## Pengujian pada layar PID

- Buka URL HTTPS hasil deployment melalui browser layar PID.
- Aktifkan mode layar penuh dari tombol `⛶`.
- Uji sentuh satu objek, lalu uji dua atau lebih jari pada objek berbeda.
- Pastikan browser/perangkat PID melaporkan sentuhan sebagai pointer berbeda. Implementasi game sudah mendukung beberapa `pointerId`, tetapi jumlah sentuhan maksimum mengikuti kemampuan panel sentuh dan browser perangkat.
- Jika audio tidak terdengar, periksa volume perangkat dan tombol suara dalam game. Game tetap dapat dimainkan tanpa suara karena indikator benar/salah juga ditampilkan secara visual.

## Catatan pengembangan

- Tidak ada gambar stok atau API eksternal saat permainan berjalan. Ilustrasi benda dan latar digambar dengan Canvas 2D.
- Untuk performa, maksimum 12 objek aktif pada layar sempit dan 18 objek aktif pada layar lebar. Item berikutnya turun setelah gelombang sebelumnya selesai. Total hitungan permainan tetap sesuai pilihan 100–1.000.
- Manifest dibuat acak setiap permainan, sehingga urutan benda berubah pada sesi berikutnya.
- Hindari mengubah klasifikasi objek hanya untuk mengikuti kebiasaan lokal tanpa menyesuaikan materi guru. Tambahkan keterangan sumber/aturan apabila materi sekolah diperbarui.

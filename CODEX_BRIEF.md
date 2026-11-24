# Brief untuk Codex — Detektif Sampah

Anda sedang mengembangkan proyek edukasi **Detektif Sampah — Misi Pilah 1.000**. Baca README.md dan seluruh `src/game/*` sebelum mengubah kode.

## Tujuan produk
Game 2D berbasis web untuk siswa SMP/MTs dan layar sentuh PID. Pemain memilah objek yang turun dari atas ke 3 wadah: Hijau/Organik, Kuning/Anorganik, Merah/B3. Semua istilah utama dan daftar contoh mengikuti materi pembelajaran sekolah; jika materi diubah, perbarui katalog dan teks penjelasan secara konsisten.

## Kontrak teknis
- Tetap gunakan Vite + JavaScript ES Modules agar kompatibel dengan deployment statis Vercel.
- Jangan menambahkan backend, database, atau API berbayar tanpa permintaan eksplisit.
- Semua input pointer harus mempertahankan dukungan multi-touch melalui `pointerId`; jangan mengganti dengan `click` saja.
- `engine.js` adalah sumber kebenaran untuk manifest, skor, validasi kategori, streak, dan progres.
- `renderer.js` bertanggung jawab untuk Canvas 2D; jangan membuat 1.000 elemen DOM aktif sekaligus.
- Pertahankan desain responsif, touch-action yang tepat, tombol fullscreen, pause, sound, keyboard fallback, dan reduced-motion.
- Pastikan objek yang salah tidak terhapus; objek harus kembali ke titik asal dan wadah yang salah memberikan indikator merah.
- Pastikan objek benar hanya dihitung sekali walaupun beberapa pointer aktif.
- Jangan mengubah angka komposisi simulasi menjadi klaim statistik nasional.

## Definition of Done
1. `npm run build` berhasil.
2. Game dapat dimulai dengan 100, 250, 500, dan 1.000 objek.
3. Jumlah benar + sisa selalu sama dengan total; salah tidak mengurangi jumlah sisa.
4. Drop pada kategori benar menambah skor, drop pada kategori salah menambah hitungan salah dan memberi alarm penolakan.
5. Dua pointer yang menggerakkan dua objek berbeda tidak saling mengganggu.
6. Tidak ada kontrol yang terpotong pada lebar 360px, tablet, dan desktop.
7. README deploy Vercel tetap akurat.

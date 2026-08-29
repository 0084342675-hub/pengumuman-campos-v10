# V7
Data peserta dan rincian nilai dikelola lewat `data/peserta.csv`. Jadi kamu cukup edit CSV lalu upload/replace file CSV di GitHub.

Kolom pencarian: `Nama`, `tahun_lahir`, `Pilihan`.
Status: `blue` = lolos, `yellow` = lolos bersyarat, `red` = belum lolos.
Tabel rincian tampil paling bawah setelah pengumuman dan bisa digeser horizontal di HP.

Foto: masukkan `sekolah.jpg`, `mpos.jpg`, dan `galeri-1.jpg` s/d `galeri-6.jpg` ke folder `assets`.
CSV bawaan hanya data testing.


## Perubahan V7.1 — Pilihan Kelas
Form pengecekan sekarang membutuhkan:
1. Nama Lengkap
2. Kelas
3. Tahun Lahir
4. Pilihan (MPK/OSIS)

Kelas yang tersedia:
- Kelas X: X.1 sampai X.11
- Kelas XI: XI.1 sampai XI.9

Kolom `Kelas` di `data/peserta.csv` harus diisi sesuai pilihan tersebut agar pencarian peserta cocok.

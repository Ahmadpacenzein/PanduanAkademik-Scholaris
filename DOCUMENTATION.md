# Scholaris App Documentation

Scholaris adalah aplikasi React Native berbasis Expo untuk panduan akademik mahasiswa. Aplikasi ini menampilkan profil mahasiswa, daftar mata kuliah, detail mata kuliah, form tambah/edit mata kuliah, serta pengaturan aplikasi yang tersimpan lokal menggunakan `AsyncStorage`.

## Gambaran Umum

Tujuan utama aplikasi:
- Menyimpan data mahasiswa, mata kuliah, dan pengaturan aplikasi secara lokal.
- Menyediakan CRUD lengkap untuk mata kuliah.
- Menjaga UI tetap memakai gaya Material Design yang konsisten.
- Mendukung dark mode yang benar-benar mengubah tampilan aplikasi.
- Menyimpan notifikasi lokal saat mata kuliah dengan jadwal ditambahkan.

## Teknologi

- Expo SDK 54
- React Native
- React Navigation
- AsyncStorage
- MaterialCommunityIcons

## Struktur Fitur

### 1. Beranda

Menampilkan:
- Sapaan mahasiswa
- Info akademik singkat
- Mata kuliah yang sedang diambil
- Menu cepat
- Pengumuman statis

### 2. Mata Kuliah

Menampilkan daftar seluruh mata kuliah dengan:
- Pencarian
- Filter semua / diambil / tersedia
- Refresh data
- Floating action button di kanan bawah untuk tambah mata kuliah

### 3. Detail Mata Kuliah

Menampilkan:
- Informasi umum mata kuliah
- Dosen pengampu
- Jadwal dan lokasi
- Kapasitas kelas
- Materi pembelajaran
- Aksi hubungi dosen
- Aksi share
- Tombol edit
- Tombol hapus
- Tombol daftar / batalkan daftar

### 4. Tambah / Edit Mata Kuliah

Form yang dipakai untuk:
- Menambah mata kuliah baru
- Mengedit mata kuliah yang sudah ada

Field yang disimpan:
- Nama mata kuliah
- Kode
- SKS
- Kapasitas
- Deskripsi
- Materi pembelajaran
- Jadwal
- Ruangan
- Nama dosen
- Email dosen
- Telepon dosen

### 5. Profil

Menampilkan:
- Data mahasiswa
- Informasi akademik
- Informasi kontak
- Informasi kampus
- Tombol notifikasi
- Tombol pengaturan

### 6. Pengaturan

Pengaturan yang disimpan lokal:
- Notifikasi
- Dark mode
- Bahasa

## Navigasi

Struktur navigasi:
- Splash screen
- `MainTabs`
  - Beranda
  - Mata Kuliah
  - Profil
- Modal screen
  - Detail Mata Kuliah
  - Tambah/Edit Mata Kuliah
  - Pengaturan

File utama navigasi:
- [RootNavigator.js](./src/navigation/RootNavigator.js)

## Penyimpanan Lokal

Semua data utama disimpan di `AsyncStorage`.

### Key Storage

- `@scholaris_student`
- `@scholaris_courses`
- `@scholaris_settings`
- `@scholaris_notifications`
- `@scholaris_enrollments`
- `@scholaris_last_sync`

### Data Mahasiswa

Disimpan untuk:
- Profil mahasiswa
- Data akademik
- Kontak
- Lokasi kampus

### Data Mata Kuliah

Disimpan untuk:
- Daftar mata kuliah
- Detail mata kuliah
- Status diambil / belum
- Kapasitas dan jumlah peserta

### Data Pengaturan

Disimpan untuk:
- `darkMode`
- `notifications`
- `language`

### Data Notifikasi

Notifikasi lokal dibuat ketika mata kuliah baru ditambahkan dan setting notifikasi aktif.

## CRUD Mata Kuliah

CRUD mata kuliah dikelola melalui service dan storage manager.

### Create

`addCourse(courseData)`:
- Membuat id baru
- Menyimpan course ke AsyncStorage
- Membuat notifikasi lokal jika setting notifikasi aktif

### Read

`getAllCourses()`
`getCourseById(courseId)`
`getEnrolledCourses()`
`getAvailableCourses()`

### Update

`updateCourse(courseId, updates)`:
- Mengubah data course berdasarkan id
- Dipakai oleh form edit

### Delete

`deleteCourse(courseId)`:
- Menghapus course dari storage

## Dark Mode

Dark mode diimplementasikan melalui `ThemeContext`:
- Saat app dimulai, setting dibaca dari AsyncStorage.
- Saat switch dark mode diubah, warna aplikasi langsung berubah.
- Theme state disimpan kembali ke AsyncStorage.

File terkait:
- [ThemeContext.js](./src/theme/ThemeContext.js)
- [colors.js](./src/styles/colors.js)
- [App.js](./App.js)

## Notifikasi

Notifikasi lokal dibuat saat:
- Mata kuliah baru ditambahkan
- Setting notifikasi dalam keadaan aktif

Tampilan notifikasi saat ini:
- Ditampilkan dari tab Profil
- Menu Notifikasi menampilkan daftar notifikasi terbaru

## Alur Data

1. App dibuka.
2. Splash tampil sebentar.
3. Storage diinisialisasi.
4. Theme dibaca dari AsyncStorage.
5. User masuk ke tab utama.
6. Semua perubahan data tersimpan lokal.

## File Penting

- [App.js](./App.js)
- [src/navigation/RootNavigator.js](./src/navigation/RootNavigator.js)
- [src/utils/storageManager.js](./src/utils/storageManager.js)
- [src/services/courseService.js](./src/services/courseService.js)
- [src/services/studentService.js](./src/services/studentService.js)
- [src/screens/HomeScreen.js](./src/screens/HomeScreen.js)
- [src/screens/CourseListScreen.js](./src/screens/CourseListScreen.js)
- [src/screens/CourseDetailScreen.js](./src/screens/CourseDetailScreen.js)
- [src/screens/AddCourseScreen.js](./src/screens/AddCourseScreen.js)
- [src/screens/ProfileScreen.js](./src/screens/ProfileScreen.js)
- [src/screens/SettingsScreen.js](./src/screens/SettingsScreen.js)
- [src/theme/ThemeContext.js](./src/theme/ThemeContext.js)

## Instalasi

Dependensi utama sudah tercantum di `package.json`. Untuk menjalankan aplikasi:

```bash
npm install
npm start
```

Untuk Android:

```bash
npm run android
```

Untuk iOS:

```bash
npm run ios
```

## Catatan Implementasi

- UI tetap memakai pola Material Design.
- Data tidak bergantung pada backend.
- Perubahan course dan setting langsung tersimpan di perangkat.
- Dark mode bersifat global dan memengaruhi tampilan aplikasi.
- Jika pengguna menambah course dengan jadwal, notifikasi lokal akan dibuat selama notifikasi aktif.


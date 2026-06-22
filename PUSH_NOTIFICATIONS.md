# Push Notification Scholaris

## Batasan Expo Go Android

Pada Expo SDK 54, remote push notification tidak tersedia di Expo Go Android.
Expo Go masih dapat menjalankan local notification melalui tombol
`Pengaturan > Tes Popup Notifikasi`.

Remote push harus diuji dengan development build pada perangkat fisik.

## Membuat development build

1. Login dan hubungkan proyek ke EAS:

   ```powershell
   npx.cmd eas-cli@latest login
   npx.cmd eas-cli@latest init
   ```

   `eas init` akan menambahkan `expo.extra.eas.projectId` ke konfigurasi proyek.

2. Konfigurasikan kredensial Android/FCM saat diminta oleh EAS.

3. Buat APK development:

   ```powershell
   npx.cmd eas-cli@latest build --profile development --platform android
   ```

4. Instal APK di HP, lalu jalankan bundler:

   ```powershell
   npm run start:dev-client
   ```

## Mendaftarkan token ke backend

Atur URL endpoint backend sebelum menjalankan aplikasi:

```powershell
$env:EXPO_PUBLIC_PUSH_TOKEN_ENDPOINT="https://domain-api.example/push/register"
npm run start:dev-client
```

App akan mengirim request berikut:

```json
{
  "token": "ExponentPushToken[...]",
  "platform": "android",
  "deviceName": "..."
}
```

Backend harus menyimpan token tersebut berdasarkan pengguna. Ketika ada
pembaruan akademik, backend mengirim pesan ke Expo Push API:

```http
POST https://exp.host/--/api/v2/push/send
Content-Type: application/json

{
  "to": "ExponentPushToken[...]",
  "title": "Pembaruan Akademik",
  "body": "Ada mata kuliah baru yang tersedia.",
  "sound": "default",
  "channelId": "academic-updates",
  "data": {
    "courseId": "SRV-31"
  }
}
```

Jangan mengirim remote push langsung dari aplikasi produksi. Pengiriman harus
dilakukan oleh backend ketika data benar-benar berubah.

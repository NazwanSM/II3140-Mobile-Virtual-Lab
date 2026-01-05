<div align="center">
  <br />
    <a href="https://intrive.space" target="_blank">
      <img src="./assets/HeaderGithub.png" alt="Aksara Banner" />
    </a>
  <br />

  <br>
  <div>
    <img src="https://img.shields.io/badge/expo-000020.svg?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/react_native-20232A.svg?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </div>

  <h3 align="center">Aksara : Virtual Lab Mobile App for Tata Tulis Karya Ilmiah</h3>

  <div align="center">
    Aksara merupakan <b>Mobile Application</b> berbasis <b>Expo (React Native)</b><br/>
    yang dirancang untuk membantu pelajar memahami Tata Tulis Karya Ilmiah<br/>
    sesuai kaidah <b>KBBI</b> dan <b>PUEBI</b>.
  </div>
</div>

---

## 📑 Table of Contents
1. [🪶 Pendahuluan](#-pendahuluan)
2. [🧩 Fitur Utama](#-fitur-utama)
3. [📱 Platform & Teknologi](#-platform--teknologi)
4. [🚀 How to Run (Expo)](#-how-to-run-expo)

---

## 🪶 Pendahuluan

**Aksara** adalah platform *Virtual Lab* interaktif berbasis **mobile application** yang membantu pengguna mempelajari **Tata Tulis Karya Ilmiah (TTKI)** secara sistematis dan menyenangkan.

Aplikasi ini mengusung alur pembelajaran:

**Belajar ➜ Praktik ➜ Refleksi ➜ Gamifikasi**

sehingga pengguna tidak hanya memahami teori, tetapi juga terlibat aktif melalui latihan dan permainan edukatif langsung dari perangkat mobile.

Nama *Aksara* melambangkan **huruf dan cahaya pengetahuan**, sejalan dengan visi aplikasi untuk meningkatkan literasi ilmiah secara berkelanjutan.

---

## 🧩 Fitur Utama

### Belajar
- Kaidah Ejaan dan Tanda Baca (PUEBI)  
- Diksi dan Kata Baku (KBBI)  
- Kalimat Efektif  

### Latihan
- Tingkat kesulitan: Mudah, Sedang, Sulit  
- Jenis soal: Pilihan ganda, esai singkat, drag & drop  
- Sistem poin **Tinta**

### Main
- Teka-Teki Silang (TTS)  
- Permainan Drag & Drop  
- Terbuka bertahap sesuai progres belajar

---

## 📱 Platform & Teknologi

- Framework: Expo (React Native)
- Bahasa: TypeScript
- Backend: Supabase
- Platform: Android & iOS
- Build Tool: Expo CLI

---

## 🚀 How to Run (Expo)

```bash
git clone <repository-url>
cd aksara-mobile

# setup environment
cat <<EOF > .env
EXPO_PUBLIC_SUPABASE_URL=https://qugficsohuryjcqiikyw.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1Z2ZpY3NvaHVyeWpjcWlpa3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzQyNDYsImV4cCI6MjA4MjUxMDI0Nn0.KN28eQRU7w77Nd3UuMRpfB-MAwEwx2F8MZKXjmqT4DA
EOF

npm install
npx expo start -c

// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyBORTa5f0LuJMEJdF4jBkYwk7MzPUf-jl4",
  authDomain: "form-pendaftaran-aman.firebaseapp.com",
  databaseURL: "https://form-pendaftaran-aman-default-rtdb.firebaseio.com",
  projectId: "form-pendaftaran-aman",
  storageBucket: "form-pendaftaran-aman.firebasestorage.app",
  messagingSenderId: "914242967795",
  appId: "1:914242967795:web:4b95ba071db7117c2dff86",
  measurementId: "G-J5HRZD1Y8S"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- VALIDASI INPUT REAL-TIME ---

// Ambil elemen form & pesan error
const namaInput = document.getElementById("nama");
const emailInput = document.getElementById("email");
const hpInput = document.getElementById("hp");

const namaError = document.getElementById("namaError");
const emailError = document.getElementById("emailError");
const hpError = document.getElementById("hpError");

// Fungsi validasi umum
function tampilkanError(input, pesan, elemenPesan) {
  input.style.border = "2px solid #ff4d4d";
  elemenPesan.textContent = pesan;
}

function hapusError(input, elemenPesan) {
  input.style.border = "2px solid #00cc99";
  elemenPesan.textContent = "";
}

// Validasi Nama (minimal 2 huruf, hanya huruf & spasi)
namaInput.addEventListener("input", () => {
  const namaValue = namaInput.value.trim();
  if (!/^[A-Za-z\s]+$/.test(namaValue)) {
    tampilkanError(namaInput, "Nama hanya boleh huruf", namaError);
  } else if (namaValue.length < 2) {
    tampilkanError(namaInput, "Nama minimal 2 huruf", namaError);
  } else {
    hapusError(namaInput, namaError);
  }
});

// Validasi Email
emailInput.addEventListener("input", () => {
  const emailValue = emailInput.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    tampilkanError(emailInput, "Format email tidak valid", emailError);
  } else {
    hapusError(emailInput, emailError);
  }
});

// Validasi Nomor HP (hanya angka, minimal 10 digit)
hpInput.addEventListener("input", () => {
  // Hapus karakter non-angka langsung saat diketik
  hpInput.value = hpInput.value.replace(/[^0-9]/g, "");
  const hpValue = hpInput.value;

  if (hpValue.length < 10) {
    tampilkanError(hpInput, "Nomor HP minimal 10 digit", hpError);
  } else {
    hapusError(hpInput, hpError);
  }
});

// === Enkripsi dan Kirim Data ===
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nama = namaInput.value.trim();
  const email = emailInput.value.trim();
  const hp = hpInput.value.trim();

  // Validasi akhir sebelum kirim
  if (nama.length < 2 || !/^[A-Za-z\s]+$/.test(nama)) {
    tampilkanError(namaInput, "Nama tidak valid (minimal 2 huruf, hanya huruf).", namaError);
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    tampilkanError(emailInput, "Email tidak valid.", emailError);
    return;
  }
  if (hp.length < 10 || !/^[0-9]+$/.test(hp)) {
    tampilkanError(hpInput, "Nomor HP tidak valid (hanya angka, minimal 10 digit).", hpError);
    return;
  }

  // Kunci rahasia (untuk enkripsi AES)
  const secretKey = "kunci-rahasia-123";

  // Enkripsi data dengan CryptoJS
  const encryptedNama = CryptoJS.AES.encrypt(nama, secretKey).toString();
  const encryptedEmail = CryptoJS.AES.encrypt(email, secretKey).toString();
  const encryptedHP = CryptoJS.AES.encrypt(hp, secretKey).toString();

  // Buat objek data yang mau dikirim ke Firebase
  const data = {
    nama: encryptedNama,
    email: encryptedEmail,
    hp: encryptedHP,
    waktu: new Date().toISOString()
  };

  // Kirim data ke Realtime Database
  database.ref("pendaftaran").push(data)
    .then(() => {
      alert("✅ Data berhasil disimpan dengan aman!");
      document.getElementById("registerForm").reset();
      [namaInput, emailInput, hpInput].forEach(inp => inp.style.border = "");
      [namaError, emailError, hpError].forEach(err => err.textContent = "");
    })
    .catch((error) => {
      alert("❌ Terjadi kesalahan: " + error.message);
    });
});

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
const auth = firebase.auth();

// === Cek status login admin ===
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    alert("❌ Anda harus login terlebih dahulu!");
    window.location.href = "login.html";
  }
});

// === Fungsi Logout ===
function logout() {
  auth.signOut().then(() => {
    alert("Anda telah logout.");
    window.location.href = "login.html";
  });
}

// === Ambil Data dari Database ===
const secretKey = "kunci-rahasia-123"; // sama seperti di script.js
const tableBody = document.querySelector("#dataTable tbody");

database.ref("pendaftaran").on("value", (snapshot) => {
  tableBody.innerHTML = "";
  snapshot.forEach((child) => {
    const data = child.val();

    // Dekripsi data
    const nama = CryptoJS.AES.decrypt(data.nama, secretKey).toString(CryptoJS.enc.Utf8);
    const email = CryptoJS.AES.decrypt(data.email, secretKey).toString(CryptoJS.enc.Utf8);
    const hp = CryptoJS.AES.decrypt(data.hp, secretKey).toString(CryptoJS.enc.Utf8);

    const row = `
      <tr>
        <td>${nama}</td>
        <td>${email}</td>
        <td>${hp}</td>
        <td>${new Date(data.waktu).toLocaleString()}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
});

// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyBORTa5f0LuJMEJdF4jBkYwk7MzPUf-jl4",
  authDomain: "form-pendaftaran-aman.firebaseapp.com",
  projectId: "form-pendaftaran-aman",
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// === LOGIN ADMIN ===
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("✅ Login berhasil!");
      window.location.href = "dashboard.html"; // Halaman admin setelah login
    })
    .catch((error) => {
      errorMsg.style.display = "block";
      errorMsg.textContent = "❌ " + error.message;
    });
});

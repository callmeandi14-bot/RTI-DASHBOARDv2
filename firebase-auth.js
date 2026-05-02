import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFbXa_03QYM8DlBkDw7UMZttBMABdtdf4",
    authDomain: "rti-dashboard-7cd8f.firebaseapp.com",
    projectId: "rti-dashboard-7cd8f",
    storageBucket: "rti-dashboard-7cd8f.firebasestorage.app",
    messagingSenderId: "328210653829",
    appId: "1:328210653829:web:2796c8a0995bfdf232bfec"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

async function isStaff(email) {
    try {
        const docRef = doc(db, "staff", email);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    } catch (e) {
        return false;
    }
}

// Ganti popup → redirect (fix mobile)
async function loginWithGoogle() {
    try {
        await signInWithRedirect(auth, provider);
    } catch (e) {
        console.error(e);
        alert("Login gagal, coba lagi.");
    }
}

// Tangkap hasil redirect — panggil ini di login.html saat halaman load
async function handleRedirectResult() {
    try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
            const email = result.user.email;
            const allowed = await isStaff(email);
            if (!allowed) {
                await signOut(auth);
                window.location.href = "denied.html";
            } else {
                window.location.href = "staff-only-1.html";
            }
        }
        // Kalau result null = belum login, diam saja
    } catch (e) {
        console.error(e);
        // Jangan alert, cukup log
    }
}

async function logout() {
    await signOut(auth);
    window.location.href = "login.html";
}

async function guardPage() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "login.html";
                resolve(false);
            } else {
                const allowed = await isStaff(user.email);
                if (!allowed) {
                    window.location.href = "denied.html";
                    resolve(false);
                } else {
                    const nameEl = document.getElementById('staff-name');
                    const emailEl = document.getElementById('staff-email');
                    const photoEl = document.getElementById('staff-photo');
                    if (nameEl) nameEl.textContent = user.displayName;
                    if (emailEl) emailEl.textContent = user.email;
                    if (photoEl) photoEl.src = user.photoURL;
                    resolve(true);
                }
            }
        });
    });
}

export { loginWithGoogle, handleRedirectResult, logout, guardPage };
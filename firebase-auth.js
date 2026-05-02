import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
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
provider.setCustomParameters({ prompt: 'select_account' });

async function isStaff(email) {
    try {
        const docRef = doc(db, "staff", email);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    } catch (e) {
        console.error("isStaff error:", e);
        return false;
    }
}

async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const email = result.user.email;
        const allowed = await isStaff(email);
        if (allowed) {
            window.location.replace("staff-only-1.html");
        } else {
            await signOut(auth);
            window.location.replace("denied.html");
        }
    } catch (e) {
        console.error("Login error:", e.code, e.message);
        if (e.code === 'auth/popup-blocked') {
            alert("Popup diblokir browser. Izinkan popup untuk site ini lalu coba lagi.");
        } else if (e.code === 'auth/popup-closed-by-user') {
            // User tutup popup sendiri, diam saja
        } else {
            alert("Login gagal: " + e.message);
        }
    }
}

async function logout() {
    await signOut(auth);
    window.location.replace("login.html");
}

async function guardPage() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.replace("login.html");
                resolve(false);
                return;
            }
            const allowed = await isStaff(user.email);
            if (!allowed) {
                await signOut(auth);
                window.location.replace("denied.html");
                resolve(false);
                return;
            }
            const nameEl = document.getElementById('staff-name');
            const emailEl = document.getElementById('staff-email');
            const photoEl = document.getElementById('staff-photo');
            if (nameEl) nameEl.textContent = user.displayName;
            if (emailEl) emailEl.textContent = user.email;
            if (photoEl) photoEl.src = user.photoURL;
            resolve(true);
        });
    });
}

export { loginWithGoogle, logout, guardPage };

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
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

export { isStaff, logout, guardPage };            }
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

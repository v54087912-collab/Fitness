
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtm9OVSsnAx74oPC4fqmtekzX6aK9p6Uo",
    authDomain: "fitness-84131.firebaseapp.com",
    projectId: "fitness-84131",
    storageBucket: "fitness-84131.firebasestorage.app",
    messagingSenderId: "762709234032",
    appId: "1:762709234032:web:f0f0b8fcb84574fd5cffb5",
    measurementId: "G-6KFBYZ6FQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// === System Window Logic ===
function showSystemWindow(title, message, isError = false) {
    // Create overlay if not exists
    let overlay = document.getElementById('system-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'system-overlay';
        overlay.className = 'system-window-overlay';
        // Add basic style for the overlay here to ensure it works even if CSS is missing
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 10000;
        `;
        overlay.innerHTML = `
            <div class="system-window" style="background: rgba(11, 13, 23, 0.95); border: 1px solid var(--sys-cyan); padding: 20px; max-width: 400px; width: 90%; box-shadow: 0 0 20px rgba(0, 243, 255, 0.2); text-align: center;">
                <div class="sys-win-header" style="border-bottom: 1px solid var(--sys-cyan-dim); padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between;">
                    <span class="sys-win-title" style="color: var(--sys-cyan); font-family: var(--font-heading);">SYSTEM MESSAGE</span>
                    <button onclick="document.getElementById('system-overlay').style.display='none'" style="background:none;border:none;color:var(--sys-cyan);cursor:pointer; font-size: 1.2rem;">&times;</button>
                </div>
                <div class="sys-win-body">
                    <div id="sys-win-alert-box" class="sys-alert-box" style="font-weight: bold; margin-bottom: 10px; font-family: var(--font-heading);"></div>
                    <p id="sys-win-msg" style="color: #ccc; margin-bottom: 20px; font-family: var(--font-mono);"></p>
                    <button class="system-btn" onclick="document.getElementById('system-overlay').style.display='none'" style="padding: 8px 20px; background: transparent; border: 1px solid var(--sys-cyan); color: var(--sys-cyan); cursor: pointer; text-transform: uppercase;">ACCEPT</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    const alertBox = document.getElementById('sys-win-alert-box');
    const msgP = document.getElementById('sys-win-msg');

    if (isError) {
        alertBox.style.color = 'var(--sys-danger, #ff003c)';
        alertBox.textContent = "SYSTEM ALERT";
    } else {
        alertBox.style.color = 'var(--sys-cyan, #00f3ff)';
        alertBox.textContent = "SYSTEM NOTIFICATION";
    }

    // Override title if needed, but "SYSTEM ALERT" fits the lore better
    if (title) alertBox.textContent = title;

    msgP.textContent = message;

    overlay.style.display = 'flex';
}

// === Auth State Observer ===
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;

    // Update Navbar Profile if exists
    // We look for 'nav-auth-btn' which is the anchor tag
    const navAuthBtn = document.getElementById('nav-auth-btn');
    // Also look for the container to replace content if needed
    const authLinkContainer = document.getElementById('auth-link-container');

    if (user) {
        console.log("Player Logged In:", user.email);

        if (navAuthBtn) {
            // Change "Awaken" to Player Icon/Profile
            // We'll replace the inner HTML of the anchor
            navAuthBtn.innerHTML = `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">👤</span>
                    <span>PLAYER</span>
                </span>
            `;
            navAuthBtn.href = 'dashboard.html'; // Click goes to dashboard

            // Optional: Add a logout button or handle it in Dashboard
        }

        // If on Auth page, go to Dashboard (as per "redirect all users to dashboard.html upon successful login" in memory,
        // though Prompt said "Welcome Player... then redirect to dashboard.html" in Task 3.3.
        // Task 3.4 says "If a user is NOT logged in, immediately redirect them from internal pages back to index.html".

        if (currentPath.endsWith('auth.html')) {
            window.location.replace('dashboard.html');
        }

    } else {
        console.log("Player Logged Out");

        if (navAuthBtn) {
            navAuthBtn.innerHTML = 'Awaken';
            navAuthBtn.href = 'auth.html';
        }

        // Security Redirect
        // "If a user is NOT logged in, immediately redirect them from internal pages back to index.html."
        // Internal pages: dashboard.html, challenge.html (Tracker).
        // Inventory and Quests might be viewable?
        // I will protect dashboard.html and challenge.html.

        if (currentPath.endsWith('dashboard.html') || currentPath.endsWith('challenge.html')) {
             window.location.replace('index.html');
        }
    }
});

// === DOM Handling for Auth Forms ===
// Ensure this runs only if the elements exist (i.e., on auth.html)
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPass = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPass) {
            showSystemWindow("SYSTEM ERROR", "Passwords do not match.", true);
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showSystemWindow("SYSTEM NOTIFICATION", "Welcome Player. Initializing Status Window...");
                // Redirect after a short delay to let them see the message
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 2000);
            })
            .catch((error) => {
                const errorCode = error.code;
                let msg = error.message;
                if (errorCode === 'auth/email-already-in-use') msg = "Error: Player already exists.";
                showSystemWindow("SYSTEM ALERT", msg, true);
            });
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showSystemWindow("SYSTEM NOTIFICATION", "Welcome back, Hunter.");
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1500);
            })
            .catch((error) => {
                showSystemWindow("ACCESS DENIED", "Invalid Credentials.", true);
            });
    });
}

// Global Logout function (assign to window so onclick works)
window.logoutSystem = function() {
    if(confirm("Log out of the System?")) {
        signOut(auth).then(() => {
            window.location.href = "index.html";
        });
    }
}

// Attach logout to any element with id 'logout-btn' if it exists (like in dashboard)
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.logoutSystem();
    });
}

export { auth };

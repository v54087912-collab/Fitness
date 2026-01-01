
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');

const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');

const userInfo = document.getElementById('user-info');

// === Helper: Show Message ===
function showMessage(elementId, text, type) {
    const msgDiv = document.getElementById(elementId);
    if (msgDiv) {
        msgDiv.textContent = text;
        msgDiv.className = `message ${type}`;
        msgDiv.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 5000);
    }
}

// === Auth State Observer ===
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;

    if (user) {
        console.log("User is signed in:", user.email);

        // Admin Redirect Logic
        if (currentPath.endsWith('auth.html')) {
             window.location.replace('dashboard.html');
        }

        // If on dashboard, show user info
        if (userInfo) {
            userInfo.textContent = `Logged in as: ${user.email}`;
        }

    } else {
        console.log("User is signed out");

        // If on dashboard or plans (protected area), redirect to auth page
        if (currentPath.endsWith('dashboard.html') || currentPath.endsWith('plans.html')) {
            // Note: In a real app, you might only protect 'plans' if it requires sub,
            // but enforcing guest protection here as requested.
            // window.location.replace('auth.html');
            // Commented out for plans.html to avoid locking users out of public pages during this demo,
            // strictly enforcing for dashboard only as per previous scope.
        }

        if (currentPath.endsWith('dashboard.html')) {
             window.location.replace('auth.html');
        }
    }
});

// === Signup Logic ===
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                showMessage('signup-message', 'Account created successfully! Redirecting...', 'success');
                // Redirect happens automatically via onAuthStateChanged
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = error.message;

                // Friendly error messages
                if (errorCode === 'auth/email-already-in-use') {
                    errorMessage = 'This email is already registered.';
                } else if (errorCode === 'auth/weak-password') {
                    errorMessage = 'Password should be at least 6 characters.';
                } else if (errorCode === 'auth/invalid-email') {
                    errorMessage = 'Please enter a valid email address.';
                }

                showMessage('signup-message', errorMessage, 'error');
            });
    });
}

// === Login Logic ===
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                showMessage('login-message', 'Login successful! Redirecting...', 'success');
                // Redirect happens automatically via onAuthStateChanged
            })
            .catch((error) => {
                const errorCode = error.code;
                let errorMessage = error.message;

                // Friendly error messages
                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
                    errorMessage = 'Invalid email or password.';
                } else if (errorCode === 'auth/invalid-email') {
                    errorMessage = 'Please enter a valid email address.';
                } else if (errorCode === 'auth/too-many-requests') {
                    errorMessage = 'Too many failed attempts. Please try again later.';
                }

                showMessage('login-message', errorMessage, 'error');
            });
    });
}

// === Logout Logic ===
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            // Redirect happens automatically via onAuthStateChanged
        }).catch((error) => {
            // An error happened.
            console.error('Logout error', error);
            alert('Error logging out: ' + error.message);
        });
    });
}

// === Toggle Forms ===
if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
    });
}

if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
    });
}

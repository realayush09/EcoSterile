/**
 * Firebase Configuration & Initialization
 * Central service for all Firebase operations
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6G8DgCBqA9lFMlKfGIC_JCEaZU-GuPxs",
  authDomain: "eco-sterile.firebaseapp.com",
  databaseURL:
    "https://eco-sterile-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eco-sterile",
  storageBucket: "eco-sterile.firebasestorage.app",
  messagingSenderId: "429228597840",
  appId: "1:429228597840:web:45c0f163c578480fc2a755",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Sign up with email and password
   */
  async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user profile to database
      await set(ref(db, `users/${user.uid}/profile`), {
        email: email,
        displayName: userData.fullName || "",
        farmName: userData.farmName || "",
        location: userData.location || "",
        cropType: userData.cropType || "rice",
        createdAt: new Date().toISOString(),
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user profile exists, if not create it
      const profileRef = ref(db, `users/${user.uid}/profile`);
      const snapshot = await get(profileRef);

      if (!snapshot.exists()) {
        await set(profileRef, {
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        });
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  },
};

/**
 * Database Service - pH Readings
 */
export const phService = {
  /**
   * Add pH reading
   */
  async addReading(userId, phValue) {
    try {
      const reading = {
        value: phValue,
        timestamp: new Date().toISOString(),
        uid: userId,
      };
      const ref_path = ref(db, `users/${userId}/phReadings`);
      await push(ref_path, reading);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get pH readings for a user
   */
  async getReadings(userId, limit = 1000) {
    try {
      const ref_path = query(
        ref(db, `users/${userId}/phReadings`),
        orderByChild("timestamp"),
        limitToLast(limit)
      );
      const snapshot = await get(ref_path);

      if (!snapshot.exists()) {
        return { success: true, readings: [] };
      }

      const readings = [];
      snapshot.forEach((child) => {
        readings.push({
          id: child.key,
          ...child.val(),
        });
      });

      return { success: true, readings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Listen to real-time pH updates
   */
  onReadingsUpdate(userId, callback) {
    const ref_path = query(
      ref(db, `users/${userId}/phReadings`),
      orderByChild("timestamp"),
      limitToLast(100)
    );
    return onValue(ref_path, (snapshot) => {
      const readings = [];
      snapshot.forEach((child) => {
        readings.push({
          id: child.key,
          ...child.val(),
        });
      });
      callback(readings);
    });
  },
};

/**
 * Database Service - Pump Activities
 */
export const pumpService = {
  /**
   * Log pump activity
   */
  async logActivity(userId, pumpType, solution, concentration) {
    try {
      const activity = {
        type: pumpType, // 'basic' or 'acidic'
        solution: solution,
        concentration: concentration,
        timestamp: new Date().toISOString(),
        uid: userId,
      };
      const ref_path = ref(db, `users/${userId}/pumpLogs`);
      await push(ref_path, activity);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get pump activity logs
   */
  async getLogs(userId, limit = 100) {
    try {
      const ref_path = query(
        ref(db, `users/${userId}/pumpLogs`),
        orderByChild("timestamp"),
        limitToLast(limit)
      );
      const snapshot = await get(ref_path);

      if (!snapshot.exists()) {
        return { success: true, logs: [] };
      }

      const logs = [];
      snapshot.forEach((child) => {
        logs.push({
          id: child.key,
          ...child.val(),
        });
      });

      return { success: true, logs: logs.reverse() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Listen to real-time pump activity updates
   */
  onLogsUpdate(userId, callback) {
    const ref_path = query(
      ref(db, `users/${userId}/pumpLogs`),
      orderByChild("timestamp"),
      limitToLast(50)
    );
    return onValue(ref_path, (snapshot) => {
      const logs = [];
      snapshot.forEach((child) => {
        logs.push({
          id: child.key,
          ...child.val(),
        });
      });
      callback(logs.reverse());
    });
  },
};

/**
 * Database Service - User Profile & Settings
 */
export const userService = {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    try {
      const snapshot = await get(ref(db, `users/${userId}/profile`));
      if (!snapshot.exists()) {
        return { success: false, error: "Profile not found" };
      }
      return { success: true, profile: snapshot.val() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    try {
      await update(ref(db, `users/${userId}/profile`), updates);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Save selected crop
   */
  async saveCropSelection(userId, cropData) {
    try {
      await update(ref(db, `users/${userId}/profile`), {
        currentCrop: cropData.value,
        cropMinPH: cropData.minPH,
        cropMaxPH: cropData.maxPH,
        lastCropChange: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Save system settings
   */
  async saveSettings(userId, settings) {
    try {
      await set(ref(db, `users/${userId}/settings`), {
        ...settings,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get system settings
   */
  async getSettings(userId) {
    try {
      const snapshot = await get(ref(db, `users/${userId}/settings`));
      if (!snapshot.exists()) {
        return { success: true, settings: {} };
      }
      return { success: true, settings: snapshot.val() };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

/**
 * Database Service - System Status
 */
export const systemService = {
  /**
   * Update Arduino connection status
   */
  async updateArduinoStatus(userId, isConnected) {
    try {
      await update(ref(db, `users/${userId}/status`), {
        arduinoConnected: isConnected,
        lastStatusUpdate: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Listen to system status
   */
  onStatusUpdate(userId, callback) {
    return onValue(ref(db, `users/${userId}/status`), (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
  },
};

export { auth, db };

import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';
import { firebaseConfig } from './firebase-config.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
const functions = getFunctions(app);

export function observeSession(callback) {
  return onAuthStateChanged(auth, callback);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export async function getAccess() {
  const user = auth.currentUser;
  if (!user) return { authenticated: false, roles: [] };
  const token = await user.getIdTokenResult(true);
  const roles = Array.isArray(token.claims.roles) ? token.claims.roles : [];
  return {
    authenticated: true,
    uid: user.uid,
    email: user.email,
    roles,
    canCoverage: roles.includes('coverage.read') || roles.includes('admin'),
    canWrite: roles.includes('data.write') || roles.includes('admin'),
    isAdmin: roles.includes('admin')
  };
}

export async function createManagedUser(data) {
  return (await httpsCallable(functions, 'createManagedUser')(data)).data;
}

export async function setManagedUserRoles(data) {
  return (await httpsCallable(functions, 'setUserRoles')(data)).data;
}

export async function listManagedUsers() {
  return (await httpsCallable(functions, 'listManagedUsers')({})).data;
}

export async function seedGtrCodes() {
  return (await httpsCallable(functions, 'seedGtrCodes')({})).data;
}

export async function saveGtrCode(data) {
  return (await httpsCallable(functions, 'saveGtrCode')(data)).data;
}

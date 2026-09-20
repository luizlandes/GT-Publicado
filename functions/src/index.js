const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

function requireAdmin(request) {
  if (!request.auth || !request.auth.token.roles || !request.auth.token.roles.includes('admin')) {
    throw new HttpsError('permission-denied', 'Se requiere el rol admin.');
  }
}

exports.setUserRoles = onCall(async (request) => {
  requireAdmin(request);
  const { uid, email, roles } = request.data || {};
  if ((!uid && !email) || !Array.isArray(roles)) throw new HttpsError('invalid-argument', 'uid o email y roles son obligatorios.');
  const allowed = new Set(['coverage.read', 'data.write', 'admin']);
  if (roles.some((role) => !allowed.has(role))) throw new HttpsError('invalid-argument', 'Rol no permitido.');
  const user = uid ? await getAuth().getUser(uid) : await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { roles });
  return { ok: true, uid: user.uid, email: user.email, roles };
});

exports.createManagedUser = onCall(async (request) => {
  requireAdmin(request);
  const { email, password, displayName, roles } = request.data || {};
  if (!email || !password || !Array.isArray(roles)) {
    throw new HttpsError('invalid-argument', 'email, password y roles son obligatorios.');
  }
  if (password.length < 6) throw new HttpsError('invalid-argument', 'La contraseña debe tener al menos 6 caracteres.');
  const allowed = new Set(['coverage.read', 'data.write', 'admin']);
  if (roles.some((role) => !allowed.has(role))) throw new HttpsError('invalid-argument', 'Rol no permitido.');
  const user = await getAuth().createUser({ email, password, displayName: displayName || undefined });
  await getAuth().setCustomUserClaims(user.uid, { roles });
  return { ok: true, uid: user.uid, email: user.email, roles };
});

exports.listManagedUsers = onCall(async (request) => {
  requireAdmin(request);
  const result = await getAuth().listUsers(1000);
  const users = result.users.filter((user) => !user.disabled).map((user) => ({
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    emailVerified: user.emailVerified,
    roles: Array.isArray(user.customClaims && user.customClaims.roles) ? user.customClaims.roles : [],
  }));
  return {
    users,
  };
});

exports.seedGtrCodes = onCall(async (request) => {
  requireAdmin(request);
  const codes = [
    ['AS', 'Asistencia', false], ['TA', 'Tardanza', false], ['FAL', 'Inasistencia', true],
    ['MED', 'Licencia médica', true], ['PER', 'Permiso', true], ['DESC', 'Descanso', false],
    ['COMP', 'Compensatorio', false],
  ];
  const batch = getFirestore().batch();
  for (const [code, description, affectsHours] of codes) {
    const ref = getFirestore().doc(`artifacts/t-publicado/public/data/gtr_codes/${code}`);
    batch.set(ref, { code, description, affectsHours }, { merge: true });
  }
  await batch.commit();
  return { ok: true, count: codes.length };
});

exports.saveGtrCode = onCall(async (request) => {
  requireAdmin(request);
  const { code, description, affectsHours } = request.data || {};
  if (!code || !description) throw new HttpsError('invalid-argument', 'Código y descripción son obligatorios.');
  const allowedCode = /^[A-Z0-9_-]{2,20}$/.test(code);
  if (!allowedCode) throw new HttpsError('invalid-argument', 'El código debe usar letras, números, guion o guion bajo.');
  await getFirestore().doc(`artifacts/t-publicado/public/data/gtr_codes/${code}`).set({ code, description, affectsHours: !!affectsHours }, { merge: true });
  return { ok: true, code };
});

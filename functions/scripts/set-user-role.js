const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');

const [email, ...roles] = process.argv.slice(2);
const allowedRoles = new Set(['coverage.read', 'data.write', 'admin']);

if (!email || !roles.length || roles.some((role) => !allowedRoles.has(role))) {
  console.error('Uso: node scripts/set-user-role.js correo rol [rol...]');
  console.error('Roles: coverage.read | data.write | admin');
  process.exit(1);
}

const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialPath) {
  console.error('Define GOOGLE_APPLICATION_CREDENTIALS con la ruta al JSON de cuenta de servicio.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(credentialPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });

getAuth().getUserByEmail(email)
    .then((user) => getAuth().setCustomUserClaims(user.uid, { roles }))
    .then(() => {
      console.log(`Roles asignados a ${email}: ${roles.join(', ')}`);
      console.log('El usuario debe cerrar sesión y volver a entrar.');
    })
    .catch((error) => {
      console.error('No se pudo asignar el rol:', error.message);
      process.exitCode = 1;
    });

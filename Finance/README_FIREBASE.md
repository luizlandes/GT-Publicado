# Turnos Omnia con Firebase

## Estructura

- `public/frontend/firebase-auth.js`: autenticacion Firebase del navegador y permisos.
- `functions/`: backend Firebase Functions para administrar roles sin exponer credenciales administrativas.
- `firestore.rules`: permisos de datos.
- `firebase.json`: configuracion de Firestore, Functions y Hosting.
- `public/index.html`: visual publicada actual.

## Primer despliegue

1. Instala Firebase CLI: `npm install -g firebase-tools`.
2. Ejecuta `firebase login`.
3. Entra en `Finance` y ejecuta los comandos Firebase desde esa carpeta.
4. Habilita Authentication en Firebase Console, usando Email/Password o Google.
5. Instala backend: `cd functions` y luego `npm install`.
6. Desde la carpeta raiz ejecuta `firebase deploy --only firestore:rules,functions,hosting`.

La configuracion web de Firebase incluida en `frontend/firebase-auth.js` no es un secreto: Firebase la usa en el navegador. No publiques nunca claves de cuenta de servicio, contrasenas ni archivos `.env`.

## Crear usuarios y roles

Crea primero el usuario en Firebase Console > Authentication > Users. Luego, desde un entorno administrativo autenticado, invoca `setUserRoles` con:

```json
{
  "uid": "UID_DEL_USUARIO",
  "roles": ["coverage.read"]
}
```

Roles disponibles:

- `coverage.read`: puede ver Cobertura.
- `data.write`: puede entrar a Configuracion y cargar/borrar datos.
- `admin`: todos los permisos y administracion de roles.

Despues de cambiar roles, el usuario debe cerrar sesion y volver a entrar para renovar sus Custom Claims. El callable `setUserRoles` solo puede ser invocado por un usuario con rol `admin`.

Tambien puedes asignar roles por correo con `functions/scripts/set-user-role.js`. Descarga una cuenta de servicio desde Firebase Console > Project settings > Service accounts, guardala fuera del proyecto y ejecuta en PowerShell:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\ruta\segura\service-account.json"
cd functions
node scripts/set-user-role.js luis.silva.pe@gmail.com coverage.read
```

Para dar acceso a Configuracion usa `data.write`. Para ambos permisos usa `coverage.read data.write`. Nunca publiques el JSON de la cuenta de servicio.

## Nota de integracion

El HTML conserva el adaptador de datos existente para no romper la visual publicada. El modulo `frontend/firebase-auth.js` deja lista la autenticacion Firebase y el modelo de permisos para conectarlo al HTML cuando se configure el proyecto real.

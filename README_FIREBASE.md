# Turnos Omnia con Firebase

## Estructura

- `frontend/`: configuracion y autenticacion Firebase del navegador.
- `functions/`: backend Firebase Functions para administrar roles.
- `firestore.rules`: permisos de datos.
- `firebase.json`: configuracion de Firestore, Functions y Hosting.
- `Turnos_Cod_Omnia.html`: visual publicada actual.

## Primer despliegue

1. Instala Firebase CLI: `npm install -g firebase-tools`.
2. Ejecuta `firebase login`.
3. En esta carpeta ejecuta `firebase use --add` y selecciona tu proyecto.
4. Habilita Authentication en Firebase Console, usando Email/Password o Google.
5. Copia `frontend/firebase-config.example.js` como `frontend/firebase-config.js` y completa los valores de la app web.
6. Instala backend: `cd functions` y luego `npm install`.
7. Desde la carpeta raiz ejecuta `firebase deploy --only firestore:rules,functions,hosting`.

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

Despues de cambiar roles, el usuario debe cerrar sesion y volver a entrar para renovar sus Custom Claims.

Tambien puedes asignar roles por correo con `functions/scripts/set-user-role.js`. Descarga una cuenta de servicio desde Firebase Console > Project settings > Service accounts, guardala fuera del proyecto y ejecuta en PowerShell:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\ruta\segura\service-account.json"
cd functions
node scripts/set-user-role.js luis.silva.pe@gmail.com coverage.read
```

Para dar acceso a Configuracion usa `data.write`. Para ambos permisos usa `coverage.read data.write`. Nunca publiques el JSON de la cuenta de servicio.

## Nota de integracion

El HTML conserva el adaptador de datos existente para no romper la visual publicada. El modulo `frontend/firebase-auth.js` deja lista la autenticacion Firebase y el modelo de permisos para conectarlo al HTML cuando se configure el proyecto real.

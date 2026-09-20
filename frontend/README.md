# Frontend Firebase

1. Copy `firebase-config.example.js` to `firebase-config.js`.
2. Fill the values from Firebase Console > Project settings > Your apps > Web app.
3. Use Firebase Authentication with Google or email/password.
4. The application should request these permissions through the backend:
   - `coverage.read`: access to Cobertura.
   - `data.write`: access to Configuracion.
   - `admin`: manage users and roles.

Do not commit `firebase-config.js` if the project stores environment-specific values outside version control.

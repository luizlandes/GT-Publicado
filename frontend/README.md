# Frontend Firebase

1. Keep the web app configuration in `firebase-config.js`.
2. Use the values from Firebase Console > Project settings > Your apps > Web app.
3. Use Firebase Authentication with Google or email/password.
4. The application should request these permissions through the backend:
   - `coverage.read`: access to Cobertura.
   - `data.write`: access to Configuracion.
   - `admin`: manage users and roles.

The web Firebase configuration is safe to expose in the browser. Never commit service-account JSON files, private keys, passwords, or `.env` files.

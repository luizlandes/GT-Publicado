# GT-Publicado

La aplicación está en [Finance](Finance/).

## Desarrollo y despliegue

```bash
cd Finance
npm --prefix functions install
firebase emulators:start --only hosting
firebase deploy --only firestore:rules,functions,hosting
```

El sitio publicado usa `Finance/public` como carpeta pública. Las funciones y las reglas Firebase están dentro de `Finance`.
# Manual de despliegue y operación

## Requisitos

- Node.js 22 o compatible con el proyecto.
- Cuenta Supabase.
- Proyecto de GitHub si se va a desplegar en Vercel.
- Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Desarrollo local

```bash
cd frontend
npm install
npm run dev
```

Validar antes de compartir cambios:

```bash
npm run lint
npm run build
```

## Supabase

Seguir [configuracion-supabase.md](configuracion-supabase.md):

1. Crear proyecto cloud.
2. Autenticar la CLI.
3. Ejecutar `npx supabase link --project-ref PROJECT_REF`.
4. Ejecutar `npx supabase db push`.
5. Crear administrador y usuario de prueba.
6. Probar RLS.

No aplicar seeds con información real hasta completar la confirmación documental.

## Vercel

1. Subir el repositorio a GitHub.
2. Crear un proyecto en Vercel e importar el repositorio.
3. Configurar `frontend` como directorio raíz si Vercel no lo detecta.
4. Usar `npm install` como instalación.
5. Usar `npm run build` como comando de build.
6. Usar `dist` como directorio de salida.
7. Añadir en Vercel:
   - `VITE_SUPABASE_URL`;
   - `VITE_SUPABASE_PUBLISHABLE_KEY`.
8. Añadir la URL de Vercel en Supabase Auth > URL Configuration.
9. Ejecutar un despliegue de prueba.

## Seguridad de variables

- No subir `frontend/.env.local`.
- No usar `service_role` en variables `VITE_*`.
- No poner tokens de la CLI en README, issues o commits.
- Rotar una clave si se expone accidentalmente.

## Revisión posterior al despliegue

- La página carga en escritorio y móvil.
- El cliente muestra Supabase configurado cuando las variables existen.
- Usuario normal y administrador tienen permisos distintos.
- Las rutas de Auth redirigen a la URL correcta.
- Los avisos expirados no se muestran.
- Las normas pendientes no aparecen como vigentes.
- La auditoría registra cambios administrativos.

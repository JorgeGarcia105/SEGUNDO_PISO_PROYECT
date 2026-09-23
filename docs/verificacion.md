# Manual de verificación

## Validación automática del frontend

Desde `frontend/`:

```bash
npm run lint
npm run build
```

Ambos comandos deben terminar sin errores.

## Verificación visual

1. Ejecutar `npm run dev`.
2. Abrir la URL local.
3. Probar cada elemento de navegación.
4. Confirmar que los módulos sin datos muestran estado vacío explícito.
5. Redimensionar a móvil y comprobar menú lateral.
6. Confirmar que el texto no se corta ni se superpone.

## Verificación Supabase

Usar dos cuentas autenticadas: usuario normal y administrador. No usar
`service_role` para estas pruebas.

Archivo de apoyo:

[database/rls-smoke-tests.sql](../database/rls-smoke-tests.sql)

### Usuario normal

- Puede leer registros publicados.
- No puede insertar avisos.
- No puede modificar normas, documentos o actas.
- Solo puede leer sus asignaciones.
- No puede leer la auditoría.

### Administrador

- Puede crear un borrador.
- Puede modificar contenido autorizado.
- Puede leer auditoría.
- No puede gestionar roles si no es superadministrador.

### Superadministrador

- Puede administrar `profile_roles`.
- Debe conservarse como cuenta restringida.

## Verificación documental

Antes de publicar un registro:

- existe fuente;
- la fecha es conocida o está marcada como pendiente;
- el tipo de información está clasificado;
- el alcance está indicado;
- se conserva el documento original;
- una decisión no se ha convertido automáticamente en norma;
- una contradicción está enlazada a su matriz;
- los datos personales tienen finalidad y visibilidad definida.

## Registro de resultado

Para cada ejecución anotar:

- fecha;
- entorno;
- commit o versión;
- cuenta/rol utilizado sin guardar credenciales;
- prueba ejecutada;
- resultado;
- incidencia;
- responsable de resolverla.

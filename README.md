# SegundoPiso

Plataforma web para consultar y administrar la información documentada del Segundo Piso.

## Estado

La implementación inicial contiene una shell responsive en React + TypeScript + Vite.
Los módulos muestran estados vacíos hasta que las normas, decisiones y responsables
sean confirmados documentalmente. No se han cargado datos operativos reales.

## Estructura

- `frontend/`: aplicación React + TypeScript.
- `database/migrations/`: esquema PostgreSQL, RLS y auditoría para Supabase.
- `docs/`: levantamiento documental, matrices y planificación.
- `Carta Interna 2do Piso RGSB.pdf`: fuente normativa original.
- `Asambleas Piso 2.pdf`: fuente histórica de actas y decisiones.

## Desarrollo local

```bash
cd frontend
npm install
npm run dev
```

Validaciones disponibles:

```bash
npm run lint
npm run build
```

## Próxima iteración

1. Aprobar el modelo `Fuente -> Decisión -> Modificación -> Norma vigente`.
2. Crear un proyecto Supabase y aplicar la migración inicial.
3. Configurar autenticación, roles y pruebas RLS.
4. Cargar únicamente datos documentales confirmados.

La migración y las decisiones de seguridad están descritas en
[docs/base-datos.md](docs/base-datos.md) y [docs/seguridad.md](docs/seguridad.md).

La CLI está inicializada en `supabase/`. Para aplicar la migración remota se
requiere crear un proyecto Supabase, autenticar la CLI localmente y ejecutar los
comandos documentados en [docs/configuracion-supabase.md](docs/configuracion-supabase.md).

Manuales:

- [Manual de usuario](docs/manual-usuario.md)
- [Manual de administración](docs/manual-administrador.md)
- [Despliegue y operación](docs/despliegue.md)
- [Verificación](docs/verificacion.md)
- [Carga documental inicial](docs/carga-documental.md)

Las decisiones de acta no se convierten automáticamente en normas vigentes.

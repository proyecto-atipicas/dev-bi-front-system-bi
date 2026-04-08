# Herramientas Data Bi - CNE — Portal

Aplicación web (Next.js) que protege el acceso con token y muestra un menú de módulos externos (AppBI, Seguimiento PMO, Embebidos Públicos). Los enlaces se abren en una nueva pestaña.

## Requisitos

- Node.js 20 o superior (recomendado 22, alineado con el `Dockerfile`)

## Configuración

1. Copie `.env.example` a `.env` y defina el token de acceso.

| Variable            | Descripción |
|---------------------|-------------|
| `APP_ACCESS_TOKEN`  | Token que el usuario debe ingresar en el login. Obligatorio en servidor. |

2. Coloque en `public/` los recursos usados por la aplicación:

- `fondo.jpeg` — imagen de fondo del login
- `Logo-LinkTIC.png` — logo del login
- `ImagenDash/dev1.png` … `ImagenDash/dev6.png` — carrusel de carga tras el login (mismo orden: dev1, dev3, dev2, dev4, dev5, dev6); al cargar las imágenes (o a los 12 s máximo) desaparece y se muestra el menú

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Docker

La imagen ejecuta `npm run build` y luego `npm run start` en el puerto `3000`. Asegúrese de pasar `APP_ACCESS_TOKEN` (y cualquier otra variable) en el entorno del contenedor o en su orquestador.

## Estructura relevante

- `src/app/page.tsx` — login y menú de módulos
- `src/components/AppLauncherMenu.tsx` — cuadrícula de módulos y URLs
- `src/app/api/login/route.ts` — validación del token y cookie de sesión
- `src/app/api/logout/route.ts` — borra la cookie de sesión (usado por «Cerrar sesión»)

Para cambiar enlaces o textos de los módulos, edite el arreglo `ITEMS` en `AppLauncherMenu.tsx`.
